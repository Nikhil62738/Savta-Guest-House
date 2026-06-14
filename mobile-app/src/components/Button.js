import React from 'react'
import { Text, StyleSheet, ActivityIndicator, Pressable, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { radius } from '../theme/themes'

export default function Button(props) {
  const { theme } = useTheme()
  const c = theme.colors
  const variant = props.variant || 'accent'
  const palette = {
    accent: { bg: c.accent, fg: c.onAccent, border: c.accent },
    primary: { bg: c.primary, fg: c.onPrimary, border: c.primary },
    outline: { bg: 'transparent', fg: c.text, border: c.border },
    ghost: { bg: 'transparent', fg: c.accent, border: 'transparent' },
  }
  const p = palette[variant] || palette.accent
  const disabled = props.disabled || props.loading
  return (
    <Pressable
      onPress={props.onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: p.bg, borderColor: p.border, opacity: disabled ? 0.6 : pressed ? 0.9 : 1 },
        props.full && styles.full,
        props.style,
      ]}
    >
      {props.loading ? (
        <ActivityIndicator color={p.fg} />
      ) : (
        <View style={styles.row}>
          {props.icon ? <Ionicons name={props.icon} size={18} color={p.fg} style={styles.icon} /> : null}
          <Text style={[styles.label, { color: p.fg }]}>{props.title}</Text>
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: { height: 52, borderRadius: radius.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 },
  full: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 8 },
  label: { fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
})
