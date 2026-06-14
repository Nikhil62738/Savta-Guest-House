import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLang } from '../context/LanguageContext.jsx'

const LINKS = [
  ['Home', '/'],
  ['About', '/about'],
  ['Rooms', '/rooms'],
  ['Gallery', '/gallery'],
  ['Facilities', '/facilities'],
  ['My Booking', '/manage-booking'],
  ['Contact', '/contact'],
]

export default function Navbar() {
  const { t, lang, toggle } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const solid = scrolled || pathname !== '/'

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        solid ? 'bg-navy/95 backdrop-blur shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <nav className="container-x flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt={t('Sawta Guest House')} className="w-11 h-11 rounded-xl2 object-cover shadow-md ring-1 ring-gold/30" />
          <span className="leading-tight">
            <span className="block font-serif text-white text-lg font-semibold">{t('Sawta Guest House')}</span>
            <span className="block text-[0.62rem] tracking-[3px] uppercase text-gold-light">{t('Luxury · Comfort · Hospitality')}</span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {LINKS.map(([label, to]) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-gold ${
                    isActive ? 'text-gold' : 'text-white/90'
                  }`
                }
              >
                {t(label)}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="hidden sm:inline-flex text-xs font-semibold text-gold-light border border-gold/40 rounded-lg px-3 py-2 hover:bg-gold/10 transition-colors"
          >
            {lang === 'en' ? '🌐 मराठी' : '🌐 English'}
          </button>
          <Link to="/booking" className="hidden md:inline-flex btn btn-gold !py-2.5 !px-5">
            {t('Book Now')}
          </Link>
          <button
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden flex flex-col gap-1.5 p-2"
          >
            <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-[480px]' : 'max-h-0'}`}>
        <ul className="container-x flex flex-col gap-1 py-4">
          {LINKS.map(([label, to]) => (
            <li key={to}>
              <NavLink to={to} className="block py-2.5 text-white/90 hover:text-gold border-b border-white/10">
                {t(label)}
              </NavLink>
            </li>
          ))}
          <li className="flex gap-3 pt-3">
            <Link to="/booking" className="btn btn-gold flex-1 justify-center">{t('Book Now')}</Link>
            <button onClick={toggle} className="btn btn-outline-light">
              {lang === 'en' ? 'मराठी' : 'English'}
            </button>
          </li>
        </ul>
      </div>
    </header>
  )
}
