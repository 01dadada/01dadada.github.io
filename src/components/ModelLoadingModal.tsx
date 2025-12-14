import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, CheckCircle2 } from "lucide-react";

interface ModelLoadingModalProps {
    isOpen: boolean;
    title: string;
    message?: string;
    progress?: number;
    showProgress?: boolean;
    onClose?: () => void;
    autoCloseDelay?: number; // 自动关闭延迟（毫秒）
    isComplete?: boolean; // 是否显示完成状态
}

export function ModelLoadingModal({
    isOpen,
    title,
    message,
    progress,
    showProgress = false,
    onClose,
    autoCloseDelay = 2000, // 默认2秒
    isComplete = false, // 是否显示完成状态
}: ModelLoadingModalProps) {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // 2秒后自动关闭
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    if (onClose) {
                        onClose();
                    }
                }, 300); // 等待动画完成
            }, autoCloseDelay);
            return () => clearTimeout(timer);
        } else {
            // 如果外部关闭，立即隐藏
            setIsVisible(false);
        }
    }, [isOpen, autoCloseDelay, onClose]);

    if (!isOpen && !isVisible) return null;

    return (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div
                className={`glass p-4 transition-all duration-300 ease-out ${isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
                    }`}
            >
                <div className="flex items-start gap-3">
                    {/* 图标：完成时显示对勾，否则显示加载动画 */}
                    <div className="relative flex-shrink-0">
                        {isComplete ? (
                            <>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/30 to-green-600/20 blur-md animate-pulse" />
                                <div className="relative rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 p-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-200" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500/30 to-brand-600/20 blur-md animate-pulse" />
                                <div className="relative rounded-full bg-gradient-to-br from-brand-500/20 to-brand-600/10 p-2">
                                    <Loader2 className="h-5 w-5 text-brand-200 animate-spin" />
                                </div>
                            </>
                        )}
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                        {/* 标题 */}
                        <h3 className="text-sm font-bold text-white mb-1">
                            {title}
                        </h3>

                        {/* 消息 */}
                        {message && (
                            <p className="text-xs text-slate-300 mb-2 line-clamp-2">
                                {message}
                            </p>
                        )}

                        {/* 进度条 */}
                        {showProgress && progress !== undefined && (
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>{t("mic.downloading")}</span>
                                    {progress >= 0 ? (
                                        <span>{progress.toFixed(1)}%</span>
                                    ) : (
                                        <span>...</span>
                                    )}
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-slate-800/50 overflow-hidden">
                                    {progress >= 0 ? (
                                        <div
                                            className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-300 ease-out"
                                            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                                        />
                                    ) : (
                                        <div className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full animate-pulse" style={{ width: "60%" }} />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

