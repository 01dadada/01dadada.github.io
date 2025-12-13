import { DownloadItem } from "../types";

// 下载列表，可按需扩展或替换
// title 和 description 使用 i18n key，需要在组件中使用 useTranslation 进行翻译
export interface DownloadItemConfig {
    titleKey: string;
    descriptionKey: string;
    url: string;
    size: string;
}

export const downloadableFiles: DownloadItemConfig[] = [
    {
        titleKey: "downloads.items.acinetobacter_baumannii_model.title",
        descriptionKey: "downloads.items.acinetobacter_baumannii_model.description",
        url: "https://github.com/01dadada/01dadada.github.io/raw/refs/heads/master/public/onnx/Acinetobacter_baumannii_model.onnx?download=",
        size: "44 MB",
    },
];

