import { useMemo, useState } from "react";
import { Download, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SectionCard } from "../components/SectionCard";
import { speciesOptions } from "../constants";
import { speciesModelConfigs, modelConfigs } from "../config/speciesModels";
import { GeneratedAmp, Species } from "../types";

interface AmpForm {
    count: number;
    targets: Species[];
    properties: string[];  // 选中的理化性质名称列表
}

interface AmpResultRow {
    id: string;
    sequence: string;
    strengths: Record<Species, number>;
    // 每个配置项的结果，key为配置项的name
    properties: { [configName: string]: number };
}

function runAmpModel(species: Species, modelUrl: string) {
    // 模拟调用指定模型，返回一个 0-1.2 之间的强度分值
    const seed = species.length + modelUrl.length;
    const base = Math.abs(Math.sin(seed + Date.now())) % 128;
    return Number(base.toFixed(2));
}

function synthesizeAmpSequence(index: number) {
    return `MAMP${index}${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

function predictProperty(sequence: string, modelUrl: string): number {
    // 模拟基于不同模型的理化性质预测
    const seed = sequence.length + modelUrl.length;
    // 根据不同理化性质返回不同范围的值
    if (modelUrl.includes("mw")) {
        // 分子量：1000-2000 Da
        const base = Math.abs(Math.sin(seed + 1)) % 10000;
        return Number((1000 + base * 0.1).toFixed(2));
    } else if (modelUrl.includes("pi")) {
        // 等电点：4.5-5.9
        const base = Math.abs(Math.cos(seed + 2)) % 14;
        return Number((4.5 + base * 0.1).toFixed(2));
    } else if (modelUrl.includes("hyd")) {
        // 疏水性：0-1.0
        const base = Math.abs(Math.sin(seed + 3)) % 2;
        return Number((base * 0.5).toFixed(2));
    } else if (modelUrl.includes("charge")) {
        // 净电荷：-10 to 10
        const base = Math.abs(Math.cos(seed + 4)) % 20;
        return Number((base - 10).toFixed(2));
    }
    // 默认值
    return Number((Math.abs(Math.sin(seed)) % 100).toFixed(2));
}

export default function AmpPage() {
    const { t } = useTranslation();
    const [ampResults, setAmpResults] = useState<AmpResultRow[]>([]);
    const [loadingAmp, setLoadingAmp] = useState(false);

    // 获取所有理化性质配置项
    const propertyConfigs = useMemo(() => {
        return modelConfigs.filter(c => c.type === "property");
    }, []);

    // 辅助函数：获取物种的翻译名称
    const getSpeciesName = (species: Species) => {
        const config = speciesModelConfigs.find(c => c.name === species);
        return config ? t(config.nameKey) : species;
    };

    const ampForm = useForm<AmpForm>({
        defaultValues: {
            count: 5,
            targets: [speciesOptions[0]],
            properties: modelConfigs.filter(c => c.type === "property").map(c => c.name),  // 默认全选理化性质
        },
    });

    const targets = ampForm.watch("targets") ?? [];
    const watchedProperties = ampForm.watch("properties") ?? [];

    const speciesModelMap = useMemo(
        () => Object.fromEntries(speciesModelConfigs.map((c) => [c.name, c.modelUrl])),
        []
    );

    // 根据选中的理化性质，筛选出相关的配置项
    const selectedPropertyConfigs = useMemo(() => {
        return propertyConfigs.filter(c => watchedProperties.includes(c.name));
    }, [watchedProperties, propertyConfigs]);

    async function handleAmpSubmit(values: AmpForm) {
        setLoadingAmp(true);
        await new Promise((r) => setTimeout(r, 600));
        const generated: AmpResultRow[] = Array.from({ length: values.count }).map((_, i) => {
            const seq = synthesizeAmpSequence(i + 1);
            const strengths = Object.fromEntries(
                (values.targets || []).map((sp) => {
                    const modelUrl = speciesModelMap[sp] || "";
                    return [sp, runAmpModel(sp, modelUrl)];
                })
            ) as Record<Species, number>;

            // 理化性质预测：对每个选中的理化性质计算
            const propertiesMap: { [configName: string]: number } = {};
            selectedPropertyConfigs.forEach((config) => {
                propertiesMap[config.name] = predictProperty(seq, config.modelUrl);
            });

            return {
                id: `AMP-${i + 1}`,
                sequence: seq,
                strengths,
                properties: propertiesMap,
            };
        });
        setAmpResults(generated);
        setLoadingAmp(false);
    }

    function handleDownloadAmp() {
        if (!ampResults.length) return;
        // 表头：ID + 序列 + 所有目标菌的强度 + 所有选中的理化性质
        const propertyHeaders = selectedPropertyConfigs.map(c => t(c.nameKey));
        const headers = ["ID", t("mic.sequence"), ...targets.map(sp => getSpeciesName(sp)), ...propertyHeaders];
        let tsv = headers.join(",") + "\n";
        for (const row of ampResults) {
            const strengthCells = targets.map((sp) => row.strengths[sp]?.toString() ?? "");
            const propertyCells = selectedPropertyConfigs.map(c => row.properties[c.name]?.toString() ?? "");
            const cells = [
                row.id,
                row.sequence,
                ...strengthCells,
                ...propertyCells,
            ];
            tsv += cells.join(",") + "\n";
        }
        // 添加 UTF-8 BOM 头，使 Office 能正确识别中文
        const tsvWithBOM = "\uFEFF" + tsv;
        const blob = new Blob([tsvWithBOM], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "amp_results.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    return (
        <div className="amp-page">
            <SectionCard
                id="amp"
                icon={<Sparkles className="h-5 w-5" />}
                title={t("amp.title")}
                description={t("amp.description")}
            >
                <form
                    className="amp-form"
                    onSubmit={ampForm.handleSubmit(handleAmpSubmit)}
                >
                    <div className="amp-controls">
                        <div>
                            <label className="amp-target-title">{t("amp.countLabel")}</label>
                            <input
                                type="number"
                                min={1}
                                max={100}
                                className="amp-input"
                                {...ampForm.register("count", { valueAsNumber: true })}
                            />
                        </div>
                        <div className="amp-options-grid">
                            <div>
                                <p className="amp-target-title">{t("amp.targetTitle")}</p>
                                <div className="amp-target-list">
                                    {speciesOptions.map((sp) => {
                                        const checked = targets.includes(sp);
                                        return (
                                            <button
                                                type="button"
                                                key={sp}
                                                className={[
                                                    "chip",
                                                    checked ? "chip-active" : "chip-inactive",
                                                ].join(" ")}
                                                onClick={() => {
                                                    const current = ampForm.getValues("targets") || [];
                                                    const exists = current.includes(sp);
                                                    const next = exists
                                                        ? current.filter((c) => c !== sp)
                                                        : [...current, sp];
                                                    ampForm.setValue("targets", next);
                                                }}
                                            >
                                                {getSpeciesName(sp)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <p className="amp-target-title">{t("amp.propertyTitle")}</p>
                                <div className="amp-target-list">
                                    {propertyConfigs.map((config) => {
                                        const checked = watchedProperties.includes(config.name);
                                        return (
                                            <button
                                                type="button"
                                                key={config.name}
                                                className={[
                                                    "chip",
                                                    checked ? "chip-active" : "chip-inactive",
                                                ].join(" ")}
                                                onClick={() => {
                                                    const current = ampForm.getValues("properties") || [];
                                                    const exists = current.includes(config.name);
                                                    const next = exists
                                                        ? current.filter((c) => c !== config.name)
                                                        : [...current, config.name];
                                                    ampForm.setValue("properties", next);
                                                }}
                                            >
                                                {t(config.nameKey)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="amp-action-row">
                            <button
                                type="submit"
                                className="action-btn-primary"
                                disabled={loadingAmp}
                            >
                                {loadingAmp ? t("amp.submitting") : t("amp.submit")}
                            </button>
                            <button
                                type="button"
                                className="action-btn-secondary"
                                onClick={() => { ampForm.reset(); setAmpResults([]); }}
                            >
                                {t("amp.clear")}
                            </button>
                            <button
                                type="button"
                                className="action-btn-ghost"
                                onClick={handleDownloadAmp}
                                disabled={ampResults.length === 0}
                                title={t("amp.export")}
                            >
                                <Download className="h-4 w-4" />
                                {t("amp.export")}
                            </button>
                        </div>
                    </div>
                    <div className="amp-results-wrapper">
                        <div className="amp-results">
                            <div className="amp-results-header">
                                <p className="text-sm text-slate-200">{t("amp.results")}</p>
                                <span className="amp-results-count">{ampResults.length} {t("amp.resultsCount")}</span>
                            </div>
                            <div className="amp-table-container">
                                <div className="amp-table-scroll">
                                    <table className="table-shell">
                                        <thead className="table-header">
                                            <tr>
                                                <th className="table-cell">ID</th>
                                                <th className="table-cell">序列</th>
                                                {targets.map((sp) => (
                                                    <th key={sp} className="table-cell">
                                                        {getSpeciesName(sp)}
                                                    </th>
                                                ))}
                                                {selectedPropertyConfigs.map((config) => (
                                                    <th key={config.name} className="table-cell">
                                                        {t(config.nameKey)}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ampResults.map((row) => (
                                                <tr key={row.id} className="table-row">
                                                    <td className="table-cell font-semibold text-white">{row.id}</td>
                                                    <td className="table-cell amp-seq-cell">
                                                        {row.sequence}
                                                    </td>
                                                    {targets.map((sp) => (
                                                        <td
                                                            key={sp}
                                                            className="table-cell amp-strength-cell"
                                                            title={`${t("amp.strength")} ${row.strengths[sp]}`}
                                                        >
                                                            {row.strengths[sp]?.toFixed(2) ?? ""}
                                                        </td>
                                                    ))}
                                                    {selectedPropertyConfigs.map((config) => {
                                                        const value = row.properties[config.name];
                                                        return (
                                                            <td key={config.name} className="table-cell amp-strength-cell">
                                                                {value !== undefined ? value.toFixed(2) : ""}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                            {!ampResults.length && (
                                                <tr>
                                                    <td
                                                        colSpan={2 + targets.length + selectedPropertyConfigs.length}
                                                        className="amp-table-empty"
                                                    >
                                                        {t("amp.empty")}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </SectionCard>
        </div>
    );
}

