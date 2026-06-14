import React from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable, Switch, Alert, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { useSaved } from '../context/SavedContext'
import Screen from '../components/Screen'
import ScreenHeader from '../components/ScreenHeader'
import { radius, shadow } from '../theme/themes'

function initials(name) {
  if (!name) return 'G'
  return name.trim().split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

export default function ProfileScreen(props) {
  const { theme, isDark, toggle } = useTheme()
  const { t, lang, toggleLang } = useLanguage()
  const { user, logout } = useAuth()
  const { saved, bookings } = useSaved()
  const c = theme.colors

  function confirmLogout() {
    Alert.alert(t('logout'), 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: t('logout'), style: 'destructive', onPress: () => logout() },
    ])
  }

  function rateApp() {
    const pkg = 'com.sawta.guesthouse'
    Linking.openURL('market://details?id=' + pkg).catch(() =>
      Linking.openURL('https://play.google.com/store/apps/details?id=' + pkg)
    )
  }

  const accountRows = [
    { icon: 'person-outline', label: t('personalInfo'), onPress: () => props.navigation.navigate('EditProfile') },
    { icon: 'calendar-outline', label: t('myBookings'), badge: bookings.length, onPress: () => props.navigation.navigate('Main', { screen: 'Bookings' }) },
    { icon: 'heart-outline', label: t('favorites'), badge: saved.length, onPress: () => props.navigation.navigate('SavedRooms') },
    { icon: 'notifications-outline', label: t('notifications'), onPress: () => props.navigation.navigate('Notifications') },
  ]
  const moreRows = [
    { icon: 'call-outline', label: t('contactUs'), onPress: () => props.navigation.navigate('Contact') },
    { icon: 'star-outline', label: t('rateApp'), onPress: rateApp },
    { icon: 'document-text-outline', label: t('terms'), onPress: () => props.navigation.navigate('Terms') },
  ]

  return (
    <Screen>
      <ScreenHeader title={t('profile')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={[styles.avatar, { backgroundColor: c.accent }]}>
            <Text style={[styles.avatarTxt, { color: c.onAccent }]}>{initials(user && user.name)}</Text>
          </View>
          <Text style={[styles.name, { color: c.text }]}>{(user && user.name) || 'Guest'}</Text>
          <Text style={[styles.email, { color: c.textMuted }]}>{(user && user.email) || ''}</Text>
        </View>

        <View style={[styles.group, { backgroundColor: c.card, borderColor: c.border }]}>
          {accountRows.map((r, i) => (
            <Pressable key={i} onPress={r.onPress} style={[styles.row, i < accountRows.length - 1 && { borderBottomColor: c.border, borderBottomWidth: 1 }]}>
              <View style={[styles.rowIcon, { backgroundColor: c.surfaceAlt }]}>
                <Ionicons name={r.icon} size={18} color={c.accent} />
              </View>
              <Text style={[styles.rowLabel, { color: c.text }]}>{r.label}</Text>
              {r.badge ? (
                <View style={[styles.badge, { backgroundColor: c.accent }]}>
                  <Text style={[styles.badgeTxt, { color: c.onAccent }]}>{r.badge}</Text>
                </View>
              ) : null}
              <Ionicons name="chevron-forward" size={18} color={c.textMuted} />
            </Pressable>
          ))}
        </View>

        <View style={[styles.group, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={[styles.row, { borderBottomColor: c.border, borderBottomWidth: 1 }]}>
            <View style={[styles.rowIcon, { backgroundColor: c.surfaceAlt }]}>
              <Ionicons name="moon-outline" size={18} color={c.accent} />
            </View>
            <Text style={[styles.rowLabel, { color: c.text }]}>{t('darkMode')}</Text>
            <Switch value={isDark} onValueChange={toggle} trackColor={switchTrack} thumbColor={'#fff'} />
          </View>
          <Pressable onPress={toggleLang} style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: c.surfaceAlt }]}>
              <Ionicons name="language-outline" size={18} color={c.accent} />
            </View>
            <Text style={[styles.rowLabel, { color: c.text }]}>{t('language')}</Text>
            <Text style={[styles.langVal, { color: c.accent }]}>{lang === 'en' ? 'English' : 'मराठी'}</Text>
          </Pressable>
        </View>

        <View style={[styles.group, { backgroundColor: c.card, borderColor: c.border }]}>
          {moreRows.map((r, i) => (
            <Pressable key={i} onPress={r.onPress} style={[styles.row, i < moreRows.length - 1 && { borderBottomColor: c.border, borderBottomWidth: 1 }]}>
              <View style={[styles.rowIcon, { backgroundColor: c.surfaceAlt }]}>
                <Ionicons name={r.icon} size={18} color={c.accent} />
              </View>
              <Text style={[styles.rowLabel, { color: c.text }]}>{r.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={c.textMuted} />
            </Pressable>
          ))}
        </View>

        <Pressable onPress={confirmLogout} style={[styles.logout, { borderColor: c.danger }]}>
          <Ionicons name="log-out-outline" size={18} color={c.danger} />
          <Text style={[styles.logoutTxt, { color: c.danger }]}>{t('logout')}</Text>
        </Pressable>
        <Text style={[styles.version, { color: c.textMuted }]}>Sawta Guest House · v1.0.0</Text>
      </ScrollView>
    </Screen>
  )
}

const switchTrack = { false: '#94A3B8', true: '#D4AF37' }

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  header: { alignItems: 'center', borderWidth: 1, borderRadius: radius.lg, paddingVertical: 26, marginBottom: 16, ...shadow.card },
  avatar: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarTxt: { fontSize: 28, fontWeight: '900' },
  name: { fontSize: 20, fontWeight: '900' },
  email: { fontSize: 14, marginTop: 3 },
  group: { borderWidth: 1, borderRadius: radius.lg, paddingHorizontal: 14, marginBottom: 16, ...shadow.card },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  rowIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '700' },
  badge: { minWidth: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, marginRight: 8 },
  badgeTxt: { fontSize: 12, fontWeight: '800' },
  langVal: { fontSize: 14, fontWeight: '800' },
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderRadius: radius.md, paddingVertical: 15 },
  logoutTxt: { fontSize: 15, fontWeight: '800', marginLeft: 8 },
  version: { textAlign: 'center', fontSize: 12, marginTop: 18 },
})
