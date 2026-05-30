import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../utils/api'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/common/StarRating'
import CategoryBadge from '../components/common/CategoryBadge'
import Modal from '../components/common/Modal'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'

export default function EntrepreneurDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ serviceType: '', description: '', preferredDate: '', location: '', budget: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    API.get(`/entrepreneurs/${id}`)
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const handleRequest = async e => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setSubmitting(true)
    try {
      await API.post('/service-requests', { entrepreneur: id, ...form })
      toast.success('Service request sent!')
      setModal(false)
      setForm({ serviceType: '', description: '', preferredDate: '', location: '', budget: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request')
    }
    setSubmitting(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><Spinner size="lg" /></div>
  if (!data?.entrepreneur) return <div className="min-h-screen flex items-center justify-center pt-16 text-gray-400">Artisan not found.</div>

  const { entrepreneur, reviews = [] } = data

  return (
    <div className="min-h-screen bg-cream pt-16">
      {/* Hero banner */}
      <div className="bg-teal py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-24 h-24 rounded-xl2 overflow-hidden bg-cream-dark shrink-0 border-2 border-white/20">
            <img
              src={entrepreneur.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(entrepreneur.businessName)}&background=E8650A&color=fff&size=200`}
              alt={entrepreneur.businessName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <CategoryBadge category={entrepreneur.category} />
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${entrepreneur.availability ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-white/50'}`}>
                {entrepreneur.availability ? '● Available' : '○ Busy'}
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight">{entrepreneur.businessName}</h1>
            <p className="text-white/55 text-sm mt-1">{entrepreneur.user?.name} &nbsp;·&nbsp; {entrepreneur.location?.city}, {entrepreneur.location?.state}</p>
            <div className="flex items-center gap-3 mt-2.5">
              <StarRating rating={entrepreneur.rating} size="md" />
              <span className="text-white/40 text-xs">{entrepreneur.totalReviews} reviews &nbsp;·&nbsp; {entrepreneur.experience} yrs experience</span>
            </div>
          </div>
          <button
            onClick={() => { if (!user) { navigate('/login'); return } setModal(true) }}
            className="btn-primary bg-saffron px-7 py-2.5 text-sm shrink-0"
          >
            Request Service
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-7">
        {/* Left col */}
        <div className="md:col-span-2 space-y-6">
          {/* About */}
          <div className="card p-6">
            <h2 className="font-semibold text-charcoal mb-3">About</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{entrepreneur.description || 'No description added yet.'}</p>
            {entrepreneur.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {entrepreneur.skills.map(s => (
                  <span key={s} className="px-3 py-1 bg-saffron/8 text-saffron text-xs font-medium rounded-full">{s}</span>
                ))}
              </div>
            )}
          </div>

          {/* Services */}
          {entrepreneur.services?.length > 0 && (
            <div className="card p-6">
              <h2 className="font-semibold text-charcoal mb-4">Services</h2>
              <div className="space-y-2.5">
                {entrepreneur.services.map((svc, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-cream rounded-xl border border-cream-dark">
                    <div>
                      <p className="text-sm font-medium text-charcoal">{svc.name}</p>
                      {svc.description && <p className="text-xs text-gray-400 mt-0.5">{svc.description}</p>}
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <span className="text-saffron font-bold text-sm">₹{svc.price}</span>
                      <span className="text-gray-400 text-xs ml-1">{svc.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {entrepreneur.gallery?.length > 0 && (
            <div className="card p-6">
              <h2 className="font-semibold text-charcoal mb-4">Gallery</h2>
              <div className="grid grid-cols-3 gap-2.5">
                {entrepreneur.gallery.map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden bg-cream-dark">
                    <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="card p-6">
            <h2 className="font-semibold text-charcoal mb-4">Reviews {reviews.length > 0 && <span className="text-gray-400 font-normal text-sm">({reviews.length})</span>}</h2>
            {reviews.length === 0
              ? <p className="text-sm text-gray-400">No reviews yet.</p>
              : <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r._id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div className="w-8 h-8 rounded-full bg-teal text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {r.reviewer?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-charcoal leading-none">{r.reviewer?.name}</p>
                          <StarRating rating={r.rating} />
                        </div>
                        <span className="ml-auto text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed pl-10">{r.comment}</p>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="font-semibold text-charcoal text-sm mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>📧 {entrepreneur.user?.email}</li>
              {entrepreneur.user?.phone && <li>📱 {entrepreneur.user.phone}</li>}
              <li>📍 {[entrepreneur.location?.address, entrepreneur.location?.city].filter(Boolean).join(', ')}</li>
              {entrepreneur.location?.pincode && <li>📮 {entrepreneur.location.pincode}</li>}
            </ul>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-charcoal text-sm mb-3">Quick Stats</h3>
            <ul className="space-y-2 text-sm">
              {[['Experience', `${entrepreneur.experience} yrs`], ['Rating', `${entrepreneur.rating} / 5`], ['Reviews', entrepreneur.totalReviews]].map(([k, v]) => (
                <li key={k} className="flex justify-between">
                  <span className="text-gray-400">{k}</span>
                  <span className="font-medium text-charcoal">{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => { if (!user) { navigate('/login'); return } setModal(true) }} className="btn-primary w-full justify-center py-2.5 text-sm">
            Request a Service
          </button>
        </div>
      </div>

      {/* Request Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Request a Service">
        <form onSubmit={handleRequest} className="space-y-4">
          <div>
            <label className="label">What do you need?</label>
            <input className="input" placeholder="e.g. Shoe repair, custom kurta…" required
              value={form.serviceType} onChange={e => setForm(f => ({ ...f, serviceType: e.target.value }))} />
          </div>
          <div>
            <label className="label">Details</label>
            <textarea className="input resize-none" rows={3} placeholder="Describe your requirement…" required
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Preferred Date</label>
              <input type="date" className="input" value={form.preferredDate}
                onChange={e => setForm(f => ({ ...f, preferredDate: e.target.value }))} />
            </div>
            <div>
              <label className="label">Budget (₹)</label>
              <input type="number" className="input" placeholder="500"
                value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Your Location</label>
            <input className="input" placeholder="Area / address"
              value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setModal(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-60">
              {submitting ? 'Sending…' : 'Send Request'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
