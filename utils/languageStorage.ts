import { Language } from './translations';

const LANGUAGE_STORAGE_KEY = 'OldPho-language';

export const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && ['en', 'zh-TW', 'ja'].includes(stored)) {
    return stored as Language;
  }
  
  // Auto-select based on browser language
  const browserLang = navigator.language;
  if (browserLang.startsWith('zh')) return 'zh-TW';
  if (browserLang.startsWith('ja')) return 'ja';
  
  return 'en';
};

export const setStoredLanguage = (language: Language): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}; 