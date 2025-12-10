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
        titleKey: "downloads.items.weights_v1.title",
        descriptionKey: "downloads.items.weights_v1.description",
        url: "https://example.com/weights-v1.zip",
        size: "10 MB",
    },
    // {
    //     titleKey: "downloads.items.dataset.title",
    //     descriptionKey: "downloads.items.dataset.description",
    //     url: "https://example.com/dataset.csv",
    //     size: "8 MB",
    // },
    // {
    //     titleKey: "downloads.items.appendix.title",
    //     descriptionKey: "downloads.items.appendix.description",
    //     url: "https://example.com/appendix.zip",
    //     size: "25 MB",
    // },
];

