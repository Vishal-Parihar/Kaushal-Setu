import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'customer' })
  const [loading, setLoading] = useState(false)

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async e => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const user = await register(form.name, form.email, form.password, form.phone, form.role)
      toast.success(`Welcome, ${user.name.split(' ')[0]}!`)
      navigate(user.role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <span className="text-2xl">🪡</span>
            <span className="font-display font-bold text-saffron text-lg">KaushalSetu</span>
          </Link>
          <h1 className="text-xl font-bold text-charcoal">Create account</h1>
          <p className="text-gray-400 text-sm mt-1">Join India's artisan marketplace</p>
        </div>

        <div className="card p-7">
          {/* Role picker */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {[['customer', '👤', 'Customer'], ['entrepreneur', '🎨', 'Artisan']].map(([r, icon, label]) => (
              <button key={r} type="button" onClick={() => setForm(f => ({ ...f, role: r }))}
                className={`py-2.5 px-3 rounded-lg border-2 text-sm font-semibold transition-all text-left flex items-center gap-2 ${form.role === r ? 'border-saffron bg-saffron/8 text-saffron' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                <span>{icon}</span>{label}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="space-y-3.5">
            <div>
              <label className="label">Full Name</label>
              <input name="name" className="input" placeholder="Rajesh Kumar" value={form.name} onChange={onChange} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input name="email" type="email" autoComplete="email" className="input" placeholder="you@example.com" value={form.email} onChange={onChange} required />
            </div>
            <div>
              <label className="label">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
              <input name="phone" className="input" placeholder="+91 98765 43210" value={form.phone} onChange={onChange} />
            </div>
            <div>
              <label className="label">Password</label>
              <input name="password" type="password" autoComplete="new-password" className="input" placeholder="Min. 6 characters" value={form.password} onChange={onChange} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1">
              {loading ? 'Creating account…' : `Register as ${form.role === 'customer' ? 'Customer' : 'Artisan'}`}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-saffron font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
