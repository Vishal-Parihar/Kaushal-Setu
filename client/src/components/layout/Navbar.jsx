import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  { to: '/explore', label: 'Explore Artisans' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setDropOpen(false)
  }, [pathname])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const dashLink = user?.role === 'admin' ? { to: '/admin', label: 'Admin Panel' }
    : user?.role === 'entrepreneur' ? { to: '/dashboard/entrepreneur', label: 'Dashboard' }
    : { to: '/dashboard/customer', label: 'My Orders' }

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-soft' : 'bg-[#2B6D8A]'}`}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <span className="text-2xl">🪡</span>
          <div className="leading-none">
            <span className="font-display font-bold text-saffron text-[17px] block">Kaushal</span>
            <span className="font-display text-teal- text-[10px] tracking-[3px] block -mt-0.5">SETU</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${pathname === l.to ? 'text-saffron bg-saffron-50' : `${scrolled ? 'text-charcoal' : 'text-white/90'} hover:text-saffron hover:bg-saffron-50`}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {user ? (
            <div className="relative" ref={dropRef}>
              <button onClick={() => setDropOpen(v => !v)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-cream hover:bg-cream-dark transition-colors">
                <div className="w-7 h-7 rounded-full bg-saffron text-white text-xs font-bold flex items-center justify-center shrink-0 overflow-hidden">
                  {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user.name[0].toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-charcoal">{user.name.split(' ')[0]}</span>
                <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {dropOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] w-44 bg-white border border-gray-100 rounded-xl shadow-lift overflow-hidden animate-fade-up">
                  <Link to={dashLink.to} className="block px-4 py-2.5 text-sm font-medium text-charcoal hover:bg-cream transition-colors">{dashLink.label}</Link>
                  <Link to="/profile" className="block px-4 py-2.5 text-sm font-medium text-charcoal hover:bg-cream transition-colors">Profile</Link>
                  <div className="h-px bg-gray-100 mx-3" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${scrolled ? 'text-charcoal hover:text-saffron' : 'text-white/90 hover:text-white'}`}>Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Join Free</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button onClick={() => setMobileOpen(v => !v)} className="md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors">
          <div className="space-y-1.5 w-5">
            <span className={`block h-0.5 bg-charcoal transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-charcoal transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-0.5 bg-charcoal transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-white border-t border-gray-100 ${mobileOpen ? 'max-h-80 shadow-card' : 'max-h-0'}`}>
        <div className="px-4 py-3 flex flex-col gap-0.5">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === l.to ? 'bg-saffron-50 text-saffron' : 'text-charcoal hover:bg-cream'}`}>{l.label}</Link>
          ))}
          <div className="h-px bg-gray-100 my-1" />
          {user ? (
            <>
              <Link to={dashLink.to} className="px-4 py-2.5 rounded-lg text-sm font-medium text-charcoal hover:bg-cream">{dashLink.label}</Link>
              <button onClick={handleLogout} className="text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50">Logout</button>
            </>
          ) : (
            <div className="flex gap-2 pt-1 pb-1">
              <Link to="/login" className="btn-outline flex-1 text-sm py-2">Login</Link>
              <Link to="/register" className="btn-primary flex-1 text-sm py-2">Join Free</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
