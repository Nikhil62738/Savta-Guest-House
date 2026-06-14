import { useState } from 'react'
import useReveal from '../hooks/useReveal.js'
import { useLang } from '../context/LanguageContext.jsx'
import Seo from '../components/Seo.jsx'
import PageHero from '../components/PageHero.jsx'
import Toast from '../components/Toast.jsx'
import { CONTACT } from '../data/site.js'
import api, { WHATSAPP, MAPS_EMBED } from '../lib/api.js'

const SUBJECTS = ['Room Booking', 'General Inquiry', 'Special Request', 'Feedback']
const EMPTY = { name: '', email: '', phone: '', subject: 'Room Booking', message: '' }
const EMPTY_REVIEW = { name: '', rating: 5, comment: '' }

export default function Contact() {
  const { t } = useLang()
  const [form, setForm] = useState(EMPTY)
  const [review, setReview] = useState(EMPTY_REVIEW)
  const [toast, setToast] = useState(null)
  useReveal('contact')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const setRev = (k, v) => setReview((r) => ({ ...r, [k]: v }))

  const submitContact = async (e) => {
    e.preventDefault()
    try { await api.post('/contact', form) } catch (_) {}
    setToast({ type: 'success', msg: 'Message sent! We will get back to you soon.' })
    setForm(EMPTY)
  }

  const submitReview = async (e) => {
    e.preventDefault()
    try { await api.post('/reviews', review) } catch (_) {}
    setToast({ type: 'success', msg: 'Thank you! Your review is submitted and will be published after approval.' })
    setReview(EMPTY_REVIEW)
  }

  const telLink = 'tel:' + CONTACT.phone1.replace(/\s/g, '')

  return (
    <>
      <Seo title="Contact Us" description="Get in touch with Sawta Guest House — phone, WhatsApp, email, address and location map." />
      <PageHero title="Contact Us" subtitle="We would love to hear from you. Reach out any time." image="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=85" />

      <section className="section-y">
        <div className="container-x grid lg:grid-cols-3 gap-6">
          {[
            { icon: '📞', title: 'Phone', lines: [CONTACT.phone1, CONTACT.phone2], href: telLink },
            { icon: '✉️', title: 'Email', lines: [CONTACT.email1, CONTACT.email2], href: 'mailto:' + CONTACT.email1 },
            { icon: '📍', title: 'Address', lines: [CONTACT.address], href: '#map' },
          ].map((c, i) => (
            <a key={c.title} href={c.href} className={`reveal d${i} bg-white rounded-xl2 p-8 shadow-sm2 hover:shadow-card transition-all text-center`}>
              <div className="text-4xl">{c.icon}</div>
              <h3 className="font-serif text-lg text-navy font-semibold mt-3">{t(c.title)}</h3>
              {c.lines.map((l) => (
                <p key={l} className="text-graytxt text-sm mt-1">{l}</p>
              ))}
            </a>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="container-x grid lg:grid-cols-2 gap-10 items-start">
          {/* Contact form */}
          <form onSubmit={submitContact} className="reveal bg-white rounded-xl2 shadow-card p-8 md:p-10">
            <h3 className="font-serif text-2xl text-navy font-semibold">{t('Send a Message')}</h3>
            <div className="grid sm:grid-cols-2 gap-5 mt-6">
              <input className="field-input field-light" required placeholder={t('Full Name')} value={form.name} onChange={set('name')} />
              <input className="field-input field-light" type="email" required placeholder={t('Email')} value={form.email} onChange={set('email')} />
              <input className="field-input field-light" placeholder={t('Phone')} value={form.phone} onChange={set('phone')} />
              <select className="field-input field-light" value={form.subject} onChange={set('subject')}>
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
              <textarea className="field-input field-light sm:col-span-2 min-h-[120px]" required placeholder={t('Message')} value={form.message} onChange={set('message')} />
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <button className="btn btn-navy">{t('Send Message →')}</button>
              <a href={'https://wa.me/' + WHATSAPP} target="_blank" rel="noreferrer" className="btn btn-gold">💬 WhatsApp</a>
            </div>
          </form>

          {/* Map + reviews */}
          <div className="space-y-8">
            <div id="map" className="reveal d1 rounded-xl2 overflow-hidden shadow-card h-[300px]">
              <iframe title="Location" src={MAPS_EMBED} loading="lazy" className="w-full h-full border-0" referrerPolicy="no-referrer-when-downgrade" />
            </div>

            {/* Review submission */}
            <form onSubmit={submitReview} className="reveal d2 bg-beige rounded-xl2 p-8">
              <h3 className="font-serif text-xl text-navy font-semibold">{t('Write a Review')}</h3>
              <p className="text-sm text-graytxt mt-1">Your review will be published after admin approval.</p>
              <div className="grid gap-4 mt-5">
                <input className="field-input field-light" required placeholder={t('Full Name')} value={review.name} onChange={(e) => setRev('name', e.target.value)} />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-charcoal">{t('Rating')}:</span>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button type="button" key={n} onClick={() => setRev('rating', n)} className={`text-2xl leading-none ${n <= review.rating ? 'text-gold' : 'text-graytxt-light'}`}>★</button>
                  ))}
                </div>
                <textarea className="field-input field-light min-h-[90px]" required placeholder={t('Comment')} value={review.comment} onChange={(e) => setRev('comment', e.target.value)} />
                <button className="btn btn-navy w-full justify-center">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  )
}
