import React from 'react'
import { Text, ScrollView, StyleSheet } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import Screen from '../components/Screen'
import ScreenHeader from '../components/ScreenHeader'
import { BRAND } from '../config/env'

export default function TermsScreen() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const c = theme.colors
  const P = (s) => <Text style={[styles.p, { color: c.textMuted }]}>{s}</Text>
  const H = (s) => <Text style={[styles.h, { color: c.text }]}>{s}</Text>
  return (
    <Screen>
      <ScreenHeader title={t('terms')} back />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {H('Terms of Use')}
        {P('By using the ' + BRAND + ' app you agree to book rooms in good faith and to provide accurate guest details. Room availability and prices are confirmed at the time of booking and may change without prior notice.')}
        {P('Bookings can be cancelled from the app subject to our cancellation policy. Please contact us directly for any modifications to a confirmed stay.')}
        {H('Privacy Policy')}
        {P('We collect only the information needed to manage your bookings — your name, mobile number and email. This information is used to confirm reservations and to contact you about your stay.')}
        {P('We do not sell your personal data. Your booking details are stored securely and shared only with our reception team to serve you better.')}
        {H('Contact')}
        {P('For any questions about these terms or your data, please reach us from the Contact Us screen in the app.')}
        <Text style={[styles.foot, { color: c.textMuted }]}>{BRAND + '  ·  v1.0.0'}</Text>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 36 },
  h: { fontSize: 18, fontWeight: '900', marginTop: 18, marginBottom: 8 },
  p: { fontSize: 14, lineHeight: 22, marginBottom: 10 },
  foot: { textAlign: 'center', fontSize: 12, marginTop: 20 },
})
