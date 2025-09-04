import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';

const resources = {
    en: {
        translation: enTranslation,
    },
    es: {
        translation: esTranslation,
    },
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',

        interpolation: {
            escapeValue: false,
        },
    });

i18n.on('languageChanged', (lng: string) => {
    console.debug('Language changed to: ', lng);
    console.debug('Resolved language: ', i18n.resolvedLanguage);
    console.debug('Available languages: ', Object.keys(resources));
});

export default i18n;
