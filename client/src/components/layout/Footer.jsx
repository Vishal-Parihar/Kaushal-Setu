import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-teal text-white pt-12 pb-7">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">

          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🪡</span>
              <div className="leading-none">
                <span className="font-display font-bold text-saffron text-base block">Kaushal</span>
                <span className="font-display text-white/50 text-[10px] tracking-[3px] block">SETU</span>
              </div>
            </div>
            <p className="text-white/55 text-sm leading-relaxed max-w-xs">
              A digital bridge connecting India's skilled micro-entrepreneurs with customers who value local craft.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {[['Artisans', '/explore'], ['Marketplace', '/marketplace'], ['About', '/about']].map(([l, h]) => (
                <li key={h}><Link to={h} className="text-sm text-white/60 hover:text-saffron-light transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Artisans */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">For Artisans</h4>
            <ul className="space-y-2.5">
              {[['Register', '/register'], ['Dashboard', '/dashboard/entrepreneur'], ['List Products', '/dashboard/entrepreneur']].map(([l, h]) => (
                <li key={l}><Link to={h} className="text-sm text-white/60 hover:text-saffron-light transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
          <span>© {new Date().getFullYear()} KaushalSetu. All rights reserved.</span>
          <span>Made for India's micro-entrepreneurs</span>
        </div>
      </div>
    </footer>
  )
}
