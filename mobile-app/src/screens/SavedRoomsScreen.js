import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, StyleSheet, RefreshControl } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useSaved } from '../context/SavedContext'
import { fetchRooms } from '../api/services'
import Screen from '../components/Screen'
import ScreenHeader from '../components/ScreenHeader'
import RoomCard from '../components/RoomCard'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'

export default function SavedRoomsScreen(props) {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const { saved } = useSaved()
  const c = theme.colors
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

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

  const savedRooms = rooms.filter((r) => saved.indexOf(r._id || r.id) !== -1)

  if (loading) {
    return (
      <Screen>
        <ScreenHeader title={t('savedRooms')} back />
        <Loader label={t('loading')} />
      </Screen>
    )
  }

  return (
    <Screen>
      <ScreenHeader title={t('savedRooms')} back />
      <FlatList
        data={savedRooms}
        keyExtractor={(item) => item._id || item.id}
        renderItem={(row) => (
          <RoomCard room={row.item} onPress={() => props.navigation.navigate('RoomDetail', { room: row.item })} style={styles.card} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.accent} />}
        ListEmptyComponent={<EmptyState icon="heart-outline" title={t('noSaved')} message={t('noSavedMsg')} />}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  list: { padding: 16, flexGrow: 1 },
  card: { marginBottom: 16 },
})
