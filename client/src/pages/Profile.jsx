import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import API from '../utils/api'
import toast from 'react-hot-toast'

const ROLE_BADGE = { customer: 'bg-blue-100 text-blue-700', entrepreneur: 'bg-purple-100 text-purple-700', admin: 'bg-red-100 text-red-700' }

export default function Profile() {
  const { user, refreshUser } = useAuth()
  const [tab, setTab] = useState('info')
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: { city: user?.address?.city || '', state: user?.address?.state || '', pincode: user?.address?.pincode || '' },
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      await API.put('/auth/profile', form)
      await refreshUser()
      toast.success('Profile updated!')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-cream pt-16">
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="card p-7 mb-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-saffron text-white flex items-center justify-center text-2xl font-bold shrink-0 overflow-hidden">
            {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-xl font-bold text-charcoal">{user?.name}</h1>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <span className={`badge mt-1.5 capitalize ${ROLE_BADGE[user?.role]}`}>{user?.role}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-6 w-fit">
          {[['info', 'Profile Info'], ['security', 'Security']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-saffron text-white' : 'text-gray-500 hover:text-charcoal'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'info' && (
          <div className="card p-7">
            <h2 className="font-semibold text-charcoal mb-5">Personal Information</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">City</label>
                  <input className="input" value={form.address.city} onChange={e => setForm(f => ({ ...f, address: { ...f.address, city: e.target.value } }))} />
                </div>
                <div>
                  <label className="label">State</label>
                  <input className="input" value={form.address.state} onChange={e => setForm(f => ({ ...f, address: { ...f.address, state: e.target.value } }))} />
                </div>
                <div>
                  <label className="label">Pincode</label>
                  <input className="input" value={form.address.pincode} onChange={e => setForm(f => ({ ...f, address: { ...f.address, pincode: e.target.value } }))} />
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary px-7 disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {tab === 'security' && (
          <div className="card p-7">
            <h2 className="font-semibold text-charcoal mb-5">Account Details</h2>
            <div className="space-y-3 text-sm mb-7">
              <div className="flex justify-between py-2.5 border-b border-gray-100">
                <span className="text-gray-400">Email</span>
                <span className="font-medium text-charcoal">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-gray-100">
                <span className="text-gray-400">Role</span>
                <span className="font-medium text-charcoal capitalize">{user?.role}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 bg-cream rounded-lg p-3.5">
              Password change can be implemented by connecting to the <code className="font-mono text-xs">/api/auth/change-password</code> endpoint. Add it to the server for full support.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
