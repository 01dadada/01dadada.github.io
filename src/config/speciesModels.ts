export type ModelType = "mic" | "property";

export interface ModelConfig {
    name: string;
    nameKey: string;
    type: ModelType;
    modelUrl: string;
}


export const modelConfigs: ModelConfig[] = [
    { name: "分子量", nameKey: "properties.molecular_weight", type: "property", modelUrl: "https://models.example.com/mw", },
    { name: "等电点", nameKey: "properties.isoelectric_point", type: "property", modelUrl: "https://models.example.com/pi", },
    { name: "疏水性", nameKey: "properties.hydrophobicity", type: "property", modelUrl: "https://models.example.com/hyd", },
    { name: "净电荷", nameKey: "properties.net_charge", type: "property", modelUrl: "https://models.example.com/charge", },
    { name: "不稳定性指数", nameKey: "properties.instability_index", type: "property", modelUrl: "https://models.example.com/instability", },
    { name: "芳香性", nameKey: "properties.aromaticity", type: "property", modelUrl: "https://models.example.com/aromaticity", },
    { name: "灵活性", nameKey: "properties.flexibility", type: "property", modelUrl: "https://models.example.com/flexibility", },
    { name: "螺旋结构", nameKey: "properties.helix", type: "property", modelUrl: "https://models.example.com/secondary_helix", },
    { name: "转角结构", nameKey: "properties.turn", type: "property", modelUrl: "https://models.example.com/secondary_turn", },
    { name: "折叠结构", nameKey: "properties.sheet", type: "property", modelUrl: "https://models.example.com/secondary_sheet", },
    { name: "摩尔消光系数", nameKey: "properties.molar_extinction", type: "property", modelUrl: "https://models.example.com/extinction", },
];


export interface SpeciesModelConfig {
    name: string;
    nameKey: string;
    modelUrl: string;
}

export const speciesModelConfigs: SpeciesModelConfig[] = [
    {
        name: "Staphylococcus aureus",
        nameKey: "species.Staphylococcus_aureus",
        modelUrl: "https://huggingface.co/Xue-Jun/AMP-Mic-Predictor/resolve/main/onnx/Staphylococcus_aureus_model.onnx",
    },
    {
        name: "Escherichia coli",
        nameKey: "species.Escherichia_coli",
        modelUrl: "https://huggingface.co/Xue-Jun/AMP-Mic-Predictor/resolve/main/onnx/Escherichia_coli_model.onnx",
    },
    {
        name: "Pseudomonas aeruginosa",
        nameKey: "species.Pseudomonas_aeruginosa",
        modelUrl: "https://huggingface.co/Xue-Jun/AMP-Mic-Predictor/resolve/main/onnx/Pseudomonas_aeruginosa_model.onnx",
    },
    {
        name: "Klebsiella pneumoniae",
        nameKey: "species.Klebsiella_pneumoniae",
        modelUrl: "https://huggingface.co/Xue-Jun/AMP-Mic-Predictor/resolve/main/onnx/Klebsiella_pneumoniae_model.onnx",
    },
    {
        name: "Acinetobacter baumannii",
        nameKey: "species.Acinetobacter_baumannii",
        modelUrl: "https://huggingface.co/Xue-Jun/AMP-Mic-Predictor/resolve/main/onnx/Acinetobacter_baumannii_model.onnx",
    },
    {
        name: "Enterococcus faecalis",
        nameKey: "species.Enterococcus_faecalis",
        modelUrl: "https://huggingface.co/Xue-Jun/AMP-Mic-Predictor/resolve/main/onnx/Enterococcus_faecalis_model.onnx",
    },
    {
        name: "Enterococcus faecium",
        nameKey: "species.Enterococcus_faecium",
        modelUrl: "https://huggingface.co/Xue-Jun/AMP-Mic-Predictor/resolve/main/onnx/Enterococcus_faecium_model.onnx",
    },
    {
        name: "Listeria monocytogenes",
        nameKey: "species.Listeria_monocytogenes",
        modelUrl: "https://huggingface.co/Xue-Jun/AMP-Mic-Predictor/resolve/main/onnx/Listeria_monocytogenes_model.onnx",
    },
    {
        name: "Bacillus cereus",
        nameKey: "species.Bacillus_cereus",
        modelUrl: "https://huggingface.co/Xue-Jun/AMP-Mic-Predictor/resolve/main/onnx/Bacillus_cereus_model.onnx",
    },
    {
        name: "Enterobacter cloacae",
        nameKey: "species.Enterobacter_cloacae",
        modelUrl: "https://huggingface.co/Xue-Jun/AMP-Mic-Predictor/resolve/main/onnx/Enterobacter_cloacae_model.onnx",
    },
    {
        name: "Candida albicans",
        nameKey: "species.Candida_albicans",
        modelUrl: "https://huggingface.co/Xue-Jun/AMP-Mic-Predictor/resolve/main/onnx/Candida_albicans_model.onnx",
    },
    {
        name: "Cryptococcus neoformans",
        nameKey: "species.Cryptococcus_neoformans",
        modelUrl: "https://huggingface.co/Xue-Jun/AMP-Mic-Predictor/resolve/main/onnx/Cryptococcus_neoformans_model.onnx",
    },
    {
        name: "Candida tropicalis",
        nameKey: "species.Candida_tropicalis",
        modelUrl: "https://huggingface.co/Xue-Jun/AMP-Mic-Predictor/resolve/main/onnx/Candida_tropicalis_model.onnx",
    },
    {
        name: "Candida parapsilosis",
        nameKey: "species.Candida_parapsilosis",
        modelUrl: "https://huggingface.co/Xue-Jun/AMP-Mic-Predictor/resolve/main/onnx/Candida_parapsilosis_model.onnx",
    },
    {
        name: "Candida glabrata",
        nameKey: "species.Candida_glabrata",
        modelUrl: "https://huggingface.co/Xue-Jun/AMP-Mic-Predictor/resolve/main/onnx/Candida_glabrata_model.onnx",
    },
    {
        name: "Salmonella",
        nameKey: "species.Salmonella",
        modelUrl: "https://huggingface.co/Xue-Jun/AMP-Mic-Predictor/resolve/main/onnx/Salmonella_model.onnx",
    },
];

