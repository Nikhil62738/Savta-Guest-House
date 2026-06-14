import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { dict } from '../translations.js'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('sawta-lang') || 'en')

  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem('sawta-lang', lang)
  }, [lang])

  const toggle = useCallback(() => setLang((l) => (l === 'en' ? 'mr' : 'en')), [])

  // t() returns the Marathi string when lang === 'mr', else the original English
  const t = useCallback((s) => (lang === 'mr' && dict[s] ? dict[s] : s), [lang])

  const value = { lang, t, toggle }
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
