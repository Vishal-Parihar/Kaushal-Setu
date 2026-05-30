import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import API from '../utils/api'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/common/StarRating'
import Modal from '../components/common/Modal'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'

const EMPTY_ADDR = { name: '', phone: '', address: '', city: '', pincode: '' }

export default function ProductDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [orderModal, setOrderModal] = useState(false)
  const [reviewModal, setReviewModal] = useState(false)
  const [orderForm, setOrderForm] = useState({ quantity: 1, deliveryAddress: { ...EMPTY_ADDR }, notes: '' })
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const addrChange = field => e =>
    setOrderForm(f => ({ ...f, deliveryAddress: { ...f.deliveryAddress, [field]: e.target.value } }))

  const handleOrder = async e => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setSubmitting(true)
    try {
      await API.post('/orders', { productId: id, ...orderForm })
      toast.success('Order placed!')
      setOrderModal(false)
      navigate('/dashboard/customer')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    setSubmitting(false)
  }

  const handleReview = async e => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setSubmitting(true)
    try {
      const res = await API.post('/reviews', { productId: id, ...reviewForm })
      setData(d => ({ ...d, reviews: [res.data.review, ...(d.reviews || [])] }))
      toast.success('Review submitted!')
      setReviewModal(false)
      setReviewForm({ rating: 5, comment: '' })
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    setSubmitting(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><Spinner size="lg" /></div>
  if (!data?.product) return <div className="min-h-screen flex items-center justify-center pt-16 text-gray-400">Product not found.</div>

  const { product, reviews = [] } = data
  const images = product.images?.length ? product.images : []
  const available = product.isAvailable && product.stock > 0
  const total = product.price * orderForm.quantity

  return (
    <div className="min-h-screen bg-cream pt-16">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-8">
          <Link to="/" className="hover:text-saffron transition-colors">Home</Link>
          <span>›</span>
          <Link to="/marketplace" className="hover:text-saffron transition-colors">Marketplace</Link>
          <span>›</span>
          <span className="text-charcoal">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10">

          {/* Images */}
          <div>
            <div className="rounded-xl2 overflow-hidden bg-cream-dark aspect-square mb-2.5">
              {images.length > 0 ? (
                <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                  <span className="text-7xl">🛍️</span>
                  <span className="text-sm mt-3 text-gray-400">No image uploaded</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-saffron' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal leading-tight">{product.name}</h1>
              <span className={`badge shrink-0 mt-1 ${available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {available ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-center gap-2.5 mb-4">
              <StarRating rating={product.rating} size="md" />
              <span className="text-xs text-gray-400">({product.totalReviews} reviews)</span>
            </div>

            <p className="text-3xl font-bold text-saffron mb-1">
              ₹{product.price}
              <span className="text-sm font-normal text-gray-400 ml-1.5">/ {product.unit || 'piece'}</span>
            </p>
            <p className="text-xs text-gray-400 mb-5">{product.stock} in stock</p>

            <p className="text-sm text-gray-500 leading-relaxed mb-5">{product.description}</p>

            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {product.tags.map(t => (
                  <span key={t} className="px-3 py-1 bg-cream-dark text-gray-500 text-xs rounded-full">{t}</span>
                ))}
              </div>
            )}

            {/* Seller card */}
            {product.entrepreneur && (
              <Link to={`/explore/${product.entrepreneur._id}`}
                className="flex items-center gap-3 p-3.5 bg-teal-light rounded-xl mb-6 hover:bg-teal/8 transition-colors group">
                <div className="w-9 h-9 rounded-full bg-teal text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {product.entrepreneur.businessName?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-teal text-sm leading-none group-hover:underline truncate">{product.entrepreneur.businessName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{product.entrepreneur.location?.city}</p>
                </div>
                <span className="text-teal/50 text-sm">›</span>
              </Link>
            )}

            <div className="flex gap-2.5">
              <button
                onClick={() => { if (!user) { navigate('/login'); return } setOrderModal(true) }}
                disabled={!available}
                className="btn-primary flex-1 justify-center py-2.5 text-sm"
              >
                Order Now
              </button>
              {user && (
                <button onClick={() => setReviewModal(true)} className="btn-outline px-4 text-sm">
                  Review
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <h2 className="font-display text-xl font-bold text-teal mb-5">
            Reviews {reviews.length > 0 && <span className="text-gray-400 font-normal text-base">({reviews.length})</span>}
          </h2>
          {reviews.length === 0 ? (
            <div className="card p-10 text-center text-gray-400 text-sm">
              No reviews yet. Be the first to share your experience.
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r._id} className="card p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-teal text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {r.reviewer?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-charcoal leading-none">{r.reviewer?.name}</p>
                      <StarRating rating={r.rating} />
                    </div>
                    <span className="ml-auto text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed pl-11">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      <Modal isOpen={orderModal} onClose={() => setOrderModal(false)} title={`Order — ${product.name}`}>
        <form onSubmit={handleOrder} className="space-y-3.5">
          <div>
            <label className="label">Quantity</label>
            <input type="number" min={1} max={product.stock} className="input"
              value={orderForm.quantity}
              onChange={e => setOrderForm(f => ({ ...f, quantity: Math.max(1, Math.min(parseInt(e.target.value) || 1, product.stock)) }))} />
            <p className="text-xs text-saffron font-semibold mt-1">Total: ₹{total}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Name</label><input className="input" required value={orderForm.deliveryAddress.name} onChange={addrChange('name')} /></div>
            <div><label className="label">Phone</label><input className="input" required value={orderForm.deliveryAddress.phone} onChange={addrChange('phone')} /></div>
          </div>
          <div>
            <label className="label">Address</label>
            <input className="input" required value={orderForm.deliveryAddress.address} onChange={addrChange('address')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">City</label><input className="input" required value={orderForm.deliveryAddress.city} onChange={addrChange('city')} /></div>
            <div><label className="label">Pincode</label><input className="input" value={orderForm.deliveryAddress.pincode} onChange={addrChange('pincode')} /></div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input resize-none" rows={2} value={orderForm.notes} onChange={e => setOrderForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setOrderModal(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-60">
              {submitting ? 'Placing…' : `Pay ₹${total}`}
            </button>
          </div>
        </form>
      </Modal>

      {/* Review Modal */}
      <Modal isOpen={reviewModal} onClose={() => setReviewModal(false)} title="Write a Review">
        <form onSubmit={handleReview} className="space-y-4">
          <div>
            <label className="label">Rating</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: n }))}
                  className={`text-2xl transition-transform hover:scale-110 ${n <= reviewForm.rating ? 'text-amber-400' : 'text-gray-200'}`}>
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Your thoughts</label>
            <textarea className="input resize-none" rows={4} required placeholder="How was your experience?"
              value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setReviewModal(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-60">
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}