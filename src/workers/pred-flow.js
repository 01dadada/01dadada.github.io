import { speciesModelConfigs } from "../config/speciesModels";

class PredFlow {
    constructor() {
        this.BACTERIA_MODEL_MAP = {};
        if (Array.isArray(speciesModelConfigs)) {
            for (const conf of speciesModelConfigs) {
                this.BACTERIA_MODEL_MAP[conf.name] = conf.modelUrl;
            }
        }

        this.esmWorker = null;
        this.micWorker = null;
        this.modelDownloaded = false; // 标记模型是否已下载
        this.downloadCallbacks = []; // 下载状态回调函数列表
        this.progressCallbacks = []; // 进度回调函数列表
    }

    // 设置下载状态回调
    setDownloadCallback(callback) {
        if (callback) {
            this.downloadCallbacks.push(callback);
        }
    }

    // 设置进度回调
    setProgressCallback(callback) {
        if (callback) {
            this.progressCallbacks.push(callback);
        }
    }

    // 触发下载状态回调
    _notifyDownloadStatus(status, data = null) {
        this.downloadCallbacks.forEach(cb => {
            try {
                cb(status, data);
            } catch (e) {
                console.error("Download callback error:", e);
            }
        });
    }

    // 触发进度回调
    _notifyProgress(data) {
        this.progressCallbacks.forEach(cb => {
            try {
                cb(data);
            } catch (e) {
                console.error("Progress callback error:", e);
            }
        });
    }

    // 初始化 worker
    initWorkers() {
        if (!this.esmWorker) {
            this.esmWorker = new Worker(
                new URL("./esm-works.js", import.meta.url),
                { type: "module" }
            );
            // 监听esm worker的所有消息，转发进度信息
            this.esmWorker.addEventListener("message", (event) => {
                const msg = event.data;
                // 转发transformers.js的进度消息
                if (msg && typeof msg === 'object' && !msg.status && !msg.embedding) {
                    this._notifyProgress({
                        type: "esm_progress",
                        data: msg,
                    });
                }
            });
        }
        if (!this.micWorker) {
            this.micWorker = new Worker(
                new URL("./mic-works.js", import.meta.url),
                { type: "module" }
            );
            // 监听mic worker的所有消息，转发下载信息
            this.micWorker.addEventListener("message", (event) => {
                const msg = event.data;
                // 转发ONNX模型下载消息
                if (msg && typeof msg === 'object' &&
                    (msg.status === "download_start" ||
                        msg.status === "download_progress" ||
                        msg.status === "download_complete")) {
                    this._notifyProgress({
                        type: "onnx_download",
                        data: msg,
                    });
                }
            });
        }
    }

    async predictMicFromSequence(sequence, targetSpecies) {
        this.initWorkers();
        const modelUrl = this.BACTERIA_MODEL_MAP[targetSpecies];

        const embedding = await new Promise((resolve, reject) => {
            let downloadStarted = false;
            let downloadCompleted = false;
            let hasReceivedProgress = false;
            let loadingStarted = false; // 标记是否已经开始加载

            const onMessage = (event) => {
                const msg = event.data;

                // 检查是否是进度消息（下载相关）
                if (msg && typeof msg === 'object' && !msg.status && !msg.embedding) {
                    hasReceivedProgress = true;
                    // 这是进度消息，表示模型正在加载
                    if (!loadingStarted) {
                        loadingStarted = true;
                        this._notifyDownloadStatus("start");
                    }
                    // 如果是首次下载，标记
                    if (!this.modelDownloaded && !downloadStarted) {
                        // 检查是否有文件下载信息
                        if (msg.file || (msg.progress !== undefined && msg.total !== undefined)) {
                            downloadStarted = true;
                        }
                    }
                    // 转发进度信息
                    this._notifyProgress({
                        type: "esm_progress",
                        data: msg,
                    });
                }

                if (msg.status === "complete" && msg.embedding) {
                    // 只监听一次
                    this.esmWorker.removeEventListener("message", onMessage);

                    // 如果已经开始加载，标记为已完成
                    if (loadingStarted && !downloadCompleted) {
                        downloadCompleted = true;
                        if (!this.modelDownloaded) {
                            this.modelDownloaded = true;
                        }
                        this._notifyDownloadStatus("complete");
                    }

                    resolve({
                        embedding: msg.embedding,
                        shape: msg.shape,
                        sequence: msg.sequence,
                    });
                } else if (msg.status === "error") {
                    this.esmWorker.removeEventListener("message", onMessage);
                    reject(new Error("ESM 嵌入出错: " + msg.error));
                } else if (msg.status === "computing") {
                    // 如果收到computing消息，说明模型已经加载完成，开始计算
                    // 如果之前没有收到进度消息（模型已缓存），也需要显示加载弹窗
                    if (!loadingStarted) {
                        loadingStarted = true;
                        this._notifyDownloadStatus("start");
                        // 立即标记为完成（因为模型已经加载好了）
                        setTimeout(() => {
                            if (!downloadCompleted) {
                                downloadCompleted = true;
                                this._notifyDownloadStatus("complete");
                            }
                        }, 100);
                    }
                }
            };
            this.esmWorker.addEventListener("message", onMessage);
            this.esmWorker.postMessage({ sequence });
        });

        const embeddingArray = embedding.embedding instanceof Float32Array
            ? embedding.embedding
            : new Float32Array(embedding.embedding);

        // MIC 推理
        const micResult = await new Promise((resolve, reject) => {
            const onMessage = (event) => {
                const msg = event.data;
                if (msg.status === "complete" && typeof msg.mic !== "undefined") {
                    this.micWorker.removeEventListener("message", onMessage);
                    resolve({
                        mic: msg.mic,
                        outputRaw: msg.outputRaw,
                    });
                } else if (msg.status === "error") {
                    this.micWorker.removeEventListener("message", onMessage);
                    reject(new Error("MIC 推理出错: " + msg.error));
                }
            };
            this.micWorker.addEventListener("message", onMessage);
            this.micWorker.postMessage({
                embedding: embeddingArray,
                modelUrl,
                species: targetSpecies,
            });
        });

        return {
            mic: micResult.mic,
            embedding: Array.from(embeddingArray),
            shape: embedding.shape,
            rawMic: micResult.outputRaw,
        };
    }

