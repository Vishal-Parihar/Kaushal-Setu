import { Link } from 'react-router-dom'

const VALUES = [
  { icon: '🤝', title: 'Empowerment', desc: 'We put digital tools in the hands of artisans who have always relied on word-of-mouth.' },
  { icon: '🌱', title: 'Sustainability', desc: 'Buying local reduces carbon footprint and keeps traditional crafts alive for generations.' },
  { icon: '💡', title: 'Inclusion', desc: 'We make onboarding simple — digital literacy should never be a barrier to earning.' },
  { icon: '🔒', title: 'Trust', desc: 'Verified profiles, transparent pricing and a review system build confidence on both sides.' },
]

export default function About() {
  return (
    <div className="min-h-screen bg-cream pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal to-teal-mid py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-5xl block mb-5">🪡</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">About KaushalSetu</h1>
          <p className="text-white/60 text-base leading-relaxed">
            <em>Kaushal</em> means skill. <em>Setu</em> means bridge. Together we bridge the gap between India's skilled micro-entrepreneurs and the customers who need them.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-title mb-4">Our Mission</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">
              Millions of cobblers, potters, tailors and artisans across India possess extraordinary skills but have no digital presence. They rely entirely on foot traffic in a world that's rapidly moving online.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-7">
              KaushalSetu gives every local micro-entrepreneur a professional profile, a product storefront and a direct channel to receive service requests — without needing any technical skills to get started.
            </p>
            <Link to="/explore" className="btn-primary px-7 py-2.5 text-sm">Explore Artisans →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['2,400+','Artisans'],['18K+','Customers'],['52','Cities'],['₹12L+','Artisan Earnings']].map(([v, l]) => (
              <div key={l} className="card p-6 text-center">
                <p className="font-display text-3xl font-bold text-saffron">{v}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title mb-2">What We Stand For</h2>
            <p className="text-gray-400 text-sm">Principles that guide every decision we make</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {VALUES.map(v => (
              <div key={v.title} className="card p-6 text-center hover:shadow-card hover:-translate-y-0.5 transition-all duration-200">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-semibold text-charcoal text-sm mb-2">{v.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title mb-2">Who We Serve</h2>
          <p className="text-gray-400 text-sm mb-9">From heritage crafts to everyday services</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[['🥿','Cobblers'],['🏺','Potters'],['🧵','Tailors'],['🎨','Artisans'],['🛒','Vendors'],['🔧','Repair Services'],['🌺','Florists'],['🍲','Home Chefs']].map(([e, l]) => (
              <div key={l} className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full border border-gray-200 shadow-soft hover:border-saffron hover:text-saffron transition-all text-sm font-medium cursor-default">
                <span className="text-lg">{e}</span>{l}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-saffron to-saffron-light text-center px-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Ready to get started?</h2>
        <p className="text-white/75 text-sm mb-7 max-w-md mx-auto">Join thousands of artisans and customers already on the platform.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/register" className="px-7 py-3 bg-white text-saffron font-semibold text-sm rounded-lg hover:bg-cream transition-colors">Join as Artisan</Link>
          <Link to="/explore" className="px-7 py-3 border-2 border-white/60 text-white font-semibold text-sm rounded-lg hover:bg-white/10 transition-colors">Find Artisans</Link>
        </div>
      </section>
    </div>
  )
}
