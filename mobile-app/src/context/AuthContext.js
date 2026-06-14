import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { STORAGE_KEYS } from '../storage/keys'

// NOTE: The existing backend only exposes ADMIN auth (no customer register/login
// endpoint). To honor "do not modify the backend", customer accounts are managed
// on-device here, with a session token kept in Expo SecureStore. Bookings created
// through the app still go to the real backend via POST /bookings.
const AuthContext = createContext(null)

function makeToken() {
  return 'tok_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

async function readUsers() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.users)
  return raw ? JSON.parse(raw) : []
}

async function writeUsers(list) {
  await AsyncStorage.setItem(STORAGE_KEYS.users, JSON.stringify(list))
}

export function AuthProvider(props) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.currentUser)
      .then((raw) => {
        if (raw) setUser(JSON.parse(raw))
      })
      .finally(() => setLoading(false))
  }, [])

  async function persist(u) {
    setUser(u)
    if (u) await AsyncStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(u))
    else await AsyncStorage.removeItem(STORAGE_KEYS.currentUser)
  }

  async function register(form) {
    const email = String(form.email || '').toLowerCase().trim()
    if (!form.name || !email || !form.password) {
      throw new Error('Please fill in your name, email and password.')
    }
    if (form.password.length < 6) throw new Error('Password must be at least 6 characters.')
    const users = await readUsers()
    if (users.some((u) => u.email === email)) {
      throw new Error('An account with this email already exists. Please log in.')
    }
    const record = {
      name: String(form.name).trim(),
      email,
      mobile: form.mobile ? String(form.mobile).trim() : '',
      password: form.password,
    }
    users.push(record)
    await writeUsers(users)
    const token = makeToken()
    await SecureStore.setItemAsync(STORAGE_KEYS.token, token)
    const profile = { name: record.name, email: record.email, mobile: record.mobile }
    await persist(profile)
    return profile
  }

  async function login(form) {
    const email = String(form.email || '').toLowerCase().trim()
    const users = await readUsers()
    const found = users.find((u) => u.email === email && u.password === form.password)
    if (!found) throw new Error('Invalid email or password.')
    const token = makeToken()
    await SecureStore.setItemAsync(STORAGE_KEYS.token, token)
    const profile = { name: found.name, email: found.email, mobile: found.mobile || '' }
    await persist(profile)
    return profile
  }

  async function resetPassword(form) {
    const email = String(form.email || '').toLowerCase().trim()
    if (!form.password || form.password.length < 6) {
      throw new Error('New password must be at least 6 characters.')
    }
    const users = await readUsers()
    const idx = users.findIndex((u) => u.email === email)
    if (idx === -1) throw new Error('No account found with this email.')
    users[idx].password = form.password
    await writeUsers(users)
    return true
  }

  async function updateProfile(updates) {
    if (!user) return null
    const merged = { ...user, ...updates }
    const users = await readUsers()
    const idx = users.findIndex((u) => u.email === user.email)
    if (idx !== -1) {
      users[idx] = { ...users[idx], name: merged.name, mobile: merged.mobile }
      await writeUsers(users)
    }
    await persist(merged)
    return merged
  }

  async function logout() {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.token)
    await persist(null)
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    resetPassword,
    updateProfile,
    logout,
  }
  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
