import { useEffect, useState } from 'react'
import api from '../../lib/api.js'
import { Card, Badge, Empty } from '../components/ui.jsx'
import Toast from '../../components/Toast.jsx'
import { SAMPLE_REVIEWS } from '../sampleData.js'

const FILTERS = ['All', 'Pending', 'Approved']

function Stars({ n }) {
  return <span className="text-[#D4AF37]">{'★'.repeat(n)}<span className="text-slate-300">{'★'.repeat(5 - n)}</span></span>
}

export default function ReviewsManager() {
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS)
  const [filter, setFilter] = useState('All')
  const [toast, setToast] = useState(null)

  const load = () => {
    api.get('/reviews/all').then((r) => {
      const data = r?.data?.reviews || r?.data
      if (Array.isArray(data) && data.length) setReviews(data)
    }).catch(() => {})
  }
  useEffect(load, [])

  const approve = async (id) => {
    setReviews((rs) => rs.map((r) => (r._id === id ? { ...r, status: 'Approved' } : r)))
    setToast({ type: 'success', msg: 'Review approved and published.' })
    try { await api.patch('/reviews/' + id + '/approve') } catch (_) {}
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this review?')) return
    setReviews((rs) => rs.filter((r) => r._id !== id))
    try { await api.delete('/reviews/' + id) } catch (_) {}
  }

  const shown = filter === 'All' ? reviews : reviews.filter((r) => r.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-slate-800">Reviews</h2>
        <p className="text-slate-400 text-sm">Approve guest reviews before they appear on the website, or delete them.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === f ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}>{f}</button>
        ))}
      </div>

      {shown.length === 0 ? (
        <Card><Empty>No reviews in this category.</Empty></Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {shown.map((r) => (
            <Card key={r._id} className="flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-800">{r.name}</div>
                  {r.city && <div className="text-xs text-slate-400">{r.city}</div>}
                  <div className="mt-1 text-sm"><Stars n={r.rating} /></div>
                </div>
                <Badge status={r.status} />
              </div>
              <p className="text-slate-600 text-sm mt-3 flex-1">“{r.comment}”</p>
              <div className="flex gap-2 mt-4">
                {r.status !== 'Approved' && (
                  <button onClick={() => approve(r._id)} className="px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold">✓ Approve & Publish</button>
                )}
                <button onClick={() => remove(r._id)} className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold">Delete</button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
