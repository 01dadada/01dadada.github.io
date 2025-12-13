import * as ort from 'onnxruntime-web/webgpu';

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
        const sessionPromise = ort.InferenceSession.create(
            modelUrl,
            {
                executionProviders: ["webgpu"],
                logSeverityLevel: 3, // 3 = ERROR, 减少警告输出
                logVerbosityLevel: 0, // 0 = 最小详细程度
            }
        ).then(sess => {
            this.modelSessions[modelUrl] = { session: sess, ort };
            delete this.sessionPromises[modelUrl];
            this.creatingSession = false; // 释放锁
            return this.modelSessions[modelUrl];
        }).catch(err => {
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
        // console.log("device:", device);
        const { session, ort } = await this.getSession(modelUrl);
        console.log("ort:", ort);
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
