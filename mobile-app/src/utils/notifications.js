import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

// Requests notification permission and sets up the Android channel.
export async function registerForPushNotifications() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Sawta Guest House',
        importance: Notifications.AndroidImportance.HIGH,
        lightColor: '#D4AF37',
      })
    }
    const current = await Notifications.getPermissionsAsync()
    let status = current.status
    if (status !== 'granted') {
      const req = await Notifications.requestPermissionsAsync()
      status = req.status
    }
    return status === 'granted'
  } catch (e) {
    return false
  }
}

// Fires an immediate local notification (used for booking confirmations, etc.).
export async function notifyLocal(title, body, data) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data: data || {} },
      trigger: null,
    })
  } catch (e) {}
}
