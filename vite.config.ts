import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages 部署配置
// 如果部署到 username.github.io，base 应该为 "/"
// 如果部署到 username.github.io/repository-name，base 应该为 "/repository-name/"
// 可以通过环境变量 VITE_BASE_PATH 来设置，例如: VITE_BASE_PATH=/my_web/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const base = env.VITE_BASE_PATH || "/";

    return {
        base,
        plugins: [react()],
        server: {
            port: 5173,
        },
    };
});

