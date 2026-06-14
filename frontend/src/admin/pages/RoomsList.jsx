import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api.js'
import { Card, Badge, Empty } from '../components/ui.jsx'
import { SAMPLE_ROOMS } from '../sampleData.js'

const avail = (r) =>
  Math.max(0, Number(r.totalUnits || 0) - Number(r.bookedOnline || 0) - Number(r.bookedOffline || 0))

export default function RoomsList() {
  const [rooms, setRooms] = useState(SAMPLE_ROOMS)

  const load = () => {
    api.get('/rooms?all=1').then((r) => {
      const data = r?.data?.rooms || r?.data
      if (Array.isArray(data) && data.length) setRooms(data)
    }).catch(() => {})
  }
  useEffect(load, [])

  const remove = async (id) => {
    if (!confirm('Delete this room? This cannot be undone.')) return
    try { await api.delete(`/rooms/${id}`) } catch (_) {}
    setRooms((rs) => rs.filter((r) => r._id !== id))
  }

  // Add or remove units from a category (quick inventory control).
  const addUnits = async (id, delta) => {
    setRooms((rs) =>
      rs.map((r) => (r._id === id ? { ...r, totalUnits: Math.max(0, Number(r.totalUnits || 0) + delta) } : r))
    )
    try { await api.patch(`/rooms/${id}/units`, { delta }) } catch (_) {}
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-slate-800">All Rooms</h2>
          <p className="text-slate-400 text-sm">{rooms.length} categories · manage units, availability, pricing and details.</p>
        </div>
        <Link to="/admin/rooms/new" className="btn btn-navy">➕ Add New Room</Link>
      </div>

      <Card>
        {rooms.length === 0 ? (
          <Empty>No rooms yet. Add your first room.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="py-3 pr-4 font-medium">Room</th>
                  <th className="py-3 pr-4 font-medium">Type</th>
                  <th className="py-3 pr-4 font-medium">Price/Night</th>
                  <th className="py-3 pr-4 font-medium">Availability</th>
                  <th className="py-3 pr-4 font-medium">Add Units</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => {
                  const a = avail(r)
                  return (
                    <tr key={r._id} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <img src={r.image || (r.images && r.images[0])} alt={r.name} className="w-12 h-12 rounded-lg object-cover" />
                          <span className="font-medium text-slate-700">{r.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-slate-500">{r.type || r.category}</td>
                      <td className="py-3 pr-4 font-semibold text-slate-700">₹{Number(r.price).toLocaleString('en-IN')}</td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-col gap-0.5 text-xs leading-tight">
                          <span className="text-slate-600">Total: <b>{Number(r.totalUnits || 0)}</b></span>
                          <span className="text-blue-600">Online booked: {Number(r.bookedOnline || 0)}</span>
                          <span className="text-amber-600">Offline booked: {Number(r.bookedOffline || 0)}</span>
                          <span className={a > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {a > 0 ? a + ' available' : 'Sold out'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => addUnits(r._id, -1)} className="w-7 h-7 grid place-items-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold">−</button>
                          <button onClick={() => addUnits(r._id, 1)} className="px-2.5 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold">+1</button>
                          <button onClick={() => addUnits(r._id, 5)} className="px-2.5 h-7 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#B8941F] text-xs font-semibold">+5</button>
                        </div>
                      </td>
                      <td className="py-3 pr-4"><Badge status={r.status || 'Active'} /></td>
                      <td className="py-3 pr-4">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/rooms/${r._id}/edit`} className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold">Edit</Link>
                          <button onClick={() => remove(r._id)} className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold">Delete</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
