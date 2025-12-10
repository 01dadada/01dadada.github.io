import { FileDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionCard } from "../components/SectionCard";
import { downloadableFiles } from "../config/downloads";

export default function DownloadsPage() {
    const { t } = useTranslation();

    return (
        <div className="downloads-page">
            <SectionCard
                id="downloads"
                icon={<FileDown className="h-5 w-5" />}
                title={t("downloads.title")}
                description=""
            >
                <div className="downloads-grid">
                    {downloadableFiles.map((item, index) => (
                        <div
                            key={`${item.titleKey}-${index}`}
                            className="download-card group"
                        >
                            <div>
                                <p className="download-title">{t(item.titleKey)}</p>
                                <p className="download-desc">{t(item.descriptionKey)}</p>
                                <p className="download-size">{item.size}</p>
                            </div>
                            <a
                                className="download-btn"
                                href={item.url}
                                target="_blank"
                            >
                                <FileDown className="h-4 w-4" />
                                {t("downloads.download")}
                            </a>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </div>
    );
}

