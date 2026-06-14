import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'
import { useLang } from '../context/LanguageContext.jsx'
import Seo, { orgJsonLd } from '../components/Seo.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import RoomCard from '../components/RoomCard.jsx'
import RoomCardSkeleton from '../components/RoomCardSkeleton.jsx'
import Lightbox from '../components/Lightbox.jsx'
import Toast from '../components/Toast.jsx'
import { ROOMS, FACILITIES, REVIEWS, GALLERY, STATS, CONTACT, VALUES } from '../data/site.js'
import api, { WHATSAPP, MAPS_EMBED } from '../lib/api.js'

const heroStyle = {
  backgroundImage:
    'linear-gradient(rgba(15,23,42,.55), rgba(15,23,42,.78)), url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=85)',
}

export default function Home() {
  const { t } = useLang()
  const [box, setBox] = useState(null)
  const [rooms, setRooms] = useState(ROOMS)
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [reviews, setReviews] = useState(REVIEWS)
  const [rForm, setRForm] = useState({ name: '', city: '', rating: 5, comment: '' })
  const [rToast, setRToast] = useState(null)
  const [rSubmitting, setRSubmitting] = useState(false)
  // Re-run reveal once rooms finish loading so the highlight cards appear.
  useReveal('home|' + (loadingRooms ? 'loading' : rooms.length))
  const telLink = 'tel:' + CONTACT.phone1.replace(/\s/g, '')

  // Load live rooms for the highlights section; fall back to bundled data.
  useEffect(() => {
    let active = true
    api
      .get('/rooms')
      .then((res) => {
        const data = res?.data?.rooms || res?.data
        if (active && Array.isArray(data) && data.length) setRooms(data)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoadingRooms(false)
      })
    return () => {
      active = false
    }
  }, [])

  // Load approved guest reviews; fall back to bundled testimonials.
  useEffect(() => {
    api.get('/reviews').then((res) => {
      const data = res?.data?.reviews || res?.data
      if (Array.isArray(data) && data.length) setReviews(data)
    }).catch(() => {})
  }, [])

  const setR = (k) => (e) => setRForm((f) => ({ ...f, [k]: e.target.value }))

  const submitReview = async (e) => {
    e.preventDefault()
    setRSubmitting(true)
    try {
      await api.post('/reviews', { ...rForm, rating: Number(rForm.rating) })
    } catch (_) {}
    setRToast({ type: 'success', msg: 'Thank you! Your review has been submitted and will appear once approved.' })
    setRForm({ name: '', city: '', rating: 5, comment: '' })
    setRSubmitting(false)
  }

  return (
    <>
      <Seo jsonLd={orgJsonLd} />

      {/* ---------- HERO ---------- */}
      <section className="relative min-h-screen flex items-center bg-center bg-cover overflow-hidden" style={heroStyle}>
        <div className="container-x relative z-10 text-center text-white py-32">
          <span className="inline-block text-gold-light tracking-[5px] text-xs uppercase mb-6 animate-fadeUp">{t('★ Premium Stays Since 2014')}</span>
          <h1 className="font-serif font-semibold leading-[1.05] text-[clamp(2.6rem,7vw,5rem)] animate-fadeUp">
            {t('Sawta')} <span className="text-gold">{t('Guest House')}</span>
          </h1>
          <p className="text-gold-light font-serif italic text-[clamp(1.1rem,2.4vw,1.6rem)] mt-3 animate-fadeUp">
            “{t('Comfortable Stay, Affordable Price')}”
          </p>
          <p className="max-w-xl mx-auto text-white/80 mt-5 animate-fadeUp">{t('Experience Comfort, Hospitality & Relaxation')}</p>
          <div className="flex flex-wrap gap-4 justify-center mt-9 animate-fadeUp">
            <Link to="/booking" className="btn btn-gold">{t('Book Now')}</Link>
            <a href={telLink} className="btn btn-outline-light">📞 {t('Call Now')}</a>
          </div>
          <div className="flex flex-wrap gap-10 justify-center mt-16">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-serif text-gold text-4xl font-bold">{s.value}</div>
                <div className="text-xs tracking-widest uppercase text-white/70 mt-1">{t(s.label)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-px h-12 bg-gold/60 animate-scrollLine" />
      </section>

      {/* ---------- ABOUT ---------- */}
      <section className="section-y">
        <div className="container-x grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80" alt="Room" loading="lazy" className="rounded-xl2 h-72 w-full shadow-card" />
            <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80" alt="Room" loading="lazy" className="rounded-xl2 h-72 w-full mt-8 shadow-card" />
          </div>
          <div className="reveal d1">
            <SectionHeading eyebrow="About Us" title="Your Home Away <em>From Home</em>" />
            <p className="text-graytxt leading-[1.9] mt-5">
              Since 2014, Sawta Guest House has welcomed travellers, families and business guests with warm hospitality and comfortable, affordable rooms. Nestled in the heart of Maharashtra, we combine modern amenities with the genuine care of a family-run home.
            </p>
            <p className="text-graytxt leading-[1.9] mt-4">
              From spotless rooms and fast WiFi to 24/7 support and secure parking, every detail is designed to make your stay effortless and memorable.
            </p>
            <Link to="/about" className="btn btn-navy mt-7">{t('Learn More')}</Link>
          </div>
        </div>
      </section>

      {/* ---------- WHY CHOOSE US ---------- */}
      <section className="section-y bg-beige">
        <div className="container-x">
          <SectionHeading center eyebrow="Why Choose Us" title="Crafted For Your <em>Comfort</em>" lede="Thoughtful touches and dependable service that keep our guests coming back." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {VALUES.map((v, i) => (
              <div key={v.title} className={`reveal d${i % 4} bg-white rounded-xl2 p-8 text-center shadow-sm2 hover:shadow-card hover:-translate-y-1.5 transition-all`}>
                <div className="text-4xl">{v.icon}</div>
                <h3 className="font-serif text-lg text-navy font-semibold mt-4">{v.title}</h3>
                <p className="text-sm text-graytxt mt-2 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ROOM HIGHLIGHTS ---------- */}
      <section className="section-y">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Accommodation" title="Our Comfortable <em>Rooms</em>" />
            <Link to="/rooms" className="btn btn-navy">{t('View All Rooms →')}</Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7 mt-14">
            {loadingRooms
              ? [0, 1, 2, 3].map((i) => <RoomCardSkeleton key={i} />)
              : rooms.slice(0, 4).map((r, i) => (
                  <div key={r.id || r._id || i} className={`reveal d${i % 4} h-full`}>
                    <RoomCard room={r} onImageClick={setBox} />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ---------- FACILITIES ---------- */}
      <section className="section-y bg-navy text-white">
        <div className="container-x">
          <SectionHeading center light eyebrow="Amenities" title="Everything You <em>Need</em>" lede="Modern facilities to make your stay effortless and relaxing." />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-14">
            {FACILITIES.slice(0, 10).map((f, i) => (
              <div key={f.name} className={`reveal d${i % 4} bg-white/5 border border-white/10 rounded-xl2 p-6 text-center hover:bg-gold hover:text-navy transition-colors group`}>
                <div className="text-3xl">{facilityEmoji(f.icon)}</div>
                <div className="text-sm font-semibold mt-3">{t(f.name)}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/facilities" className="btn btn-gold">{t('View All Facilities')}</Link>
          </div>
        </div>
      </section>

      {/* ---------- REVIEWS ---------- */}
      <section className="section-y bg-beige">
        <div className="container-x">
          <SectionHeading center eyebrow="Testimonials" title="What Our <em>Guests Say</em>" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 mt-14">
            {reviews.map((r, i) => (
              <figure key={r._id || r.name} className={`reveal d${i % 3} bg-white rounded-xl2 p-7 shadow-sm2`}>
                <div className="text-gold text-lg">{'★'.repeat(r.rating)}</div>
                <blockquote className="text-graytxt leading-relaxed mt-3">“{r.text || r.comment}”</blockquote>
                <figcaption className="flex items-center gap-3 mt-5 pt-5 border-t border-black/5">
                  {r.img ? (
                    <img src={r.img} alt={r.name} loading="lazy" className="w-11 h-11 rounded-full" />
                  ) : (
                    <span className="w-11 h-11 rounded-full bg-navy/10 text-navy grid place-items-center font-semibold">{(r.name || '?').charAt(0)}</span>
                  )}
                  <div>
                    <div className="font-semibold text-navy text-sm">{r.name}</div>
                    <div className="text-xs text-graytxt">{r.city}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Write a review */}
          <div className="mt-14 max-w-2xl mx-auto reveal">
            <div className="bg-white rounded-xl2 p-7 sm:p-9 shadow-sm2">
              <h3 className="font-serif text-2xl text-navy font-semibold text-center">{t('Write a Review')}</h3>
              <p className="text-center text-graytxt text-sm mt-1">{t('Stayed with us? Share your experience — it appears after our team approves it.')}</p>
              <form onSubmit={submitReview} className="grid sm:grid-cols-2 gap-4 mt-6">
                <input className="field-input field-light" required placeholder={t('Your Name')} value={rForm.name} onChange={setR('name')} />
                <input className="field-input field-light" placeholder={t('City (optional)')} value={rForm.city} onChange={setR('city')} />
                <select className="field-input field-light" value={rForm.rating} onChange={setR('rating')}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{'★'.repeat(n) + ' (' + n + ')'}</option>
                  ))}
                </select>
                <div className="sm:col-span-2">
                  <textarea className="field-input field-light min-h-[110px]" required placeholder={t('Tell us about your stay…')} value={rForm.comment} onChange={setR('comment')} />
                </div>
                <div className="sm:col-span-2">
                  <button disabled={rSubmitting} className="btn btn-gold w-full justify-center disabled:opacity-60">{rSubmitting ? t('Submitting…') : t('Submit Review')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Toast toast={rToast} onClose={() => setRToast(null)} />
      </section>

      {/* ---------- GALLERY PREVIEW ---------- */}
      <section className="section-y">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Gallery" title="A Glimpse Of <em>Sawta</em>" />
            <Link to="/gallery" className="btn btn-navy">{t('View Gallery →')}</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">
            {GALLERY.slice(0, 8).map((g, i) => (
              <button key={i} onClick={() => setBox({ src: g.src, label: g.label })} className="reveal group relative overflow-hidden rounded-xl2 h-48">
                <img src={g.src} alt={g.label} loading="lazy" className="w-full h-full transition-transform duration-700 group-hover:scale-110" />
                <span className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-colors grid place-items-center text-white opacity-0 group-hover:opacity-100 text-sm font-medium">{g.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- LOCATION MAP ---------- */}
      <section className="section-y bg-beige">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <SectionHeading eyebrow="Location" title="Find Us <em>Easily</em>" lede="Conveniently located near the city center, temples, market and transport hubs." />
            <ul className="mt-6 space-y-3">
              <li className="flex gap-3 text-charcoal"><span>📍</span>{CONTACT.address}</li>
              <li className="flex gap-3 text-charcoal"><span>📞</span>{CONTACT.phone1}</li>
              <li className="flex gap-3 text-charcoal"><span>🕒</span>{t('Open 24/7')} · Check-in {CONTACT.checkIn}</li>
            </ul>
            <div className="flex gap-3 mt-7">
              <Link to="/contact" className="btn btn-navy">{t('Contact Us')}</Link>
              <a href={'https://wa.me/' + WHATSAPP} target="_blank" rel="noreferrer" className="btn btn-gold">💬 WhatsApp</a>
            </div>
          </div>
          <div className="reveal d1 rounded-xl2 overflow-hidden shadow-card h-[360px]">
            <iframe title="Sawta Guest House location" src={MAPS_EMBED} loading="lazy" className="w-full h-full border-0" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>

      {/* ---------- CONTACT CTA ---------- */}
      <section className="py-24 bg-navy text-white text-center">
        <div className="container-x">
          <h2 className="heading !text-white">Ready For A <span className="text-gold">Comfortable Stay?</span></h2>
          <p className="text-white/70 max-w-xl mx-auto mt-4">Book your room today or reach out to us — our team is available around the clock to help you.</p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Link to="/booking" className="btn btn-gold">{t('Book Now')}</Link>
            <a href={telLink} className="btn btn-outline-light">📞 {t('Call Now')}</a>
          </div>
        </div>
      </section>

      <Lightbox item={box} onClose={() => setBox(null)} />
    </>
  )
}

export function facilityEmoji(icon) {
  const map = {
    wifi: '📡', parking: '🅿️', ac: '❄️', water: '🚿', cctv: '📹',
    family: '👪', support: '🕒', service: '🛎️', tv: '📺', power: '🔋',
  }
  return map[icon] || '✨'
}
