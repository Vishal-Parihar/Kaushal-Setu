import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import API from '../utils/api'
import EntrepreneurCard from '../components/entrepreneur/EntrepreneurCard'
import Pagination from '../components/common/Pagination'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'

const CATS = ['cobbler', 'potter', 'tailor', 'artisan', 'vendor', 'other']

export default function Explore() {
  const [searchParams] = useSearchParams()
  const [entrepreneurs, setEntrepreneurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    city: '',
  })

  const fetchData = async (f = filters, p = page) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: p, limit: 12 })
      if (f.search) params.append('search', f.search)
      if (f.category) params.append('category', f.category)
      if (f.city) params.append('city', f.city)
      const { data } = await API.get(`/entrepreneurs?${params}`)
      setEntrepreneurs(data.entrepreneurs || [])
      setTotal(data.total || 0)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [page])

  const handleSearch = e => { e.preventDefault(); setPage(1); fetchData(filters, 1) }
  const toggleCat = cat => {
    const next = { ...filters, category: filters.category === cat ? '' : cat }
    setFilters(next); setPage(1); fetchData(next, 1)
  }

  return (
    <div className="min-h-screen bg-cream pt-16">
      {/* Header */}
      <div className="page-header">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-1.5">Explore Artisans</h1>
          <p className="text-white/55 text-sm mb-7">Find skilled micro-entrepreneurs near you</p>

          <form onSubmit={handleSearch} className="flex flex-wrap gap-2.5 max-w-2xl">
            <input value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              placeholder="Search by name or skill…"
              className="input flex-1 min-w-48 bg-white/12 border-white/20 text-white placeholder:text-white/40 focus:bg-white/18 focus:border-white/40" />
            <input value={filters.city} onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
              placeholder="City"
              className="input w-32 bg-white/12 border-white/20 text-white placeholder:text-white/40 focus:bg-white/18 focus:border-white/40" />
            <button type="submit" className="btn-primary bg-saffron px-6 text-sm">Search</button>
          </form>

          <div className="flex flex-wrap gap-2 mt-5">
            {CATS.map(cat => (
              <button key={cat} onClick={() => toggleCat(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${filters.category === cat ? 'bg-saffron text-white' : 'bg-white/12 text-white/65 hover:bg-white/20'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">{loading ? '' : `${total} artisan${total !== 1 ? 's' : ''} found`}</p>
          {filters.category && (
            <button onClick={() => toggleCat(filters.category)} className="text-xs text-saffron hover:underline">Clear filter ×</button>
          )}
        </div>

        {loading
          ? <div className="py-24 flex justify-center"><Spinner size="lg" /></div>
          : entrepreneurs.length > 0
            ? <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {entrepreneurs.map(e => <EntrepreneurCard key={e._id} entrepreneur={e} />)}
                </div>
                <Pagination page={page} totalPages={Math.ceil(total / 12)} onChange={p => { setPage(p); window.scrollTo(0, 0) }} />
              </>
            : <EmptyState icon="🔍" title="No artisans found" description="Try a different search term or category." />
        }
      </div>
    </div>
  )
}
