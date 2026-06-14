import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { API_URL } from '../config/env'
import { STORAGE_KEYS } from '../storage/keys'

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.token)
    if (token) config.headers.Authorization = 'Bearer ' + token
  } catch (e) {}
  return config
})

// Extracts a friendly message from an axios error (matches the backend shape:
// { message } or { errors: [{ msg }] }).
export function apiErrorMessage(err, fallback) {
  const data = err && err.response && err.response.data
  const fromErrors = data && data.errors && data.errors[0] && data.errors[0].msg
  const msg = (data && data.message) || fromErrors
  return msg || (err && err.message) || fallback || 'Something went wrong. Please try again.'
}

export default api
