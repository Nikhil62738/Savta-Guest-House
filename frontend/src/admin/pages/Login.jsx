import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api.js'

const panelStyle = {
  backgroundImage:
    'linear-gradient(rgba(15,23,42,.85), rgba(15,23,42,.92)), url(https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80)',
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('sawta_token', data.token)
      localStorage.setItem('sawta_admin', JSON.stringify(data.user || { name: 'Admin', email }))
      navigate('/admin', { replace: true })
    } catch (e2) {
      setErr(e2?.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-center bg-cover p-6" style={panelStyle}>
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-10 animate-popIn">
        <div className="flex items-center gap-3 justify-center">
          <span className="grid place-items-center w-12 h-12 rounded-xl font-serif font-bold text-[#0F172A] text-xl bg-gradient-to-br from-[#D4AF37] to-[#E6C68A]">S</span>
          <div className="leading-tight">
            <div className="font-serif font-semibold text-lg text-[#0F172A]">SAWTA GUEST HOUSE</div>
            <div className="text-[0.62rem] tracking-[3px] text-[#B8941F] uppercase">Admin Login</div>
          </div>
        </div>

        <h2 className="text-center font-serif text-2xl text-slate-800 mt-8">Welcome Back</h2>
        <p className="text-center text-sm text-slate-500 mt-1">Sign in to manage your guest house.</p>

        {err && <div className="mt-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{err}</div>}

        <label className="block mt-6">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field-input field-light mt-1.5" placeholder="admin@sawtaguesthouse.com" />
        </label>
        <label className="block mt-4">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field-input field-light mt-1.5" placeholder="••••••••" />
        </label>

        <button disabled={loading} className="btn btn-navy w-full justify-center mt-7 disabled:opacity-60">
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <p className="text-center text-xs text-slate-400 mt-5">
          Demo: admin@sawtaguesthouse.com / Admin@123
        </p>
      </form>
    </div>
  )
}
