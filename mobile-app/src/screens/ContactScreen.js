import React from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable, Share } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import Screen from '../components/Screen'
import ScreenHeader from '../components/ScreenHeader'
import { openPhone, openWhatsApp, openEmail, openMaps } from '../utils/links'
import { CONTACT } from '../data/content'
import { radius } from '../theme/themes'

export default function ContactScreen() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const c = theme.colors

  async function shareApp() {
    try {
      await Share.share({
        message: 'Stay at Sawta Guest House — comfort, hospitality, memories. Book your room: ' + CONTACT.website,
      })
    } catch (e) {}
  }

  const actions = [
    { icon: 'call', label: t('callUs'), sub: CONTACT.phone, color: '#22C55E', onPress: () => openPhone(CONTACT.phone) },
    { icon: 'logo-whatsapp', label: t('whatsapp'), sub: 'Chat with us', color: '#25D366', onPress: () => openWhatsApp(CONTACT.whatsapp, 'Hello Sawta Guest House, I have a question.') },
    { icon: 'mail', label: t('email'), sub: CONTACT.email, color: '#3B82F6', onPress: () => openEmail(CONTACT.email, 'Sawta Guest House Enquiry') },
    { icon: 'navigate', label: t('directions'), sub: 'Open in Google Maps', color: '#EF4444', onPress: () => openMaps(CONTACT.mapsQuery) },
    { icon: 'share-social', label: t('share'), sub: 'Tell your friends', color: '#D4AF37', onPress: shareApp },
  ]

  return (
    <Screen>
      <ScreenHeader title={t('contact')} back />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.hero}>
          <Ionicons name="business" size={30} color="#D4AF37" />
          <Text style={styles.heroTitle}>Sawta Guest House</Text>
          <Text style={styles.heroSub}>{CONTACT.address}</Text>
        </LinearGradient>

        {actions.map((a, i) => (
          <Pressable key={i} onPress={a.onPress} style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={[styles.icon, { backgroundColor: a.color }]}>
              <Ionicons name={a.icon} size={20} color="#fff" />
            </View>
            <View style={styles.txt}>
              <Text style={[styles.label, { color: c.text }]}>{a.label}</Text>
              <Text style={[styles.sub, { color: c.textMuted }]}>{a.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={c.textMuted} />
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  hero: { borderRadius: radius.lg, padding: 24, alignItems: 'center', marginBottom: 18 },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '900', marginTop: 10 },
  heroSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlign: 'center', marginTop: 6 },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: radius.md, padding: 14, marginBottom: 12 },
  icon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  txt: { flex: 1 },
  label: { fontSize: 16, fontWeight: '800' },
  sub: { fontSize: 13, marginTop: 2 },
})
