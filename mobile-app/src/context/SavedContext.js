import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS } from '../storage/keys'
import { useAuth } from './AuthContext'
import { cancelBooking as cancelBookingApi } from '../api/services'

// Saved rooms + local booking history. Booking history is stored per-user after
// a real booking is created via the backend (the backend has no per-user
// bookings endpoint, so the app keeps the confirmed bookings it created).
const SavedContext = createContext(null)

export function SavedProvider(props) {
  const { user } = useAuth()
  const [saved, setSaved] = useState([])
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.saved).then((raw) => {
      if (raw) setSaved(JSON.parse(raw))
    })
  }, [])

  const bookingsKey = STORAGE_KEYS.bookingsPrefix + (user ? user.email : 'guest')

  useEffect(() => {
    AsyncStorage.getItem(bookingsKey).then((raw) => {
      setBookings(raw ? JSON.parse(raw) : [])
    })
  }, [bookingsKey])

  async function toggleSaved(roomId) {
    const id = String(roomId)
    const next = saved.includes(id) ? saved.filter((x) => x !== id) : [id, ...saved]
    setSaved(next)
    await AsyncStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(next))
  }

  function isSaved(roomId) {
    return saved.includes(String(roomId))
  }

  async function addBooking(booking) {
    const next = [booking, ...bookings]
    setBookings(next)
    await AsyncStorage.setItem(bookingsKey, JSON.stringify(next))
  }

  async function refreshBookings() {
    const raw = await AsyncStorage.getItem(bookingsKey)
    setBookings(raw ? JSON.parse(raw) : [])
  }

  // Cancel a booking. Cancel on the SERVER first so it reflects in the admin
  // panel; only mark it cancelled locally once the server confirms. Errors are
  // re-thrown so the screen can tell the guest what went wrong.
  async function cancelBooking(booking) {
    if (booking && booking._id) {
      await cancelBookingApi(booking._id, booking.mobile)
    }
    const next = bookings.map((b) =>
      b._id && booking._id && b._id === booking._id ? { ...b, status: 'Cancelled' } : b
    )
    setBookings(next)
    await AsyncStorage.setItem(bookingsKey, JSON.stringify(next))
  }

  const value = { saved, isSaved, toggleSaved, bookings, addBooking, refreshBookings, cancelBooking }
  return <SavedContext.Provider value={value}>{props.children}</SavedContext.Provider>
}

export function useSaved() {
  const ctx = useContext(SavedContext)
  if (!ctx) throw new Error('useSaved must be used within SavedProvider')
  return ctx
}
