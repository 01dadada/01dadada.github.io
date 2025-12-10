export type Species =
    | "大肠杆菌"
    | "金黄色葡萄球菌"
    | "肺炎克雷伯菌"
    | "铜绿假单胞菌";

export interface MicResult {
    id: string;
    sequence: string;
    score: number;
    species: Species[];
}

export interface GeneratedAmp {
    id: string;
    sequence: string;
    strengths: Record<Species, number>;
}

export interface DownloadItem {
    title: string;
    description: string;
    url: string;
    size: string;
}

