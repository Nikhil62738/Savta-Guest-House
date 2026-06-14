import React from 'react'
import { Image, StyleSheet } from 'react-native'

// Brand logo image (English + Marathi wordmark crest). Used across the app.
const LOGO = require('../../assets/logo.png')

export default function Logo(props) {
  const size = props.size === 'lg' ? 150 : props.size === 'sm' ? 60 : 100
  return (
    <Image
      source={LOGO}
      style={[styles.logo, { width: size, height: size }, props.style]}
      resizeMode="contain"
      accessibilityLabel="Sawta Guest House"
    />
  )
}

const styles = StyleSheet.create({
  logo: { borderRadius: 18 },
})
