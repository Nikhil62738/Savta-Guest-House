import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, RefreshControl, Pressable } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { fetchRooms, fetchReviews } from '../api/services'
import Logo from '../components/Logo'
import SectionHeader from '../components/SectionHeader'
import RoomCard from '../components/RoomCard'
import ReviewCard from '../components/ReviewCard'
import Button from '../components/Button'
import { HERO, OFFERS, FACILITIES, NEARBY } from '../data/content'

export default function HomeScreen(props) {
  const { theme } = useTheme()
  const { t, lang, toggleLang } = useLanguage()
  const { user } = useAuth()
  const insets = useSafeAreaInsets()
  const c = theme.colors
  const [rooms, setRooms] = useState([])
  const [reviews, setReviews] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    try {
      const r = await fetchRooms()
      setRooms(r.data || [])
    } catch (e) {}
    try {
      const rv = await fetchReviews()
      setReviews(rv.data || [])
    } catch (e) {}
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function onRefresh() {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  function openRoom(room) {
    props.navigation.navigate('RoomDetail', { room })
  }
  function bookRoom(room) {
    props.navigation.navigate('Booking', { room })
  }

  const firstName = user && user.name ? String(user.name).split(' ')[0] : t('guest')
  const featured = rooms.slice(0, 6)

  return (
    <View style={[styles.fill, { backgroundColor: c.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.accent} />}
      >
        <View style={styles.hero}>
          <Image source={HERO.image} style={styles.heroImg} contentFit="cover" />
          <LinearGradient colors={['rgba(15,23,42,0.3)', 'rgba(15,23,42,0.9)']} style={styles.heroShade} />
          <Pressable onPress={toggleLang} style={[styles.langPill, { top: insets.top + 10 }]}>
            <Ionicons name="language" size={14} color="#fff" />
            <Text style={styles.langTxt}>{lang === 'en' ? 'EN' : 'मर'}</Text>
          </Pressable>
          <View style={styles.heroContent}>
            <Logo size="md" onDark tagline />
            <Text style={styles.heroSub}>{HERO.subtitle}</Text>
            <Button title={t('quickBooking')} icon="flash" onPress={() => props.navigation.navigate('Booking', {})} style={styles.heroBtn} />
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.greet}>
            <Text style={[styles.greetHi, { color: c.text }]}>{t('welcomeBack') + ', ' + firstName + ' 👋'}</Text>
            <Text style={[styles.greetSub, { color: c.textMuted }]}>{t('findStay')}</Text>
          </View>
          <Pressable onPress={() => props.navigation.navigate('Rooms')} style={[styles.search, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
            <Ionicons name="search" size={18} color={c.textMuted} />
            <Text style={[styles.searchTxt, { color: c.textMuted }]}>{t('searchRooms')}</Text>
          </Pressable>
          <SectionHeader title={t('featuredRooms')} actionLabel={t('viewAll')} onAction={() => props.navigation.navigate('Rooms')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
            {featured.map((room) => (
              <RoomCard key={room._id || room.id} room={room} onPress={() => openRoom(room)} onBook={() => bookRoom(room)} style={styles.hRoom} />
            ))}
          </ScrollView>

          <SectionHeader title={t('specialOffers')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
            {OFFERS.map((o) => (
              <LinearGradient key={o.id} colors={['#D4AF37', '#B8932F']} start={[0, 0]} end={[1, 1]} style={styles.offer}>
                <View style={styles.offerTag}><Text style={styles.offerTagTxt}>{o.tag}</Text></View>
                <Text style={styles.offerTitle}>{o.title}</Text>
                <Text style={styles.offerDesc}>{o.desc}</Text>
              </LinearGradient>
            ))}
          </ScrollView>

          <SectionHeader title={t('facilities')} />
          <View style={styles.facilities}>
            {FACILITIES.map((f, i) => (
              <View key={i} style={[styles.facility, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
                <Ionicons name={f.icon} size={18} color={c.accent} />
                <Text style={[styles.facilityTxt, { color: c.text }]} numberOfLines={1}>{f.name}</Text>
              </View>
            ))}
          </View>

          {reviews.length > 0 ? (
            <View>
              <SectionHeader title={t('guestReviews')} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
                {reviews.map((r) => (
                  <ReviewCard key={r._id || r.name} review={r} />
                ))}
              </ScrollView>
            </View>
          ) : null}

          <SectionHeader title={t('nearby')} />
          <View style={[styles.nearbyBox, { backgroundColor: c.card, borderColor: c.border }]}>
            {NEARBY.map((n, i) => (
              <View key={i} style={[styles.nearbyRow, i < NEARBY.length - 1 && { borderBottomColor: c.border, borderBottomWidth: 1 }]}>
                <View style={[styles.nearbyIcon, { backgroundColor: c.surfaceAlt }]}>
                  <Ionicons name={n.icon} size={18} color={c.accent} />
                </View>
                <Text style={[styles.nearbyName, { color: c.text }]}>{n.name}</Text>
                <Text style={[styles.nearbyDist, { color: c.textMuted }]}>{n.distance}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scroll: { paddingBottom: 28 },
  hero: { height: 312, width: '100%' },
  heroImg: { width: '100%', height: '100%' },
  heroShade: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  langPill: { position: 'absolute', right: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 12, height: 32, borderRadius: 16 },
  langTxt: { color: '#fff', fontSize: 12, fontWeight: '800', marginLeft: 6 },
  heroContent: { position: 'absolute', left: 0, right: 0, bottom: 28, alignItems: 'center', paddingHorizontal: 24 },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 10, marginBottom: 18 },
  heroBtn: { paddingHorizontal: 30 },
  body: { paddingHorizontal: 20, paddingTop: 20 },
  greet: { marginBottom: 14 },
  greetHi: { fontSize: 22, fontWeight: '900' },
  greetSub: { fontSize: 14, marginTop: 3 },
  search: { flexDirection: 'row', alignItems: 'center', height: 50, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, marginBottom: 22 },
  searchTxt: { fontSize: 15, marginLeft: 10 },
  hList: { paddingRight: 8, paddingBottom: 8 },
  hRoom: { width: 290, marginRight: 14 },
  offer: { width: 250, borderRadius: 20, padding: 18, marginRight: 14 },
  offerTag: { alignSelf: 'flex-start', backgroundColor: 'rgba(15,23,42,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 10 },
  offerTagTxt: { color: '#0F172A', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  offerTitle: { color: '#0F172A', fontSize: 18, fontWeight: '900' },
  offerDesc: { color: 'rgba(15,23,42,0.8)', fontSize: 13, marginTop: 6, lineHeight: 18 },
  facilities: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  facility: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginRight: 8, marginBottom: 8, width: '47%' },
  facilityTxt: { fontSize: 13, fontWeight: '600', marginLeft: 8, flexShrink: 1 },
  nearbyBox: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 14 },
  nearbyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  nearbyIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  nearbyName: { flex: 1, fontSize: 15, fontWeight: '700' },
  nearbyDist: { fontSize: 13, fontWeight: '600' },
})
