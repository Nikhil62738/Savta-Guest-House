/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0F172A', 2: '#1E293B' },
        gold: { DEFAULT: '#D4AF37', light: '#E6C68A', dark: '#B8941F' },
        ivory: '#FAF9F6',
        beige: { DEFAULT: '#F5EFE6', 2: '#EDE4D3' },
        charcoal: '#2D3748',
        graytxt: { DEFAULT: '#64748B', light: '#94A3B8' },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
        deva: ['"Noto Sans Devanagari"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        sm2: '0 4px 16px rgba(15,23,42,.06)',
        card: '0 14px 50px rgba(15,23,42,.12)',
        lg2: '0 28px 80px rgba(15,23,42,.18)',
        gold: '0 16px 40px rgba(212,175,55,.5)',
      },
      borderRadius: { xl2: '18px' },
      maxWidth: { container: '1340px' },
      keyframes: {
        slowZoom: { from: { transform: 'scale(1)' }, to: { transform: 'scale(1.08)' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'none' } },
        spin: { to: { transform: 'rotate(360deg)' } },
        loadBar: { to: { width: '100%' } },
        pageIn: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'none' } },
        popIn: { from: { transform: 'scale(.7)', opacity: '0' }, to: { transform: 'scale(1)', opacity: '1' } },
        scrollLine: { '0%,100%': { opacity: '.3', transform: 'scaleY(.5)' }, '50%': { opacity: '1', transform: 'scaleY(1)' } },
        waPulse: {
          '0%,100%': { boxShadow: '0 8px 30px rgba(37,211,102,.55)' },
          '50%': { boxShadow: '0 8px 30px rgba(37,211,102,.85),0 0 0 14px rgba(37,211,102,.12)' },
        },
      },
      animation: {
        slowZoom: 'slowZoom 18s ease-out infinite alternate',
        fadeUp: 'fadeUp 1s both',
        spin: 'spin 1s linear infinite',
        loadBar: 'loadBar 1.8s ease forwards',
        pageIn: 'pageIn .5s ease-out',
        popIn: 'popIn .55s cubic-bezier(.175,.885,.32,1.275)',
        scrollLine: 'scrollLine 2s ease-in-out infinite',
        waPulse: 'waPulse 3s infinite',
      },
    },
  },
  plugins: [],
}
