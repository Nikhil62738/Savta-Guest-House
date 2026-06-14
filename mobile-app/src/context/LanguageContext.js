import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STRINGS } from '../i18n/strings'

const KEY = 'sawta-lang'
const LanguageContext = createContext(null)

export function LanguageProvider(props) {
  const [lang, setLangState] = useState('en')

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => {
      if (v === 'en' || v === 'mr') setLangState(v)
    })
  }, [])

  async function setLang(next) {
    setLangState(next)
    await AsyncStorage.setItem(KEY, next)
  }

  function toggleLang() {
    setLang(lang === 'en' ? 'mr' : 'en')
  }

  function t(key) {
    const dict = STRINGS[lang] || STRINGS.en
    return dict[key] || STRINGS.en[key] || key
  }

  const value = { lang, setLang, toggleLang, t }
  return <LanguageContext.Provider value={value}>{props.children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
