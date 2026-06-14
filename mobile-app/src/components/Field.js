import React from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { radius } from '../theme/themes'

export default function Field(props) {
  const { theme } = useTheme()
  const c = theme.colors
  const [hide, setHide] = React.useState(!!props.secureTextEntry)
  return (
    <View style={[styles.wrap, props.style]}>
      {props.label ? <Text style={[styles.label, { color: c.textMuted }]}>{props.label}</Text> : null}
      <View style={[styles.box, { backgroundColor: c.surfaceAlt, borderColor: c.border }, props.multiline && styles.multiBox]}>
        {props.icon ? <Ionicons name={props.icon} size={18} color={c.textMuted} style={styles.lead} /> : null}
        <TextInput
          style={[styles.input, { color: c.text }, props.multiline && styles.multiInput]}
          placeholder={props.placeholder}
          placeholderTextColor={c.textMuted}
          value={props.value}
          onChangeText={props.onChangeText}
          keyboardType={props.keyboardType}
          autoCapitalize={props.autoCapitalize || 'none'}
          autoCorrect={false}
          secureTextEntry={hide}
          multiline={props.multiline}
          editable={props.editable !== false}
        />
        {props.secureTextEntry ? (
          <Pressable onPress={() => setHide(!hide)} hitSlop={8}>
            <Ionicons name={hide ? 'eye-outline' : 'eye-off-outline'} size={18} color={c.textMuted} />
          </Pressable>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginLeft: 4 },
  box: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 14, minHeight: 52 },
  multiBox: { alignItems: 'flex-start', paddingVertical: 6 },
  lead: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, paddingVertical: 14 },
  multiInput: { minHeight: 90, textAlignVertical: 'top' },
})
