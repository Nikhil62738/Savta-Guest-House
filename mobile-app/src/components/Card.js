import React from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { BlurView } from 'expo-blur'
import { useTheme } from '../context/ThemeContext'
import { radius } from '../theme/themes'

export default function Card(props) {
  const { theme, isDark } = useTheme()
  const c = theme.colors
  if (props.glass && Platform.OS !== 'web') {
    return (
      <BlurView
        intensity={isDark ? 40 : 55}
        tint={isDark ? 'dark' : 'light'}
        style={[styles.card, { borderColor: c.border, backgroundColor: c.glass }, props.style]}
      >
        {props.children}
      </BlurView>
    )
  }
  return (
    <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }, props.style]}>
      {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, borderWidth: 1, padding: 16, overflow: 'hidden' },
})
