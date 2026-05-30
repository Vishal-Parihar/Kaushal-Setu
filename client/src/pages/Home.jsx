import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/api'
import EntrepreneurCard from '../components/entrepreneur/EntrepreneurCard'
import ProductCard from '../components/product/ProductCard'
import Spinner from '../components/common/Spinner'

const CATEGORIES = [
  { id: 'cobbler',  label: 'Cobbler',  icon: '🥿', desc: 'Shoes repaired right' },
  { id: 'potter',   label: 'Potter',   icon: '🏺', desc: 'Clay & terracotta' },
  { id: 'tailor',   label: 'Tailor',   icon: '🧵', desc: 'Custom fits' },
  { id: 'artisan',  label: 'Artisan',  icon: '🎨', desc: 'Handmade crafts' },
  { id: 'vendor',   label: 'Vendor',   icon: '🛒', desc: 'Local specialties' },
]

const STATS = [
  { value: '2,400+', label: 'Artisans' },
  { value: '18,000+', label: 'Customers' },
  { value: '52', label: 'Cities' },
  { value: '98%', label: 'Satisfaction' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([API.get('/entrepreneurs?limit=4'), API.get('/products?limit=4')])
      .then(([e, p]) => { setFeatured(e.data.entrepreneurs || []); setProducts(p.data.products || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-teal via-teal to-teal-mid overflow-hidden pt-16">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 15% 60%, rgba(232,101,10,0.18) 0%, transparent 55%), radial-gradient(ellipse at 85% 25%, rgba(255,140,58,0.12) 0%, transparent 50%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-xs text-white/75 mb-7">
              🇮🇳 &nbsp;India's Artisan Marketplace
            </span>
            <h1 className="font-display text-5xl md:text-[3.6rem] font-bold text-white leading-[1.12] mb-5">
              Discover Local<br />
              <span className="text-saffron-light">Kaushal</span> Near You
            </h1>
            <p className="text-white/65 text-base leading-relaxed mb-8 max-w-sm">
              Find cobblers, potters, tailors and artisans in your city. Book services directly, buy handmade goods, support local skill.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/explore" className="btn-primary px-7 py-3 text-sm">
                Explore Artisans →
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 px-7 py-3 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-all">
                Join as Artisan
              </Link>
            </div>
          </div>

          <div className="hidden md:grid grid-cols-2 gap-3">
            {CATEGORIES.slice(0, 4).map((cat) => (
              <Link key={cat.id} to={`/explore?category=${cat.id}`}
                className="bg-white/8 backdrop-blur border border-white/15 rounded-xl2 p-5 hover:bg-white/15 transition-all duration-200 group">
                <div className="text-3xl mb-2.5">{cat.icon}</div>
                <div className="font-semibold text-white text-sm">{cat.label}</div>
                <div className="text-white/45 text-xs mt-0.5">{cat.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>



{/* commented code orange bd description */}



      {/* Stats bar
      <div className="bg-saffron">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="font-display text-2xl md:text-3xl font-bold text-white">{s.value}</div>
              <div className="text-white/65 text-xs mt-0.5 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Browse by skill */}
      <section className="py-16 px-6 bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h2 className="section-title mb-2">Browse by Skill</h2>
            <p className="text-gray-500 text-sm">Find exactly who you need</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CATEGORIES.map(cat => (
              <Link key={cat.id} to={`/explore?category=${cat.id}`}
                className="card p-5 text-center hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 group">
                <div className="text-3xl mb-2.5">{cat.icon}</div>
                <div className="font-semibold text-charcoal text-sm group-hover:text-saffron transition-colors">{cat.label}</div>
                <div className="text-gray-400 text-xs mt-0.5">{cat.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artisans */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="section-title mb-1">Featured Artisans</h2>
              <p className="text-gray-400 text-sm">Top-rated talent on the platform</p>
            </div>
            <Link to="/explore" className="text-sm font-semibold text-saffron hover:underline underline-offset-2">View all →</Link>
          </div>
          {loading ? <div className="py-16 flex justify-center"><Spinner size="lg" /></div>
            : featured.length > 0
              ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{featured.map(e => <EntrepreneurCard key={e._id} entrepreneur={e} />)}</div>
              : <div className="text-center py-16 text-gray-400"><div className="text-5xl mb-3">🎭</div><p className="text-sm">No artisans yet. <Link to="/register" className="text-saffron underline">Be the first!</Link></p></div>
          }
        </div>
      </section>

      {/* Marketplace preview */}
      <section className="py-16 px-6 bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="section-title mb-1">From the Marketplace</h2>
              <p className="text-gray-400 text-sm">Handmade products, shipped from artisans</p>
            </div>
            <Link to="/marketplace" className="text-sm font-semibold text-saffron hover:underline underline-offset-2">Shop all →</Link>
          </div>
          {loading ? <div className="py-16 flex justify-center"><Spinner size="lg" /></div>
            : products.length > 0
              ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
              : <div className="text-center py-16 text-gray-400"><div className="text-5xl mb-3">🛍️</div><p className="text-sm">Products coming soon.</p></div>
          }
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title mb-2">How it Works</h2>
            <p className="text-gray-400 text-sm">Four simple steps to connect</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: '01', icon: '🔍', title: 'Browse', desc: 'Search by skill, city, or category' },
              { step: '02', icon: '👤', title: 'View Profile', desc: 'Check portfolio and pricing' },
              { step: '03', icon: '📋', title: 'Place Request', desc: 'Order a product or book a service' },
              { step: '04', icon: '⭐', title: 'Review', desc: 'Share your experience' },
            ].map(item => (
              <div key={item.step} className="relative text-center px-2">
                <div className="w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center mx-auto mb-3 text-xl">{item.icon}</div>
                <div className="absolute -top-1 left-1/2 -translate-x-6 translate-x-3 w-5 h-5 rounded-full bg-saffron text-white text-[10px] font-bold flex items-center justify-center">{item.step}</div>
                <h3 className="font-semibold text-charcoal text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-teal to-teal-mid text-center px-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Have a skill? Earn from it.</h2>
        <p className="text-white/60 text-sm mb-7 max-w-md mx-auto">Register on KaushalSetu and reach thousands of customers in your city — no middlemen, no hidden charges.</p>
        <Link to="/register" className="inline-flex items-center gap-2 bg-saffron text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-saffron-dark transition-all text-sm">
          Register for Free →
        </Link>
      </section>
    </div>
  )
}