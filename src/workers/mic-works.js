import * as ort from 'onnxruntime-web/webgpu';

// 利用 IndexedDB 实现模型文件缓存
const DB_NAME = "mic-onnx-models";
const STORE_NAME = "models";
const DB_VERSION = 1;

// 打开或升级 IndexedDB
function openModelDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = function (event) {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "modelUrl" });
            }
        };
        req.onsuccess = function () {
            resolve(req.result);
        };
        req.onerror = function (e) {
            reject(e);
        };
    });
}

// 从 IndexedDB 获取缓存的模型
async function getCachedModel(modelUrl) {
    const db = await openModelDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction([STORE_NAME], "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(modelUrl);
        req.onsuccess = function () {
            resolve(req.result ? req.result.data : null);
        };
        req.onerror = function (e) {
            reject(e);
        };
    });
}

// 将模型缓存在 IndexedDB
async function cacheModel(modelUrl, arrayBuffer) {
    const db = await openModelDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction([STORE_NAME], "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.put({ modelUrl, data: arrayBuffer });
        tx.oncomplete = function () {
            resolve();
        };
        tx.onerror = function (e) {
            reject(e);
        };
    });
}

function validateOnnxBuffer(buffer) {
    const size = buffer.byteLength;

    // 1️⃣ 大小下限（根据你模型调，5–10MB 很常见）
    if (size < 1024 * 1024) {
        throw new Error(`ONNX file too small (${size} bytes)`);
    }

    // 2️⃣ 防 HTML / JSON / 文本
    const head = new Uint8Array(buffer.slice(0, 16));
    const isText = head.every(b => b >= 9 && b <= 126);
    if (isText) {
        const text = new TextDecoder().decode(head);
        throw new Error(`Downloaded file looks like text: ${text}`);
    }
}

async function downloadModelArrayBuffer(modelUrl, progressCb) {
    const response = await fetch(modelUrl, {
        cache: "no-store",
        headers: {
            "Accept": "application/octet-stream",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to download model ${modelUrl}: ${response.status}`);
    }

    const contentLength = response.headers.get("content-length");
    const total = contentLength ? parseInt(contentLength, 10) : null;

    if (!response.body) {
        throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const chunks = [];
    let receivedLength = 0;

    progressCb && self.postMessage({ status: "download_start", modelUrl, total });

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.byteLength;

        progressCb && self.postMessage({
            status: "download_progress",
            modelUrl,
            received: receivedLength,
            total,
            progress: total ? receivedLength / total * 100 : -1,
        });
    }

    const buffer = new Uint8Array(receivedLength);
    let offset = 0;
    for (const chunk of chunks) {
        buffer.set(chunk, offset);
        offset += chunk.byteLength;
    }

    // 🔥 关键：校验
    validateOnnxBuffer(buffer.buffer);

    progressCb && self.postMessage({
        status: "download_complete",
        modelUrl,
        size: receivedLength,
    });

    return buffer.buffer;
}


class MicPredictPipeline {
    static modelSessions = {};
    static sessionPromises = {};
    static creatingSession = false; // 全局锁，确保同一时间只有一个会话在创建

    static async getSession(modelUrl) {
        // 如果会话已存在，直接返回
        if (this.modelSessions[modelUrl]) {
            return this.modelSessions[modelUrl];
        }
        // 如果正在创建该会话，等待创建完成
        if (this.sessionPromises[modelUrl]) {
            return this.sessionPromises[modelUrl];
        }

        // 等待其他会话创建完成
        while (this.creatingSession) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        // 再次检查，可能在等待期间已经创建完成
        if (this.modelSessions[modelUrl]) {
            return this.modelSessions[modelUrl];
        }
        if (this.sessionPromises[modelUrl]) {
            return this.sessionPromises[modelUrl];
        }

        // 设置创建锁
        this.creatingSession = true;
        const sessionPromise = (async () => {
            // 尝试读取缓存
            console.log("尝试读取缓存", modelUrl);
            let modelBuffer = await getCachedModel(modelUrl);
            if (!modelBuffer) {
                // 下载模型并缓存（传递进度回调）
                console.log("下载模型并缓存", modelUrl);
                modelBuffer = await downloadModelArrayBuffer(modelUrl, true);
                console.log("下载模型并缓存完成", modelUrl);
                await cacheModel(modelUrl, modelBuffer);
                console.log("缓存模型", modelUrl);
            }
            const sess = await ort.InferenceSession.create(
                modelBuffer,
                {
                    executionProviders: ["webgpu"],
                    logSeverityLevel: 3,
                    logVerbosityLevel: 0,
                }
            );
            this.modelSessions[modelUrl] = { session: sess, ort };
            this.creatingSession = false; // 释放锁
            return this.modelSessions[modelUrl];
        })().catch(err => {
            delete this.sessionPromises[modelUrl];
            this.creatingSession = false; // 释放锁
            throw err;
        });
        this.sessionPromises[modelUrl] = sessionPromise;
        return sessionPromise;
    }

    static async predict({ embedding, modelUrl, target }) {
        return await this.predictEmbedding({ embedding, modelUrl });
    }

    static async predictEmbedding({ embedding, modelUrl, device = "webgpu" }) {
        const { session, ort } = await this.getSession(modelUrl);
        let inputArray;
        if (embedding instanceof Float32Array) {
            inputArray = embedding;
        } else if (Array.isArray(embedding)) {
            inputArray = new Float32Array(embedding);
        } else {
            throw new Error("Invalid embedding format");
        }
        let dim0 = 1;
        let dim2 = 320;
        if (inputArray.length % (dim0 * dim2) !== 0) {
            throw new Error(`输入长度 (${inputArray.length}) 不能整除 320`);
        }
        let dim1 = inputArray.length / (dim0 * dim2);
        if (!Number.isInteger(dim1)) {
            throw new Error(`中间维度不是整数，无法推断形状: ${inputArray.length} / (${dim0}*${dim2})`);
        }
        const inputTensor = new ort.Tensor("float32", inputArray, [dim0, dim1, dim2]);
        const inputName = session.inputNames[0];
        const feeds = { [inputName]: inputTensor };

        const outputMap = await session.run(feeds);
        const outputName = session.outputNames[0];
        const resultTensor = outputMap[outputName];

        const value = Array.isArray(resultTensor.data)
            ? resultTensor.data[0]
            : resultTensor.data;

        return {
            mic: value,
            outputRaw: resultTensor.data
        };
    }
}

self.addEventListener("message", async (event) => {
    try {
        const { embedding, modelUrl, device } = event.data || {};
        self.postMessage({
            status: "computing",
            message: "正在计算MIC..."
        });
        const result = await MicPredictPipeline.predictEmbedding({ embedding, modelUrl, device });
        self.postMessage({
            status: "complete",
            mic: result.mic,
            outputRaw: result.outputRaw
        });
    } catch (error) {
        self.postMessage({
            status: "error",
            error: error.message || String(error)
        });
    }
});
