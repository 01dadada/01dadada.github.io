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

    // 批量预测：传入序列和目标菌种列表，只计算一次嵌入，然后对每个菌种使用不同的模型进行预测
    async predictMicFromSequenceForMultipleSpecies(sequence, targetSpeciesList) {
        this.initWorkers();

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
                    mic: micResult.mic,
                    rawMic: micResult.outputRaw,
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
