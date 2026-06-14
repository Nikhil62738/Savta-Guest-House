import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../context/ThemeContext'

export default function ScreenHeader(props) {
  const nav = useNavigation()
  const { theme } = useTheme()
  const c = theme.colors
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {props.back ? (
          <Pressable onPress={() => nav.goBack()} hitSlop={8} style={[styles.iconBtn, { backgroundColor: c.surfaceAlt }]}>
            <Ionicons name="chevron-back" size={22} color={c.text} />
          </Pressable>
        ) : null}
      </View>
      <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>{props.title}</Text>
      <View style={[styles.side, styles.right]}>{props.right}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  side: { width: 44, justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  iconBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800' },
})
