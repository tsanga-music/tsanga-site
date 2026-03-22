import { createContext, useContext, useState } from 'react';
import fr from '../i18n/fr';
import en from '../i18n/en';
import de from '../i18n/de';

const translations = { fr, en, de };

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState('fr');
  const t = translations[lang];
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
