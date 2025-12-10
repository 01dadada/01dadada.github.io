import { Mail } from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { useTranslation } from "react-i18next";

export default function ContactPage() {
    const { t } = useTranslation();

    return (
        <div className="contact-page">
            <SectionCard
                icon={<Mail className="h-5 w-5" />}
                title={t("contact.title")}
                description={t("contact.description")}
            >
                <div className="contact-card">
                    <p className="contact-text">
                        {t("contact.emailLabel")}
                        <a
                            className="contact-link"
                            href="mailto:xuejun.01@foxmail.com"
                        >
                            xuejun.01@foxmail.com
                        </a>
                    </p>
                </div>
            </SectionCard>
        </div>
    );
}

