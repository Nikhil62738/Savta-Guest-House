import React from 'react'
import { Text, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { radius } from '../theme/themes'

export default function Chip(props) {
  const { theme } = useTheme()
  const c = theme.colors
  const active = props.active
  return (
    <Pressable
      onPress={props.onPress}
      style={[
        styles.chip,
        { borderColor: active ? c.accent : c.border, backgroundColor: active ? c.accent : 'transparent' },
        props.style,
      ]}
    >
      <Text style={[styles.txt, { color: active ? c.onAccent : c.textMuted }]}>{props.label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 16, height: 38, borderRadius: radius.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  txt: { fontSize: 13, fontWeight: '700' },
})
