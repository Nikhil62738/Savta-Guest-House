import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import BookingAlerts from './components/BookingAlerts.jsx'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/rooms', label: 'Rooms', icon: '🛏️' },
  { to: '/admin/bookings', label: 'Bookings', icon: '📅' },
  { to: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  { to: '/admin/contacts', label: 'Contacts', icon: '✉️' },
  { to: '/admin/reviews', label: 'Reviews', icon: '⭐' },
]

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const admin = JSON.parse(localStorage.getItem('sawta_admin') || '{}')

  const logout = () => {
    localStorage.removeItem('sawta_token')
    localStorage.removeItem('sawta_admin')
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static z-40 inset-y-0 left-0 w-64 bg-[#0F172A] text-white flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-6 py-6 flex items-center gap-3 border-b border-white/10">
          <span className="grid place-items-center w-10 h-10 rounded-xl font-serif font-bold text-[#0F172A] bg-gradient-to-br from-[#D4AF37] to-[#E6C68A]">S</span>
          <div className="leading-tight">
            <div className="font-serif font-semibold tracking-wide">SAWTA</div>
            <div className="text-[0.6rem] tracking-[3px] text-[#E6C68A] uppercase">Guest House</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#D4AF37] text-[#0F172A]' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="m-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-colors text-left">
          🚪 Logout
        </button>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <button className="lg:hidden text-2xl" onClick={() => setOpen(true)}>☰</button>
          <h1 className="font-serif text-lg font-semibold text-slate-800">Admin Panel</h1>
          <div className="flex items-center gap-3">
            <BookingAlerts />
            <a href="/" target="_blank" rel="noreferrer" className="text-sm text-slate-500 hover:text-slate-800">View Site ↗</a>
            <span className="grid place-items-center w-9 h-9 rounded-full bg-[#0F172A] text-[#D4AF37] text-sm font-semibold">
              {(admin.name || 'A')[0].toUpperCase()}
            </span>
          </div>
        </header>
        <main className="flex-1 p-6 animate-pageIn">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
