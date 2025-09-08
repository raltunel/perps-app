import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import deTranslation from '../locales/de/translation.json';
import enTranslation from '../locales/en/translation.json';
import esTranslation from '../locales/es/translation.json';
import frTranslation from '../locales/fr/translation.json';
import jaTranslation from '../locales/ja/translation.json';
import koTranslation from '../locales/ko/translation.json';
import nlTranslation from '../locales/nl/translation.json';
import plTranslation from '../locales/pl/translation.json';
import ptBRTranslation from '../locales/pt-BR/translation.json';
import ukTranslation from '../locales/uk/translation.json';
import zhTranslation from '../locales/zh/translation.json';
import zhHKTranslation from '../locales/zh-HK/translation.json';
import zhTWTranslation from '../locales/zh-TW/translation.json';
import idTranslation from '../locales/id/translation.json';
import viTranslation from '../locales/vi/translation.json';

const resources = {
    de: {
        translation: deTranslation,
    },
    en: {
        translation: enTranslation,
    },
    es: {
        translation: esTranslation,
    },
    fr: {
        translation: frTranslation,
    },
    ja: {
        translation: jaTranslation,
    },
    ko: {
        translation: koTranslation,
    },
    nl: {
        translation: nlTranslation,
    },
    pl: {
        translation: plTranslation,
    },
    'pt-BR': {
        translation: ptBRTranslation,
    },
    uk: {
        translation: ukTranslation,
    },
    zh: {
        translation: zhTranslation,
    },
    'zh-HK': {
        translation: zhHKTranslation,
    },
    'zh-TW': {
        translation: zhTWTranslation,
    },
    id: {
        translation: idTranslation,
    },
    vi: {
        translation: viTranslation,
    },
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        // debug: process.env.NODE_ENV === 'development',
        debug: true,

        interpolation: {
            escapeValue: false,
        },
    });

// Add language change listener
i18n.on('languageChanged', (lng) => {
    console.debug('🌐 Language changed to: ', lng);
    console.debug('📍 Resolved language: ', i18n.resolvedLanguage);
    console.debug('🗂️ Available languages: ', Object.keys(resources));
});

// Log initial language detection
i18n.on('initialized', () => {
    console.debug('✅ i18n initialized with language: ', i18n.language);
    console.debug('🔍 Browser languages: ', navigator.languages);
});

// Log when translations are loaded
i18n.on('loaded', (loaded) => {
    console.debug('📚 Translations loaded: ', loaded);
});

// Log loading failures
i18n.on('failedLoading', (lng, ns, msg) => {
    console.error('❌ Failed loading: ', lng, ns, msg);
});

export default i18n;
