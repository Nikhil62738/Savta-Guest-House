import { useEffect } from 'react'

// Small success/error popup used after form submissions.
export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [toast, onClose])

  if (!toast) return null
  const ok = toast.type !== 'error'
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] animate-popIn">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl2 shadow-lg2 text-white ${ok ? 'bg-navy' : 'bg-red-600'}`}>
        <span className="text-xl">{ok ? '✅' : '⚠️'}</span>
        <span className="text-sm font-medium">{toast.msg}</span>
      </div>
    </div>
  )
}
