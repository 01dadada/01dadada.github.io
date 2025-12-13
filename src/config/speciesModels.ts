export type ModelType = "mic" | "property";

export interface ModelConfig {
    name: string;
    nameKey: string;
    type: ModelType;
    modelUrl: string;
}


export const modelConfigs: ModelConfig[] = [
    { name: "分子量", nameKey: "properties.分子量", type: "property", modelUrl: "https://models.example.com/mw", },
    { name: "等电点", nameKey: "properties.等电点", type: "property", modelUrl: "https://models.example.com/pi", },
    { name: "疏水性", nameKey: "properties.疏水性", type: "property", modelUrl: "https://models.example.com/hyd", },
    { name: "净电荷", nameKey: "properties.净电荷", type: "property", modelUrl: "https://models.example.com/charge", },
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
        modelUrl: "/onnx/Staphylococcus_aureus_model.onnx",
    },
    {
        name: "Escherichia coli",
        nameKey: "species.Escherichia_coli",
        modelUrl: "/onnx/Escherichia_coli_model.onnx",
    },
    {
        name: "Pseudomonas aeruginosa",
        nameKey: "species.Pseudomonas_aeruginosa",
        modelUrl: "/onnx/Pseudomonas_aeruginosa_model.onnx",
    },
    {
        name: "Klebsiella pneumoniae",
        nameKey: "species.Klebsiella_pneumoniae",
        modelUrl: "/onnx/Klebsiella_pneumoniae_model.onnx",
    },
    {
        name: "Acinetobacter baumannii",
        nameKey: "species.Acinetobacter_baumannii",
        modelUrl: "/onnx/Acinetobacter_baumannii_model.onnx",
    },
    {
        name: "Enterococcus faecalis",
        nameKey: "species.Enterococcus_faecalis",
        modelUrl: "/onnx/Enterococcus_faecalis_model.onnx",
    },
    {
        name: "Enterococcus faecium",
        nameKey: "species.Enterococcus_faecium",
        modelUrl: "/onnx/Enterococcus_faecium_model.onnx",
    },
    {
        name: "Listeria monocytogenes",
        nameKey: "species.Listeria_monocytogenes",
        modelUrl: "/onnx/Listeria_monocytogenes_model.onnx",
    },
    {
        name: "Bacillus cereus",
        nameKey: "species.Bacillus_cereus",
        modelUrl: "/onnx/Bacillus_cereus_model.onnx",
    },
    {
        name: "Enterobacter cloacae",
        nameKey: "species.Enterobacter_cloacae",
        modelUrl: "/onnx/Enterobacter_cloacae_model.onnx",
    },
    {
        name: "Candida albicans",
        nameKey: "species.Candida_albicans",
        modelUrl: "/onnx/Candida_albicans_model.onnx",
    },
    {
        name: "Cryptococcus neoformans",
        nameKey: "species.Cryptococcus_neoformans",
        modelUrl: "/onnx/Cryptococcus_neoformans_model.onnx",
    },
    {
        name: "Candida tropicalis",
        nameKey: "species.Candida_tropicalis",
        modelUrl: "/onnx/Candida_tropicalis_model.onnx",
    },
    {
        name: "Candida parapsilosis",
        nameKey: "species.Candida_parapsilosis",
        modelUrl: "/onnx/Candida_parapsilosis_model.onnx",
    },
    {
        name: "Candida glabrata",
        nameKey: "species.Candida_glabrata",
        modelUrl: "/onnx/Candida_glabrata_model.onnx",
    },
    {
        name: "Salmonella",
        nameKey: "species.Salmonella",
        modelUrl: "/onnx/Salmonella_model.onnx",
    },
];

