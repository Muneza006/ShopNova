import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ACCENT = '#E8813A'
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const Header = ({ onSearch, cartCount = 0, wishlistCount = 0, user, onLoginClick, onLogout }) => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [showUser, setShowUser] = useState(false)
  const [openCat, setOpenCat] = useState(null)
  const [showMore, setShowMore] = useState(false)
  const [categories, setCategories] = useState([])
  const userRef = useRef(null)
  const catRef = useRef(null)
  const moreRef = useRef(null)

  useEffect(() => {
    fetch(`${BASE}/api/categories/with-subcategories`)
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false)
      if (catRef.current && !catRef.current.contains(e.target)) setOpenCat(null)
      if (moreRef.current && !moreRef.current.contains(e.target)) setShowMore(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    if (onSearch) onSearch(query)
    navigate(`/products?q=${encodeURIComponent(query)}`)
  }

  // Show only main categories (no parent), first 5 inline, rest in "More"
  const mainCats = categories.filter(cat => !cat.parentId)
  const visibleCats = mainCats.slice(0, 5)
  const moreCats = mainCats.slice(5)

  const navLink = (to, label) => (
    <Link to={to} style={{ fontSize: 13, fontWeight: 500, color: '#444', padding: '5px 10px', borderRadius: 6, textDecoration: 'none', whiteSpace: 'nowrap' }}
      onMouseEnter={e => { e.target.style.color = ACCENT; e.target.style.background = '#fff5ef' }}
      onMouseLeave={e => { e.target.style.color = '#444'; e.target.style.background = 'transparent' }}>
      {label}
    </Link>
  )

  return (
    <>
      {/* Announcement bar */}
      <div style={{ background: '#1a1a1a', color: '#ccc', fontSize: 11, textAlign: 'center', padding: '6px 16px' }}>
        🎉 Summer Sale — Up to <span style={{ color: ACCENT, fontWeight: 600 }}>50% OFF</span> on selected items. Free shipping over 5,000 RWF!
      </div>

      {/* Main navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12, height: 56 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, background: ACCENT, borderRadius: 8, display: 'grid', placeItems: 'center', color: 'white', fontWeight: 800, fontSize: 16 }}>S</div>
            <span style={{ fontWeight: 800, fontSize: 18, color: '#1a1a1a' }}>Shop<span style={{ color: ACCENT }}>Nova</span></span>
          </Link>

          {/* Search bar — takes remaining space */}
          <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', minWidth: 0, maxWidth: 400 }}>
            <div style={{ display: 'flex', width: '100%', border: '1.5px solid #e8e8e8', borderRadius: 8, overflow: 'hidden', background: '#fafafa' }}>
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products, brands..."
                style={{ flex: 1, padding: '8px 14px', border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#1a1a1a', minWidth: 0 }}
                onFocus={e => e.target.parentElement.style.borderColor = ACCENT}
                onBlur={e => e.target.parentElement.style.borderColor = '#e8e8e8'}
              />
              <button type="submit" style={{ padding: '8px 16px', background: ACCENT, border: 'none', color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>Search</button>
            </div>
          </form>

          {/* Right icons — always visible */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            {/* Wishlist */}
            <Link to="/wishlist" title="Wishlist" style={{ position: 'relative', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, textDecoration: 'none', color: '#555' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff5ef'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              {wishlistCount > 0 && <span style={{ position: 'absolute', top: 2, right: 2, width: 15, height: 15, background: '#E8294A', color: 'white', fontSize: 9, fontWeight: 700, borderRadius: '50%', display: 'grid', placeItems: 'center' }}>{wishlistCount}</span>}
            </Link>

            {/* Cart */}
            <Link to="/cart" title="Cart" style={{ position: 'relative', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, textDecoration: 'none', color: '#555' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff5ef'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              {cartCount > 0 && <span style={{ position: 'absolute', top: 2, right: 2, width: 15, height: 15, background: ACCENT, color: 'white', fontSize: 9, fontWeight: 700, borderRadius: '50%', display: 'grid', placeItems: 'center' }}>{cartCount}</span>}
            </Link>

            {/* Profile */}
            <div ref={userRef} style={{ position: 'relative' }}>
              <button onClick={() => user ? setShowUser(v => !v) : onLoginClick?.()}
                style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: '#555' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fff5ef'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {user ? (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg,${ACCENT},#FCD34D)`, display: 'grid', placeItems: 'center', color: 'white', fontWeight: 700, fontSize: 11 }}>
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                )}
              </button>
              {showUser && user && (
                <div style={{ position: 'absolute', right: 0, top: 42, width: 180, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 200, padding: '4px 0' }}>
                  <div style={{ padding: '10px 16px', borderBottom: '1px solid #f5f5f5' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{user.firstName} {user.lastName}</p>
                    <p style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{user.email}</p>
                  </div>
                  <Link to="/account" onClick={() => setShowUser(false)} style={{ display: 'block', padding: '9px 16px', fontSize: 13, color: '#444', textDecoration: 'none' }}
                    onMouseEnter={e => e.target.style.background = '#f5f5f5'} onMouseLeave={e => e.target.style.background = 'transparent'}>👤 My Account</Link>
                  {(user.role === 'SUPER_ADMIN' || user.role === 'BACKUP_ADMIN') && (
                    <Link to="/admin" onClick={() => setShowUser(false)} style={{ display: 'block', padding: '9px 16px', fontSize: 13, color: '#444', textDecoration: 'none' }}
                      onMouseEnter={e => e.target.style.background = '#f5f5f5'} onMouseLeave={e => e.target.style.background = 'transparent'}>⚙️ Admin Dashboard</Link>
                  )}
                  <button onClick={() => { setShowUser(false); onLogout?.() }} style={{ display: 'block', width: '100%', padding: '9px 16px', fontSize: 13, color: '#E8294A', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    onMouseEnter={e => e.target.style.background = '#fff5f5'} onMouseLeave={e => e.target.style.background = 'transparent'}>🚪 Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category nav row */}
        <div style={{ borderTop: '1px solid #f0f0f0', background: '#fff' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 2, height: 38, overflowX: 'auto', scrollbarWidth: 'none' }} ref={catRef}>
            {navLink('/', 'Home')}
            {navLink('/products', 'Products')}
            {navLink('/deals', '🔥 Deals')}

            {/* Visible categories with dropdowns */}
            {visibleCats.map(cat => (
              <div key={cat.id} style={{ position: 'relative', flexShrink: 0 }}>
                <button onClick={() => setOpenCat(openCat === cat.id ? null : cat.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 13, fontWeight: 500, color: openCat === cat.id ? ACCENT : '#444', padding: '5px 10px', borderRadius: 6, background: openCat === cat.id ? '#fff5ef' : 'transparent', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {cat.name}
                  {cat.subcategories?.length > 0 && <svg width="9" height="9" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: openCat === cat.id ? 'rotate(180deg)' : 'none', transition: '0.2s' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/></svg>}
                </button>
                {openCat === cat.id && cat.subcategories?.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 2, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 200, minWidth: 160, padding: '4px 0' }}>
                    <Link to={`/category/${cat.slug}`} onClick={() => setOpenCat(null)} style={{ display: 'block', padding: '8px 14px', fontSize: 13, color: ACCENT, fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid #f5f5f5' }}>All {cat.name}</Link>
                    {cat.subcategories.map(sub => (
                      <Link key={sub.id} to={`/category/${sub.slug}`} onClick={() => setOpenCat(null)} style={{ display: 'block', padding: '8px 14px', fontSize: 13, color: '#444', textDecoration: 'none' }}
                        onMouseEnter={e => { e.target.style.background = '#fff5ef'; e.target.style.color = ACCENT }}
                        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#444' }}>
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* More dropdown for overflow categories */}
            {moreCats.length > 0 && (
              <div ref={moreRef} style={{ position: 'relative', flexShrink: 0 }}>
                <button onClick={() => setShowMore(v => !v)}
                  style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 13, fontWeight: 500, color: showMore ? ACCENT : '#444', padding: '5px 10px', borderRadius: 6, background: showMore ? '#fff5ef' : 'transparent', border: 'none', cursor: 'pointer' }}>
                  More ···
                  <svg width="9" height="9" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: showMore ? 'rotate(180deg)' : 'none', transition: '0.2s' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/></svg>
                </button>
                {showMore && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 2, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 200, minWidth: 180, padding: '4px 0', maxHeight: 320, overflowY: 'auto' }}>
                    {moreCats.map(cat => (
                      <div key={cat.id}>
                        <Link to={`/category/${cat.slug}`} onClick={() => setShowMore(false)} style={{ display: 'block', padding: '8px 14px', fontSize: 13, color: '#1a1a1a', fontWeight: 600, textDecoration: 'none' }}
                          onMouseEnter={e => e.target.style.background = '#fff5ef'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                          {cat.name}
                        </Link>
                        {cat.subcategories?.map(sub => (
                          <Link key={sub.id} to={`/category/${sub.slug}`} onClick={() => setShowMore(false)} style={{ display: 'block', padding: '6px 14px 6px 26px', fontSize: 12, color: '#666', textDecoration: 'none' }}
                            onMouseEnter={e => { e.target.style.background = '#fff5ef'; e.target.style.color = ACCENT }}
                            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#666' }}>
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {navLink('/about', 'About')}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Header
