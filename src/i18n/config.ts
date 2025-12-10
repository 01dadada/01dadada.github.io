import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from './locales/zh.json';
import en from './locales/en.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            zh: {
                translation: zh,
            },
            en: {
                translation: en,
            },
        },
        lng: (() => {
            // 从 localStorage 读取，如果没有则根据浏览器语言设置
            const saved = localStorage.getItem('language');
            if (saved === 'zh' || saved === 'en') {
                return saved;
            }
            // 检测浏览器语言
            const browserLang = navigator.language.toLowerCase();
            return browserLang.startsWith('zh') ? 'zh' : 'en';
        })(),
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React 已经转义了
        },
    });

// 监听语言变化，更新 localStorage 和 HTML lang 属性
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
    document.documentElement.lang = lng;
});

export default i18n;

