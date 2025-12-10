import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const navItems = [
    { to: "/", key: "home" },
    { to: "/mic", key: "mic" },
    { to: "/amp", key: "amp" },
    { to: "/downloads", key: "downloads" },
    { to: "/contact", key: "contact" },
];

export function Header() {
    const { t, i18n: i18nInstance } = useTranslation();
    const currentLang = i18nInstance.language;

    const toggleLanguage = () => {
        const newLang = currentLang === "zh" ? "en" : "zh";
        i18nInstance.changeLanguage(newLang);
    };

    return (
        <header className="sticky top-0 z-50 mx-auto flex items-center justify-between border-b border-white/5 bg-slate-950/80 backdrop-blur-xl py-4 px-4 md:px-6 lg:px-8 transition-all">
            <div className="flex items-center gap-2 md:gap-3">
                <div className="group relative flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/30 to-brand-600/20 text-brand-200 shadow-lg shadow-brand-500/20 transition-all hover:scale-105 hover:shadow-brand-500/30">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-400/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <img
                        src="/logo.svg"
                        alt="AMP-MIC Logo"
                        className="relative h-7 w-7 md:h-8 md:w-8"
                        draggable={false}
                    />
                </div>
                <div className="hidden sm:block">
                    {/* <p className="text-xs text-slate-400 font-medium">MIC Predictor / Generator</p> */}
                    <p className="text-base md:text-lg font-bold text-white tracking-tight">MIC Predictor / Generator</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <nav className="flex items-center gap-1 overflow-x-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                [
                                    "relative whitespace-nowrap rounded-xl px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30"
                                        : "text-slate-300 hover:text-white hover:bg-white/5",
                                ].join(" ")
                            }
                        >
                            <span className="relative z-10">{t(`nav.${item.key}`)}</span>
                        </NavLink>
                    ))}
                </nav>
                <button
                    onClick={toggleLanguage}
                    className="relative whitespace-nowrap rounded-xl px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-all duration-200 text-slate-300 hover:text-white hover:bg-white/5"
                    title={currentLang === "zh" ? "Switch to English" : "切换到中文"}
                >
                    {currentLang === "zh" ? "EN" : "中文"}
                </button>
            </div>
        </header>
    );
}

