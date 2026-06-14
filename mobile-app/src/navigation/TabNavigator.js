import React from 'react'
import { Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import HomeScreen from '../screens/HomeScreen'
import RoomsScreen from '../screens/RoomsScreen'
import BookingsScreen from '../screens/BookingsScreen'
import GalleryScreen from '../screens/GalleryScreen'
import ProfileScreen from '../screens/ProfileScreen'

const Tab = createBottomTabNavigator()

const ICONS = {
  Home: ['home', 'home-outline'],
  Rooms: ['bed', 'bed-outline'],
  Bookings: ['calendar', 'calendar-outline'],
  Gallery: ['images', 'images-outline'],
  Profile: ['person', 'person-outline'],
}

export default function TabNavigator() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const c = theme.colors
  const labels = {
    Home: t('home'),
    Rooms: t('rooms'),
    Bookings: t('bookings'),
    Gallery: t('gallery'),
    Profile: t('profile'),
  }
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.textMuted,
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopColor: c.border,
          height: Platform.OS === 'ios' ? 86 : 64,
          paddingBottom: Platform.OS === 'ios' ? 26 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarLabel: labels[route.name],
        tabBarIcon: (icon) => {
          const pair = ICONS[route.name] || ICONS.Home
          return <Ionicons name={icon.focused ? pair[0] : pair[1]} size={icon.size} color={icon.color} />
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Rooms" component={RoomsScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}
