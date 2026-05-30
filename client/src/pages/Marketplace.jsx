import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../utils/api'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/product/ProductCard'
import Modal from '../components/common/Modal'
import Pagination from '../components/common/Pagination'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import toast from 'react-hot-toast'

const EMPTY_ADDR = { name: '', phone: '', address: '', city: '', pincode: '' }

export default function Marketplace() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ search: '', minPrice: '', maxPrice: '' })
  const [orderTarget, setOrderTarget] = useState(null)
  const [orderForm, setOrderForm] = useState({ quantity: 1, deliveryAddress: { ...EMPTY_ADDR }, notes: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchProducts = async (f = filters, p = page) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: p, limit: 12 })
      if (f.search) params.append('search', f.search)
      if (f.minPrice) params.append('minPrice', f.minPrice)
      if (f.maxPrice) params.append('maxPrice', f.maxPrice)
      const { data } = await API.get(`/products?${params}`)
      setProducts(data.products || [])
      setTotal(data.total || 0)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [page])

  const handleSearch = e => { e.preventDefault(); setPage(1); fetchProducts(filters, 1) }

  const openOrder = prod => {
    if (!user) { navigate('/login'); return }
    setOrderTarget(prod)
    setOrderForm({ quantity: 1, deliveryAddress: { ...EMPTY_ADDR }, notes: '' })
  }

  const handleOrder = async e => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await API.post('/orders', { productId: orderTarget._id, ...orderForm })
      toast.success('Order placed!')
      setOrderTarget(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    }
    setSubmitting(false)
  }

  const addrChange = field => e =>
    setOrderForm(f => ({ ...f, deliveryAddress: { ...f.deliveryAddress, [field]: e.target.value } }))

  const total_ = orderTarget ? orderTarget.price * orderForm.quantity : 0

  return (
    <div className="min-h-screen bg-cream pt-16">
      <div className="page-header">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-1.5">Marketplace</h1>
          <p className="text-white/55 text-sm mb-7">Handcrafted products from local artisans</p>
          <form onSubmit={handleSearch} className="flex flex-wrap gap-2.5 max-w-2xl">
            <input value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              placeholder="Search products…"
              className="input flex-1 min-w-48 bg-white/12 border-white/20 text-white placeholder:text-white/40 focus:bg-white/18 focus:border-white/40" />
            <input type="number" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
              placeholder="Min ₹" className="input w-24 bg-white/12 border-white/20 text-white placeholder:text-white/40" />
            <input type="number" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
              placeholder="Max ₹" className="input w-24 bg-white/12 border-white/20 text-white placeholder:text-white/40" />
            <button type="submit" className="btn-primary bg-saffron px-6 text-sm">Search</button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-sm text-gray-400 mb-5">{!loading && `${total} product${total !== 1 ? 's' : ''}`}</p>
        {loading
          ? <div className="py-24 flex justify-center"><Spinner size="lg" /></div>
          : products.length > 0
            ? <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {products.map(p => <ProductCard key={p._id} product={p} onOrder={openOrder} />)}
                </div>
                <Pagination page={page} totalPages={Math.ceil(total / 12)} onChange={p => { setPage(p); window.scrollTo(0, 0) }} />
              </>
            : <EmptyState icon="🛍️" title="No products found" description="Try adjusting the search or check back later." />
        }
      </div>

      {/* Order Modal */}
      <Modal isOpen={!!orderTarget} onClose={() => setOrderTarget(null)} title={orderTarget?.name}>
        <form onSubmit={handleOrder} className="space-y-4">
          <div>
            <label className="label">Quantity</label>
            <input type="number" min={1} max={orderTarget?.stock} className="input"
              value={orderForm.quantity}
              onChange={e => setOrderForm(f => ({ ...f, quantity: Math.max(1, Math.min(parseInt(e.target.value) || 1, orderTarget?.stock)) }))} />
            <p className="text-xs text-saffron font-semibold mt-1">Total: ₹{total_}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Your Name</label><input className="input" required value={orderForm.deliveryAddress.name} onChange={addrChange('name')} /></div>
            <div><label className="label">Phone</label><input className="input" required value={orderForm.deliveryAddress.phone} onChange={addrChange('phone')} /></div>
          </div>
          <div><label className="label">Street / Area</label><input className="input" required value={orderForm.deliveryAddress.address} onChange={addrChange('address')} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">City</label><input className="input" required value={orderForm.deliveryAddress.city} onChange={addrChange('city')} /></div>
            <div><label className="label">Pincode</label><input className="input" value={orderForm.deliveryAddress.pincode} onChange={addrChange('pincode')} /></div>
          </div>
          <div><label className="label">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea className="input resize-none" rows={2} value={orderForm.notes} onChange={e => setOrderForm(f => ({ ...f, notes: e.target.value }))} /></div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setOrderTarget(null)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-60">
              {submitting ? 'Placing…' : `Order · ₹${total_}`}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
