import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl, Pressable, Modal, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { fetchGallery } from '../api/services'
import Screen from '../components/Screen'
import ScreenHeader from '../components/ScreenHeader'
import Chip from '../components/Chip'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { GALLERY_CATEGORIES } from '../data/content'

const W = Dimensions.get('window').width
const GAP = 12
const SIZE = (W - 16 * 2 - GAP) / 2

export default function GalleryScreen() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const c = theme.colors
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [cat, setCat] = useState('All')
  const [viewer, setViewer] = useState(false)
  const [vIdx, setVIdx] = useState(0)

  const load = useCallback(async () => {
    try {
      const r = await fetchGallery()
      setItems(r.data || [])
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

  const cats = useMemo(() => {
    const set = ['All']
    items.forEach((it) => {
      const k = it.cat || it.label
      if (k && set.indexOf(k) === -1) set.push(k)
    })
    return set.length > 1 ? set : GALLERY_CATEGORIES
  }, [items])

  const filtered = cat === 'All' ? items : items.filter((it) => it.cat === cat || it.label === cat)

  function renderItem(row) {
    const it = row.item
    return (
      <Pressable onPress={() => { setVIdx(row.index); setViewer(true) }} style={styles.cell}>
        <Image source={it.src} style={styles.img} contentFit="cover" transition={200} />
        {it.label ? (
          <View style={styles.cap}>
            <Text style={styles.capTxt} numberOfLines={1}>{it.label}</Text>
          </View>
        ) : null}
      </Pressable>
    )
  }

  return (
    <Screen>
      <ScreenHeader title={t('gallery')} />
      <View style={styles.chips}>
        <FlatList
          data={cats}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={(row) => <Chip label={row.item} active={cat === row.item} onPress={() => setCat(row.item)} />}
          contentContainerStyle={styles.chipsRow}
        />
      </View>
      {loading ? (
        <Loader label={t('loading')} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item, i) => (item._id || '') + i}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.colWrap}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.accent} />}
          ListEmptyComponent={<EmptyState icon="images-outline" title="No photos yet" message="Check back soon for our gallery." />}
        />
      )}

      <Modal visible={viewer} transparent animationType="fade" onRequestClose={() => setViewer(false)}>
        <View style={styles.modal}>
          <Pressable style={styles.modalClose} onPress={() => setViewer(false)}>
            <Ionicons name="close" size={26} color="#fff" />
          </Pressable>
          <View style={styles.counter}>
            <Text style={styles.counterTxt}>{(vIdx + 1) + ' / ' + filtered.length}</Text>
          </View>
          <FlatList
            data={filtered}
            horizontal
            pagingEnabled
            initialScrollIndex={vIdx}
            getItemLayout={(d, i) => ({ length: W, offset: W * i, index: i })}
            onMomentumScrollEnd={(e) => setVIdx(Math.round(e.nativeEvent.contentOffset.x / W))}
            keyExtractor={(item, i) => 'v' + ((item._id || '') + i)}
            showsHorizontalScrollIndicator={false}
            renderItem={(row) => (
              <View style={styles.slide}>
                <Image source={row.item.src} style={styles.full} contentFit="contain" />
              </View>
            )}
          />
        </View>
      </Modal>
    </Screen>
  )
}

const styles = StyleSheet.create({
  chips: { marginTop: 4, marginBottom: 4 },
  chipsRow: { paddingHorizontal: 16 },
  list: { padding: 16 },
  colWrap: { justifyContent: 'space-between' },
  cell: { width: SIZE, height: SIZE, borderRadius: 16, overflow: 'hidden', marginBottom: GAP },
  img: { width: '100%', height: '100%' },
  cap: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.55)', paddingHorizontal: 10, paddingVertical: 6 },
  capTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
  modal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center' },
  modalClose: { position: 'absolute', top: 50, right: 20, zIndex: 2, width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  counter: { position: 'absolute', top: 54, alignSelf: 'center', zIndex: 2, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14 },
  counterTxt: { color: '#fff', fontSize: 13, fontWeight: '800' },
  slide: { width: W, height: '100%', alignItems: 'center', justifyContent: 'center' },
  full: { width: W, height: W },
})
