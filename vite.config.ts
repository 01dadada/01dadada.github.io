import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const base = env.VITE_BASE_PATH || "/";

    return {
        base,
        plugins: [
            react(),
        ],
        server: {
            port: 5173,
            cors: true, // 允许所有跨域请求
            headers: {
                // WebGPU 和 SharedArrayBuffer 所需的 CORS 头
                'Cross-Origin-Embedder-Policy': 'require-corp',
                'Cross-Origin-Opener-Policy': 'same-origin',
            },
            fs: { strict: false },
        },
        optimizeDeps: { exclude: ['onnxruntime-web'] },
        // 可选：强制把 wasm 当静态资源
        assetsInclude: ['**/*.wasm'],
    };
});
