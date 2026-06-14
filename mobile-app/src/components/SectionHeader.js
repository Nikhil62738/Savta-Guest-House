import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '../context/ThemeContext'

export default function SectionHeader(props) {
  const { theme } = useTheme()
  const c = theme.colors
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={[styles.bar, { backgroundColor: c.accent }]} />
        <Text style={[styles.title, { color: c.text }]}>{props.title}</Text>
      </View>
      {props.actionLabel ? (
        <Pressable onPress={props.onAction} hitSlop={8}>
          <Text style={[styles.action, { color: c.accent }]}>{props.actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  left: { flexDirection: 'row', alignItems: 'center' },
  bar: { width: 4, height: 20, borderRadius: 2, marginRight: 10 },
  title: { fontSize: 19, fontWeight: '800', letterSpacing: 0.2 },
  action: { fontSize: 14, fontWeight: '700' },
})
