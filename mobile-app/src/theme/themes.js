const BRAND = {
  navy: '#0F172A',
  gold: '#D4AF37',
  ivory: '#FAF9F6',
}

export const lightTheme = {
  mode: 'light',
  brand: BRAND,
  colors: {
    background: '#FAF9F6',
    surface: '#FFFFFF',
    surfaceAlt: '#F1EEE7',
    card: '#FFFFFF',
    text: '#0F172A',
    textMuted: '#64748B',
    border: 'rgba(15,23,42,0.08)',
    primary: '#0F172A',
    accent: '#D4AF37',
    onPrimary: '#FFFFFF',
    onAccent: '#0F172A',
    success: '#16A34A',
    danger: '#DC2626',
    glass: 'rgba(255,255,255,0.6)',
    overlay: 'rgba(15,23,42,0.55)',
  },
}

export const darkTheme = {
  mode: 'dark',
  brand: BRAND,
  colors: {
    background: '#0B1120',
    surface: '#0F172A',
    surfaceAlt: '#152035',
    card: '#0D1B3A',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    border: 'rgba(255,255,255,0.10)',
    primary: '#D4AF37',
    accent: '#D4AF37',
    onPrimary: '#0F172A',
    onAccent: '#0F172A',
    success: '#22C55E',
    danger: '#F87171',
    glass: 'rgba(17,27,46,0.6)',
    overlay: 'rgba(0,0,0,0.6)',
  },
}

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 }
export const radius = { sm: 10, md: 16, lg: 22, xl: 28, pill: 999 }
// Soft elevation used on cards for extra depth (works on both themes).
export const shadow = {
  card: { shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
}
