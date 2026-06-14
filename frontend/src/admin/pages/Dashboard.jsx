import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api.js'
import { StatCard, Card, Badge } from '../components/ui.jsx'
import { SAMPLE_STATS, SAMPLE_BOOKINGS } from '../sampleData.js'

export default function Dashboard() {
  const [stats, setStats] = useState(SAMPLE_STATS)
  const [recent, setRecent] = useState(SAMPLE_BOOKINGS)

  useEffect(() => {
    api.get('/dashboard/stats').then((r) => r.data && setStats(r.data)).catch(() => {})
    api.get('/bookings?limit=5').then((r) => {
      const data = r?.data?.bookings || r?.data
      if (Array.isArray(data) && data.length) setRecent(data)
    }).catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-slate-800">Dashboard</h2>
        <p className="text-slate-400 text-sm">Overview of your guest house at a glance.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📅" label="Total Bookings" value={stats.totalBookings} />
        <StatCard icon="🛏️" label="Total Rooms" value={stats.totalRooms} accent="from-sky-400 to-sky-300" />
        <StatCard icon="🖼️" label="Gallery Images" value={stats.totalGallery} accent="from-violet-400 to-violet-300" />
        <StatCard icon="✉️" label="Contact Inquiries" value={stats.totalContacts} accent="from-rose-400 to-rose-300" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card title="Recent Bookings" className="lg:col-span-2" action={<Link to="/admin/bookings" className="text-sm text-[#B8941F] hover:underline">View all</Link>}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="py-2 pr-4 font-medium">Guest</th>
                  <th className="py-2 pr-4 font-medium">Room</th>
                  <th className="py-2 pr-4 font-medium">Check-In</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.slice(0, 5).map((b) => (
                  <tr key={b._id} className="border-b border-slate-50">
                    <td className="py-3 pr-4 font-medium text-slate-700">{b.name}</td>
                    <td className="py-3 pr-4 text-slate-500">{b.roomType}</td>
                    <td className="py-3 pr-4 text-slate-500">{b.checkIn}</td>
                    <td className="py-3 pr-4"><Badge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="grid gap-3">
            <Link to="/admin/rooms/new" className="btn btn-navy justify-center">➕ Add Room</Link>
            <Link to="/admin/bookings" className="btn btn-gold justify-center">📝 Offline Booking</Link>
            <Link to="/admin/gallery" className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold text-center transition-colors">🖼️ Manage Gallery</Link>
            <Link to="/admin/reviews" className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold text-center transition-colors">⭐ Approve Reviews ({stats.pendingReviews ?? 0})</Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
