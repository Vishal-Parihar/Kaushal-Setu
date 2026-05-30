import { useState, useEffect } from 'react'
import API from '../utils/api'
import StatusBadge from '../components/common/StatusBadge'
import CategoryBadge from '../components/common/CategoryBadge'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [pending, setPending] = useState([])
  const [users, setUsers] = useState([])
  const [entrepreneurs, setEntrepreneurs] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([API.get('/admin/analytics'), API.get('/admin/pending-entrepreneurs')])
      .then(([a, p]) => {
        setStats(a.data.stats)
        setRecentOrders(a.data.recentOrders || [])
        setPending(p.data.entrepreneurs || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const load = async (type) => {
    try {
      if (type === 'users' && !users.length) { const { data } = await API.get('/admin/users'); setUsers(data.users || []) }
      if (type === 'entrepreneurs' && !entrepreneurs.length) { const { data } = await API.get('/admin/entrepreneurs'); setEntrepreneurs(data.entrepreneurs || []) }
      if (type === 'orders' && !allOrders.length) { const { data } = await API.get('/admin/orders'); setAllOrders(data.orders || []) }
    } catch {}
  }

  const handleApprove = async (id, approve) => {
    try {
      await API.put(`/admin/entrepreneurs/${id}/approve`, { isApproved: approve })
      setPending(prev => prev.filter(e => e._id !== id))
      toast.success(approve ? 'Artisan approved!' : 'Artisan rejected')
    } catch { toast.error('Failed') }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><Spinner size="lg" /></div>

  const TABS = ['overview', 'approvals', 'users', 'entrepreneurs', 'orders']
  const statCards = stats ? [
    { label: 'Customers', value: stats.totalUsers, icon: '👥', c: 'bg-blue-50 text-blue-700' },
    { label: 'Artisans', value: stats.totalEntrepreneurs, icon: '🎨', c: 'bg-purple-50 text-purple-700' },
    { label: 'Orders', value: stats.totalOrders, icon: '📦', c: 'bg-yellow-50 text-yellow-700' },
    { label: 'Products', value: stats.totalProducts, icon: '🛍️', c: 'bg-pink-50 text-pink-700' },
    { label: 'Pending', value: stats.pendingApprovals, icon: '⏳', c: 'bg-orange-50 text-orange-700' },
    { label: 'Revenue', value: `₹${stats.totalRevenue}`, icon: '💰', c: 'bg-green-50 text-green-700' },
  ] : []

  return (
    <div className="min-h-screen bg-cream pt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-7">
          <h1 className="font-display text-2xl font-bold text-teal">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-0.5">KaushalSetu Platform Management</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-7">
            {statCards.map(s => (
              <div key={s.label} className={`card p-4 ${s.c}`}>
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-xs font-medium opacity-65 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 flex-wrap bg-white rounded-xl p-1 border border-gray-100 mb-6">
          {TABS.map(t => (
            <button key={t} onClick={() => { setTab(t); load(t) }}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-teal text-white' : 'text-gray-500 hover:text-charcoal'}`}>
              {t}
              {t === 'approvals' && pending.length > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pending.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-charcoal text-sm">Recent Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream">
                  <tr className="text-left text-xs text-gray-400">
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Product</th>
                    <th className="px-5 py-3 font-medium">Artisan</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o._id} className="border-t border-gray-50 hover:bg-cream/60 transition-colors">
                      <td className="px-5 py-3 font-medium text-charcoal">{o.customer?.name}</td>
                      <td className="px-5 py-3 text-gray-500">{o.product?.name}</td>
                      <td className="px-5 py-3 text-gray-500">{o.entrepreneur?.user?.name}</td>
                      <td className="px-5 py-3 font-semibold text-saffron">₹{o.totalAmount}</td>
                      <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentOrders.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">No orders yet</div>}
            </div>
          </div>
        )}

        {/* Approvals */}
        {tab === 'approvals' && (
          pending.length === 0
            ? <EmptyState icon="✅" title="All caught up!" description="No pending approvals right now." />
            : <div className="space-y-3">
                {pending.map(e => (
                  <div key={e._id} className="card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-charcoal">{e.businessName}</span>
                        <CategoryBadge category={e.category} />
                      </div>
                      <p className="text-xs text-gray-400">{e.user?.name} &nbsp;·&nbsp; {e.user?.email}</p>
                      {e.location && <p className="text-xs text-gray-400">📍 {e.location.city}, {e.location.state}</p>}
                      {e.description && <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{e.description}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleApprove(e._id, true)} className="btn-primary text-xs py-1.5 px-5">Approve</button>
                      <button onClick={() => handleApprove(e._id, false)} className="text-xs py-1.5 px-5 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream"><tr className="text-left text-xs text-gray-400">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                </tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-t border-gray-50 hover:bg-cream/60 transition-colors">
                      <td className="px-5 py-3 font-medium text-charcoal">{u.name}</td>
                      <td className="px-5 py-3 text-gray-500">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={`badge capitalize ${u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'entrepreneur' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">No users loaded</div>}
            </div>
          </div>
        )}

        {/* Entrepreneurs */}
        {tab === 'entrepreneurs' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream"><tr className="text-left text-xs text-gray-400">
                  <th className="px-5 py-3 font-medium">Business</th>
                  <th className="px-5 py-3 font-medium">Owner</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">City</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Rating</th>
                </tr></thead>
                <tbody>
                  {entrepreneurs.map(e => (
                    <tr key={e._id} className="border-t border-gray-50 hover:bg-cream/60 transition-colors">
                      <td className="px-5 py-3 font-medium text-charcoal">{e.businessName}</td>
                      <td className="px-5 py-3 text-gray-500">{e.user?.name}</td>
                      <td className="px-5 py-3"><CategoryBadge category={e.category} /></td>
                      <td className="px-5 py-3 text-gray-500">{e.location?.city}</td>
                      <td className="px-5 py-3">
                        <span className={`badge ${e.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{e.isApproved ? 'Approved' : 'Pending'}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">⭐ {e.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {entrepreneurs.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">No data loaded</div>}
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream"><tr className="text-left text-xs text-gray-400">
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Artisan</th>
                  <th className="px-5 py-3 font-medium">Qty</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr></thead>
                <tbody>
                  {allOrders.map(o => (
                    <tr key={o._id} className="border-t border-gray-50 hover:bg-cream/60 transition-colors">
                      <td className="px-5 py-3 font-medium text-charcoal">{o.customer?.name}</td>
                      <td className="px-5 py-3 text-gray-500">{o.product?.name}</td>
                      <td className="px-5 py-3 text-gray-500">{o.entrepreneur?.user?.name}</td>
                      <td className="px-5 py-3">{o.quantity}</td>
                      <td className="px-5 py-3 font-semibold text-saffron">₹{o.totalAmount}</td>
                      <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-5 py-3 text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {allOrders.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">No orders loaded</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
