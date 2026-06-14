// Small shared admin UI primitives.

export function StatCard({ icon, label, value, accent }) {
  const ring = accent || 'from-[#D4AF37] to-[#E6C68A]'
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
      <div className={`grid place-items-center w-14 h-14 rounded-xl text-2xl text-[#0F172A] bg-gradient-to-br ${ring}`}>{icon}</div>
      <div>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        <div className="text-xs uppercase tracking-wide text-slate-400 mt-0.5">{label}</div>
      </div>
    </div>
  )
}

export function Card({ title, action, children, className = '' }) {
  return (
    <section className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}

export function Badge({ status }) {
  const map = {
    Confirmed: 'bg-green-100 text-green-700',
    Approved: 'bg-green-100 text-green-700',
    Pending: 'bg-amber-100 text-amber-700',
    Cancelled: 'bg-red-100 text-red-700',
    Rejected: 'bg-red-100 text-red-700',
    Completed: 'bg-blue-100 text-blue-700',
    Active: 'bg-green-100 text-green-700',
    Inactive: 'bg-slate-200 text-slate-500',
  }
  return <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>
}

export function Empty({ children }) {
  return <div className="text-center text-slate-400 py-12 text-sm">{children}</div>
}
