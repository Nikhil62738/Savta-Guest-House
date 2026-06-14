import React, { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from './src/context/ThemeContext'
import { LanguageProvider } from './src/context/LanguageContext'
import { AuthProvider } from './src/context/AuthContext'
import { SavedProvider } from './src/context/SavedContext'
import RootNavigator from './src/navigation/RootNavigator'
import { registerForPushNotifications } from './src/utils/notifications'

export default function App() {
  useEffect(() => {
    registerForPushNotifications()
  }, [])
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <SavedProvider>
                <RootNavigator />
              </SavedProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = { flex: { flex: 1 } }
