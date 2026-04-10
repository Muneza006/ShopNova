import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const O = '#F97316' // orange accent

const statusStyle = {
  PENDING: { bg: 'rgba(234,179,8,0.15)', color: '#EAB308', dot: '#EAB308' },
  PENDING_PAYMENT: { bg: 'rgba(249,115,22,0.15)', color: '#F97316', dot: '#F97316' },
  PROCESSING: { bg: 'rgba(59,130,246,0.15)', color: '#60A5FA', dot: '#60A5FA' },
  SHIPPED: { bg: 'rgba(168,85,247,0.15)', color: '#C084FC', dot: '#C084FC' },
  DELIVERED: { bg: 'rgba(34,197,94,0.15)', color: '#4ADE80', dot: '#4ADE80' },
  PAID: { bg: 'rgba(34,197,94,0.15)', color: '#4ADE80', dot: '#4ADE80' },
  PAYMENT_FAILED: { bg: 'rgba(239,68,68,0.15)', color: '#F87171', dot: '#F87171' },
  CANCELLED: { bg: 'rgba(239,68,68,0.15)', color: '#F87171', dot: '#F87171' },
}

const Badge = ({ status }) => {
  const s = statusStyle[status] || { bg: 'rgba(150,150,150,0.15)', color: '#aaa', dot: '#aaa' }
  return (
    <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, display: 'inline-block' }}/>
      {status}
    </span>
  )
}

