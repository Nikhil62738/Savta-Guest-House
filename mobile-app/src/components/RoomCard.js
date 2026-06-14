import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useSaved } from '../context/SavedContext'
import { radius, shadow } from '../theme/themes'

export function roomAvailability(room) {
  if (room.available != null) return room.available
  if (room.totalUnits != null) {
    const booked = (room.bookedOnline || 0) + (room.bookedOffline || 0)
    return Math.max(0, room.totalUnits - booked)
  }
  return null
}

// Deterministic display rating + review count when the backend doesn't provide one.
export function roomRating(room) {
  if (room.rating != null) {
    return { rating: Number(room.rating), reviews: room.reviewsCount || room.reviews || 0 }
  }
  const key = String(room._id || room.id || room.name || 'room')
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 100000
  const rating = (4.5 + (h % 5) / 10).toFixed(1)
  const reviews = 80 + (h % 150)
  return { rating: Number(rating), reviews }
}

const FALLBACK = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80'

export default function RoomCard(props) {
  const room = props.room
  const { theme } = useTheme()
  const { t } = useLanguage()
  const c = theme.colors
  const { isSaved, toggleSaved } = useSaved()
  const id = room._id || room.id
  const saved = isSaved(id)
  const avail = roomAvailability(room)
  const soldOut = avail === 0
  const img = (room.images && room.images[0]) || FALLBACK
  const rt = roomRating(room)
  return (
    <Pressable onPress={props.onPress} style={[styles.card, { backgroundColor: c.card, borderColor: c.border }, props.style]}>
      <View style={styles.imgWrap}>
        <Image source={img} style={styles.img} contentFit="cover" transition={250} />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.55)']} style={styles.shade} />
        <Pressable onPress={() => toggleSaved(id)} hitSlop={8} style={[styles.heart, { backgroundColor: c.overlay }]}>
          <Ionicons name={saved ? 'heart' : 'heart-outline'} size={18} color={saved ? '#F87171' : '#fff'} />
        </Pressable>
        <View style={[styles.typeTag, { backgroundColor: c.accent }]}>
          <Text style={[styles.typeTxt, { color: c.onAccent }]}>{room.category || room.type}</Text>
        </View>
        {avail != null ? (
          <View style={[styles.availTag, { backgroundColor: soldOut ? c.danger : c.success }]}>
            <Text style={styles.availTxt}>{soldOut ? t('soldOut') : avail + ' ' + t('available')}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.body}>
        <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>{room.name}</Text>
        <Text style={[styles.meta, { color: c.textMuted }]} numberOfLines={1}>
          {(room.type || 'Room') + '  ·  ' + t('guests') + ' ' + (room.occupancy || 2)}
        </Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color="#F5A623" />
          <Text style={[styles.rating, { color: c.text }]}>{rt.rating}</Text>
          <Text style={[styles.ratingCount, { color: c.textMuted }]}>{'(' + rt.reviews + ' ' + t('reviews') + ')'}</Text>
        </View>
        <View style={styles.footer}>
          <View>
            <Text style={[styles.price, { color: c.text }]}>{'₹' + (room.price || 0)}</Text>
            <Text style={[styles.night, { color: c.textMuted }]}>{t('perNight')}</Text>
          </View>
          <Pressable onPress={props.onBook || props.onPress} hitSlop={6} style={[styles.cta, { backgroundColor: soldOut ? c.textMuted : c.accent }]}>
            <Text style={[styles.ctaTxt, { color: c.onAccent }]}>{soldOut ? t('soldOut') : t('bookNow')}</Text>
            {!soldOut ? <Ionicons name="arrow-forward" size={14} color={c.onAccent} /> : null}
          </Pressable>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden', ...shadow.card },
  imgWrap: { height: 168, width: '100%' },
  img: { width: '100%', height: '100%' },
  shade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 70 },
  heart: { position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  typeTag: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  typeTxt: { fontSize: 11, fontWeight: '800', letterSpacing: 0.4 },
  availTag: { position: 'absolute', bottom: 12, left: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  availTxt: { color: '#fff', fontSize: 11, fontWeight: '800' },
  body: { padding: 14 },
  name: { fontSize: 17, fontWeight: '800' },
  meta: { fontSize: 13, marginTop: 3 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  rating: { fontSize: 13, fontWeight: '800', marginLeft: 4 },
  ratingCount: { fontSize: 12, marginLeft: 4 },
  footer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 14 },
  price: { fontSize: 20, fontWeight: '900' },
  night: { fontSize: 11, marginTop: 2 },
  cta: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 40, borderRadius: radius.pill },
  ctaTxt: { fontSize: 13, fontWeight: '800', marginRight: 6 },
})
