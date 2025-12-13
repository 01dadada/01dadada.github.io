import { AutoTokenizer, AutoModel, AutoConfig, env } from "@huggingface/transformers";

// 使用GPU后端
env.backends.use = "webgpu";

/**
 * 蛋白质嵌入管道类
 * 使用单例模式确保只加载一次模型
 */
class ProteinEmbeddingPipeline {
    static model = "Xue-Jun/esm2-8M";
    static instance = null;
    static tokenizer = null;
    static config = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.config = await AutoConfig.from_pretrained(this.model);
            this.config.output_hidden_states = true;

            this.tokenizer = await AutoTokenizer.from_pretrained(this.model, {
                progress_callback,
            });
            // 强制加载非量化模型，指定device为"webgpu"
            this.instance = await AutoModel.from_pretrained(this.model, {
                config: this.config,
                quantized: false,
                progress_callback,
                device: "webgpu", // 明确指定在GPU上推理
                dtype: "fp32", // 明确指定数据类型，避免警告
            });
        }
        return {
            model: this.instance,
            tokenizer: this.tokenizer,
        };
    }
}

// 监听来自主线程的消息
self.addEventListener("message", async (event) => {
    try {
        // 获取蛋白质嵌入管道
        const { model, tokenizer } = await ProteinEmbeddingPipeline.getInstance(
            (progress) => {
                // 发送进度更新
                self.postMessage(progress);
            }
        );

        const sequence = event.data.sequence;
        self.postMessage({
            status: "computing",
            message: "正在计算蛋白质嵌入...",
        });
        const inputs = await tokenizer(sequence, {
            padding: false,
            truncation: true,
        });
        const outputs = await model(inputs);
        const embeddingData = outputs.last_hidden_state.ort_tensor.data;
        const shape = outputs.last_hidden_state.ort_tensor.dims;

        self.postMessage({
            status: "complete",
            embedding: Array.from(embeddingData), // 转换为普通数组
            shape: shape,
            sequence: sequence,
        });
    } catch (error) {
        // 发送错误消息
        self.postMessage({
            status: "error",
            error: error.message,
        });
    }
});

