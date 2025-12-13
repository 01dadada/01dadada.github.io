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
    }

    // 初始化 worker
    initWorkers() {
        if (!this.esmWorker) {
            this.esmWorker = new Worker(
                new URL("./esm-works.js", import.meta.url),
                { type: "module" }
            );
        }
        if (!this.micWorker) {
            this.micWorker = new Worker(
                new URL("./mic-works.js", import.meta.url),
                { type: "module" }
            );
        }
    }

    async predictMicFromSequence(sequence, targetSpecies) {
        this.initWorkers();
        const modelUrl = this.BACTERIA_MODEL_MAP[targetSpecies];

        const embedding = await new Promise((resolve, reject) => {
            const onMessage = (event) => {
                const msg = event.data;
                if (msg.status === "complete" && msg.embedding) {
                    // 只监听一次
                    this.esmWorker.removeEventListener("message", onMessage);
                    resolve({
                        embedding: msg.embedding,
                        shape: msg.shape,
                        sequence: msg.sequence,
                    });
                } else if (msg.status === "error") {
                    this.esmWorker.removeEventListener("message", onMessage);
                    reject(new Error("ESM 嵌入出错: " + msg.error));
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
