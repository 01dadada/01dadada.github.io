import { useMemo, useState, useEffect, useRef } from "react";
import { FlaskConical, Upload, Download } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
// @ts-ignore
import PredFlow from "../workers/pred-flow.js";
import { predictProperty } from "../workers/prop-works";
import { SectionCard } from "../components/SectionCard";
import { ModelLoadingModal } from "../components/ModelLoadingModal";
import { MAX_FILE_SIZE, MAX_SEQ_COUNT, speciesOptions } from "../constants";
import { modelConfigs, speciesModelConfigs } from "../config/speciesModels";
import { parseFasta } from "../utils/parseFasta";

interface MicForm {
    sequences: string;
    targets: string[];
    properties: string[];  // 选中的理化性质名称列表
}

interface MicResultRow {
    id: string;
    sequence: string;
    // 每个配置项的结果，key为配置项的name
    results: { [configName: string]: number };
}

// 预测队列：确保同一时间只有一个预测在进行，避免 WebGPU 会话冲突
class PredictionQueue {
    private queue: Array<() => Promise<any>> = [];
    private processing = false;

    async enqueue<T>(task: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await task();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
            this.process();
        });
    }

    private async process() {
        if (this.processing || this.queue.length === 0) {
            return;
        }
        this.processing = true;
        while (this.queue.length > 0) {
            const task = this.queue.shift();
            if (task) {
                await task();
            }
        }
        this.processing = false;
    }
}

const predictionQueue = new PredictionQueue();

async function predictMICForMultipleSpecies(sequence: string, speciesList: string[]): Promise<Record<string, number>> {
    const predFlowRef = (window as any).__predFlowRef = (window as any).__predFlowRef || new PredFlow();

    return await predictionQueue.enqueue(async () => {
        try {
            const res = await predFlowRef.predictMicFromSequenceForMultipleSpecies(sequence.trim(), speciesList);
            const result: Record<string, number> = {};
            for (const species of speciesList) {
                if (res.results[species] && res.results[species] !== null) {
                    const micValue = res.results[species].mic[0]
                    result[species] = micValue;
                } else {
                    result[species] = NaN;
                }
            }
            return result;
        } catch (err: any) {
            console.error(`MIC prediction failed for species:`, err);
            throw new Error(`MIC 预测失败: ${err?.message || err}`);
        }
    });
}

