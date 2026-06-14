import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable, Platform, Alert, KeyboardAvoidingView } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { useSaved } from '../context/SavedContext'
import { fetchRooms, createBooking } from '../api/services'
import { apiErrorMessage } from '../api/client'
import { notifyLocal } from '../utils/notifications'
import Screen from '../components/Screen'
import ScreenHeader from '../components/ScreenHeader'
import Field from '../components/Field'
import Button from '../components/Button'
import { radius } from '../theme/themes'

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}
function fmt(d) {
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}
function nightsBetween(a, b) {
  const ms = new Date(b).setHours(0, 0, 0, 0) - new Date(a).setHours(0, 0, 0, 0)
  return Math.max(1, Math.round(ms / 86400000))
}

export default function BookingScreen(props) {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const { user } = useAuth()
  const { addBooking } = useSaved()
  const c = theme.colors
  const preselected = props.route.params && props.route.params.room

  const [rooms, setRooms] = useState(preselected ? [preselected] : [])
  const [room, setRoom] = useState(preselected || null)
  const [checkIn, setCheckIn] = useState(new Date())
  const [checkOut, setCheckOut] = useState(addDays(new Date(), 1))
  const [showIn, setShowIn] = useState(false)
  const [showOut, setShowOut] = useState(false)
  const [guests, setGuests] = useState(1)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({
    name: user ? user.name : '',
    mobile: user ? user.mobile : '',
    email: user ? user.email : '',
    specialRequest: '',
  })

  function set(key, value) {
    setForm((f) => Object.assign({}, f, { [key]: value }))
  }

  useEffect(() => {
    if (!preselected) {
      fetchRooms()
        .then((r) => setRooms(r.data || []))
        .catch(() => {})
    }
  }, [preselected])

  function onChangeIn(event, selected) {
    setShowIn(Platform.OS === 'ios')
    if (selected) {
      setCheckIn(selected)
      if (checkOut <= selected) setCheckOut(addDays(selected, 1))
    }
  }
  function onChangeOut(event, selected) {
    setShowOut(Platform.OS === 'ios')
    if (selected) setCheckOut(selected)
  }

  async function confirm() {
    if (!room) {
      Alert.alert('Select a room', 'Please choose a room to continue.')
      return
    }
    if (!form.name || !form.mobile || !form.email) {
      Alert.alert('Missing details', 'Please enter your name, mobile and email.')
      return
    }
    setBusy(true)
    try {
      const payload = {
        name: form.name,
        mobile: form.mobile,
        email: form.email,
        roomType: room.category || room.name,
        room: room._id || room.id,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        guests: guests,
        specialRequest: form.specialRequest,
        source: 'Online',
      }
      const data = await createBooking(payload)
      const record = Object.assign({}, data, {
        roomName: room.name,
        image: (room.images && room.images[0]) || null,
        price: room.price,
        nights: nightsBetween(checkIn, checkOut),
      })
      await addBooking(record)
      await notifyLocal(t('bookingConfirmed'), room.name + ' · ' + fmt(checkIn) + ' → ' + fmt(checkOut))
      Alert.alert(t('bookingConfirmed'), 'Your stay at ' + room.name + ' is confirmed!', [
        { text: 'OK', onPress: () => props.navigation.navigate('Main', { screen: 'Bookings' }) },
      ])
    } catch (e) {
      Alert.alert('Booking failed', apiErrorMessage(e, 'Could not complete your booking.'))
    } finally {
      setBusy(false)
    }
  }

  const nights = nightsBetween(checkIn, checkOut)
  const total = room ? (room.price || 0) * nights : 0

  return (
    <Screen>
      <ScreenHeader title={t('confirmBooking')} back />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={[styles.label, { color: c.textMuted }]}>{t('selectRoom')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomRow}>
            {rooms.map((r) => {
              const rid = r._id || r.id
              const activeRoom = room && (room._id || room.id) === rid
              return (
                <Pressable
                  key={rid}
                  onPress={() => setRoom(r)}
                  style={[styles.roomPick, { borderColor: activeRoom ? c.accent : c.border, backgroundColor: activeRoom ? c.accent : c.surfaceAlt }]}
                >
                  <Text style={[styles.roomPickName, { color: activeRoom ? c.onAccent : c.text }]} numberOfLines={1}>{r.name}</Text>
                  <Text style={[styles.roomPickPrice, { color: activeRoom ? c.onAccent : c.textMuted }]}>{'₹' + (r.price || 0)}</Text>
                </Pressable>
              )
            })}
          </ScrollView>

          <View style={styles.dateRow}>
            <Pressable onPress={() => setShowIn(true)} style={[styles.dateBox, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
              <Text style={[styles.dateLabel, { color: c.textMuted }]}>{t('checkIn')}</Text>
              <Text style={[styles.dateVal, { color: c.text }]}>{fmt(checkIn)}</Text>
            </Pressable>
            <Pressable onPress={() => setShowOut(true)} style={[styles.dateBox, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
              <Text style={[styles.dateLabel, { color: c.textMuted }]}>{t('checkOut')}</Text>
              <Text style={[styles.dateVal, { color: c.text }]}>{fmt(checkOut)}</Text>
            </Pressable>
          </View>
          {showIn ? <DateTimePicker value={checkIn} mode="date" minimumDate={new Date()} onChange={onChangeIn} /> : null}
          {showOut ? <DateTimePicker value={checkOut} mode="date" minimumDate={addDays(checkIn, 1)} onChange={onChangeOut} /> : null}

          <View style={[styles.guestRow, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
            <Text style={[styles.dateVal, { color: c.text }]}>{t('guests')}</Text>
            <View style={styles.stepper}>
              <Pressable onPress={() => setGuests(Math.max(1, guests - 1))} style={[styles.stepBtn, { borderColor: c.border }]}>
                <Ionicons name="remove" size={18} color={c.text} />
              </Pressable>
              <Text style={[styles.guestNum, { color: c.text }]}>{guests}</Text>
              <Pressable onPress={() => setGuests(guests + 1)} style={[styles.stepBtn, { borderColor: c.border }]}>
                <Ionicons name="add" size={18} color={c.text} />
              </Pressable>
            </View>
          </View>

          <Field label={t('name')} icon="person-outline" value={form.name} onChangeText={(v) => set('name', v)} autoCapitalize="words" />
          <Field label={t('mobile')} icon="call-outline" value={form.mobile} onChangeText={(v) => set('mobile', v)} keyboardType="phone-pad" />
          <Field label={t('email')} icon="mail-outline" value={form.email} onChangeText={(v) => set('email', v)} keyboardType="email-address" />
          <Field label={t('specialRequest')} icon="chatbox-outline" value={form.specialRequest} onChangeText={(v) => set('specialRequest', v)} multiline />

          <View style={[styles.summary, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.sumLabel, { color: c.textMuted }]}>{nights} {t('nights')}</Text>
              <Text style={[styles.sumLabel, { color: c.textMuted }]}>{'₹' + (room ? room.price || 0 : 0)} x {nights}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.sumTotal, { color: c.text }]}>{t('total')}</Text>
              <Text style={[styles.sumTotal, { color: c.accent }]}>{'₹' + total}</Text>
            </View>
          </View>

          <Button title={t('confirmBooking')} icon="checkmark-circle" onPress={confirm} loading={busy} full style={styles.confirm} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, paddingTop: 6 },
  label: { fontSize: 13, fontWeight: '700', marginBottom: 10, marginLeft: 2 },
  roomRow: { marginBottom: 18 },
  roomPick: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, marginRight: 10, minWidth: 120 },
  roomPickName: { fontSize: 14, fontWeight: '800' },
  roomPickPrice: { fontSize: 13, fontWeight: '700', marginTop: 4 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dateBox: { width: '48%', borderWidth: 1, borderRadius: radius.md, padding: 14 },
  dateLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  dateVal: { fontSize: 14, fontWeight: '800' },
  guestRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: radius.md, padding: 14, marginTop: 14, marginBottom: 6 },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  guestNum: { fontSize: 17, fontWeight: '800', marginHorizontal: 18 },
  summary: { borderWidth: 1, borderRadius: radius.md, padding: 16, marginTop: 10, marginBottom: 18 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sumLabel: { fontSize: 14 },
  sumTotal: { fontSize: 18, fontWeight: '900' },
  confirm: { marginBottom: 12 },
})
