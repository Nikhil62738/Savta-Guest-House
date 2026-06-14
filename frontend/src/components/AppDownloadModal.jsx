import { useEffect, useState } from 'react'
import { useLang } from '../context/LanguageContext.jsx'
import { APP } from '../data/site.js'

const SEEN_KEY = 'sawta-app-popup-seen'

// Popup shown once per browser session inviting visitors to download the Android app.
export default function AppDownloadModal() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return
    } catch (e) {
      // ignore storage errors (private mode etc.)
    }
    const id = setTimeout(() => setOpen(true), 1200)
    return () => clearTimeout(id)
  }, [])

  const close = () => {
    setOpen(false)
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch (e) {
      // ignore
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-xl2 bg-ivory shadow-lg2 animate-popIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 grid place-items-center w-9 h-9 rounded-full bg-black/10 text-white hover:bg-black/25 transition"
        >
          ✕
        </button>

        <div className="bg-navy px-6 pt-9 pb-7 text-center">
          <img
            src="/logo.png"
            alt={APP.name}
            className="mx-auto w-20 h-20 rounded-2xl object-cover ring-2 ring-gold/40 shadow-gold"
          />
          <h3 className="mt-4 text-xl font-bold text-white font-serif">{t('Get the Mobile App')}</h3>
          <p className="mt-1 text-sm text-gold">{APP.name}</p>
        </div>

        <div className="px-6 py-6 text-center">
          <p className="text-charcoal text-sm leading-relaxed">
            {t('Book rooms, manage your stay and get instant updates right from your phone.')}
          </p>

          <a
            href={APP.downloadUrl}
            download
            onClick={close}
            className="mt-5 w-full justify-center btn btn-gold text-base"
          >
            ⬇️ {t('Download APK')}
          </a>

          <button
            onClick={close}
            className="mt-3 block w-full text-sm text-graytxt hover:text-navy transition"
          >
            {t('Maybe later')}
          </button>

          <p className="mt-3 text-[11px] text-graytxt-light">
            {t('Android • Free • Version')} {APP.version}
          </p>
        </div>
      </div>
    </div>
  )
}
