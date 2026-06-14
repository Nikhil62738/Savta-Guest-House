import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'

export default function EmptyState(props) {
  const { theme } = useTheme()
  const c = theme.colors
  return (
    <View style={styles.wrap}>
      <View style={[styles.circle, { backgroundColor: c.surfaceAlt }]}>
        <Ionicons name={props.icon || 'sad-outline'} size={34} color={c.textMuted} />
      </View>
      <Text style={[styles.title, { color: c.text }]}>{props.title || 'Nothing here yet'}</Text>
      {props.message ? <Text style={[styles.msg, { color: c.textMuted }]}>{props.message}</Text> : null}
      {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', padding: 32 },
  circle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 17, fontWeight: '800', marginBottom: 6, textAlign: 'center' },
  msg: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 16 },
})
