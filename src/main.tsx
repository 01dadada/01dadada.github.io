import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";

// 获取 base path，与 vite.config.ts 保持一致
// 如果部署到 username.github.io，basename 应该为 "/"
// 如果部署到 username.github.io/repository-name，basename 应该为 "/repository-name/"
const basename = import.meta.env.BASE_URL || "/";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter basename={basename}>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);

