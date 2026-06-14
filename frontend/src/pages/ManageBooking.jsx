import { useState } from 'react'
import { useLang } from '../context/LanguageContext.jsx'
import api from '../lib/api.js'

const STATUS_STYLES = {
  Confirmed: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-red-100 text-red-600',
  Completed: 'bg-slate-200 text-slate-600',
}

function fmtDate(d) {
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date)) return String(d).slice(0, 10)
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ManageBooking() {
  const { t } = useLang()
  const [mobile, setMobile] = useState('')
  const [bookings, setBookings] = useState(null)
  const [loading, setLoading] = useState(false)
  const [cancelling, setCancelling] = useState('')
  const [error, setError] = useState('')

  const search = async (e) => {
    e.preventDefault()
    setError('')
    const digits = mobile.replace(/\D/g, '')
    if (digits.length < 10) {
      setError(t('Please enter the 10-digit mobile number used for booking.'))
      return
    }
    setLoading(true)
    try {
      const { data } = await api.get('/bookings/lookup', { params: { mobile: digits } })
      setBookings(data.bookings || [])
    } catch (err) {
      setError((err && err.response && err.response.data && err.response.data.message) || t('Something went wrong. Please try again.'))
      setBookings(null)
    } finally {
      setLoading(false)
    }
  }

  const cancel = async (b) => {
    if (!window.confirm(t('Are you sure you want to cancel this booking?'))) return
    setCancelling(b._id)
    setError('')
    try {
      const digits = mobile.replace(/\D/g, '')
      await api.patch('/bookings/' + b._id + '/cancel', { mobile: digits })
      setBookings((list) => list.map((x) => (x._id === b._id ? { ...x, status: 'Cancelled' } : x)))
    } catch (err) {
      setError((err && err.response && err.response.data && err.response.data.message) || t('Could not cancel the booking. Please try again.'))
    } finally {
      setCancelling('')
    }
  }

  const pill = (status) =>
    'text-xs font-semibold px-2.5 py-1 rounded-full ' + (STATUS_STYLES[status] || 'bg-slate-100 text-slate-600')

  return (
    <section className="pt-32 pb-20 min-h-screen bg-[#FAF9F6]">
      <div className="container-x max-w-3xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy">{t('Manage Your Booking')}</h1>
        <p className="mt-2 text-slate-600">{t('Enter the mobile number you used while booking to view or cancel your reservations.')}</p>

        <form onSubmit={search} className="mt-8 flex flex-col sm:flex-row gap-3">
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder={t('Mobile Number')}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <button type="submit" disabled={loading} className="btn btn-gold !px-6 disabled:opacity-60">
            {loading ? t('Searching…') : t('Find Bookings')}
          </button>
        </form>

        {error ? <p className="mt-4 text-red-600 text-sm">{error}</p> : null}

        {bookings && bookings.length === 0 ? (
          <p className="mt-10 text-center text-slate-500">{t('No bookings found for this mobile number.')}</p>
        ) : null}

        <div className="mt-8 space-y-4">
          {(bookings || []).map((b) => (
            <div key={b._id} className="rounded-2xl bg-white shadow-sm border border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-navy">{t(b.roomType)}</h3>
                  <span className={pill(b.status)}>{t(b.status)}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{fmtDate(b.checkIn)} → {fmtDate(b.checkOut)} · {b.guests} {t('guest(s)')}</p>
                <p className="mt-1 text-xs text-slate-400">{t('Booking ID')}: {String(b._id).slice(-8).toUpperCase()}</p>
              </div>
              {b.status !== 'Cancelled' && b.status !== 'Completed' ? (
                <button
                  onClick={() => cancel(b)}
                  disabled={cancelling === b._id}
                  className="shrink-0 rounded-xl border border-red-300 text-red-600 font-semibold px-4 py-2.5 hover:bg-red-50 transition-colors disabled:opacity-60"
                >
                  {cancelling === b._id ? t('Cancelling…') : t('Cancel Booking')}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
