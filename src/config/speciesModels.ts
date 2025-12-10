import { Species } from "../types";

export type ModelType = "mic" | "property";

export interface ModelConfig {
    name: string;  // 内部标识，用于匹配和逻辑判断（保持中文作为 key）
    nameKey: string;  // i18n key，用于显示，格式如 "properties.分子量"
    type: ModelType;  // "mic" 表示MIC预测，"property" 表示理化性质预测
    modelUrl: string;
}

// 所有预测任务的配置（MIC预测 + 理化性质预测）
export const modelConfigs: ModelConfig[] = [
    { name: "分子量", nameKey: "properties.分子量", type: "property", modelUrl: "https://models.example.com/mw", },
    { name: "等电点", nameKey: "properties.等电点", type: "property", modelUrl: "https://models.example.com/pi", },
    { name: "疏水性", nameKey: "properties.疏水性", type: "property", modelUrl: "https://models.example.com/hyd", },
    { name: "净电荷", nameKey: "properties.净电荷", type: "property", modelUrl: "https://models.example.com/charge", },
];

// 为了保持向后兼容，保留原有的 speciesModelConfigs
export interface SpeciesModelConfig {
    name: Species;  // 内部标识，用于逻辑判断
    nameKey: string;  // i18n key，用于显示，格式如 "species.大肠杆菌"
    modelUrl: string;
}

export const speciesModelConfigs: SpeciesModelConfig[] = [
    {
        name: "大肠杆菌",
        nameKey: "species.大肠杆菌",
        modelUrl: "https://models.example.com/ecoli-mic",
    },
    {
        name: "金黄色葡萄球菌",
        nameKey: "species.金黄色葡萄球菌",
        modelUrl: "https://models.example.com/saureus-mic",
    },
    {
        name: "肺炎克雷伯菌",
        nameKey: "species.肺炎克雷伯菌",
        modelUrl: "https://models.example.com/kpneumoniae-mic",
    },
    {
        name: "铜绿假单胞菌",
        nameKey: "species.铜绿假单胞菌",
        modelUrl: "https://models.example.com/paeruginosa-mic",
    },
];

