

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

// Define translations structure
interface Translations {
  // FIX: Allow string arrays for translations like lists of features.
  [key: string]: string | string[] | Translations;
}

// Import translation files
import { translations } from '../locales';

type LanguageContextType = {
  language: string;
  changeLanguage: (lang: string) => void;
  // FIX: Changed return type to `any` to support arrays of strings from translation files.
  t: (key: string, variables?: { [key: string]: string | number }) => any;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get nested translation
// FIX: Updated to correctly traverse nested objects and return any type.
const getNestedTranslation = (obj: any, key: string): any => {
    return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
}


export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const changeLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };
  
  // FIX: Updated `t` function to handle different return types (string, string[]) and perform variable substitution only on strings.
  const t = useCallback((key: string, variables?: { [key: string]: string | number }): any => {
    let translation = getNestedTranslation(translations[language], key);
    
    if (translation === undefined) {
      // Fallback to English
      translation = getNestedTranslation(translations['en'], key);
    }

    if (translation === undefined) {
      return key; // Return key if no translation found
    }

    if (typeof translation === 'string' && variables) {
      let templatedString = translation;
      Object.keys(variables).forEach(varKey => {
        const regex = new RegExp(`{{${varKey}}}`, 'g');
        templatedString = templatedString.replace(regex, String(variables[varKey]));
      });
      return templatedString;
    }

    return translation;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
