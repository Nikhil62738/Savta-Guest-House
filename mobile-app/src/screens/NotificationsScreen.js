import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useSaved } from '../context/SavedContext'
import Screen from '../components/Screen'
import ScreenHeader from '../components/ScreenHeader'
import EmptyState from '../components/EmptyState'
import { OFFERS } from '../data/content'
import { radius } from '../theme/themes'

function shortDate(v) {
  try {
    return new Date(v).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
  } catch (e) {
    return ''
  }
}

export default function NotificationsScreen() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const { bookings } = useSaved()
  const c = theme.colors

  const updates = (bookings || []).slice(0, 10).map((b, idx) => {
    const status = b.status || 'Confirmed'
    const icon =
      status === 'Cancelled' ? 'close-circle' : status === 'Completed' ? 'checkmark-done-circle' : 'checkmark-circle'
    return {
      id: 'b' + ((b._id || '') + idx),
      icon,
      title: (b.roomName || b.roomType || 'Your booking') + '  ·  ' + status,
      desc: shortDate(b.checkIn) + '  →  ' + shortDate(b.checkOut),
    }
  })

  const hasAny = updates.length > 0 || OFFERS.length > 0

  return (
    <Screen>
      <ScreenHeader title={t('notifications')} back />
      {!hasAny ? (
        <EmptyState icon="notifications-outline" title={t('noNotifications')} message={t('noNotificationsMsg')} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.section, { color: c.textMuted }]}>{t('bookingUpdates')}</Text>
          <View style={[styles.group, { backgroundColor: c.card, borderColor: c.border }]}>
            {updates.length ? (
              updates.map((n, i) => (
                <View key={n.id} style={[styles.row, i < updates.length - 1 && { borderBottomColor: c.border, borderBottomWidth: 1 }]}>
                  <View style={[styles.icon, { backgroundColor: c.surfaceAlt }]}>
                    <Ionicons name={n.icon} size={18} color={c.accent} />
                  </View>
                  <View style={styles.txt}>
                    <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>{n.title}</Text>
                    <Text style={[styles.desc, { color: c.textMuted }]} numberOfLines={1}>{n.desc}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[styles.empty, { color: c.textMuted }]}>{t('noBookingsMsg')}</Text>
            )}
          </View>

          <Text style={[styles.section, { color: c.textMuted }]}>{t('specialOffers')}</Text>
          <View style={[styles.group, { backgroundColor: c.card, borderColor: c.border }]}>
            {OFFERS.map((o, i) => (
              <View key={o.id} style={[styles.row, i < OFFERS.length - 1 && { borderBottomColor: c.border, borderBottomWidth: 1 }]}>
                <View style={[styles.icon, { backgroundColor: c.surfaceAlt }]}>
                  <Ionicons name="pricetag" size={18} color={c.accent} />
                </View>
                <View style={styles.txt}>
                  <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>{o.title}</Text>
                  <Text style={[styles.desc, { color: c.textMuted }]} numberOfLines={2}>{o.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  section: { fontSize: 12, fontWeight: '800', letterSpacing: 0.6, marginBottom: 8, marginTop: 6 },
  group: { borderWidth: 1, borderRadius: radius.lg, paddingHorizontal: 14, marginBottom: 18 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  icon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  txt: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700' },
  desc: { fontSize: 13, marginTop: 2 },
  empty: { fontSize: 13, paddingVertical: 16 },
})