export default function CustomerDashboard({ user, onLogout, wishlistItems = [], cartItems = [] }) {
  const [tab, setTab] = useState('overview')
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.id) return
    axios.get(`${BASE}/api/orders/user/${user.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(r => setOrders(Array.isArray(r.data) ? r.data : [])).catch(() => {})
  }, [user])

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F1117' }}>
      <div style={{ textAlign: 'center', color: '#F0F2F8' }}>
        <p style={{ fontSize: 48, marginBottom: 12 }}>🔒</p>
        <p style={{ marginBottom: 16, color: '#7A8299' }}>Please log in to view your account.</p>
        <Link to="/" style={{ padding: '10px 24px', background: O, color: 'white', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>Go Home</Link>
      </div>
    </div>
  )

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`
  const totalSpent = orders.filter(o => o.status !== 'CANCELLED' && o.status !== 'PAYMENT_FAILED').reduce((s, o) => s + parseFloat(o.totalAmount || 0), 0)
  const delivered = orders.filter(o => o.status === 'DELIVERED' || o.status === 'PAID').length

  const css = {
    bg: '#0F1117', bg2: '#171923', bg3: '#1E2330',
    border: 'rgba(255,255,255,0.08)', text: '#F0F2F8', muted: '#7A8299',
    green: '#22C55E', red: '#EF4444', blue: '#3B82F6', purple: '#A855F7'
  }

  const navItems = [
    { id: 'overview', icon: '▦', label: 'Overview', section: 'MAIN' },
    { id: 'orders', icon: '📦', label: 'My Orders', section: 'MAIN', count: orders.length },
    { id: 'wishlist', icon: '♥', label: 'Wishlist', section: 'MAIN' },
    { id: 'cart', icon: '🛒', label: 'Cart', section: 'MAIN', count: cartItems.length, countColor: css.green },
    { id: 'profile', icon: '👤', label: 'Profile', section: 'ACCOUNT' },
    { id: 'addresses', icon: '📍', label: 'Addresses', section: 'ACCOUNT' },
    { id: 'notifications', icon: '🔔', label: 'Notifications', section: 'ACCOUNT' },
    { id: 'security', icon: '🔒', label: 'Security', section: 'ACCOUNT' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: css.bg, color: css.text, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: css.bg, borderRight: `1px solid ${css.border}`, display: 'flex', flexDirection: 'column', padding: '24px 12px', flexShrink: 0 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 28, paddingLeft: 8 }}>
          <div style={{ width: 30, height: 30, background: O, borderRadius: 8, display: 'grid', placeItems: 'center', color: 'white', fontWeight: 800, fontSize: 15 }}>S</div>
          <span style={{ fontWeight: 800, fontSize: 17, color: css.text }}>Shop<span style={{ color: O }}>Nova</span></span>
        </Link>

        {['MAIN', 'ACCOUNT'].map(section => (
          <div key={section} style={{ marginBottom: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: css.muted, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '8px 10px 4px' }}>{section}</p>
            {navItems.filter(n => n.section === section).map(item => (
              <button key={item.id} onClick={() => setTab(item.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, marginBottom: 2, background: tab === item.id ? 'rgba(249,115,22,0.12)' : 'transparent', color: tab === item.id ? O : css.muted, textAlign: 'left' }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.count > 0 && <span style={{ background: item.countColor || O, color: 'white', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>{item.count}</span>}
              </button>
            ))}
          </div>
        ))}

        <div style={{ marginTop: 'auto', borderTop: `1px solid ${css.border}`, paddingTop: 12 }}>
          <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: 'transparent', color: css.red, textAlign: 'left' }}>
            <span>🚪</span><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{ background: 'rgba(15,17,23,0.9)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${css.border}`, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {['Home', 'Products', 'Deals'].map(l => (
              <Link key={l} to={`/${l.toLowerCase()}`} style={{ fontSize: 13, color: css.muted, textDecoration: 'none', fontWeight: 500 }}
                onMouseEnter={e => e.target.style.color = O} onMouseLeave={e => e.target.style.color = css.muted}>{l}</Link>
            ))}
            <span style={{ fontSize: 13, color: O, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: O, display: 'inline-block' }}/>Dashboard
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <input placeholder="Search products..." style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${css.border}`, borderRadius: 8, color: css.text, fontSize: 12, outline: 'none', width: 180 }}/>
            </div>
            <Link to="/cart" style={{ position: 'relative', width: 34, height: 34, display: 'grid', placeItems: 'center', borderRadius: 8, background: 'rgba(255,255,255,0.06)', textDecoration: 'none', color: css.muted }}>
              🛒{cartItems.length > 0 && <span style={{ position: 'absolute', top: -4, right: -4, width: 15, height: 15, background: O, color: 'white', fontSize: 9, fontWeight: 700, borderRadius: '50%', display: 'grid', placeItems: 'center' }}>{cartItems.length}</span>}
            </Link>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg,${O},#FCD34D)`, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13, color: 'white', cursor: 'pointer' }}>{initials}</div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Greeting */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 700 }}>Hello, <span style={{ color: O }}>{user.firstName}!</span> 👋</h1>
                  <p style={{ color: css.muted, fontSize: 13, marginTop: 4 }}>Here's what's happening with your account today.</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Link to="/products" style={{ padding: '9px 16px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${css.border}`, borderRadius: 10, color: css.muted, textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>🛍 Continue Shopping</Link>
                  <button onClick={() => setTab('orders')} style={{ padding: '9px 16px', background: O, border: 'none', borderRadius: 10, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>📦 Track Orders</button>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
                {[
                  { icon: '📦', label: 'Total Orders', value: orders.length, accent: O, bg: 'rgba(249,115,22,0.12)' },
                  { icon: '✅', label: 'Delivered', value: delivered, accent: css.purple, bg: 'rgba(168,85,247,0.12)' },
                  { icon: '💰', label: 'Total Spent', value: `${totalSpent.toLocaleString()} RWF`, accent: css.green, bg: 'rgba(34,197,94,0.1)', small: true },
                  { icon: '♥', label: 'Wishlist Items', value: wishlistItems.length, accent: css.red, bg: 'rgba(239,68,68,0.1)' },
                ].map((s, i) => (
                  <div key={i} style={{ background: css.bg2, border: `1px solid ${css.border}`, borderRadius: 16, padding: 20, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: s.accent, opacity: 0.7 }}/>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'grid', placeItems: 'center', fontSize: 20, marginBottom: 14 }}>{s.icon}</div>
                    <p style={{ fontSize: s.small ? 18 : 26, fontWeight: 700, lineHeight: 1 }}>{s.value}</p>
                    <p style={{ color: css.muted, fontSize: 12, marginTop: 4 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Orders + Profile */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h2 style={{ fontWeight: 700, fontSize: 16 }}>Recent Orders</h2>
                    <button onClick={() => setTab('orders')} style={{ color: O, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>View All →</button>
                  </div>
                  <div style={{ background: css.bg2, border: `1px solid ${css.border}`, borderRadius: 16, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead><tr style={{ borderBottom: `1px solid ${css.border}` }}>
                        {['ORDER ID', 'PRODUCT', 'DATE', 'STATUS', 'AMOUNT'].map(h => <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 10, fontWeight: 700, color: css.muted, letterSpacing: '1px' }}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {orders.slice(0, 4).map(o => (
                          <tr key={o.id} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                            <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, color: css.muted }}>{o.orderNumber}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: css.bg3, display: 'grid', placeItems: 'center', fontSize: 16 }}>📦</div>
                                <div><p style={{ fontSize: 12, fontWeight: 500 }}>{o.items?.[0]?.product?.name || 'Order'}</p><p style={{ fontSize: 11, color: css.muted }}>{o.items?.length || 0} item(s)</p></div>
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: 12, color: css.muted }}>{new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                            <td style={{ padding: '12px 16px' }}><Badge status={o.status}/></td>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: O, fontSize: 13 }}>{parseFloat(o.totalAmount).toLocaleString()} RWF</td>
                          </tr>
                        ))}
                        {orders.length === 0 && <tr><td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', color: css.muted, fontSize: 13 }}>No orders yet</td></tr>}
                      </tbody>
                    </table>
                  </div>

                  {/* Cart Preview */}
                  {cartItems.length > 0 && (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <h2 style={{ fontWeight: 700, fontSize: 16 }}>Cart Preview</h2>
                        <Link to="/cart" style={{ color: O, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>View Cart →</Link>
                      </div>
                      <div style={{ background: css.bg2, border: `1px solid ${css.border}`, borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <img src={cartItems[0].imageUrl} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', background: css.bg3 }}/>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 600 }}>{cartItems[0].name}</p>
                          <p style={{ fontSize: 11, color: css.muted }}>{cartItems[0].category?.name || 'Product'}</p>
                        </div>
                        <span style={{ fontWeight: 700, color: O }}>{((cartItems[0].discountPrice || cartItems[0].price) * cartItems[0].quantity).toLocaleString()} RWF</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ background: css.bg2, border: `1px solid ${css.border}`, borderRadius: 16, padding: 24, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(135deg,rgba(249,115,22,0.1),rgba(59,130,246,0.05))' }}/>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg,${O},#FCD34D)`, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 22, color: 'white', margin: '0 auto 12px', position: 'relative', zIndex: 1, boxShadow: `0 0 0 3px ${css.bg2}, 0 0 0 5px ${O}` }}>{initials}</div>
                    <p style={{ fontWeight: 700, fontSize: 17 }}>{user.firstName} {user.lastName}</p>
                    <p style={{ color: css.muted, fontSize: 12, marginTop: 2 }}>{user.email}</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '12px 0' }}>
                      <span style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: css.green }}>✔ Verified</span>
                      <span style={{ background: css.bg3, border: `1px solid ${css.border}`, borderRadius: 6, padding: '3px 8px', fontSize: 11, color: css.muted }}>🇷🇼 Rwanda</span>
                      <span style={{ background: css.bg3, border: `1px solid ${css.border}`, borderRadius: 6, padding: '3px 8px', fontSize: 11, color: css.muted }}>Customer</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: css.border, borderRadius: 10, overflow: 'hidden', marginTop: 12 }}>
                      {[{ val: orders.length, label: 'Orders' }, { val: wishlistItems.length, label: 'Wishlist' }, { val: Math.floor((Date.now() - new Date(user.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24 * 30)), label: 'Months' }].map((s, i) => (
                        <div key={i} style={{ background: css.bg3, padding: '12px 8px', textAlign: 'center' }}>
                          <p style={{ fontSize: 18, fontWeight: 700, color: O }}>{s.val}</p>
                          <p style={{ fontSize: 11, color: css.muted, marginTop: 2 }}>{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Quick actions */}
                  <div style={{ background: css.bg2, border: `1px solid ${css.border}`, borderRadius: 16, padding: 16 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Quick Actions</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {[{ icon: '📦', label: 'My Orders', id: 'orders' }, { icon: '♥', label: 'Wishlist', id: 'wishlist' }, { icon: '📍', label: 'Addresses', id: 'addresses' }, { icon: '✏️', label: 'Edit Profile', id: 'profile' }].map(a => (
                        <button key={a.id} onClick={() => setTab(a.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 8px', borderRadius: 10, background: css.bg3, border: `1px solid ${css.border}`, cursor: 'pointer', color: css.muted, fontSize: 12, fontWeight: 500 }}>
                          <span style={{ fontSize: 18 }}>{a.icon}</span>{a.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {tab === 'orders' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>My <span style={{ color: O }}>Orders</span></h1>
              <div style={{ background: css.bg2, border: `1px solid ${css.border}`, borderRadius: 16, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: css.bg3 }}>
                    {['Order ID', 'Items', 'Date', 'Payment', 'Status', 'Amount'].map(h => <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 10, fontWeight: 700, color: css.muted, letterSpacing: '1px', textTransform: 'uppercase' }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, color: css.muted }}>{o.orderNumber}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13 }}>{o.items?.length || 0} item(s)</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: css.muted }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: css.muted }}>{o.paymentMethod === 'MOBILE_MONEY' ? '📱 MoMo' : '💵 Cash'}</td>
                        <td style={{ padding: '12px 16px' }}><Badge status={o.status}/></td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: O }}>{parseFloat(o.totalAmount).toLocaleString()} RWF</td>
                      </tr>
                    ))}
                    {orders.length === 0 && <tr><td colSpan={6} style={{ padding: '40px 16px', textAlign: 'center', color: css.muted }}>No orders yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* WISHLIST */}
          {tab === 'wishlist' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>My <span style={{ color: O }}>Wishlist</span></h1>
              {wishlistItems.length === 0 ? (
                <div style={{ background: css.bg2, border: `1px solid ${css.border}`, borderRadius: 16, padding: '60px 20px', textAlign: 'center' }}>
                  <p style={{ fontSize: 48, marginBottom: 12 }}>💔</p>
                  <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Your wishlist is empty</p>
                  <p style={{ color: css.muted, fontSize: 13, marginBottom: 20 }}>Start adding products you love</p>
                  <Link to="/products" style={{ padding: '10px 20px', background: O, color: 'white', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>🛍 Explore Products</Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
                  {wishlistItems.map(item => (
                    <div key={item.id} style={{ background: css.bg2, border: `1px solid ${css.border}`, borderRadius: 16, overflow: 'hidden' }}>
                      <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: 140, objectFit: 'cover', background: css.bg3 }}/>
                      <div style={{ padding: 14 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{item.name}</p>
                        <p style={{ fontSize: 16, fontWeight: 700, color: O }}>{(item.discountPrice || item.price)?.toLocaleString()} RWF</p>
                        <Link to={`/product/${item.id}`} style={{ display: 'block', marginTop: 10, padding: '8px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 8, color: O, fontSize: 12, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>View Product</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CART */}
          {tab === 'cart' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>My <span style={{ color: O }}>Cart</span></h1>
              {cartItems.length === 0 ? (
                <div style={{ background: css.bg2, border: `1px solid ${css.border}`, borderRadius: 16, padding: '60px 20px', textAlign: 'center' }}>
                  <p style={{ fontSize: 48, marginBottom: 12 }}>🛒</p>
                  <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Your cart is empty</p>
                  <Link to="/products" style={{ padding: '10px 20px', background: O, color: 'white', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>🛍 Start Shopping</Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
                  <div style={{ background: css.bg2, border: `1px solid ${css.border}`, borderRadius: 16, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead><tr style={{ background: css.bg3 }}>{['Product', 'Price', 'Qty', 'Total'].map(h => <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 10, fontWeight: 700, color: css.muted, letterSpacing: '1px', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
                      <tbody>
                        {cartItems.map(item => (
                          <tr key={item.id} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <img src={item.imageUrl} alt={item.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', background: css.bg3 }}/>
                                <div><p style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</p><p style={{ fontSize: 11, color: css.muted }}>{item.category?.name || ''}</p></div>
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px', color: css.muted, fontSize: 13 }}>{(item.discountPrice || item.price)?.toLocaleString()} RWF</td>
                            <td style={{ padding: '12px 16px', fontWeight: 600 }}>×{item.quantity}</td>
                            <td style={{ padding: '12px 16px', fontWeight: 700, color: O }}>{((item.discountPrice || item.price) * item.quantity)?.toLocaleString()} RWF</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ background: css.bg2, border: `1px solid ${css.border}`, borderRadius: 16, padding: 20, height: 'fit-content' }}>
                    <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Order Summary</p>
                    {(() => {
                      const sub = cartItems.reduce((s, i) => s + (i.discountPrice || i.price) * i.quantity, 0)
                      const ship = sub > 5000 ? 0 : 500
                      return <>
                        {[['Subtotal', `${sub.toLocaleString()} RWF`], ['Shipping', ship === 0 ? 'Free' : `${ship} RWF`]].map(([k, v]) => (
                          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10, color: css.muted }}><span>{k}</span><span style={{ color: v === 'Free' ? css.green : css.text }}>{v}</span></div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, borderTop: `1px solid ${css.border}`, paddingTop: 12, marginTop: 4 }}><span>Total</span><span style={{ color: O }}>{(sub + ship).toLocaleString()} RWF</span></div>
                        <Link to="/checkout" style={{ display: 'block', textAlign: 'center', marginTop: 16, padding: 13, background: O, color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>🔒 Checkout</Link>
                      </>
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PROFILE */}
          {tab === 'profile' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>My <span style={{ color: O }}>Profile</span></h1>
              <div style={{ background: css.bg2, border: `1px solid ${css.border}`, borderRadius: 16, padding: 24, maxWidth: 500 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: `linear-gradient(135deg,${O},#FCD34D)`, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 22, color: 'white' }}>{initials}</div>
                  <div><p style={{ fontWeight: 700, fontSize: 18 }}>{user.firstName} {user.lastName}</p><p style={{ color: css.muted, fontSize: 13 }}>{user.email}</p></div>
                </div>
                {[['First Name', user.firstName], ['Last Name', user.lastName], ['Email', user.email]].map(([label, val]) => (
                  <div key={label} style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: css.muted, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>{label}</label>
                    <div style={{ padding: '10px 14px', background: css.bg3, border: `1px solid ${css.border}`, borderRadius: 10, fontSize: 14, color: css.text }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OTHER TABS */}
          {['addresses', 'notifications', 'security'].includes(tab) && (
            <div style={{ background: css.bg2, border: `1px solid ${css.border}`, borderRadius: 16, padding: '60px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🚧</p>
              <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, textTransform: 'capitalize' }}>{tab}</p>
              <p style={{ color: css.muted, fontSize: 13 }}>This section is coming soon.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
