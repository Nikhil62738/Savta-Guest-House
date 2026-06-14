import React from 'react'
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native'
import { useTheme } from '../context/ThemeContext'

export default function Loader(props) {
  const { theme } = useTheme()
  return (
    <View style={[styles.wrap, props.style]}>
      <ActivityIndicator size="large" color={theme.colors.accent} />
      {props.label ? <Text style={[styles.txt, { color: theme.colors.textMuted }]}>{props.label}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  txt: { marginTop: 12, fontSize: 14 },
})
