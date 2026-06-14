import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { radius } from '../theme/themes'

export default function ReviewCard(props) {
  const r = props.review
  const { theme } = useTheme()
  const c = theme.colors
  const initials = (r.name || 'G').trim().charAt(0).toUpperCase()
  const stars = []
  for (let i = 1; i <= 5; i++) stars.push(i <= (r.rating || 0))
  return (
    <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }, props.style]}>
      <View style={styles.head}>
        <View style={[styles.avatar, { backgroundColor: c.accent }]}>
          <Text style={[styles.initials, { color: c.onAccent }]}>{initials}</Text>
        </View>
        <View style={styles.headText}>
          <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>{r.name}</Text>
          {r.city ? <Text style={[styles.city, { color: c.textMuted }]}>{r.city}</Text> : null}
        </View>
      </View>
      <View style={styles.stars}>
        {stars.map((on, i) => (
          <Ionicons key={i} name={on ? 'star' : 'star-outline'} size={14} color={c.accent} style={styles.star} />
        ))}
      </View>
      <Text style={[styles.comment, { color: c.textMuted }]} numberOfLines={5}>{r.comment}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { width: 280, borderRadius: radius.lg, borderWidth: 1, padding: 16, marginRight: 14 },
  head: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  initials: { fontSize: 18, fontWeight: '800' },
  headText: { flex: 1 },
  name: { fontSize: 15, fontWeight: '800' },
  city: { fontSize: 12, marginTop: 2 },
  stars: { flexDirection: 'row', marginBottom: 8 },
  star: { marginRight: 2 },
  comment: { fontSize: 13, lineHeight: 19 },
})
