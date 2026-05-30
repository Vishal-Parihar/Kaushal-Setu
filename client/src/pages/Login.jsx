import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      navigate(user.role === 'admin' ? '/admin' : user.role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <span className="text-2xl">🪡</span>
            <span className="font-display font-bold text-saffron text-lg">KaushalSetu</span>
          </Link>
          <h1 className="text-xl font-bold text-charcoal">Sign in</h1>
          <p className="text-gray-400 text-sm mt-1">Good to see you again</p>
        </div>

        <div className="card p-7">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input name="email" type="email" autoComplete="email" className="input" placeholder="you@example.com" value={form.email} onChange={onChange} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input name="password" type="password" autoComplete="current-password" className="input" placeholder="••••••••" value={form.password} onChange={onChange} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-saffron font-semibold hover:underline">Create one</Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4 px-4">
          Demo: use <span className="font-mono text-gray-600">admin@kaushalsetu.com</span> / <span className="font-mono text-gray-600">password123</span> after seeding
        </p>
      </div>
    </div>
  )
}
