import React, { useState } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Pressable, Alert } from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useSaved } from '../context/SavedContext'
import Screen from '../components/Screen'
import ScreenHeader from '../components/ScreenHeader'
import EmptyState from '../components/EmptyState'
import { radius, shadow } from '../theme/themes'

function statusColor(status, c) {
  if (status === 'Confirmed') return c.success
  if (status === 'Pending') return '#F59E0B'
  if (status === 'Cancelled') return c.danger
  if (status === 'Completed') return c.accent
  return c.textMuted
}
function shortDate(v) {
  try {
    return new Date(v).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
  } catch (e) {
    return v
  }
}

export default function BookingsScreen() {
  const { theme } = useTheme()
  const { t, lang } = useLanguage()
  const { bookings, refreshBookings, cancelBooking } = useSaved()
  const L = lang === 'mr'
    ? { cancel: 'रद्द करा', title: 'बुकिंग रद्द करायची?', msg: 'तुम्हाला ही बुकिंग रद्द करायची आहे का?', no: 'नाही', yes: 'होय, रद्द करा', done: 'रद्द झाले', doneMsg: 'तुमची बुकिंग रद्द करण्यात आली आहे.', failed: 'रद्द करता आले नाही', failedMsg: 'कृपया पुन्हा प्रयत्न करा किंवा आम्हाला कॉल करा.' }
    : { cancel: 'Cancel', title: 'Cancel booking?', msg: 'Are you sure you want to cancel this booking?', no: 'No', yes: 'Yes, cancel', done: 'Booking cancelled', doneMsg: 'Your booking has been cancelled.', failed: 'Could not cancel', failedMsg: 'Please try again, or call us to cancel.' }
  function onCancel(b) {
    Alert.alert(L.title, L.msg, [
      { text: L.no, style: 'cancel' },
      {
        text: L.yes,
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelBooking(b)
            await refreshBookings()
            Alert.alert(L.done, L.doneMsg)
          } catch (e) {
            Alert.alert(L.failed, L.failedMsg)
          }
        },
      },
    ])
  }
  const c = theme.colors
  const [refreshing, setRefreshing] = useState(false)
  const [tab, setTab] = useState('upcoming')

  useFocusEffect(
    React.useCallback(() => {
      refreshBookings()
    }, [])
  )

  async function onRefresh() {
    setRefreshing(true)
    await refreshBookings()
    setRefreshing(false)
  }

  const TABS = [
    { key: 'upcoming', label: t('upcoming') },
    { key: 'completed', label: t('completed') },
    { key: 'cancelled', label: t('cancelled') },
  ]
  const shown = (bookings || []).filter((b) => {
    const s = b.status || 'Confirmed'
    if (tab === 'completed') return s === 'Completed'
    if (tab === 'cancelled') return s === 'Cancelled'
    return s !== 'Completed' && s !== 'Cancelled'
  })

  function renderItem(row) {
    const b = row.item
    const sc = statusColor(b.status, c)
    return (
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <Image source={b.image || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80'} style={styles.thumb} contentFit="cover" />
        <View style={styles.info}>
          <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>{b.roomName || b.roomType}</Text>
          <View style={styles.dateLine}>
            <Ionicons name="calendar-outline" size={13} color={c.textMuted} />
            <Text style={[styles.dateTxt, { color: c.textMuted }]}>{shortDate(b.checkIn)} → {shortDate(b.checkOut)}</Text>
          </View>
          <View style={styles.dateLine}>
            <Ionicons name="people-outline" size={13} color={c.textMuted} />
            <Text style={[styles.dateTxt, { color: c.textMuted }]}>{(b.guests || 1) + ' ' + t('guests')}</Text>
          </View>
        </View>
        <View style={styles.right}>
          <View style={[styles.statusTag, { backgroundColor: sc }]}>
            <Text style={styles.statusTxt}>{b.status || t('confirmed')}</Text>
          </View>
          {b.price ? <Text style={[styles.price, { color: c.text }]}>{'₹' + b.price}</Text> : null}
          {b.status !== 'Cancelled' && b.status !== 'Completed' ? (
            <TouchableOpacity onPress={() => onCancel(b)} style={[styles.cancelBtn, { borderColor: c.danger }]}>
              <Text style={[styles.cancelTxt, { color: c.danger }]}>{L.cancel}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    )
  }

  return (
    <Screen>
      <ScreenHeader title={t('bookingHistory')} />
      <View style={styles.tabs}>
        {TABS.map((tb) => (
          <Pressable key={tb.key} onPress={() => setTab(tb.key)} style={[styles.tab, { backgroundColor: c.surfaceAlt }, tab === tb.key && { backgroundColor: c.accent }]}>
            <Text style={[styles.tabTxt, { color: tab === tb.key ? c.onAccent : c.textMuted }]}>{tb.label}</Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={shown}
        keyExtractor={(item, i) => (item._id || '') + i}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.accent} />}
        ListEmptyComponent={<EmptyState icon="calendar-outline" title={t('noBookings')} message={t('noBookingsMsg')} />}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 6 },
  tab: { flex: 1, height: 38, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  tabTxt: { fontSize: 13, fontWeight: '800' },
  list: { padding: 16, flexGrow: 1 },
  card: { flexDirection: 'row', borderWidth: 1, borderRadius: radius.lg, padding: 10, marginBottom: 14, alignItems: 'center', ...shadow.card },
  thumb: { width: 74, height: 74, borderRadius: 12 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '800' },
  dateLine: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  dateTxt: { fontSize: 12, fontWeight: '600', marginLeft: 6 },
  right: { alignItems: 'flex-end', marginLeft: 8 },
  statusTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusTxt: { color: '#fff', fontSize: 11, fontWeight: '800' },
  price: { fontSize: 15, fontWeight: '900', marginTop: 8 },
  cancelBtn: { marginTop: 8, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  cancelTxt: { fontSize: 12, fontWeight: '800' },
})
