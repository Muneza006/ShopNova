import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const ProductDetailPage = ({ onAddToCart, user, onLoginClick, wishlistItems = [], onToggleWishlist }) => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [zoom, setZoom] = useState(false)
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 })
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 })
  const imageBoxRef = useRef(null)

  useEffect(() => {
    axios.get(`${BASE}/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const handleMouseMove = useCallback((e) => {
    const box = imageBoxRef.current
    if (!box) return
    const rect = box.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = Math.max(0, Math.min(100, (x / rect.width) * 100))
    const py = Math.max(0, Math.min(100, (y / rect.height) * 100))
    setLensPos({ x, y })
    setZoomPos({ x: px, y: py })
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
  if (!product) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Product not found.</p></div>

  const images = [product.imageUrl].filter(Boolean)
  const discount = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0
  const wishlisted = wishlistItems.some(i => i.id === product.id)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Images */}
        <div className="md:w-1/2 flex gap-3">
          <div className="flex flex-col gap-2">
            {images.map((img, i) => (
              <button key={i} onClick={() => setSelectedImg(i)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition ${selectedImg === i ? 'border-orange-400' : 'border-gray-200'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex gap-4 flex-1">
            <div ref={imageBoxRef} className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-gray-50 cursor-crosshair"
              onMouseEnter={() => setZoom(true)} onMouseLeave={() => setZoom(false)} onMouseMove={handleMouseMove}>
              <img src={images[selectedImg]} alt={product.name} className="w-full h-full object-cover" />
              {zoom && <div className="absolute w-20 h-20 rounded-full border-2 border-orange-400 pointer-events-none" style={{ left: lensPos.x - 40, top: lensPos.y - 40, background: 'rgba(232,129,58,0.15)' }} />}
            </div>
            {zoom && (
              <div className="hidden md:block w-80 h-80 rounded-2xl overflow-hidden border border-gray-200 shadow-lg flex-shrink-0">
                <div className="w-full h-full" style={{ backgroundImage: `url(${images[selectedImg]})`, backgroundSize: '350%', backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%` }} />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="md:w-1/2">
          <p className="text-xs text-orange-500 font-semibold uppercase tracking-wider mb-2">{product.category?.name}</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-extrabold text-orange-500">{(product.discountPrice || product.price).toLocaleString()} RWF</span>
            {discount > 0 && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">-{discount}%</span>}
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">{product.description}</p>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-gray-50 text-gray-600 text-lg">−</button>
              <span className="px-4 py-2 font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 hover:bg-gray-50 text-gray-600 text-lg">+</button>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${product.stockQuantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
            </span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { if (user) { for (let i = 0; i < quantity; i++) onAddToCart(product) } else onLoginClick() }}
              disabled={product.stockQuantity === 0}
              className="flex-1 py-3 text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50"
              style={{ backgroundColor: '#E8813A' }}>
              🛒 Add to Cart
            </button>
            <button onClick={() => onToggleWishlist(product)}
              className={`px-4 py-3 rounded-xl border-2 transition ${wishlisted ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-red-300'}`}>
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill={wishlisted ? '#E8294A' : 'none'} stroke={wishlisted ? '#E8294A' : '#9CA3AF'} strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
