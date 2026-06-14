import { useEffect, useState } from 'react'
import { WHATSAPP } from '../lib/api.js'
import { CONTACT } from '../data/site.js'

export default function FloatingButtons() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const waLink = 'https://wa.me/' + WHATSAPP
  const telLink = 'tel:' + CONTACT.phone1.replace(/\s/g, '')
  const waStyle = { background: '#25D366' }

  return (
    <>
      <a
        href={waLink}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-6 right-6 z-40 grid place-items-center w-14 h-14 rounded-full text-white text-2xl animate-waPulse"
        style={waStyle}
      >
        💬
      </a>
      <a
        href={telLink}
        aria-label="Call"
        className="fixed bottom-24 right-6 z-40 grid place-items-center w-14 h-14 rounded-full bg-navy text-gold text-xl shadow-lg hover:scale-105 transition-transform"
      >
        📞
      </a>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-6 left-6 z-40 grid place-items-center w-12 h-12 rounded-full bg-gold text-navy shadow-lg transition-all ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        ↑
      </button>
    </>
  )
}
