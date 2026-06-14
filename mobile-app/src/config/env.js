import Constants from 'expo-constants'

const extra = (Constants.expoConfig && Constants.expoConfig.extra) || {}

// Point this at your existing backend. Change in app.json -> expo.extra.apiUrl,
// or set it here. It MUST end with /api (the same base the website uses).
export const API_URL = extra.apiUrl || 'https://savta-guest-house.onrender.com/api'
export const WHATSAPP = extra.whatsapp || '919876543210'
export const PHONE = extra.phone || '+919876543210'
export const SUPPORT_EMAIL = extra.email || 'info@sawtaguesthouse.com'
export const MAPS_QUERY = extra.mapsQuery || 'Sawta Guest House, Maharashtra, India'
export const BRAND = 'Sawta Guest House'
