import { Linking, Platform, Share } from 'react-native'
import { PHONE, WHATSAPP, SUPPORT_EMAIL, MAPS_QUERY, BRAND } from '../config/env'

export function callPhone(number) {
  const n = (number || PHONE).replace(/\s/g, '')
  Linking.openURL('tel:' + n)
}

export function openWhatsApp(message) {
  const text = message ? '?text=' + encodeURIComponent(message) : ''
  Linking.openURL('https://wa.me/' + WHATSAPP + text)
}

export function sendEmail(subject, body) {
  const parts = []
  if (subject) parts.push('subject=' + encodeURIComponent(subject))
  if (body) parts.push('body=' + encodeURIComponent(body))
  const qs = parts.length ? '?' + parts.join('&') : ''
  Linking.openURL('mailto:' + SUPPORT_EMAIL + qs)
}

export function openMaps(query) {
  const q = encodeURIComponent(query || MAPS_QUERY)
  const url =
    Platform.OS === 'ios'
      ? 'http://maps.apple.com/?q=' + q
      : 'https://www.google.com/maps/search/?api=1&query=' + q
  Linking.openURL(url)
}

export async function shareApp() {
  try {
    await Share.share({
      message: 'Check out ' + BRAND + ' — premium rooms at an affordable price. Book your stay!',
    })
  } catch (e) {}
}
