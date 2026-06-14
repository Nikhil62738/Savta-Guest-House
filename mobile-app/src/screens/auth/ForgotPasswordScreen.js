import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import Screen from '../../components/Screen'
import ScreenHeader from '../../components/ScreenHeader'
import Field from '../../components/Field'
import Button from '../../components/Button'

export default function ForgotPasswordScreen(props) {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const { resetPassword } = useAuth()
  const c = theme.colors
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit() {
    setBusy(true)
    try {
      await resetPassword({ email, password })
      Alert.alert('Password reset', 'Your password has been updated. Please log in.', [
        { text: 'OK', onPress: () => props.navigation.navigate('Login') },
      ])
    } catch (e) {
      Alert.alert('Could not reset', e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Screen>
      <ScreenHeader title={t('forgotPassword')} back />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.sub, { color: c.textMuted }]}>
            Enter your account email and a new password to reset it.
          </Text>
          <Field label={t('email')} icon="mail-outline" placeholder="you@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Field label={t('newPassword')} icon="lock-closed-outline" placeholder="At least 6 characters" value={password} onChangeText={setPassword} secureTextEntry />
          <Button title={t('resetPassword')} onPress={submit} loading={busy} full style={styles.btn} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 24 },
  sub: { fontSize: 14, lineHeight: 20, marginBottom: 22 },
  btn: { marginTop: 6 },
})
