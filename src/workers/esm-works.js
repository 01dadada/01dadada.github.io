import { AutoTokenizer, AutoModel, AutoConfig, env } from "@huggingface/transformers";

// 使用GPU后端
env.backends.use = "webgpu";

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
            this.instance = await AutoModel.from_pretrained(this.model, {
                config: this.config,
                quantized: false,
                progress_callback,
                device: "webgpu",
                dtype: "fp32",
            });
        }
        return {
            model: this.instance,
            tokenizer: this.tokenizer,
        };
    }
}

self.addEventListener("message", async (event) => {
    try {
        const { model, tokenizer } = await ProteinEmbeddingPipeline.getInstance(
            (progress) => {
                self.postMessage(progress);
            }
        );

        const sequence = event.data.sequence;
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
        self.postMessage({
            status: "error",
            error: error.message,
        });
    }
});

