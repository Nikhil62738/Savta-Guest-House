import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { fetchRooms } from '../api/services'
import Screen from '../components/Screen'
import ScreenHeader from '../components/ScreenHeader'
import RoomCard, { roomRating } from '../components/RoomCard'
import Chip from '../components/Chip'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { radius } from '../theme/themes'

function popularity(room) {
  const booked = (room.bookedOnline || 0) + (room.bookedOffline || 0)
  return booked * 10 + roomRating(room).reviews
}

export default function RoomsScreen(props) {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const c = theme.colors
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState('recommended')

  const load = useCallback(async () => {
    try {
      const r = await fetchRooms()
      setRooms(r.data || [])
    } catch (e) {}
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function onRefresh() {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  const categories = useMemo(() => {
    const set = ['All']
    rooms.forEach((r) => {
      const k = r.category || r.type
      if (k && set.indexOf(k) === -1) set.push(k)
    })
    return set
  }, [rooms])

  const filtered = rooms.filter((r) => {
    const matchCat = cat === 'All' || r.category === cat || r.type === cat
    const matchQ = !query || (r.name || '').toLowerCase().indexOf(query.toLowerCase()) !== -1
    return matchCat && matchQ
  })

  const sortOptions = [
    { key: 'recommended', label: t('recommended') },
    { key: 'priceLow', label: t('priceLowHigh') },
    { key: 'priceHigh', label: t('priceHighLow') },
    { key: 'popular', label: t('mostPopular') },
  ]
  const display = [...filtered]
  if (sort === 'priceLow') display.sort((a, b) => (a.price || 0) - (b.price || 0))
  else if (sort === 'priceHigh') display.sort((a, b) => (b.price || 0) - (a.price || 0))
  else if (sort === 'popular') display.sort((a, b) => popularity(b) - popularity(a))

  return (
    <Screen>
      <ScreenHeader title={t('rooms')} />
      <View style={[styles.search, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
        <Ionicons name="search" size={18} color={c.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: c.text }]}
          placeholder={t('searchRooms')}
          placeholderTextColor={c.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <View style={styles.chips}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={(row) => <Chip label={row.item} active={cat === row.item} onPress={() => setCat(row.item)} />}
          contentContainerStyle={styles.chipsRow}
        />
      </View>
      <View style={styles.sortRow}>
        <FlatList
          data={sortOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          renderItem={(row) => <Chip label={row.item.label} active={sort === row.item.key} onPress={() => setSort(row.item.key)} />}
          contentContainerStyle={styles.chipsRow}
        />
      </View>
      {loading ? (
        <Loader label={t('loading')} />
      ) : (
        <FlatList
          data={display}
          keyExtractor={(item) => item._id || item.id}
          renderItem={(row) => (
            <RoomCard room={row.item} onPress={() => props.navigation.navigate('RoomDetail', { room: row.item })} onBook={() => props.navigation.navigate('Booking', { room: row.item })} style={styles.card} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.accent} />}
          ListEmptyComponent={<EmptyState icon="bed-outline" title="No rooms found" message="Try a different search or category." />}
        />
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 4, paddingHorizontal: 14, height: 48, borderRadius: radius.md, borderWidth: 1 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },
  chips: { marginTop: 12 },
  sortRow: { marginTop: 10 },
  chipsRow: { paddingHorizontal: 16 },
  list: { padding: 16, paddingTop: 12 },
  card: { marginBottom: 16 },
})
