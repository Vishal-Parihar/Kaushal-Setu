import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Explore from './pages/Explore'
import EntrepreneurDetail from './pages/EntrepreneurDetail'
import Marketplace from './pages/Marketplace'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Profile from './pages/Profile'
import CustomerDashboard from './pages/CustomerDashboard'
import EntrepreneurDashboard from './pages/EntrepreneurDashboard'
import AdminDashboard from './pages/AdminDashboard'

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

const Layout = ({ children, noFooter }) => (
  <>
    <Navbar />
    <main>{children}</main>
    {!noFooter && <Footer />}
  </>
)

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-cream pt-16 text-center px-4">
    <span className="text-7xl mb-5">🧵</span>
    <h1 className="font-display text-4xl font-bold text-teal mb-2">Page not found</h1>
    <p className="text-gray-400 text-sm mb-8">This thread seems to have unraveled.</p>
    <a href="/" className="btn-primary px-7 py-2.5 text-sm">Back to Home</a>
  </div>
)

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/explore" element={<Layout><Explore /></Layout>} />
      <Route path="/explore/:id" element={<Layout><EntrepreneurDetail /></Layout>} />
      <Route path="/marketplace" element={<Layout><Marketplace /></Layout>} />
      <Route path="/marketplace/:id" element={<Layout><ProductDetail /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
      <Route path="/dashboard/customer" element={<ProtectedRoute roles={['customer']}><Layout noFooter><CustomerDashboard /></Layout></ProtectedRoute>} />
      <Route path="/dashboard/entrepreneur" element={<ProtectedRoute roles={['entrepreneur']}><Layout noFooter><EntrepreneurDashboard /></Layout></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Layout noFooter><AdminDashboard /></Layout></ProtectedRoute>} />
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'Sora, sans-serif', fontSize: '13px', borderRadius: '10px' },
            success: { iconTheme: { primary: '#E8650A', secondary: '#fff' } },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
