import { useMemo, useState } from "react";
import { FlaskConical, Upload, Download } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SectionCard } from "../components/SectionCard";
import { MAX_FILE_SIZE, MAX_SEQ_COUNT, speciesOptions } from "../constants";
import { modelConfigs, speciesModelConfigs } from "../config/speciesModels";
import { Species } from "../types";
import { parseFasta } from "../utils/parseFasta";

interface MicForm {
    sequences: string;
    targets: Species[];
    properties: string[];  // 选中的理化性质名称列表
}

interface MicResultRow {
    id: string;
    sequence: string;
    // 每个配置项的结果，key为配置项的name
    results: { [configName: string]: number };
}

function predictMIC(sequence: string, modelUrl: string): number {
    // 模拟基于不同模型的 MIC 预测
    const seed = sequence.length + modelUrl.length;
    const base = Math.abs(Math.cos(seed + Date.now())) % 4;
    return Number(base.toFixed(2));
}

function predictProperty(sequence: string, modelUrl: string): number {
    // 模拟基于不同模型的理化性质预测，传入参数和MIC预测类似
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

export default function MicPage() {
    const { t } = useTranslation();
    // 用页面变量保存（而不是 species 存 micResults 里的每行 species），micResults 为所有序列、每个目标菌对应分数
    const [micResults, setMicResults] = useState<MicResultRow[]>([]);
    const [loadingMic, setLoadingMic] = useState(false);

    // 获取所有理化性质配置项
    const propertyConfigs = useMemo(() => {
        return modelConfigs.filter(c => c.type === "property");
    }, []);

    // 辅助函数：获取物种的翻译名称
    const getSpeciesName = (species: Species) => {
        const config = speciesModelConfigs.find(c => c.name === species);
        return config ? t(config.nameKey) : species;
    };

    // 当前选择的目标菌列表和理化性质列表，直接从 form 获取
    const micForm = useForm<MicForm>({
        defaultValues: {
            sequences: "",
            targets: [speciesOptions[0]],
            properties: modelConfigs.filter(c => c.type === "property").map(c => c.name),  // 默认全选理化性质
        },
    });

    const sequencesPreview = useMemo(() => micForm.watch("sequences"), [micForm]);
    const watchedTargets = micForm.watch("targets") ?? [];
    const watchedProperties = micForm.watch("properties") ?? [];

    // 根据选中的理化性质，筛选出相关的配置项
    const selectedPropertyConfigs = useMemo(() => {
        return propertyConfigs.filter(c => watchedProperties.includes(c.name));
    }, [watchedProperties, propertyConfigs]);

    async function handleMicSubmit(values: MicForm) {
        const parsed = parseFasta(values.sequences);
        if (!parsed.length) {
            alert(t("mic.invalidFasta"));
            return;
        }
        if (parsed.length > MAX_SEQ_COUNT) {
            alert(t("mic.tooManySeqs", { count: MAX_SEQ_COUNT }));
            return;
        }

        setLoadingMic(true);
        await new Promise((r) => setTimeout(r, 400));

        // 为每个序列进行预测：MIC按目标菌计算，理化性质只计算一次（不按目标菌）
        const results: MicResultRow[] = parsed.map((item, idx) => {
            const resultsMap: Record<string, number> = {};

            // MIC预测：对每个选中的目标菌计算
            watchedTargets.forEach((sp: Species) => {
                const micConfig = speciesModelConfigs.find(c => c.name === sp);
                if (micConfig) {
                    resultsMap[`${sp}-MIC`] = predictMIC(item.seq, micConfig.modelUrl);
                }
            });

            // 理化性质预测：对每个选中的理化性质计算（不关联目标菌）
            selectedPropertyConfigs.forEach((config) => {
                resultsMap[config.name] = predictProperty(item.seq, config.modelUrl);
            });

            return {
                id: item.id || `seq-${idx + 1}`,
                sequence: item.seq,
                results: resultsMap,
            };
        });

        setMicResults(results);
        setLoadingMic(false);
    }

    // 导出为 CSV
    function handleDownloadResults() {
        if (micResults.length === 0) return;
        // 表头：ID + 所有目标菌的MIC + 所有选中的理化性质 + Sequence
        const micHeaders = watchedTargets.map(sp => `${getSpeciesName(sp)}-MIC`);
        const propertyHeaders = selectedPropertyConfigs.map(c => t(c.nameKey));
        const headers = ["ID", ...micHeaders, ...propertyHeaders, "Sequence"];
        let tsv = headers.join(",") + "\n";
        for (const row of micResults) {
            const micCells = watchedTargets.map(sp => row.results[`${sp}-MIC`]?.toString() ?? "");
            const propertyCells = selectedPropertyConfigs.map(c => row.results[c.name]?.toString() ?? "");
            const cells = [
                row.id,
                ...micCells,
                ...propertyCells,
                row.sequence,
            ];
            tsv += cells.join(",") + "\n";
        }
        // 添加 UTF-8 BOM 头，使 Office 能正确识别中文
        const tsvWithBOM = "\uFEFF" + tsv;
        const blob = new Blob([tsvWithBOM], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mic_results.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    return (
        <div className="mic-page">
            <SectionCard
                id="mic"
                icon={<FlaskConical className="h-5 w-5" />}
                title={t("mic.title")}
                description={t("mic.description")}
            >
                <form
                    className="mic-form"
                    onSubmit={micForm.handleSubmit(handleMicSubmit)}
                >
                    <div className="mic-inputs">
                        <label className="mic-label">
                            <span>{t("mic.inputLabel")}</span>
                            <span className="mic-label-note">{t("mic.inputNote")} {MAX_SEQ_COUNT} {t("mic.resultsCount")}</span>
                        </label>
                        <textarea
                            className="mic-textarea"
                            placeholder=">seq1&#10;MAGWLL...&#10;>seq2&#10;ASDF..."
                            {...micForm.register("sequences", { required: true })}
                        />
                        <label className="mic-upload group">
                            <div className="flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                <span>{t("mic.uploadLabel")}</span>
                            </div>
                            <input
                                type="file"
                                accept=".fa,.fasta,.txt"
                                className="mic-upload-input"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    if (file.size > MAX_FILE_SIZE) {
                                        alert(t("mic.fileTooLarge"));
                                        return;
                                    }
                                    const text = await file.text();
                                    micForm.setValue("sequences", text, { shouldValidate: true });
                                }}
                            />
                        </label>
                        <div className="mic-options-grid">
                            <div>
                                <p className="mic-target-title">{t("mic.targetTitle")}</p>
                                <div className="mic-target-list">
                                    {speciesOptions.map((sp) => {
                                        const checked = watchedTargets.includes(sp);
                                        return (
                                            <button
                                                type="button"
                                                key={sp}
                                                className={[
                                                    "chip",
                                                    checked ? "chip-active" : "chip-inactive",
                                                ].join(" ")}
                                                onClick={() => {
                                                    const current = micForm.getValues("targets") || [];
                                                    const exists = current.includes(sp);
                                                    const next = exists
                                                        ? current.filter((c) => c !== sp)
                                                        : [...current, sp];
                                                    micForm.setValue("targets", next);
                                                }}
                                            >
                                                {getSpeciesName(sp)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <p className="mic-target-title">{t("mic.propertyTitle")}</p>
                                <div className="mic-target-list">
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
                                                    const current = micForm.getValues("properties") || [];
                                                    const exists = current.includes(config.name);
                                                    const next = exists
                                                        ? current.filter((c) => c !== config.name)
                                                        : [...current, config.name];
                                                    micForm.setValue("properties", next);
                                                }}
                                            >
                                                {t(config.nameKey)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="mic-action-row">
                            <button
                                type="submit"
                                className="action-btn-primary"
                                disabled={loadingMic}
                            >
                                {loadingMic ? t("mic.submitting") : t("mic.submit")}
                            </button>
                            <button
                                type="button"
                                className="action-btn-secondary"
                                onClick={() => { micForm.reset(); setMicResults([]); }}
                            >
                                {t("mic.clear")}
                            </button>
                            <button
                                type="button"
                                className="action-btn-ghost"
                                onClick={handleDownloadResults}
                                disabled={micResults.length === 0}
                                title={t("mic.export")}
                            >
                                <Download className="h-4 w-4" />
                                {t("mic.export")}
                            </button>
                        </div>
                    </div>

                    <div className="mic-results-wrapper">
                        <div className="mic-results">
                            <div className="mic-results-header">
                                <p className="text-sm text-slate-200">{t("mic.results")}</p>
                                <span className="mic-results-count">{micResults.length} {t("mic.resultsCount")}</span>
                            </div>
                            <div className="mic-table-container">
                                <div className="mic-table-scroll">
                                    <table className="table-shell">
                                        <thead className="table-header">
                                            <tr>
                                                <th className="table-cell">ID</th>
                                                {watchedTargets.map((sp) => (
                                                    <th key={`${sp}-MIC`} className="table-cell">
                                                        {getSpeciesName(sp)}-MIC
                                                    </th>
                                                ))}
                                                {selectedPropertyConfigs.map((config) => (
                                                    <th key={config.name} className="table-cell">
                                                        {t(config.nameKey)}
                                                    </th>
                                                ))}
                                                <th className="table-cell">{t("mic.sequence")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {micResults.map((row) => (
                                                <tr key={row.id} className="table-row">
                                                    <td className="table-cell font-semibold text-white">{row.id}</td>
                                                    {watchedTargets.map((sp) => {
                                                        const key = `${sp}-MIC`;
                                                        const value = row.results[key];
                                                        return (
                                                            <td key={key} className="table-cell mic-score-cell">
                                                                {value !== undefined ? value.toFixed(2) : ""}
                                                            </td>
                                                        );
                                                    })}
                                                    {selectedPropertyConfigs.map((config) => {
                                                        const value = row.results[config.name];
                                                        return (
                                                            <td key={config.name} className="table-cell mic-score-cell">
                                                                {value !== undefined ? value.toFixed(2) : ""}
                                                            </td>
                                                        );
                                                    })}
                                                    <td className="table-cell mic-seq-cell">
                                                        {row.sequence}
                                                    </td>
                                                </tr>
                                            ))}
                                            {!micResults.length && (
                                                <tr>
                                                    <td colSpan={watchedTargets.length + selectedPropertyConfigs.length + 2} className="mic-table-empty">
                                                        {t("mic.empty")}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {sequencesPreview && (
                                <p className="mic-seq-length">
                                    {t("mic.sequenceLength")} {sequencesPreview.length} {t("mic.characters")}
                                </p>
                            )}
                        </div>
                    </div>
                </form>
            </SectionCard>
        </div>
    );
}

