import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext.jsx'
import { CONTACT } from '../data/site.js'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="bg-navy text-white/70">
      <div className="container-x py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt={t('Sawta Guest House')} className="w-12 h-12 rounded-xl2 object-cover ring-1 ring-gold/30" />
            <span className="font-serif text-white text-lg font-semibold">{t('Sawta Guest House')}</span>
          </div>
          <p className="text-sm leading-relaxed">
            Comfortable stay at an affordable price. Experience warm hospitality, modern amenities and a peaceful stay in the heart of Maharashtra.
          </p>
          <div className="flex gap-3 mt-5">
            {['f', 'IG', '💬', 'X'].map((s) => (
              <span key={s} className="grid place-items-center w-9 h-9 rounded-full bg-white/10 hover:bg-gold hover:text-navy transition-colors cursor-pointer text-xs font-semibold">{s}</span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">{t('Quick Links')}</h4>
          <ul className="space-y-2 text-sm">
            {[['Home', '/'], ['About', '/about'], ['Rooms', '/rooms'], ['Gallery', '/gallery'], ['Facilities', '/facilities'], ['Contact', '/contact']].map(([l, to]) => (
              <li key={to}><Link to={to} className="hover:text-gold transition-colors">{t(l)}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">{t('Room Types')}</h4>
          <ul className="space-y-2 text-sm">
            {['Standard Room', 'Deluxe Room', 'Family Room', 'AC Room', 'Non AC Room'].map((r) => (
              <li key={r}><Link to="/rooms" className="hover:text-gold transition-colors">{t(r)}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">{t('Contact Info')}</h4>
          <ul className="space-y-2 text-sm">
            <li>📞 {CONTACT.phone1}</li>
            <li>✉️ {CONTACT.email1}</li>
            <li>📍 {CONTACT.address}</li>
            <li>🕒 {t('Open 24/7')}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span>© 2025 {t('Sawta Guest House')}. All rights reserved.</span>
          <span>Crafted with ♥ for our guests</span>
        </div>
      </div>
    </footer>
  )
}
