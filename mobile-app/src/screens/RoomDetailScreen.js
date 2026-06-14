import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useSaved } from '../context/SavedContext'
import { roomAvailability } from '../components/RoomCard'
import Button from '../components/Button'

const W = Dimensions.get('window').width
const FALLBACK = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80'

export default function RoomDetailScreen(props) {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const { isSaved, toggleSaved } = useSaved()
  const insets = useSafeAreaInsets()
  const c = theme.colors
  const room = (props.route.params && props.route.params.room) || {}
  const id = room._id || room.id
  const images = room.images && room.images.length ? room.images : [FALLBACK]
  const [active, setActive] = useState(0)
  const avail = roomAvailability(room)
  const soldOut = avail === 0
  const saved = isSaved(id)

  function onScroll(e) {
    const x = e.nativeEvent.contentOffset.x
    setActive(Math.round(x / W))
  }

  return (
    <View style={[styles.fill, { backgroundColor: c.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.gallery}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={16}>
            {images.map((src, i) => (
              <Image key={i} source={src} style={styles.galleryImg} contentFit="cover" transition={200} />
            ))}
          </ScrollView>
          <LinearGradient colors={['rgba(15,23,42,0.5)', 'transparent']} style={styles.topShade} />
          <Pressable onPress={() => props.navigation.goBack()} style={[styles.roundBtn, { top: insets.top + 8, left: 16 }]}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>
          <Pressable onPress={() => toggleSaved(id)} style={[styles.roundBtn, { top: insets.top + 8, right: 16 }]}>
            <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? '#F87171' : '#fff'} />
          </Pressable>
          {images.length > 1 ? (
            <View style={styles.dots}>
              {images.map((s, i) => (
                <View key={i} style={[styles.dot, { backgroundColor: i === active ? c.accent : 'rgba(255,255,255,0.5)' }]} />
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={[styles.name, { color: c.text }]}>{room.name}</Text>
            {avail != null ? (
              <View style={[styles.availTag, { backgroundColor: soldOut ? c.danger : c.success }]}>
                <Text style={styles.availTxt}>{soldOut ? t('soldOut') : avail + ' ' + t('available')}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="pricetag-outline" size={15} color={c.accent} />
              <Text style={[styles.metaTxt, { color: c.textMuted }]}>{room.category || room.type}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={15} color={c.accent} />
              <Text style={[styles.metaTxt, { color: c.textMuted }]}>{t('guests')} {room.occupancy || 2}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="snow-outline" size={15} color={c.accent} />
              <Text style={[styles.metaTxt, { color: c.textMuted }]}>{room.type}</Text>
            </View>
          </View>

          {room.description ? (
            <View>
              <Text style={[styles.sectionTitle, { color: c.text }]}>{t('aboutRoom')}</Text>
              <Text style={[styles.desc, { color: c.textMuted }]}>{room.description}</Text>
            </View>
          ) : null}

          {room.amenities && room.amenities.length ? (
            <View>
              <Text style={[styles.sectionTitle, { color: c.text }]}>{t('amenities')}</Text>
              <View style={styles.amenities}>
                {room.amenities.map((a, i) => (
                  <View key={i} style={[styles.amenity, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
                    <Ionicons name="checkmark-circle" size={15} color={c.success} />
                    <Text style={[styles.amenityTxt, { color: c.text }]}>{a}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: c.surface, borderTopColor: c.border, paddingBottom: insets.bottom + 12 }]}>
        <View>
          <Text style={[styles.price, { color: c.text }]}>{'₹' + (room.price || 0)}</Text>
          <Text style={[styles.night, { color: c.textMuted }]}>{t('perNight')}</Text>
        </View>
        <Button
          title={t('bookNow')}
          icon="calendar"
          disabled={soldOut}
          onPress={() => props.navigation.navigate('Booking', { room })}
          style={styles.bookBtn}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scroll: { paddingBottom: 24 },
  gallery: { height: 320, width: '100%' },
  galleryImg: { width: W, height: 320 },
  topShade: { position: 'absolute', top: 0, left: 0, right: 0, height: 110 },
  roundBtn: { position: 'absolute', width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(15,23,42,0.5)', alignItems: 'center', justifyContent: 'center' },
  dots: { position: 'absolute', bottom: 14, alignSelf: 'center', flexDirection: 'row' },
  dot: { width: 7, height: 7, borderRadius: 4, marginHorizontal: 3 },
  body: { padding: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: 24, fontWeight: '900', flex: 1, marginRight: 10 },
  availTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  availTxt: { color: '#fff', fontSize: 11, fontWeight: '800' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, marginBottom: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 18, marginBottom: 6 },
  metaTxt: { fontSize: 13, fontWeight: '600', marginLeft: 6 },
  sectionTitle: { fontSize: 17, fontWeight: '800', marginTop: 18, marginBottom: 8 },
  desc: { fontSize: 14, lineHeight: 21 },
  amenities: { flexDirection: 'row', flexWrap: 'wrap' },
  amenity: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, marginBottom: 8 },
  amenityTxt: { fontSize: 13, fontWeight: '600', marginLeft: 6 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1 },
  price: { fontSize: 24, fontWeight: '900' },
  night: { fontSize: 12, marginTop: 1 },
  bookBtn: { paddingHorizontal: 40 },
})
