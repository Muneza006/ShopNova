import { Link } from 'react-router-dom'

const WishlistPage = ({ wishlistItems = [], onRemove, onAddToCart }) => {
  if (wishlistItems.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-6xl mb-4">❤️</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save products you love to buy later.</p>
        <Link to="/products" className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition">Browse Products</Link>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Wishlist ({wishlistItems.length})</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlistItems.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
            <Link to={`/product/${item.id}`}>
              <div className="aspect-square bg-gray-50 overflow-hidden">
                <img src={item.imageUrl || null} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            </Link>
            <div className="p-3">
              <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">{item.name}</p>
              <p className="text-sm font-bold text-orange-500 mb-3">{(item.discountPrice || item.price).toLocaleString()} RWF</p>
              <div className="flex gap-2">
                <button onClick={() => onAddToCart(item)} className="flex-1 py-1.5 text-xs font-semibold text-white rounded-lg transition" style={{ backgroundColor: '#E8813A' }}>Add to Cart</button>
                <button onClick={() => onRemove(item.id)} className="px-2 py-1.5 text-xs font-semibold text-red-400 hover:text-red-600 border border-red-100 rounded-lg transition">✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WishlistPage
