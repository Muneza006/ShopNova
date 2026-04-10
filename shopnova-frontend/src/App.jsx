import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Loader from './components/common/Loader'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import CustomerDashboard from './pages/CustomerDashboard'
import WishlistPage from './pages/WishlistPage'
import CategoryPage from './pages/CategoryPage'
import DealsPage from './pages/DealsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import HowToBuyPage from './pages/HowToBuyPage'
import ReturnsPage from './pages/ReturnsPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import NotFoundPage from './pages/NotFoundPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import OAuth2CallbackPage from './pages/OAuth2CallbackPage'
import QrConfirmPage from './pages/QrConfirmPage'
import LoginForm from './components/user/LoginForm'
import SignUpForm from './components/user/SignUpForm'
import ForgotPasswordForm from './components/user/ForgotPasswordForm'
import AdminDashboard from './pages/AdminDashboard'
import { LanguageProvider } from './context/LanguageContext'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function AppContent() {
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [loading, setLoading] = useState(true)

  // Cart state — persisted in localStorage
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]') } catch { return [] }
  })

  // Wishlist state — persisted in localStorage
  const [wishlistItems, setWishlistItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]') } catch { return [] }
  })

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0)
  const wishlistCount = wishlistItems.length

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      const updated = existing
        ? prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...product, quantity: 1 }]
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id)
    setCartItems(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, quantity } : i)
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  const removeFromCart = (id) => {
    setCartItems(prev => {
      const updated = prev.filter(i => i.id !== id)
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  const clearCart = () => { setCartItems([]); localStorage.removeItem('cart') }

  const toggleWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.find(i => i.id === product.id)
      const updated = exists ? prev.filter(i => i.id !== product.id) : [...prev, product]
      localStorage.setItem('wishlist', JSON.stringify(updated))
      return updated
    })
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {}
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    const user = userData.user || userData
    const token = userData.token
    if (token) localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    setShowLogin(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!location.pathname.startsWith('/admin') && location.pathname !== '/account' && location.pathname !== '/dashboard' && (
        <Header
          categoriesWithSubs={[]}
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          user={user}
          onLoginClick={() => setShowLogin(true)}
          onLogout={handleLogout}
        />
      )}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage user={user} onAddToCart={addToCart} wishlistItems={wishlistItems} onToggleWishlist={toggleWishlist} />} />
          <Route path="/products" element={<ProductsPage products={[]} onAddToCart={addToCart} wishlistItems={wishlistItems} onToggleWishlist={toggleWishlist} />} />
          <Route path="/product/:id" element={<ProductDetailPage onAddToCart={addToCart} user={user} onLoginClick={() => setShowLogin(true)} wishlistItems={wishlistItems} onToggleWishlist={toggleWishlist} />} />
          <Route path="/category/:slug" element={<CategoryPage onAddToCart={addToCart} wishlistItems={wishlistItems} onToggleWishlist={toggleWishlist} />} />
          <Route path="/cart" element={<CartPage cartItems={cartItems} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} user={user} onLoginClick={() => setShowLogin(true)} />} />
          <Route path="/checkout" element={<CheckoutPage cartItems={cartItems} user={user} onOrderSuccess={clearCart} />} />
          <Route path="/account" element={<CustomerDashboard user={user} onLogout={handleLogout} wishlistItems={wishlistItems} cartItems={cartItems} />} />
          <Route path="/dashboard" element={<CustomerDashboard user={user} onLogout={handleLogout} wishlistItems={wishlistItems} cartItems={cartItems} />} />
          <Route path="/wishlist" element={<WishlistPage wishlistItems={wishlistItems} onRemove={(id) => toggleWishlist({id})} onAddToCart={addToCart} />} />
          <Route path="/deals" element={<DealsPage products={[]} onAddToCart={addToCart} wishlistItems={wishlistItems} onToggleWishlist={toggleWishlist} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/how-to-buy" element={<HowToBuyPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />
          <Route path="/auth/qr/confirm" element={<QrConfirmPage user={user} />} />
          <Route path="/admin" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
          <Route path="/admin/*" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      {!location.pathname.startsWith('/admin') && location.pathname !== '/account' && location.pathname !== '/dashboard' && (
        <Footer />
      )}

      {/* Auth Modals */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <LoginForm
              onSubmit={handleLogin}
              onSwitchToSignUp={() => { setShowLogin(false); setShowSignUp(true) }}
              onClose={() => setShowLogin(false)}
            />
          </div>
        </div>
      )}

      {showSignUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <SignUpForm
              onSuccess={() => { setShowSignUp(false); setShowLogin(true) }}
              onClose={() => setShowSignUp(false)}
            />
          </div>
        </div>
      )}

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <ForgotPasswordForm
              onClose={() => setShowForgotPassword(false)}
              onSwitchToLogin={() => { setShowForgotPassword(false); setShowLogin(true) }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  )
}

export default App
