import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AutoSlider from '../components/common/AutoSlider'
import Loader from '../components/common/Loader'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081'

const HomePage = ({ user, onAddToCart, wishlistItems = [], onToggleWishlist }) => {
  const [products, setProducts] = useState([])
  const [hotDeals, setHotDeals] = useState([])
  const [flashDeals, setFlashDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 18 })
  const [bannerIdx, setBannerIdx] = useState(0)

  const banners = [
    { tag: '🇷🇼 Made for Rwanda', title: 'Shop Smarter,', accent: 'Pay with MoMo', sub: "Rwanda's modern marketplace — electronics, fashion, home goods delivered to your door.", bg: 'linear-gradient(135deg,#0D1F1A 0%,#0F2E22 60%,#1A3A2A 100%)', accentColor: '#00E5A0', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80' },
    { tag: '⚡ Flash Sale', title: 'Up to 50% Off', accent: 'Today Only', sub: 'Limited time deals on top electronics, fashion and more. Free delivery over 5,000 RWF.', bg: 'linear-gradient(135deg,#1a0a2e 0%,#2d1b69 60%,#1a0a2e 100%)', accentColor: '#F97316', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80' },
    { tag: '🚚 Free Delivery', title: 'Orders Over', accent: '5,000 RWF Free', sub: 'Shop from hundreds of products and get free delivery across Kigali and beyond.', bg: 'linear-gradient(135deg,#0a1628 0%,#1e3a5f 60%,#0a1628 100%)', accentColor: '#3B82F6', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80' },
  ]

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % banners.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    // Mock data for deployed version without backend
    const mockProducts = [
      { id: 1, name: 'Wireless Headphones', price: 89.99, discount: 20, image: '/headphones.jpg', category: 'Electronics', rating: 4.5 },
      { id: 2, name: 'Smart Watch', price: 199.99, discount: 15, image: '/watch.jpg', category: 'Electronics', rating: 4.8 },
      { id: 3, name: 'Laptop Stand', price: 45.99, discount: 10, image: '/stand.jpg', category: 'Electronics', rating: 4.2 },
      { id: 4, name: 'Denim Jacket', price: 79.99, discount: 30, image: '/jacket.jpg', category: 'Fashion', rating: 4.6 },
      { id: 5, name: 'Running Shoes', price: 120.00, discount: 25, image: '/shoes.jpg', category: 'Fashion', rating: 4.7 },
      { id: 6, name: 'Backpack', price: 65.00, discount: 20, image: '/backpack.jpg', category: 'Fashion', rating: 4.4 },
      { id: 7, name: 'Coffee Maker', price: 149.99, discount: 15, image: '/coffee.jpg', category: 'Home', rating: 4.3 },
      { id: 8, name: 'Desk Lamp', price: 35.99, discount: 10, image: '/lamp.jpg', category: 'Home', rating: 4.5 }
    ]

    // Try to fetch from backend, fallback to mock data
    fetch(`${BASE}/api/products`)
      .then(res => res.ok ? res.json() : mockProducts)
      .then(data => {
        setProducts(Array.isArray(data) ? data : mockProducts)
        setHotDeals(Array.isArray(data) ? data.slice(0, 4) : mockProducts.slice(0, 4))
        setFlashDeals(Array.isArray(data) ? data.slice(0, 6) : mockProducts.slice(0, 6))
      })
      .catch(() => {
        // Fallback to mock data if backend fails
        setProducts(mockProducts)
        setHotDeals(mockProducts.slice(0, 4))
        setFlashDeals(mockProducts.slice(0, 6))
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1
        if (totalSeconds <= 0) return { hours: 0, minutes: 0, seconds: 0 }
        
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAddToCart = async (product) => {
    if (!user) {
      alert('Please login to add items to cart')
      return
    }

    try {
      const res = await fetch(`${BASE}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1
        })
      })

      if (res.ok) {
        setCartCount(prev => prev + 1)
        if (onAddToCart) onAddToCart(product)
      } else {
        alert('Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add to cart')
    }
  }

  const ProductCard = ({ product, showDiscount = true, categoryColor = '#00A86B' }) => {
    const discount = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0
    const wishlisted = wishlistItems.some(i => i.id === product.id)

    return (
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E8E8E3',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      onClick={() => window.location.href = `/product/${product.id}`}
    >
        <div style={{
          background: '#F4F4F0',
          height: '140px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          position: 'relative'
        }}>
          {showDiscount && discount > 0 && (
            <span style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              background: '#FF6B35',
              color: '#fff',
              fontSize: '10px',
              fontWeight: '600',
              padding: '2px 7px',
              borderRadius: '4px'
            }}>
              -{discount}%
            </span>
          )}
          📱
        </div>
        <div style={{ padding: '0.85rem' }}>
          <div style={{
            fontSize: '13px',
            fontWeight: '500',
            marginBottom: '0.25rem',
            lineHeight: '1.3'
          }}>
            {product.name}
          </div>
          <div style={{
            fontSize: '11px',
            color: '#8A8A82',
            marginBottom: '0.5rem'
          }}>
            {product.category?.name || 'Electronics'}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A18' }}>
              {product.discountPrice ? (
                <>
                  {product.discountPrice}K
                  <span style={{
                    fontSize: '11px',
                    color: '#8A8A82',
                    textDecoration: 'line-through',
                    fontWeight: '400',
                    marginLeft: '4px'
                  }}>
                    {product.price}K
                  </span>
                </>
              ) : (
                `${product.price}K`
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleAddToCart(product)
              }}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: categoryColor + '20',
                color: categoryColor,
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '300'
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div style={{ background: '#FAFAF8', color: '#1A1A18', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>

      {/* ── Hero Banner ── */}
      {(() => {
        const b = banners[bannerIdx]
        return (
          <div style={{ position: 'relative', overflow: 'hidden', minHeight: 420 }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${b.img})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'all 0.7s ease' }}/>
            <div style={{ position: 'absolute', inset: 0, background: b.bg, opacity: 0.88 }}/>
            <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '80px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>
              <div style={{ maxWidth: 520 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: b.accentColor, fontSize: 12, padding: '5px 14px', borderRadius: 20, marginBottom: 20, fontWeight: 600, letterSpacing: '0.5px' }}>{b.tag}</span>
                <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 48, fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 8 }}>
                  {b.title}<br/><span style={{ color: b.accentColor }}>{b.accent}</span>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, lineHeight: 1.7, marginBottom: 28, maxWidth: 420 }}>{b.sub}</p>
                {/* Search bar inside hero */}
                <form onSubmit={e => { e.preventDefault(); const q = e.target.querySelector('input').value.trim(); if (q) window.location.href = `/products?q=${encodeURIComponent(q)}` }}
                  style={{ display: 'flex', background: 'rgba(255,255,255,0.95)', borderRadius: 12, overflow: 'hidden', marginBottom: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', maxWidth: 480 }}>
                  <input placeholder="Search products, brands..." style={{ flex: 1, padding: '14px 18px', border: 'none', outline: 'none', fontSize: 14, background: 'transparent', color: '#1A1A18' }}/>
                  <button type="submit" style={{ padding: '14px 22px', background: b.accentColor, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, color: '#fff', whiteSpace: 'nowrap' }}>Search</button>
                </form>
                <div style={{ display: 'flex', gap: 12 }}>
                  <a href="/products" style={{ padding: '11px 24px', background: b.accentColor, color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>Shop Now →</a>
                  <a href="/deals" style={{ padding: '11px 24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>View Deals</a>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
                {products.filter(p => p.discountPrice).slice(0, 2).map((p, i) => (
                  <a key={i} href={`/product/${p.id}`} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', backdropFilter: 'blur(10px)', minWidth: 220 }}>
                    <img src={p.imageUrl} alt={p.name} style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', background: 'rgba(255,255,255,0.1)' }}/>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 2, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: b.accentColor }}>{(p.discountPrice||p.price)?.toLocaleString()} RWF</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
              {banners.map((_, i) => (
                <button key={i} onClick={() => setBannerIdx(i)} style={{ width: i === bannerIdx ? 24 : 8, height: 8, borderRadius: 4, background: i === bannerIdx ? b.accentColor : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', transition: '0.3s', padding: 0 }}/>
              ))}
            </div>
          </div>
        )
      })()}

      {/* Trust bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '3rem',
        padding: '0.85rem 2rem',
        background: '#FFFFFF',
        borderBottom: '1px solid #E8E8E3'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#8A8A82' }}>
          📦 <span><strong>Free delivery</strong> over RWF 20K</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#8A8A82' }}>
          📱 <span><strong>MTN MoMo</strong> payments</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#8A8A82' }}>
          🔄 <span><strong>Easy returns</strong> 7 days</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#8A8A82' }}>
          🛡️ <span><strong>Secure</strong> checkout</span>
        </div>
      </div>

      {/* Category nav */}
      <div style={{
        padding: '0.85rem 2rem',
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        background: '#FAFAF8',
        borderBottom: '1px solid #E8E8E3'
      }}>
        <div style={{
          flexShrink: 0,
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          fontSize: '12.5px',
          cursor: 'pointer',
          border: '1px solid #E8E8E3',
          background: '#FFFFFF',
          color: '#8A8A82',
          fontWeight: '500',
          transition: 'all 0.15s'
        }}>
          All
        </div>
        <div style={{
          flexShrink: 0,
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          fontSize: '12.5px',
          cursor: 'pointer',
          border: '1px solid #E8E8E3',
          background: '#FFFFFF',
          color: '#8A8A82',
          fontWeight: '500',
          transition: 'all 0.15s'
        }}>
          📱 Electronics
        </div>
        <div style={{
          flexShrink: 0,
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          fontSize: '12.5px',
          cursor: 'pointer',
          border: '1px solid #E8E8E3',
          background: '#FFFFFF',
          color: '#8A8A82',
          fontWeight: '500',
          transition: 'all 0.15s'
        }}>
          👗 Fashion
        </div>
        <div style={{
          flexShrink: 0,
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          fontSize: '12.5px',
          cursor: 'pointer',
          border: '1px solid #E8E8E3',
          background: '#FFFFFF',
          color: '#8A8A82',
          fontWeight: '500',
          transition: 'all 0.15s'
        }}>
          🏠 Home & Living
        </div>
        <div style={{
          flexShrink: 0,
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          fontSize: '12.5px',
          cursor: 'pointer',
          border: '1px solid #E8E8E3',
          background: '#FFFFFF',
          color: '#8A8A82',
          fontWeight: '500',
          transition: 'all 0.15s'
        }}>
          💄 Beauty
        </div>
        <div style={{
          flexShrink: 0,
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          fontSize: '12.5px',
          cursor: 'pointer',
          border: '1px solid #E8E8E3',
          background: '#FFFFFF',
          color: '#8A8A82',
          fontWeight: '500',
          transition: 'all 0.15s'
        }}>
          🍎 Groceries
        </div>
        <div style={{
          flexShrink: 0,
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          fontSize: '12.5px',
          cursor: 'pointer',
          border: '1px solid #E8E8E3',
          background: '#FFFFFF',
          color: '#8A8A82',
          fontWeight: '500',
          transition: 'all 0.15s'
        }}>
          📚 Books
        </div>
        <div style={{
          flexShrink: 0,
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          fontSize: '12.5px',
          cursor: 'pointer',
          border: '1px solid #E8E8E3',
          background: '#FFFFFF',
          color: '#8A8A82',
          fontWeight: '500',
          transition: 'all 0.15s'
        }}>
          ⚽ Sports
        </div>
        <div style={{
          flexShrink: 0,
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          fontSize: '12.5px',
          cursor: 'pointer',
          border: '1px solid #E8E8E3',
          background: '#FFFFFF',
          color: '#8A8A82',
          fontWeight: '500',
          transition: 'all 0.15s'
        }}>
          🎮 Gaming
        </div>
      </div>

      {/* Flash Deals */}
      <div style={{ padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{
            background: '#FF6B35',
            color: '#fff',
            fontSize: '11px',
            fontWeight: '700',
            padding: '4px 10px',
            borderRadius: '6px',
            letterSpacing: '0.5px'
          }}>
            ⚡ FLASH DEALS
          </span>
          <span style={{ fontSize: '12px', color: '#8A8A82' }}>Ends in</span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px' }}>
            <span style={{
              background: '#1A1A18',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontWeight: '600',
              fontSize: '13px'
            }}>
              {String(timeLeft.hours).padStart(2, '0')}
            </span>:
            <span style={{
              background: '#1A1A18',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontWeight: '600',
              fontSize: '13px'
            }}>
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>:
            <span style={{
              background: '#1A1A18',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontWeight: '600',
              fontSize: '13px'
            }}>
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#00A86B', cursor: 'pointer' }}>See all →</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {flashDeals.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Electronics section */}
      <div style={{ background: '#FFFFFF', borderTop: '3px solid #3B82F6' }}>
        <div style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: '700' }}>
            📱 <span style={{ color: '#3B82F6' }}>Electronics</span>
          </div>
          <span style={{ fontSize: '12px', color: '#3B82F6', cursor: 'pointer' }}>View all →</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '0 2rem 2rem' }}>
          {products.filter(p => p.category?.name === 'Electronics').slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} categoryColor="#3B82F6" />
          ))}
        </div>
      </div>

      {/* Fashion section */}
      <div style={{ background: '#FFF5F9', borderTop: '3px solid #EC4899' }}>
        <div style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: '700' }}>
            👗 <span style={{ color: '#EC4899' }}>Fashion</span>
          </div>
          <span style={{ fontSize: '12px', color: '#EC4899', cursor: 'pointer' }}>View all →</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '0 2rem 2rem' }}>
          {products.filter(p => p.category?.name === 'Fashion').slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} categoryColor="#EC4899" />
          ))}
        </div>
      </div>

      {/* Home section */}
      <div style={{ background: '#FFFBF0', borderTop: '3px solid #F59E0B' }}>
        <div style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: '700' }}>
            🏠 <span style={{ color: '#F59E0B' }}>Home & Living</span>
          </div>
          <span style={{ fontSize: '12px', color: '#F59E0B', cursor: 'pointer' }}>View all →</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '0 2rem 2rem' }}>
          {products.filter(p => p.category?.name === 'Home & Living').slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} categoryColor="#F59E0B" />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: '#1A1A18',
        color: 'rgba(255,255,255,0.4)',
        textAlign: 'center',
        fontSize: '11px',
        padding: '0.65rem',
        letterSpacing: '0.5px'
      }}>
        © 2026 ShopNova Rwanda · All rights reserved · Made with ❤️ in Kigali
      </div>
    </div>
  )
}

export default HomePage
