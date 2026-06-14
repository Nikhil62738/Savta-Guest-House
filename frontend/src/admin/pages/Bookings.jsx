import { useEffect, useState } from 'react'
import api from '../../lib/api.js'
import { Card, Badge, Empty } from '../components/ui.jsx'
import Toast from '../../components/Toast.jsx'
import { SAMPLE_BOOKINGS, SAMPLE_ROOMS } from '../sampleData.js'

const FILTERS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled']
const EMPTY = { name: '', mobile: '', email: '', room: '', roomType: '', checkIn: '', checkOut: '', guests: 1, source: 'Offline', status: 'Confirmed' }

export default function Bookings() {
  const [bookings, setBookings] = useState(SAMPLE_BOOKINGS)
  const [rooms, setRooms] = useState(SAMPLE_ROOMS)
  const [filter, setFilter] = useState('All')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState(null)

  const load = () => {
    api.get('/bookings').then((r) => {
      const data = r?.data?.bookings || r?.data
      if (Array.isArray(data) && data.length) setBookings(data)
    }).catch(() => {})
  }
  const loadRooms = () => {
    api.get('/rooms?all=1').then((r) => {
      const data = r?.data?.rooms || r?.data
      if (Array.isArray(data) && data.length) setRooms(data)
    }).catch(() => {})
  }
  useEffect(() => { load(); loadRooms() }, [])

  const availOf = (r) =>
    Math.max(0, Number(r.totalUnits || 0) - Number(r.bookedOnline || 0) - Number(r.bookedOffline || 0))

  // Pick a specific room so the booking decrements that exact category.
  const pickRoom = (e) => {
    const id = e.target.value
    const r = rooms.find((x) => x._id === id)
    setForm((f) => (r ? { ...f, room: r._id, roomType: r.name } : { ...f, room: '', roomType: '' }))
  }

  const setStatus = async (id, status) => {
    setBookings((bs) => bs.map((b) => (b._id === id ? { ...b, status } : b)))
    setSelected((s) => (s && s._id === id ? { ...s, status } : s))
    try {
      await api.patch(`/bookings/${id}/status`, { status })
      setToast({ type: 'success', msg: 'Booking marked ' + status + '.' })
      load(); loadRooms()
    } catch (err) {
      setToast({ type: 'error', msg: (err && err.response && err.response.data && err.response.data.message) || 'Could not update this booking. Please try again.' })
      load()
    }
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  // Admin-created offline (walk-in / phone) booking.
  const addOffline = async (e) => {
    e.preventDefault()
    // Build a clean payload WITHOUT a temp _id — sending a fake _id makes Mongo reject it.
    const payload = { ...form, source: 'Offline' }
    const optimistic = { ...payload, _id: 'tmp' + Date.now() }
    setBookings((bs) => [optimistic, ...bs])
    setShowForm(false)
    setForm(EMPTY)
    try {
      await api.post('/bookings', payload)
      setToast({ type: 'success', msg: 'Offline booking saved.' })
      load(); loadRooms()
    } catch (err) {
      setToast({ type: 'success', msg: 'Offline booking added (demo mode — backend offline).' })
    }
  }

  const inRange = (b) => {
    const d = (b.checkIn || '').slice(0, 10)
    if (from && d < from) return false
    if (to && d > to) return false
    return true
  }
  const shown = bookings
    .filter((b) => (filter === 'All' ? true : b.status === filter))
    .filter(inRange)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-slate-800">Bookings</h2>
          <p className="text-slate-400 text-sm">Approve, reject or complete bookings · add offline bookings · click a row for details.</p>
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="btn btn-gold">➕ Offline Booking</button>
      </div>

      {showForm && (
        <Card title="Add Offline Booking">
          <form onSubmit={addOffline} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input className="field-input field-light" required placeholder="Guest Name" value={form.name} onChange={set('name')} />
            <input className="field-input field-light" required placeholder="Mobile" value={form.mobile} onChange={set('mobile')} />
            <input className="field-input field-light" type="email" placeholder="Email (optional)" value={form.email} onChange={set('email')} />
            <select className="field-input field-light" required value={form.room} onChange={pickRoom}>
              <option value="">Select Room…</option>
              {rooms.map((r) => (
                <option key={r._id} value={r._id} disabled={availOf(r) <= 0}>
                  {r.name} · {r.category} · {availOf(r)} available
                </option>
              ))}
            </select>
            <input className="field-input field-light" type="date" required value={form.checkIn} onChange={set('checkIn')} />
            <input className="field-input field-light" type="date" required value={form.checkOut} onChange={set('checkOut')} />
            <input className="field-input field-light" type="number" min="1" placeholder="Guests" value={form.guests} onChange={set('guests')} />
            <select className="field-input field-light" value={form.status} onChange={set('status')}>
              <option>Confirmed</option><option>Pending</option><option>Completed</option>
            </select>
            <div className="flex gap-2">
              <button className="btn btn-navy flex-1 justify-center">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 rounded-[10px] bg-slate-100 text-slate-600 text-sm">Cancel</button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === f ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}>{f}</button>
        ))}
        <div className="flex items-center gap-2 ml-auto text-sm text-slate-500">
          <span>Check-in</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="field-input field-light !py-2" />
          <span>→</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="field-input field-light !py-2" />
          {(from || to) && (
            <button onClick={() => { setFrom(''); setTo('') }} className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold">Clear</button>
          )}
        </div>
      </div>

      <Card>
        {shown.length === 0 ? (
          <Empty>No bookings match this filter.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="py-3 pr-4 font-medium">Guest</th>
                  <th className="py-3 pr-4 font-medium">Contact</th>
                  <th className="py-3 pr-4 font-medium">Room</th>
                  <th className="py-3 pr-4 font-medium">Dates</th>
                  <th className="py-3 pr-4 font-medium">Source</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((b) => (
                  <tr key={b._id} onClick={() => setSelected(b)} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                    <td className="py-3 pr-4 font-medium text-slate-700">{b.name}<div className="text-xs text-slate-400">👥 {b.guests}</div></td>
                    <td className="py-3 pr-4 text-slate-500">{b.mobile}<div className="text-xs text-slate-400">{b.email}</div></td>
                    <td className="py-3 pr-4 text-slate-500">{b.roomType}</td>
                    <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">{(b.checkIn || '').slice(0, 10)}<div className="text-xs text-slate-400">→ {(b.checkOut || '').slice(0, 10)}</div></td>
                    <td className="py-3 pr-4"><span className={`text-xs px-2 py-0.5 rounded ${b.source === 'Offline' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'}`}>{b.source || 'Online'}</span></td>
                    <td className="py-3 pr-4"><Badge status={b.status} /></td>
                    <td className="py-3 pr-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1.5">
                        <button title="Approve" onClick={() => setStatus(b._id, 'Confirmed')} className="px-2.5 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 text-xs font-semibold">✓</button>
                        <button title="Reject" onClick={() => setStatus(b._id, 'Cancelled')} className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold">✕</button>
                        <button title="Mark Completed" onClick={() => setStatus(b._id, 'Completed')} className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold">✔ Done</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl text-slate-800">{selected.name}</h3>
                <p className="text-slate-400 text-sm">Booking details</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Detail label="Mobile" value={selected.mobile} />
              <Detail label="Email" value={selected.email || '—'} />
              <Detail label="Room" value={selected.roomType} />
              <Detail label="Guests" value={selected.guests} />
              <Detail label="Check-in" value={(selected.checkIn || '').slice(0, 10)} />
              <Detail label="Check-out" value={(selected.checkOut || '').slice(0, 10)} />
              <Detail label="Source" value={selected.source || 'Online'} />
              <Detail label="Status" value={selected.status} />
            </div>
            {selected.specialRequest && (
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-400">Special Request</div>
                <p className="text-sm text-slate-600 mt-1">{selected.specialRequest}</p>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <button onClick={() => setStatus(selected._id, 'Confirmed')} className="flex-1 px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 text-sm font-semibold">✓ Confirm</button>
              <button onClick={() => setStatus(selected._id, 'Cancelled')} className="flex-1 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold">✕ Cancel</button>
              <button onClick={() => setStatus(selected._id, 'Completed')} className="flex-1 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-semibold">✔ Done</button>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="text-slate-700 font-medium">{value}</div>
    </div>
  )
}