export default function MicPage() {
    const { t } = useTranslation();
    // 用页面变量保存（而不是 species 存 micResults 里的每行 species），micResults 为所有序列、每个目标菌对应分数
    const [micResults, setMicResults] = useState<MicResultRow[]>([]);
    const [loadingMic, setLoadingMic] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0, estimatedTimeRemaining: 0 });
    const processingTimesRef = useRef<number[]>([]);
    const startTimeRef = useRef<number>(0);
    const modelDownloadedRef = useRef<boolean>(false); // 标记模型是否已下载过

    // 模型加载/下载弹窗状态
    const [modelLoadingModal, setModelLoadingModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        progress: 0,
        showProgress: false,
        isComplete: false, // 是否显示完成状态
        type: "loading" as "loading" | "downloading", // loading: transformers.js加载, downloading: onnx下载
    });

    // 获取所有理化性质配置项
    const propertyConfigs = useMemo(() => {
        return modelConfigs.filter(c => c.type === "property");
    }, []);

    // 辅助函数：获取物种的翻译名称
    const getSpeciesName = (species: string) => {
        const config = speciesModelConfigs.find(c => c.name === species);
        return config ? t(config.nameKey) : species;
    };

    // 当前选择的目标菌列表和理化性质列表，直接从 form 获取
    const micForm = useForm<MicForm>({
        defaultValues: {
            sequences: "",
            targets: [],
            properties: [],
        },
    });

    const sequencesPreview = useMemo(() => micForm.watch("sequences"), [micForm]);
    const watchedTargets = micForm.watch("targets") ?? [];
    const watchedProperties = micForm.watch("properties") ?? [];

    // 初始化并清理 PredFlow 实例
    useEffect(() => {
        // 初始化 PredFlow 实例（如果还没有的话）
        const predFlowRef = (window as any).__predFlowRef = (window as any).__predFlowRef || new PredFlow();

        // 设置下载状态回调
        predFlowRef.setDownloadCallback((status: string) => {
            if (status === "start") {
                // 开始加载ESM模型（每次都需要弹窗）
                setModelLoadingModal({
                    isOpen: true,
                    title: t("mic.modelLoadingTitle"),
                    message: t("mic.modelLoadingMessage"),
                    progress: 0,
                    showProgress: false, // 不显示进度条
                    isComplete: false,
                    type: "loading",
                });
            } else if (status === "complete") {
                // ESM模型加载完成
                if (!modelDownloadedRef.current) {
                    modelDownloadedRef.current = true;
                }
                // 先关闭加载弹窗
                setModelLoadingModal(prev => ({ ...prev, isOpen: false }));
                // 然后显示完成通知
                setTimeout(() => {
                    setModelLoadingModal({
                        isOpen: true,
                        title: t("mic.modelLoadingCompleteTitle"),
                        message: t("mic.modelLoadingCompleteMessage"),
                        progress: 100,
                        showProgress: false,
                        isComplete: true,
                        type: "loading",
                    });
                }, 100);
            }
        });

        // 设置进度回调
        predFlowRef.setProgressCallback((progressData: any) => {
            if (progressData.type === "esm_progress") {
                // transformers.js加载进度（不更新进度条，因为showProgress为false）
                // 这里可以保留逻辑，但不会显示进度条
            } else if (progressData.type === "onnx_download") {
                // ONNX模型下载进度
                const msg = progressData.data;
                if (msg.status === "download_start") {
                    // ONNX模型开始下载
                    setModelLoadingModal({
                        isOpen: true,
                        title: t("mic.modelDownloadTitle"),
                        message: t("mic.modelDownloadMessage", { modelUrl: msg.modelUrl }),
                        progress: 0,
                        showProgress: true,
                        isComplete: false,
                        type: "downloading",
                    });
                } else if (msg.status === "download_progress") {
                    // ONNX模型下载进度
                    setModelLoadingModal(prev => ({
                        ...prev,
                        progress: msg.progress !== undefined ? msg.progress : 0,
                    }));
                } else if (msg.status === "download_complete") {
                    // ONNX模型下载完成
                    // 先关闭进度弹窗
                    setModelLoadingModal(prev => ({ ...prev, isOpen: false }));
                    // 然后显示完成通知
                    setTimeout(() => {
                        setModelLoadingModal({
                            isOpen: true,
                            title: t("mic.modelDownloadCompleteTitle"),
                            message: t("mic.modelDownloadCompleteMessage"),
                            progress: 100,
                            showProgress: false,
                            isComplete: true,
                            type: "downloading",
                        });
                    }, 100);
                }
            }
        });

        // 清理函数：在组件卸载或页面关闭时清理
        const cleanup = () => {
            if ((window as any).__predFlowRef) {
                (window as any).__predFlowRef.terminate();
                delete (window as any).__predFlowRef;
            }
        };

        // 监听页面卸载事件
        if (!(window as any).__predFlowUnloaded) {
            (window as any).__predFlowUnloaded = true;
            window.addEventListener("beforeunload", cleanup);
        }

        // 组件卸载时清理
        return () => {
        };
    }, [t]);

    // 根据选中的理化性质，筛选出相关的配置项
    const selectedPropertyConfigs = useMemo(() => {
        return propertyConfigs.filter(c => watchedProperties.includes(c.name));
    }, [watchedProperties, propertyConfigs]);

    // 格式化剩余时间
    const formatTimeRemaining = (seconds: number): string => {
        if (seconds < 60) {
            return `${Math.ceil(seconds)}${t("mic.seconds")}`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.ceil(seconds % 60);
            if (secs > 0) {
                return `${minutes}${t("mic.minutes")} ${secs}${t("mic.seconds")}`;
            }
            return `${minutes}${t("mic.minutes")}`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            if (minutes > 0) {
                return `${hours}${t("mic.hours")} ${minutes}${t("mic.minutes")}`;
            }
            return `${hours}${t("mic.hours")}`;
        }
    };

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
        setProgress({ current: 0, total: parsed.length, estimatedTimeRemaining: 0 });
        processingTimesRef.current = [];
        startTimeRef.current = Date.now();

        try {
            // 为每个序列进行预测：改为顺序处理以支持进度更新
            const results: MicResultRow[] = [];

            for (let idx = 0; idx < parsed.length; idx++) {
                const item = parsed[idx];
                const sequenceStartTime = Date.now();
                const resultsMap: Record<string, number> = {};

                if (watchedTargets.length > 0) {
                    try {
                        const micResults = await predictMICForMultipleSpecies(item.seq, watchedTargets);
                        for (const sp of watchedTargets) {
                            resultsMap[`${sp}-MIC`] = micResults[sp] ?? NaN;
                        }
                    } catch (err: any) {
                        console.error(`Failed to predict MIC for sequence ${idx + 1}:`, err);
                        watchedTargets.forEach((sp: string) => {
                            resultsMap[`${sp}-MIC`] = NaN;
                        });
                    }
                }

                // 理化性质预测：对每个选中的理化性质计算（不关联目标菌）
                selectedPropertyConfigs.forEach((config) => {
                    resultsMap[config.name] = predictProperty(item.seq, config.modelUrl);
                });

                results.push({
                    id: item.id || `seq-${idx + 1}`,
                    sequence: item.seq,
                    results: resultsMap,
                });

                // 记录处理时间
                const sequenceTime = (Date.now() - sequenceStartTime) / 1000; // 转换为秒
                processingTimesRef.current.push(sequenceTime);

                // 计算平均处理时间和剩余时间
                const avgTime = processingTimesRef.current.reduce((a, b) => a + b, 0) / processingTimesRef.current.length;
                const remaining = parsed.length - (idx + 1);
                const estimatedTimeRemaining = avgTime * remaining;

                // 更新进度
                setProgress({
                    current: idx + 1,
                    total: parsed.length,
                    estimatedTimeRemaining: estimatedTimeRemaining
                });
                // 更新结果，让用户看到部分结果
                setMicResults([...results]);
            }

            setMicResults(results);
        } catch (err: any) {
            console.error("MIC prediction error:", err);
            alert(t("mic.predictionError") + ": " + (err?.message || err));
        } finally {
            setLoadingMic(false);
            setProgress({ current: 0, total: 0, estimatedTimeRemaining: 0 });
        }
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
            const micCells = watchedTargets.map(sp => {
                const value = row.results[`${sp}-MIC`];
                return value !== undefined && !isNaN(value) ? value.toString() : "N/A";
            });
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
                        {loadingMic && progress.total > 0 && (
                            <div className="mic-progress-container">
                                <div className="mic-progress-header">
                                    <span className="mic-progress-text">
                                        {t("mic.progress")} {progress.current} / {progress.total}
                                    </span>
                                    <span className="mic-progress-percent">
                                        {Math.round((progress.current / progress.total) * 100)}%
                                    </span>
                                </div>
                                <div className="mic-progress-bar">
                                    <div
                                        className="mic-progress-fill"
                                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                    />
                                </div>
                                {progress.current > 0 && progress.current < progress.total && (
                                    <div className="mic-progress-time">
                                        <span className="mic-progress-time-label">{t("mic.estimatedTimeRemaining")}:</span>
                                        <span className="mic-progress-time-value">{formatTimeRemaining(progress.estimatedTimeRemaining)}</span>
                                    </div>
                                )}
                            </div>
                        )}
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
                                                                {typeof value === 'number' && !isNaN(value) ? value.toFixed(2) : "N/A"}
                                                            </td>
                                                        );
                                                    })}
                                                    {selectedPropertyConfigs.map((config) => {
                                                        const value = row.results[config.name];
                                                        return (
                                                            <td key={config.name} className="table-cell mic-score-cell">
                                                                {typeof value === 'number' && !isNaN(value) ? value.toFixed(2) : ""}
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

            {/* 模型加载/下载弹窗 */}
            <ModelLoadingModal
                isOpen={modelLoadingModal.isOpen}
                title={modelLoadingModal.title}
                message={modelLoadingModal.message}
                progress={modelLoadingModal.progress}
                showProgress={modelLoadingModal.showProgress}
                isComplete={modelLoadingModal.isComplete}
                onClose={() => setModelLoadingModal(prev => ({ ...prev, isOpen: false }))}
                autoCloseDelay={2000}
            />
        </div>
    );
}

