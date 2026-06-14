import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import Screen from '../../components/Screen'
import ScreenHeader from '../../components/ScreenHeader'
import Field from '../../components/Field'
import Button from '../../components/Button'

export default function RegisterScreen(props) {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const { register } = useAuth()
  const c = theme.colors
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' })
  const [busy, setBusy] = useState(false)

  function set(key, value) {
    setForm((f) => Object.assign({}, f, { [key]: value }))
  }

  async function submit() {
    setBusy(true)
    try {
      await register(form)
    } catch (e) {
      Alert.alert('Registration failed', e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Screen>
      <ScreenHeader title={t('register')} back />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: c.text }]}>{t('signup')}</Text>
          <Field label={t('name')} icon="person-outline" placeholder="Your name" value={form.name} onChangeText={(v) => set('name', v)} autoCapitalize="words" />
          <Field label={t('email')} icon="mail-outline" placeholder="you@email.com" value={form.email} onChangeText={(v) => set('email', v)} keyboardType="email-address" />
          <Field label={t('mobile')} icon="call-outline" placeholder="+91 ..." value={form.mobile} onChangeText={(v) => set('mobile', v)} keyboardType="phone-pad" />
          <Field label={t('password')} icon="lock-closed-outline" placeholder="At least 6 characters" value={form.password} onChangeText={(v) => set('password', v)} secureTextEntry />
          <Button title={t('register')} onPress={submit} loading={busy} full style={styles.btn} />
          <View style={styles.row}>
            <Text style={[styles.muted, { color: c.textMuted }]}>{t('haveAccount')} </Text>
            <Pressable onPress={() => props.navigation.navigate('Login')} hitSlop={6}>
              <Text style={[styles.link, { color: c.accent }]}>{t('login')}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 24, paddingTop: 8 },
  title: { fontSize: 24, fontWeight: '900', marginBottom: 20 },
  btn: { marginTop: 6 },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  muted: { fontSize: 14 },
  link: { fontSize: 14, fontWeight: '800' },
})