    // 批量预测：传入序列和目标菌种列表，只计算一次嵌入，然后对每个菌种使用不同的模型进行预测
    async predictMicFromSequenceForMultipleSpecies(sequence, targetSpeciesList) {
        this.initWorkers();

        const embedding = await new Promise((resolve, reject) => {
            let downloadStarted = false;
            let downloadCompleted = false;
            let hasReceivedProgress = false;
            let loadingStarted = false; // 标记是否已经开始加载

            const onMessage = (event) => {
                const msg = event.data;

                // 检查是否是进度消息（下载相关）
                // Hugging Face transformers 的进度消息通常包含 file, progress, total 等字段
                if (msg && typeof msg === 'object' && !msg.status && !msg.embedding) {
                    hasReceivedProgress = true;
                    // 这是进度消息，表示模型正在加载
                    if (!loadingStarted) {
                        loadingStarted = true;
                        this._notifyDownloadStatus("start");
                    }
                    // 如果是首次下载，标记
                    if (!this.modelDownloaded && !downloadStarted) {
                        // 检查是否有文件下载信息（file 字段或 progress/total 字段）
                        if (msg.file || (msg.progress !== undefined && msg.total !== undefined)) {
                            downloadStarted = true;
                        }
                    }
                    // 转发进度信息
                    this._notifyProgress({
                        type: "esm_progress",
                        data: msg,
                    });
                }

                if (msg.status === "complete" && msg.embedding) {
                    // 只监听一次
                    this.esmWorker.removeEventListener("message", onMessage);

                    // 如果已经开始加载，标记为已完成
                    if (loadingStarted && !downloadCompleted) {
                        downloadCompleted = true;
                        if (!this.modelDownloaded) {
                            this.modelDownloaded = true;
                        }
                        this._notifyDownloadStatus("complete");
                    }

                    resolve({
                        embedding: msg.embedding,
                        shape: msg.shape,
                        sequence: msg.sequence,
                    });
                } else if (msg.status === "error") {
                    this.esmWorker.removeEventListener("message", onMessage);
                    reject(new Error("ESM 嵌入出错: " + msg.error));
                } else if (msg.status === "computing") {
                    // 如果收到computing消息，说明模型已经加载完成，开始计算
                    // 如果之前没有收到进度消息（模型已缓存），也需要显示加载弹窗
                    if (!loadingStarted) {
                        loadingStarted = true;
                        this._notifyDownloadStatus("start");
                        // 立即标记为完成（因为模型已经加载好了）
                        setTimeout(() => {
                            if (!downloadCompleted) {
                                downloadCompleted = true;
                                this._notifyDownloadStatus("complete");
                            }
                        }, 100);
                    }
                }
            };
            this.esmWorker.addEventListener("message", onMessage);
            this.esmWorker.postMessage({ sequence });
        });
        const embeddingArray = embedding.embedding instanceof Float32Array
            ? embedding.embedding
            : new Float32Array(embedding.embedding);

        // 转换为普通数组以便通过 postMessage 传递（postMessage 会序列化，Float32Array 会被转换为普通数组）
        const embeddingArrayForWorker = Array.from(embeddingArray);

        // 对每个目标菌种使用相应的模型进行预测
        const results = {};
        for (const targetSpecies of targetSpeciesList) {
            const modelUrl = this.BACTERIA_MODEL_MAP[targetSpecies];
            if (!modelUrl) {
                console.warn(`未找到菌种 ${targetSpecies} 的模型配置`);
                results[targetSpecies] = null;
                continue;
            }

            try {
                // MIC 推理
                const micResult = await new Promise((resolve, reject) => {
                    const onMessage = (event) => {
                        const msg = event.data;
                        if (msg.status === "complete" && typeof msg.mic !== "undefined") {
                            this.micWorker.removeEventListener("message", onMessage);
                            resolve({
                                mic: msg.mic,
                                outputRaw: msg.outputRaw,
                            });
                        } else if (msg.status === "error") {
                            this.micWorker.removeEventListener("message", onMessage);
                            reject(new Error("MIC 推理出错: " + msg.error));
                        }
                    };
                    this.micWorker.addEventListener("message", onMessage);
                    this.micWorker.postMessage({
                        embedding: embeddingArrayForWorker,
                        modelUrl,
                        species: targetSpecies,
                    });
                });
                results[targetSpecies] = {
                    mic: Math.pow(2, micResult.mic[0]) - 1,
                    rawMic: micResult.outputRaw[0],
                };
            } catch (error) {
                console.error(`预测 ${targetSpecies} 失败:`, error);
                results[targetSpecies] = null;
            }
        }

        return {
            results,
            embedding: Array.from(embeddingArray),
            shape: embedding.shape,
        };
    }

    terminate() {
        if (this.esmWorker) {
            this.esmWorker.terminate();
            this.esmWorker = null;
        }
        if (this.micWorker) {
            this.micWorker.terminate();
            this.micWorker = null;
        }
    }
}


export default PredFlow;
