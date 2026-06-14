import { Fragment, useEffect, useState } from 'react'
import api from '../../lib/api.js'
import { Card, Empty } from '../components/ui.jsx'
import Toast from '../../components/Toast.jsx'
import { SAMPLE_CONTACTS } from '../sampleData.js'

export default function ContactInquiries() {
  const [messages, setMessages] = useState(SAMPLE_CONTACTS)
  const [open, setOpen] = useState(null)
  const [toast, setToast] = useState(null)

  const load = () => {
    api.get('/contact').then((r) => {
      const data = r?.data?.messages || r?.data
      if (Array.isArray(data) && data.length) setMessages(data)
    }).catch(() => {})
  }
  useEffect(load, [])

  const remove = async (id) => {
    if (!window.confirm('Delete this message?')) return
    setMessages((ms) => ms.filter((m) => m._id !== id))
    if (open === id) setOpen(null)
    setToast({ type: 'success', msg: 'Message deleted.' })
    try { await api.delete('/contact/' + id) } catch (_) {}
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-slate-800">Contact Inquiries</h2>
        <p className="text-slate-400 text-sm">View and delete messages submitted through the contact form.</p>
      </div>

      <Card>
        {messages.length === 0 ? (
          <Empty>No contact messages yet.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="py-3 pr-4 font-medium">Name</th>
                  <th className="py-3 pr-4 font-medium">Contact</th>
                  <th className="py-3 pr-4 font-medium">Subject</th>
                  <th className="py-3 pr-4 font-medium">Received</th>
                  <th className="py-3 pr-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <Fragment key={m._id}>
                    <tr className="border-b border-slate-50">
                      <td className="py-3 pr-4 font-medium text-slate-700">{m.name}</td>
                      <td className="py-3 pr-4 text-slate-500">{m.email}<div className="text-xs text-slate-400">{m.phone}</div></td>
                      <td className="py-3 pr-4 text-slate-500">{m.subject}</td>
                      <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">{(m.createdAt || '').slice(0, 10)}</td>
                      <td className="py-3 pr-4">
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => setOpen(open === m._id ? null : m._id)} className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold">{open === m._id ? 'Hide' : 'View'}</button>
                          <button onClick={() => remove(m._id)} className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold">Delete</button>
                        </div>
                      </td>
                    </tr>
                    {open === m._id && (
                      <tr className="border-b border-slate-50 bg-slate-50/60">
                        <td colSpan={5} className="py-3 px-4 text-slate-600">
                          <span className="text-xs uppercase tracking-wide text-slate-400">Message</span>
                          <p className="mt-1">{m.message}</p>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
