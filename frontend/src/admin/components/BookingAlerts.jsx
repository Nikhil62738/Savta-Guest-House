import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api.js'

const POLL_MS = 25000 // check for new booking requests every 25s

export default function BookingAlerts() {
  const [pending, setPending] = useState([])
  const [open, setOpen] = useState(false)
  const [perm, setPerm] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'unsupported')
  const seen = useRef(null) // Set of known booking IDs; null until the first load (baseline)
  const navigate = useNavigate()

  const beep = () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return
      const ctx = new Ctx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      osc.start()
      osc.stop(ctx.currentTime + 0.18)
    } catch (_) {}
  }

  const notify = (booking) => {
    const title = 'New booking request'
    const body =
      (booking.name || 'A guest') + ' · ' + (booking.roomType || 'Room') + ' · ' + (booking.checkIn || '').slice(0, 10)
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'NOTIFY', title, body, url: '/admin/bookings', tag: 'b-' + booking._id })
    } else if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try { new Notification(title, { body, icon: '/icon.svg' }) } catch (_) {}
    }
    beep()
  }

  const poll = async () => {
    try {
      const r = await api.get('/bookings?status=Pending&limit=50')
      const data = r?.data?.bookings || r?.data
      if (!Array.isArray(data)) return
      setPending(data)
      const ids = new Set(data.map((b) => b._id))
      if (seen.current === null) {
        seen.current = ids // baseline on first load — don't notify for already-pending requests
        return
      }
      data.filter((b) => !seen.current.has(b._id)).forEach(notify)
      seen.current = ids
    } catch (_) {}
  }

  useEffect(() => {
    poll()
    const id = setInterval(poll, POLL_MS)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const askPerm = () => {
    if (typeof Notification === 'undefined') return
    Notification.requestPermission().then((p) => setPerm(p)).catch(() => {})
  }

  const count = pending.length

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen((o) => !o); if (perm === 'default') askPerm() }}
        className="relative grid place-items-center w-9 h-9 rounded-full hover:bg-slate-100 transition-colors"
        title="Booking requests"
      >
        <span className="text-xl">🔔</span>
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold grid place-items-center">{count}</span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 z-40 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="font-semibold text-slate-800 text-sm">Pending Requests</span>
              <span className="text-xs text-slate-400">{count}</span>
            </div>
            {perm !== 'granted' && perm !== 'unsupported' && (
              <button onClick={askPerm} className="w-full text-left px-4 py-2 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100">
                🔔 Enable desktop notifications
              </button>
            )}
            <div className="max-h-80 overflow-y-auto">
              {count === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-slate-400">No pending requests 🎉</div>
              ) : (
                pending.map((b) => (
                  <button
                    key={b._id}
                    onClick={() => { setOpen(false); navigate('/admin/bookings') }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50"
                  >
                    <div className="text-sm font-medium text-slate-700">{b.name}</div>
                    <div className="text-xs text-slate-400">{b.roomType} · {(b.checkIn || '').slice(0, 10)} · {b.source || 'Online'}</div>
                  </button>
                ))
              )}
            </div>
            <button onClick={() => { setOpen(false); navigate('/admin/bookings') }} className="w-full px-4 py-2.5 text-sm font-semibold text-[#0F172A] bg-slate-50 hover:bg-slate-100">
              View all bookings
            </button>
          </div>
        </>
      )}
    </div>
  )
}
