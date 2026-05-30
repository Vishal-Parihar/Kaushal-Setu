import { useState, useEffect } from 'react'
import API from '../utils/api'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/common/StatusBadge'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import toast from 'react-hot-toast'

export default function EntrepreneurDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('overview')
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const [requests, setRequests] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Product form
  const [pForm, setPForm] = useState({ name: '', description: '', price: '', stock: 1, category: '', tags: '' })
  // Profile form
  const [profileForm, setProfileForm] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, oRes, rRes, prRes] = await Promise.all([
          API.get('/entrepreneurs/me'),
          API.get('/orders/entrepreneur'),
          API.get('/service-requests/entrepreneur'),
          API.get('/products?limit=50'),
        ])
        const ep = pRes.data.entrepreneur
        setProfile(ep)
        setProfileForm(ep)
        setOrders(oRes.data.orders || [])
        setRequests(rRes.data.requests || [])
        setProducts((prRes.data.products || []).filter(p => p.entrepreneur?._id === ep?._id))
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const handleOrderStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status })
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o))
      toast.success(`Order marked as ${status.replace('_', ' ')}`)
    } catch { toast.error('Failed') }
  }

  const handleAddProduct = async e => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...pForm, price: parseFloat(pForm.price), tags: pForm.tags.split(',').map(t => t.trim()).filter(Boolean) }
      const { data } = await API.post('/products', payload)
      setProducts(prev => [data.product, ...prev])
      setPForm({ name: '', description: '', price: '', stock: 1, category: '', tags: '' })
      toast.success('Product added!')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    setSaving(false)
  }

  const handleProfileSave = async e => {
    e.preventDefault(); setSaving(true)
    try {
      const { data } = await API.put('/entrepreneurs', profileForm)
      setProfile(data.entrepreneur)
      toast.success('Profile updated!')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    setSaving(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><Spinner size="lg" /></div>

  if (!profile) return (
    <div className="min-h-screen bg-cream pt-16">
      <div className="max-w-lg mx-auto px-6 py-16 text-center">
        <div className="text-5xl mb-4">🎨</div>
        <h2 className="text-xl font-bold text-charcoal mb-2">Set up your artisan profile</h2>
        <p className="text-gray-400 text-sm mb-8">Fill in your details to start receiving orders and service requests.</p>
        <CreateProfileForm onCreated={p => { setProfile(p); setProfileForm(p) }} />
      </div>
    </div>
  )

  const tabs = ['overview', 'orders', 'requests', 'products', 'profile']

  return (
    <div className="min-h-screen bg-cream pt-16">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7">
          <div>
            <h1 className="font-display text-2xl font-bold text-teal">{profile.businessName}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{user?.name}</p>
          </div>
          <span className={`badge w-fit ${profile.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {profile.isApproved ? '✅ Approved' : '⏳ Pending Approval'}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
          {[
            { label: 'Orders', value: orders.length, icon: '📦', c: 'bg-blue-50 text-blue-700' },
            { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: '⏳', c: 'bg-yellow-50 text-yellow-700' },
            { label: 'Earnings', value: `₹${profile.earnings || 0}`, icon: '💰', c: 'bg-green-50 text-green-700' },
            { label: 'Products', value: products.length, icon: '🛍️', c: 'bg-purple-50 text-purple-700' },
          ].map(s => (
            <div key={s.label} className={`card p-4 ${s.c}`}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs font-medium opacity-65 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 flex-wrap bg-white rounded-xl p-1 border border-gray-100 mb-6">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-saffron text-white' : 'text-gray-500 hover:text-charcoal'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="card p-5">
              <h3 className="font-semibold text-charcoal text-sm mb-4">Recent Orders</h3>
              {orders.length === 0
                ? <p className="text-gray-400 text-xs text-center py-6">No orders yet</p>
                : orders.slice(0, 5).map(o => (
                    <div key={o._id} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-charcoal">{o.product?.name}</p>
                        <p className="text-xs text-gray-400">{o.customer?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-saffron">₹{o.totalAmount}</p>
                        <StatusBadge status={o.status} />
                      </div>
                    </div>
                  ))
              }
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-charcoal text-sm mb-4">Recent Requests</h3>
              {requests.length === 0
                ? <p className="text-gray-400 text-xs text-center py-6">No requests yet</p>
                : requests.slice(0, 5).map(r => (
                    <div key={r._id} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-charcoal">{r.serviceType}</p>
                        <p className="text-xs text-gray-400">{r.customer?.name}</p>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                  ))
              }
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          orders.length === 0
            ? <EmptyState icon="📦" title="No orders yet" description="Orders from customers will appear here." />
            : <div className="space-y-3">
                {orders.map(o => (
                  <div key={o._id} className="card p-5">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="flex-1">
                        <p className="font-semibold text-charcoal">{o.product?.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{o.customer?.name} &nbsp;·&nbsp; {o.customer?.phone} &nbsp;·&nbsp; Qty: {o.quantity}</p>
                        {o.deliveryAddress && <p className="text-xs text-gray-400 mt-0.5">📍 {o.deliveryAddress.address}, {o.deliveryAddress.city}</p>}
                        {o.notes && <p className="text-xs text-gray-500 mt-1 italic">{o.notes}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <p className="text-saffron font-bold">₹{o.totalAmount}</p>
                        <StatusBadge status={o.status} />
                        <div className="flex gap-1.5">
                          {o.status === 'pending' && <>
                            <button onClick={() => handleOrderStatus(o._id, 'confirmed')} className="btn-primary text-xs py-1 px-3">Confirm</button>
                            <button onClick={() => handleOrderStatus(o._id, 'cancelled')} className="text-xs py-1 px-3 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors">Cancel</button>
                          </>}
                          {o.status === 'confirmed' && <button onClick={() => handleOrderStatus(o._id, 'in_progress')} className="btn-teal text-xs py-1 px-3">Start</button>}
                          {o.status === 'in_progress' && <button onClick={() => handleOrderStatus(o._id, 'completed')} className="btn-primary text-xs py-1 px-3">Complete</button>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
        )}

        {/* Requests */}
        {tab === 'requests' && (
          requests.length === 0
            ? <EmptyState icon="🔧" title="No service requests" description="Customer requests will show up here." />
            : <div className="space-y-3">
                {requests.map(r => <RequestCard key={r._id} request={r} onRespond={async (id, status, response, price) => {
                  try {
                    await API.put(`/service-requests/${id}/respond`, { status, entrepreneurResponse: response, agreedPrice: price })
                    setRequests(prev => prev.map(x => x._id === id ? { ...x, status, entrepreneurResponse: response, agreedPrice: price } : x))
                    toast.success('Response sent!')
                  } catch { toast.error('Failed') }
                }} />)}
              </div>
        )}

        {/* Products */}
        {tab === 'products' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {products.length === 0
                ? <EmptyState icon="🛍️" title="No products listed" description="Add your first product using the form." />
                : <div className="space-y-3">
                    {products.map(p => (
  <div key={p._id} className="card p-4 flex items-center gap-4">
    <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream-dark shrink-0">
      {p.images?.[0] ? (
        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-2xl bg-cream">🛍️</div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-charcoal text-sm truncate">{p.name}</p>
      <p className="text-xs text-gray-400">₹{p.price} · Stock: {p.stock}</p>
    </div>
    <span className={`badge ${p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
      {p.isAvailable ? 'Active' : 'Hidden'}
    </span>
    <button
      onClick={() => handleDeleteProduct(p._id)}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
      title="Delete product"
    >
      🗑️
    </button>
  </div>
))}
                  </div>
              }
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-charcoal text-sm mb-4">Add Product</h3>
              <form onSubmit={handleAddProduct} className="space-y-3">
                <input className="input text-sm" placeholder="Product name" required value={pForm.name} onChange={e => setPForm(f => ({ ...f, name: e.target.value }))} />
                <textarea className="input text-sm resize-none" rows={2} placeholder="Description" required value={pForm.description} onChange={e => setPForm(f => ({ ...f, description: e.target.value }))} />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" className="input text-sm" placeholder="Price ₹" required value={pForm.price} onChange={e => setPForm(f => ({ ...f, price: e.target.value }))} />
                  <input type="number" className="input text-sm" placeholder="Stock" required value={pForm.stock} onChange={e => setPForm(f => ({ ...f, stock: parseInt(e.target.value) || 1 }))} />
                </div>
                <input className="input text-sm" placeholder="Category" value={pForm.category} onChange={e => setPForm(f => ({ ...f, category: e.target.value }))} />
                <input className="input text-sm" placeholder="Tags (comma separated)" value={pForm.tags} onChange={e => setPForm(f => ({ ...f, tags: e.target.value }))} />
                <button type="submit" disabled={saving} className="btn-primary w-full text-sm py-2.5 disabled:opacity-60">
                  {saving ? 'Adding…' : '+ Add Product'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Profile */}
        {tab === 'profile' && profileForm && (
          <div className="max-w-xl card p-6">
            <h3 className="font-semibold text-charcoal mb-5">Edit Profile</h3>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Business Name</label><input className="input" value={profileForm.businessName || ''} onChange={e => setProfileForm(f => ({ ...f, businessName: e.target.value }))} /></div>
                <div><label className="label">Experience (yrs)</label><input type="number" className="input" value={profileForm.experience || 0} onChange={e => setProfileForm(f => ({ ...f, experience: parseInt(e.target.value) }))} /></div>
              </div>
              <div><label className="label">Category</label>
                <select className="input" value={profileForm.category || ''} onChange={e => setProfileForm(f => ({ ...f, category: e.target.value }))}>
                  {['cobbler','potter','tailor','artisan','vendor','other'].map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
              <div><label className="label">Description</label><textarea className="input resize-none" rows={4} value={profileForm.description || ''} onChange={e => setProfileForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">City</label><input className="input" value={profileForm.location?.city || ''} onChange={e => setProfileForm(f => ({ ...f, location: { ...f.location, city: e.target.value } }))} /></div>
                <div><label className="label">State</label><input className="input" value={profileForm.location?.state || ''} onChange={e => setProfileForm(f => ({ ...f, location: { ...f.location, state: e.target.value } }))} /></div>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-saffron" checked={profileForm.availability ?? true} onChange={e => setProfileForm(f => ({ ...f, availability: e.target.checked }))} />
                <span className="text-sm font-medium text-charcoal">Available for new work</span>
              </label>
              <button type="submit" disabled={saving} className="btn-primary px-7 disabled:opacity-60">{saving ? 'Saving…' : 'Save Changes'}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

function RequestCard({ request: r, onRespond }) {
  const [open, setOpen] = useState(false)
  const [response, setResponse] = useState('')
  const [price, setPrice] = useState('')

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="font-semibold text-charcoal">{r.serviceType}</p>
          <p className="text-xs text-gray-400 mt-0.5">{r.customer?.name} &nbsp;·&nbsp; {r.customer?.phone}</p>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{r.description}</p>
          {r.budget && <p className="text-xs text-gray-400 mt-1">Budget: ₹{r.budget}</p>}
        </div>
        <StatusBadge status={r.status} />
      </div>
      {r.status === 'pending' && (
        <div className="mt-4">
          {!open
            ? <button onClick={() => setOpen(true)} className="btn-primary text-xs py-1.5 px-4">Respond</button>
            : <div className="space-y-2.5 p-4 bg-cream rounded-xl mt-2">
                <textarea className="input text-sm resize-none" rows={2} placeholder="Your response…" value={response} onChange={e => setResponse(e.target.value)} />
                <input type="number" className="input text-sm" placeholder="Agreed price ₹" value={price} onChange={e => setPrice(e.target.value)} />
                <div className="flex gap-2">
                  <button onClick={() => { onRespond(r._id, 'accepted', response, price); setOpen(false) }} className="btn-primary text-xs py-1.5 px-4">Accept</button>
                  <button onClick={() => { onRespond(r._id, 'rejected', response, price); setOpen(false) }} className="text-xs py-1.5 px-4 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors">Reject</button>
                  <button onClick={() => setOpen(false)} className="btn-outline text-xs py-1.5 px-4">Cancel</button>
                </div>
              </div>
          }
        </div>
      )}
    </div>
  )
}

function CreateProfileForm({ onCreated }) {
  const [form, setForm] = useState({ businessName: '', category: 'artisan', description: '', experience: 0, location: { city: '', state: '' } })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true)
    try {
      const { data } = await API.post('/entrepreneurs', form)
      onCreated(data.entrepreneur)
      toast.success('Profile created! Awaiting admin approval.')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="text-left space-y-4">
      <div><label className="label">Business / Artisan Name</label><input className="input" required value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} /></div>
      <div><label className="label">Category</label>
        <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
          {['cobbler','potter','tailor','artisan','vendor','other'].map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
        </select>
      </div>
      <div><label className="label">Description</label><textarea className="input resize-none" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="label">City</label><input className="input" required value={form.location.city} onChange={e => setForm(f => ({ ...f, location: { ...f.location, city: e.target.value } }))} /></div>
        <div><label className="label">State</label><input className="input" required value={form.location.state} onChange={e => setForm(f => ({ ...f, location: { ...f.location, state: e.target.value } }))} /></div>
      </div>
      <button type="submit" disabled={saving} className="btn-primary w-full py-2.5 disabled:opacity-60">{saving ? 'Creating…' : 'Create Profile'}</button>
    </form>
  )
}
