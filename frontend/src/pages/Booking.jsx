import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'
import { useLang } from '../context/LanguageContext.jsx'
import Seo from '../components/Seo.jsx'
import PageHero from '../components/PageHero.jsx'
import Toast from '../components/Toast.jsx'
import { ROOM_TYPES, CONTACT } from '../data/site.js'
import api from '../lib/api.js'

const EMPTY = {
  name: '', mobile: '', email: '', checkIn: '', checkOut: '',
  guests: 1, room: '', roomType: 'Standard', specialRequest: '',
}

export default function Booking() {
  const { t } = useLang()
  const location = useLocation()
  const [form, setForm] = useState({ ...EMPTY, room: location.state?.roomId || '', roomType: location.state?.roomType || 'Standard' })
  const [rooms, setRooms] = useState([])
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  useReveal('booking')

  useEffect(() => {
    api.get('/rooms').then((r) => {
      const data = r?.data?.rooms || r?.data
      if (Array.isArray(data)) setRooms(data)
    }).catch(() => {})
  }, [])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const availOf = (r) =>
    Math.max(0, Number(r.totalUnits || 0) - Number(r.bookedOnline || 0) - Number(r.bookedOffline || 0))

  const pickRoom = (e) => {
    const id = e.target.value
    const r = rooms.find((x) => x._id === id)
    setForm((f) => (r ? { ...f, room: r._id, roomType: r.name } : { ...f, room: '', roomType: f.roomType }))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (form.checkOut && form.checkIn && new Date(form.checkOut) <= new Date(form.checkIn)) {
      setToast({ type: 'error', msg: 'Check-out date must be after the check-in date.' })
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/bookings', form)
      const idTail = data && data._id ? ' Booking ID: ' + String(data._id).slice(-8).toUpperCase() + '.' : ''
      const emailNote = form.email ? ' A confirmation email is on its way to ' + form.email + '.' : ''
      setToast({ type: 'success', msg: 'Booking confirmed instantly!' + emailNote + idTail })
      setForm(EMPTY)
      // Refresh availability so a just-booked room reflects the new count.
      api.get('/rooms').then((r) => {
        const list = r && r.data && (r.data.rooms || r.data)
        if (Array.isArray(list)) setRooms(list)
      }).catch(() => {})
    } catch (err) {
      const res = err && err.response && err.response.data
      const msg =
        (res && res.message) ||
        (res && res.errors && res.errors[0] && res.errors[0].msg) ||
        'Sorry, we could not confirm your booking. Please try again or contact us directly.'
      setToast({ type: 'error', msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Seo title="Book a Room" description="Make a booking inquiry at Sawta Guest House. Choose your dates, room type and number of guests." />
      <PageHero title="Make a Booking Inquiry" subtitle="Fill in your details and our team will confirm availability." image="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1600&q=85" />

      <section className="section-y">
        <div className="container-x grid lg:grid-cols-[1.4fr,1fr] gap-12 items-start">
          {/* Form */}
          <form onSubmit={submit} className="reveal bg-white rounded-xl2 shadow-card p-8 md:p-10 grid sm:grid-cols-2 gap-5">
            <Field label="Full Name" required>
              <input className="field-input field-light" required value={form.name} onChange={set('name')} placeholder="John Doe" />
            </Field>
            <Field label="Mobile Number" required>
              <input className="field-input field-light" required type="tel" pattern="[0-9 +]{8,15}" value={form.mobile} onChange={set('mobile')} placeholder="+91 98765 43210" />
            </Field>
            <Field label="Email" required full>
              <input className="field-input field-light" required type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
            </Field>
            <Field label="Check-In" required>
              <input className="field-input field-light" required type="date" value={form.checkIn} onChange={set('checkIn')} />
            </Field>
            <Field label="Check-Out" required>
              <input className="field-input field-light" required type="date" value={form.checkOut} onChange={set('checkOut')} />
            </Field>
            <Field label="Number of Guests" required>
              <input className="field-input field-light" required type="number" min="1" max="20" value={form.guests} onChange={set('guests')} />
            </Field>
            <Field label="Room" required>
              {rooms.length > 0 ? (
                <select className="field-input field-light" value={form.room} onChange={pickRoom}>
                  <option value="">Select a room…</option>
                  {rooms.map((r) => (
                    <option key={r._id} value={r._id} disabled={availOf(r) <= 0}>
                      {r.name} · ₹{Number(r.price || 0).toLocaleString('en-IN')} · {availOf(r) > 0 ? availOf(r) + ' available' : 'Sold out'}
                    </option>
                  ))}
                </select>
              ) : (
                <select className="field-input field-light" value={form.roomType} onChange={set('roomType')}>
                  {ROOM_TYPES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              )}
            </Field>
            <Field label="Special Request" full>
              <textarea className="field-input field-light min-h-[110px]" value={form.specialRequest} onChange={set('specialRequest')} placeholder="Any preferences or requirements?" />
            </Field>
            <div className="sm:col-span-2">
              <button disabled={loading} className="btn btn-gold w-full justify-center disabled:opacity-60">
                {loading ? 'Submitting…' : t('Submit Inquiry →')}
              </button>
            </div>
          </form>

          {/* Aside */}
          <aside className="reveal d1 space-y-6">
            <div className="bg-navy text-white rounded-xl2 p-8">
              <h3 className="font-serif text-xl font-semibold">Need Help Booking?</h3>
              <p className="text-white/70 text-sm mt-2">Our reception is available 24/7 to assist you.</p>
              <ul className="mt-5 space-y-3 text-sm">
                <li>📞 {CONTACT.phone1}</li>
                <li>✉️ {CONTACT.email2}</li>
                <li>📍 {CONTACT.address}</li>
              </ul>
              <a href={'https://wa.me/' + CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn btn-gold w-full justify-center mt-6">💬 WhatsApp Us</a>
            </div>
            <div className="bg-beige rounded-xl2 p-8">
              <h4 className="font-serif text-lg text-navy font-semibold">Good To Know</h4>
              <ul className="mt-3 space-y-2 text-sm text-graytxt">
                <li>🕑 Check-in: {CONTACT.checkIn} · Check-out: {CONTACT.checkOut}</li>
                <li>✅ Free cancellation up to 24h before arrival</li>
                <li>💳 Pay at the property — no advance needed</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  )
}

function Field({ label, children, required, full }) {
  const { t } = useLang()
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="block text-sm font-medium text-charcoal mb-1.5">
        {t(label)} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  )
}
