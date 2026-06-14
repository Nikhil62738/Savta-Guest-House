import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { darkTheme, lightTheme } from '../theme/themes'
import { STORAGE_KEYS } from '../storage/keys'

const ThemeContext = createContext(null)

export function ThemeProvider(props) {
  const system = useColorScheme()
  const [pref, setPref] = useState('system')

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.themeMode).then((v) => {
      if (v) setPref(v)
    })
  }, [])

  const isDark = pref === 'system' ? system === 'dark' : pref === 'dark'
  const theme = isDark ? darkTheme : lightTheme

  async function setMode(mode) {
    setPref(mode)
    await AsyncStorage.setItem(STORAGE_KEYS.themeMode, mode)
  }

  function toggle() {
    setMode(isDark ? 'light' : 'dark')
  }

  const value = useMemo(
    () => ({ theme, isDark, pref, setMode, toggle }),
    [theme, isDark, pref]
  )
  return <ThemeContext.Provider value={value}>{props.children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
