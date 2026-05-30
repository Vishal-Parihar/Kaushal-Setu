import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/api'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/common/StatusBadge'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([API.get('/orders/my'), API.get('/service-requests/my')])
      .then(([o, r]) => { setOrders(o.data.orders || []); setRequests(r.data.requests || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: '📦', color: 'bg-blue-50 text-blue-700' },
    { label: 'Completed', value: orders.filter(o => o.status === 'completed').length, icon: '✅', color: 'bg-green-50 text-green-700' },
    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: '⏳', color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Requests', value: requests.length, icon: '🔧', color: 'bg-purple-50 text-purple-700' },
  ]

  return (
    <div className="min-h-screen bg-cream pt-16">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-7">
          <h1 className="font-display text-2xl font-bold text-teal">My Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">Welcome back, {user?.name?.split(' ')[0]}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
          {stats.map(s => (
            <div key={s.label} className={`card p-4 ${s.color}`}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs font-medium opacity-65 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-6 w-fit">
          {[['orders', `Orders (${orders.length})`], ['requests', `Requests (${requests.length})`]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-saffron text-white' : 'text-gray-500 hover:text-charcoal'}`}>
              {label}
            </button>
          ))}
        </div>

        {loading
          ? <div className="flex justify-center py-16"><Spinner /></div>
          : tab === 'orders'
            ? orders.length === 0
              ? <EmptyState icon="📦" title="No orders yet" description="Browse the marketplace and place your first order." action={<Link to="/marketplace" className="btn-primary text-sm px-6">Shop Now</Link>} />
              : <div className="space-y-3">
                  {orders.map(o => (
                    <div key={o._id} className="card p-4 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream-dark shrink-0">
                        {o.product?.images?.[0] ? (
                          <img src={o.product.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-charcoal text-sm truncate">{o.product?.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">From {o.entrepreneur?.user?.name} &nbsp;·&nbsp; Qty: {o.quantity}</p>
                        <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-saffron font-bold text-sm">₹{o.totalAmount}</p>
                        <div className="mt-1"><StatusBadge status={o.status} /></div>
                      </div>
                    </div>
                  ))}
                </div>
            : requests.length === 0
              ? <EmptyState icon="🔧" title="No service requests" description="Visit an artisan's profile to send a service request." action={<Link to="/explore" className="btn-primary text-sm px-6">Find Artisans</Link>} />
              : <div className="space-y-3">
                  {requests.map(r => (
                    <div key={r._id} className="card p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-charcoal text-sm">{r.serviceType}</p>
                          <p className="text-xs text-gray-400 mt-0.5">To: {r.entrepreneur?.businessName || r.entrepreneur?.user?.name}</p>
                          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{r.description}</p>
                          {r.entrepreneurResponse && (
                            <div className="mt-3 p-3 bg-teal-light rounded-lg text-xs text-teal leading-relaxed">
                              <span className="font-semibold">Response: </span>{r.entrepreneurResponse}
                              {r.agreedPrice && <span className="font-bold ml-1">· ₹{r.agreedPrice}</span>}
                            </div>
                          )}
                        </div>
                        <StatusBadge status={r.status} />
                      </div>
                      <p className="text-xs text-gray-400 mt-3">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  ))}
                </div>
        }
      </div>
    </div>
  )
}