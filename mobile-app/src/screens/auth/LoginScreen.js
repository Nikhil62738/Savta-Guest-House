import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import Screen from '../../components/Screen'
import Field from '../../components/Field'
import Button from '../../components/Button'
import Logo from '../../components/Logo'

export default function LoginScreen(props) {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const { login } = useAuth()
  const c = theme.colors
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit() {
    setBusy(true)
    try {
      await login({ email, password })
    } catch (e) {
      Alert.alert('Login failed', e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.logo}><Logo size="md" tagline /></View>
          <Text style={[styles.title, { color: c.text }]}>{t('login')}</Text>
          <Text style={[styles.sub, { color: c.textMuted }]}>{t('welcomeTitle')} Sawta Guest House</Text>
          <Field label={t('email')} icon="mail-outline" placeholder="you@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Field label={t('password')} icon="lock-closed-outline" placeholder="********" value={password} onChangeText={setPassword} secureTextEntry />
          <Pressable onPress={() => props.navigation.navigate('Forgot')} hitSlop={6} style={styles.forgot}>
            <Text style={[styles.forgotTxt, { color: c.accent }]}>{t('forgotPassword')}</Text>
          </Pressable>
          <Button title={t('login')} onPress={submit} loading={busy} full />
          <View style={styles.row}>
            <Text style={[styles.muted, { color: c.textMuted }]}>{t('noAccount')} </Text>
            <Pressable onPress={() => props.navigation.navigate('Register')} hitSlop={6}>
              <Text style={[styles.link, { color: c.accent }]}>{t('signup')}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 24, paddingTop: 32, flexGrow: 1, justifyContent: 'center' },
  logo: { alignItems: 'center', marginBottom: 28 },
  title: { fontSize: 26, fontWeight: '900', textAlign: 'center' },
  sub: { fontSize: 14, textAlign: 'center', marginBottom: 24, marginTop: 4 },
  forgot: { alignSelf: 'flex-end', marginBottom: 18 },
  forgotTxt: { fontSize: 13, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  muted: { fontSize: 14 },
  link: { fontSize: 14, fontWeight: '800' },
})
