import React, { useState } from 'react'
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import Screen from '../components/Screen'
import ScreenHeader from '../components/ScreenHeader'
import Field from '../components/Field'
import Button from '../components/Button'

export default function EditProfileScreen(props) {
  const { t } = useLanguage()
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    name: user ? user.name : '',
    mobile: user ? user.mobile : '',
    email: user ? user.email : '',
  })
  const [busy, setBusy] = useState(false)

  function set(key, value) {
    setForm((f) => Object.assign({}, f, { [key]: value }))
  }

  async function save() {
    setBusy(true)
    try {
      await updateProfile(form)
      Alert.alert('Saved', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => props.navigation.goBack() },
      ])
    } catch (e) {
      Alert.alert('Could not save', e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Screen>
      <ScreenHeader title={t('editProfile')} back />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Field label={t('name')} icon="person-outline" value={form.name} onChangeText={(v) => set('name', v)} autoCapitalize="words" />
          <Field label={t('mobile')} icon="call-outline" value={form.mobile} onChangeText={(v) => set('mobile', v)} keyboardType="phone-pad" />
          <Field label={t('email')} icon="mail-outline" value={form.email} onChangeText={(v) => set('email', v)} keyboardType="email-address" editable={false} />
          <Button title={t('save')} icon="save-outline" onPress={save} loading={busy} full style={styles.btn} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20 },
  btn: { marginTop: 8 },
})
