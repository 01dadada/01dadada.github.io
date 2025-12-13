export interface MicResult {
    id: string;
    sequence: string;
    score: number;
    species: string[];
}

export interface GeneratedAmp {
    id: string;
    sequence: string;
    strengths: Record<string, number>;
}

export interface DownloadItem {
    title: string;
    description: string;
    url: string;
    size: string;
}

