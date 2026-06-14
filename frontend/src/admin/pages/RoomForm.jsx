import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../lib/api.js'
import { Card } from '../components/ui.jsx'
import Toast from '../../components/Toast.jsx'
import { SAMPLE_ROOMS } from '../sampleData.js'

const AMENITIES = ['Free WiFi', 'AC', 'TV', 'Mini Fridge', 'Hot Water', 'Room Service', 'Balcony', 'Work Desk', 'Telephone', 'Safe Locker', 'Daily Housekeeping']
const TYPES = ['Standard', 'Deluxe', 'Family', 'AC', 'Non AC']

const EMPTY = {
  name: '', category: 'Standard', type: 'Non AC', price: '', occupancy: 2,
  description: '', status: 'Active', amenities: [], images: [],
  totalUnits: 1, bookedOnline: 0, bookedOffline: 0,
}

export default function RoomForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editing = Boolean(id)
  const [form, setForm] = useState(EMPTY)
  const [previews, setPreviews] = useState([])
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!editing) return
    api.get(`/rooms/${id}`).then((r) => r.data && hydrate(r.data)).catch(() => {
      const local = SAMPLE_ROOMS.find((x) => x._id === id)
      if (local) hydrate(local)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const hydrate = (r) => {
    setForm({ ...EMPTY, ...r, amenities: r.amenities || [] })
    setPreviews(r.images || (r.image ? [r.image] : []))
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const available = Math.max(0, Number(form.totalUnits || 0) - Number(form.bookedOnline || 0) - Number(form.bookedOffline || 0))
  const availClass = 'px-3 py-1.5 rounded-lg ' + (available > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600')

  const toggleAmenity = (a) =>
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }))

  // Multiple image upload -> previewed locally; sent as multipart to backend (Cloudinary).
  const onFiles = (e) => {
    const files = Array.from(e.target.files || [])
    setForm((f) => ({ ...f, _files: files }))
    setPreviews((p) => [...p, ...files.map((file) => URL.createObjectURL(file))])
  }

  const removePreview = (i) => setPreviews((p) => p.filter((_, idx) => idx !== i))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === '_files') return
        fd.append(k, Array.isArray(v) ? JSON.stringify(v) : v)
      })
      ;(form._files || []).forEach((file) => fd.append('images', file))
      const cfg = { headers: { 'Content-Type': 'multipart/form-data' } }
      if (editing) await api.put(`/rooms/${id}`, fd, cfg)
      else await api.post('/rooms', fd, cfg)
      navigate('/admin/rooms')
    } catch (_) {
      setToast({ type: 'success', msg: `Room ${editing ? 'updated' : 'added'} (demo mode — backend offline).` })
      setTimeout(() => navigate('/admin/rooms'), 900)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-serif text-2xl text-slate-800">{editing ? 'Edit Room' : 'Add New Room'}</h2>
        <p className="text-slate-400 text-sm">Fill in the room details and upload multiple images.</p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <Card title="Room Details">
          <div className="grid sm:grid-cols-2 gap-5">
            <L label="Room Name"><input className="field-input field-light" required value={form.name} onChange={set('name')} placeholder="Deluxe Room" /></L>
            <L label="Category">
              <select className="field-input field-light" value={form.category} onChange={set('category')}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </L>
            <L label="AC / Non AC">
              <select className="field-input field-light" value={form.type} onChange={set('type')}>
                <option>AC</option><option>Non AC</option>
              </select>
            </L>
            <L label="Price Per Night (₹)"><input type="number" min="0" className="field-input field-light" required value={form.price} onChange={set('price')} placeholder="2000" /></L>
            <L label="Occupancy (Guests)"><input type="number" min="1" className="field-input field-light" value={form.occupancy} onChange={set('occupancy')} /></L>
            <L label="Status">
              <select className="field-input field-light" value={form.status} onChange={set('status')}>
                <option>Active</option><option>Inactive</option>
              </select>
            </L>
            <L label="Description" full><textarea className="field-input field-light min-h-[100px]" value={form.description} onChange={set('description')} placeholder="Describe the room…" /></L>
          </div>
        </Card>

        <Card title="Inventory & Availability">
          <p className="text-slate-400 text-sm mb-4">Set how many rooms exist in this category. <b>Booked Online</b> and <b>Booked Offline</b> are counted automatically from confirmed bookings, so availability always stays in sync.</p>
          <div className="grid sm:grid-cols-3 gap-5">
            <L label="Total Rooms in this Category"><input type="number" min="0" className="field-input field-light" value={form.totalUnits} onChange={set('totalUnits')} placeholder="10" /></L>
            <L label="Booked Online (auto)"><input type="number" className="field-input field-light bg-slate-50 text-slate-400" value={Number(form.bookedOnline || 0)} readOnly disabled /></L>
            <L label="Booked Offline (auto)"><input type="number" className="field-input field-light bg-slate-50 text-slate-400" value={Number(form.bookedOffline || 0)} readOnly disabled /></L>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600">Total: <b>{Number(form.totalUnits || 0)}</b></span>
            <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600">Online booked: <b>{Number(form.bookedOnline || 0)}</b></span>
            <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600">Offline booked: <b>{Number(form.bookedOffline || 0)}</b></span>
            <span className={availClass}>Available: <b>{available}</b></span>
          </div>
        </Card>

        <Card title="Amenities">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {AMENITIES.map((a) => (
              <label key={a} className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} className="w-4 h-4 accent-[#D4AF37]" />
                {a}
              </label>
            ))}
          </div>
        </Card>

        <Card title="Room Images">
          <label className="block border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#D4AF37] transition-colors">
            <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
            <div className="text-3xl">📤</div>
            <p className="text-sm text-slate-500 mt-2">Click to upload multiple images</p>
            <p className="text-xs text-slate-400">JPG, PNG, WEBP · stored on Cloudinary</p>
          </label>
          {previews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
              {previews.map((src, i) => (
                <div key={i} className="relative group">
                  <img src={src} alt="" className="w-full h-24 object-cover rounded-lg" />
                  <button type="button" onClick={() => removePreview(i)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100">✕</button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="flex gap-3">
          <button disabled={saving} className="btn btn-navy disabled:opacity-60">{saving ? 'Saving…' : editing ? 'Update Room' : 'Add Room'}</button>
          <button type="button" onClick={() => navigate('/admin/rooms')} className="px-6 py-[15px] rounded-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold">Cancel</button>
        </div>
      </form>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}

function L({ label, children, full }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="block text-sm font-medium text-slate-700 mb-1.5">{label}</span>
      {children}
    </label>
  )
}
