import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const CategoryPage = ({ onAddToCart, wishlistItems = [], onToggleWishlist }) => {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${BASE}/api/products?category=${encodeURIComponent(slug)}`)
      .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 capitalize">{slug}</h1>
      {products.length === 0 ? (
        <div className="text-center py-16"><p className="text-5xl mb-4">📦</p><p className="text-gray-500">No products in this category yet.</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map(product => {
            const wishlisted = wishlistItems.some(i => i.id === product.id)
            return (
              <Link key={product.id} to={`/product/${product.id}`} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden group flex flex-col">
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img src={product.imageUrl || null} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <button onClick={e => { e.preventDefault(); onToggleWishlist(product) }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill={wishlisted ? '#E8294A' : 'none'} stroke={wishlisted ? '#E8294A' : '#9CA3AF'} strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                  </button>
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <p className="text-xs text-gray-700 line-clamp-2 mb-2">{product.name}</p>
                  <div className="mt-auto">
                    <p className="text-sm font-bold text-orange-500">{(product.discountPrice || product.price).toLocaleString()} RWF</p>
                    <button onClick={e => { e.preventDefault(); onAddToCart(product) }}
                      className="w-full mt-2 py-1.5 text-xs font-semibold text-white rounded opacity-0 group-hover:opacity-100 transition"
                      style={{ backgroundColor: '#E8813A' }}>Add to Cart</button>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CategoryPage
