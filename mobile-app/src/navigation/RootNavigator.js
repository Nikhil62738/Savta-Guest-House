import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS } from '../storage/keys'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import TabNavigator from './TabNavigator'
import OnboardingScreen from '../screens/OnboardingScreen'
import LoginScreen from '../screens/auth/LoginScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen'
import RoomDetailScreen from '../screens/RoomDetailScreen'
import BookingScreen from '../screens/BookingScreen'
import ContactScreen from '../screens/ContactScreen'
import EditProfileScreen from '../screens/EditProfileScreen'
import SavedRoomsScreen from '../screens/SavedRoomsScreen'
import NotificationsScreen from '../screens/NotificationsScreen'
import TermsScreen from '../screens/TermsScreen'

const Stack = createNativeStackNavigator()
const hiddenHeader = { headerShown: false }
const modalCard = { headerShown: false, animation: 'slide_from_right' }

export default function RootNavigator() {
  const { isAuthenticated, loading } = useAuth()
  const { theme, isDark } = useTheme()
  const [onboarded, setOnboarded] = useState(null)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.onboarded).then((v) => setOnboarded(v === '1'))
  }, [])

  if (loading || onboarded === null) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    )
  }

  const base = isDark ? DarkTheme : DefaultTheme
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      primary: theme.colors.accent,
      border: theme.colors.border,
    },
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={hiddenHeader}>
        {!onboarded ? (
          <Stack.Screen name="Onboarding">
            {(p) => <OnboardingScreen {...p} onDone={() => setOnboarded(true)} />}
          </Stack.Screen>
        ) : !isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Forgot" component={ForgotPasswordScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="RoomDetail" component={RoomDetailScreen} options={modalCard} />
            <Stack.Screen name="Booking" component={BookingScreen} options={modalCard} />
            <Stack.Screen name="Contact" component={ContactScreen} options={modalCard} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={modalCard} />
            <Stack.Screen name="SavedRooms" component={SavedRoomsScreen} options={modalCard} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={modalCard} />
            <Stack.Screen name="Terms" component={TermsScreen} options={modalCard} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})
