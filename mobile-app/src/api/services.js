import AsyncStorage from '@react-native-async-storage/async-storage'
import api from './client'
import { STORAGE_KEYS } from '../storage/keys'

// GET with offline caching: on success cache the payload; on failure fall back
// to the last cached copy so the app keeps working offline.
async function cachedGet(key, fetcher) {
  try {
    const data = await fetcher()
    await AsyncStorage.setItem(STORAGE_KEYS.cachePrefix + key, JSON.stringify(data))
    return { data, fromCache: false }
  } catch (err) {
    const cached = await AsyncStorage.getItem(STORAGE_KEYS.cachePrefix + key)
    if (cached) return { data: JSON.parse(cached), fromCache: true }
    throw err
  }
}

export async function fetchRooms() {
  return cachedGet('rooms', async () => {
    const res = await api.get('/rooms')
    return res.data.rooms || []
  })
}

export async function fetchRoom(id) {
  const res = await api.get('/rooms/' + id)
  return res.data.room || res.data
}

export async function fetchGallery(cat) {
  const q = cat && cat !== 'All' ? '?cat=' + encodeURIComponent(cat) : ''
  return cachedGet('gallery_' + (cat || 'All'), async () => {
    const res = await api.get('/gallery' + q)
    return res.data.gallery || []
  })
}

export async function fetchReviews() {
  return cachedGet('reviews', async () => {
    const res = await api.get('/reviews')
    return res.data.reviews || []
  })
}

// Creates a real booking via the existing public endpoint (auto-confirmed).
export async function createBooking(payload) {
  const res = await api.post('/bookings', payload)
  return res.data
}

export async function createReview(payload) {
  const res = await api.post('/reviews', payload)
  return res.data
}

export async function sendContactMessage(payload) {
  const res = await api.post('/contact', payload)
  return res.data
}

// Cancel a booking (guest-facing). Backend verifies the mobile matches the booking.
export async function cancelBooking(id, mobile) {
  const res = await api.patch('/bookings/' + id + '/cancel', { mobile })
  return res.data
}

// Look up a guest's bookings by the mobile number they booked with.
export async function lookupBookings(mobile) {
  const res = await api.get('/bookings/lookup', { params: { mobile } })
  return res.data.bookings || []
}
