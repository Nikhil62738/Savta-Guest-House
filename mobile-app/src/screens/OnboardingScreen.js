import React from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS } from '../storage/keys'
import { useLanguage } from '../context/LanguageContext'
import Logo from '../components/Logo'
import Button from '../components/Button'
import { ONBOARDING_BENEFITS } from '../data/content'

export default function OnboardingScreen(props) {
  const { t } = useLanguage()

  async function finish() {
    await AsyncStorage.setItem(STORAGE_KEYS.onboarded, '1')
    if (props.onDone) props.onDone()
  }

  return (
    <LinearGradient colors={['#0F172A', '#1E293B', '#0B1120']} style={styles.fill}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoWrap}>
          <Logo size="lg" onDark tagline />
        </View>
        <Text style={styles.getApp}>{t('getApp')}</Text>
        <View style={styles.benefits}>
          {ONBOARDING_BENEFITS.map((b, i) => (
            <View key={i} style={styles.benefit}>
              <View style={styles.benefitIcon}>
                <Ionicons name={b.icon} size={20} color="#D4AF37" />
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitDesc}>{b.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.actions}>
        <Button title={t('continue')} icon="arrow-forward" onPress={finish} full />
        <Pressable onPress={finish} style={styles.skip} hitSlop={8}>
          <Text style={styles.skipTxt}>{t('skip')}</Text>
        </Pressable>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingTop: 80, paddingHorizontal: 28, paddingBottom: 24 },
  logoWrap: { alignItems: 'center', marginBottom: 28 },
  getApp: { color: '#fff', fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 28, lineHeight: 28 },
  benefits: { marginTop: 4 },
  benefit: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  benefitIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: 'rgba(212,175,55,0.14)', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  benefitText: { flex: 1 },
  benefitTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  benefitDesc: { color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 2 },
  actions: { paddingHorizontal: 28, paddingBottom: 40 },
  skip: { alignItems: 'center', paddingVertical: 16 },
  skipTxt: { color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: '700' },
})
