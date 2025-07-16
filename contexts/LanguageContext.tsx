import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../utils/translations';
import { getStoredLanguage, setStoredLanguage } from '../utils/languageStorage';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }: LanguageProviderProps) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load language from storage on mount
    const storedLanguage = getStoredLanguage();
    setCurrentLanguage(storedLanguage);
    setIsInitialized(true);
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    setStoredLanguage(language);
  };

  // Don't render until language is initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 