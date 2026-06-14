import { useEffect, useRef, useState } from 'react'
import api from '../../lib/api.js'
import { Card, Empty } from '../components/ui.jsx'
import Toast from '../../components/Toast.jsx'
import { SAMPLE_GALLERY } from '../sampleData.js'

const CATS = ['All', 'Rooms', 'Reception', 'Exterior', 'Dining', 'Parking', 'Videos']

export default function GalleryManager() {
  const [items, setItems] = useState(SAMPLE_GALLERY)
  const [filter, setFilter] = useState('All')
  const [cat, setCat] = useState('Rooms')
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState(null)
  const inputRef = useRef(null)

  const load = () => {
    api.get('/gallery').then((r) => {
      const data = r?.data?.gallery || r?.data
      if (Array.isArray(data) && data.length) setItems(data)
    }).catch(() => {})
  }
  useEffect(load, [])

  const onPick = (e) => setFiles(Array.from(e.target.files || []))

  const upload = async (e) => {
    e.preventDefault()
    if (!files.length) {
      setToast({ type: 'error', msg: 'Please choose at least one file.' })
      return
    }
    setUploading(true)
    const fd = new FormData()
    files.forEach((f) => fd.append('media', f))
    fd.append('cat', cat)
    try {
      const r = await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      const added = r?.data?.gallery || []
      if (added.length) setItems((it) => [...added, ...it])
      setToast({ type: 'success', msg: 'Media uploaded.' })
    } catch (_) {
      // Offline/demo fallback — show local previews
      const previews = files.map((f, i) => ({
        _id: 'tmp' + Date.now() + i,
        label: f.name,
        cat,
        type: f.type.startsWith('video') ? 'video' : 'image',
        src: URL.createObjectURL(f),
      }))
      setItems((it) => [...previews, ...it])
      setToast({ type: 'success', msg: 'Added locally (backend not connected).' })
    } finally {
      setUploading(false)
      setFiles([])
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this media?')) return
    setItems((it) => it.filter((x) => x._id !== id))
    try { await api.delete('/gallery/' + id) } catch (_) {}
  }

  const shown = filter === 'All' ? items : items.filter((x) => x.cat === filter)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-slate-800">Gallery Management</h2>
        <p className="text-slate-400 text-sm">Upload images & videos, organize by category, and delete media.</p>
      </div>

      <Card title="Upload Media">
        <form onSubmit={upload} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Images / Videos</label>
            <input ref={inputRef} type="file" accept="image/*,video/*" multiple onChange={onPick} className="block w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#0F172A] file:text-white file:text-sm hover:file:bg-[#1E293B]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
            <select className="field-input field-light" value={cat} onChange={(e) => setCat(e.target.value)}>
              {CATS.filter((c) => c !== 'All').map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button disabled={uploading} className="btn btn-gold justify-center disabled:opacity-60">{uploading ? 'Uploading…' : '⬆ Upload'}</button>
        </form>
        {files.length > 0 && <p className="text-xs text-slate-400 mt-2">{files.length} file(s) selected.</p>}
      </Card>

      <div className="flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === c ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}>{c}</button>
        ))}
      </div>

      <Card>
        {shown.length === 0 ? (
          <Empty>No media in this category.</Empty>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {shown.map((m) => (
              <div key={m._id} className="group relative rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                <img src={m.src} alt={m.label} loading="lazy" className="w-full h-36 object-cover" />
                {m.type === 'video' && (
                  <span className="absolute top-2 left-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded">▶ Video</span>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <div className="text-white text-xs font-medium truncate">{m.label}</div>
                  <div className="text-white/70 text-[10px]">{m.cat}</div>
                </div>
                <button onClick={() => remove(m._id)} title="Delete" className="absolute top-2 right-2 w-7 h-7 grid place-items-center rounded-full bg-red-500/90 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
