import { useState } from "react";
import { FlaskConical, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MAX_SEQ_COUNT } from "../constants";
import { bibtex } from "../config/bibtex";

function Hero() {
    const { t } = useTranslation();
    return (
        <section className="glass home-hero">
            <div className="home-hero-layout">
                <div className="home-hero-info">
                    <p className="home-hero-badge">
                        {t("home.badge")}
                    </p>
                    <h1 className="home-hero-title">
                        {t("home.title")}
                    </h1>
                    <p className="home-hero-desc">
                        {t("home.desc")}
                    </p>
                    <div className="home-hero-actions">
                        <a
                            className="home-hero-cta group"
                            href="/mic"
                        >
                            <FlaskConical className="h-4 w-4" />
                            {t("home.cta")}
                        </a>
                        <a
                            className="home-hero-secondary"
                            href="/amp"
                        >
                            <Sparkles className="h-4 w-4" />
                            {t("home.secondary")}
                        </a>
                    </div>
                </div>
                <div className="home-hero-stats">
                    {[
                        { labelKey: "home.stats.sequenceSupport", valueKey: "home.stats.sequenceValue" },
                        { labelKey: "home.stats.batchLimit", valueKey: "home.stats.batchValue", valueParams: { count: MAX_SEQ_COUNT } },
                        { labelKey: "home.stats.fileLimit", valueKey: "home.stats.fileValue" },
                        { labelKey: "home.stats.targetSpecies", valueKey: "home.stats.targetValue" },
                    ].map((item) => (
                        <div
                            key={item.labelKey}
                            className="home-hero-stat-card group"
                        >
                            <p className="home-hero-stat-label">{t(item.labelKey)}</p>
                            <p className="home-hero-stat-value">
                                {item.valueParams ? t(item.valueKey, item.valueParams) : t(item.valueKey)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Chip({ label }: { label: string }) {
    return (
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-100">
            {label}
        </span>
    );
}

export default function HomePage() {
    const { t } = useTranslation();
    const [bibtexCopied, setBibtexCopied] = useState(false);

    return (
        <div className="home-page">
            <Hero />

            <section className="home-highlight">
                <div className="home-highlight-blob-primary" />
                <div className="home-highlight-blob-secondary" />
                <div className="home-highlight-grid">
                    <div className="home-highlight-copy">
                        <p className="home-highlight-subtitle">
                            {t("home.highlight.subtitle")}
                        </p>
                        <p className="home-highlight-text">
                            {t("home.highlight.text")}
                        </p>
                    </div>
                    <div className="home-highlight-links">
                        <a
                            href="https://github.com/junlab-bio/AMP-MIC"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="home-link group"
                        >
                            <svg
                                height="18"
                                width="18"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.419-1.304.762-1.604-2.665-.304-5.467-1.332-5.467-5.933 0-1.311.469-2.383 1.236-3.222-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.491 11.491 0 0 1 3.003-.404c1.019.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.839 1.235 1.911 1.235 3.222 0 4.61-2.807 5.625-5.479 5.921.43.372.823 1.104.823 2.227v3.301c0 .319.218.694.827.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z" />
                            </svg>
                            Code
                        </a>
                        <a
                            href="https://arxiv.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="home-link group"
                            title="论文（Paper）"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect x="3" y="3" width="13" height="18" rx="2" />
                                <path d="M16 8h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-9" />
                                <line x1="8" y1="6" x2="12" y2="6" />
                                <line x1="8" y1="10" x2="12" y2="10" />
                                <line x1="8" y1="14" x2="15" y2="14" />
                            </svg>
                            Paper
                        </a>
                    </div>

                </div>

                <div className="home-bibtex-card">
                    <div className="home-bibtex-header">
                        <p className="home-bibtex-label">{t("home.bibtex.label")}</p>
                        <button
                            className="home-copy-btn"
                            onClick={async () => {
                                await navigator.clipboard.writeText(bibtex);
                                setBibtexCopied(true);
                                setTimeout(() => setBibtexCopied(false), 1600);
                            }}
                        >
                            {bibtexCopied ? t("home.bibtex.copied") : t("home.bibtex.copy")}
                        </button>
                    </div>
                    <pre className="home-bibtex-pre">
                        {bibtex}
                    </pre>
                </div>
            </section>
        </div>
    );
}

