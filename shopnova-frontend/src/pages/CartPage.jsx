import { Link } from 'react-router-dom'

const CartPage = ({ cartItems = [], onUpdateQuantity, onRemove, user, onLoginClick }) => {
  const total = cartItems.reduce((s, i) => s + (i.discountPrice || i.price) * i.quantity, 0)
  const shipping = total >= 5000 ? 0 : 500

  if (cartItems.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to get started.</p>
        <Link to="/products" className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition">Shop Now</Link>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart ({cartItems.length})</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4">
              <img src={item.imageUrl || null} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-gray-100 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                <p className="text-sm text-orange-500 font-bold mt-1">{(item.discountPrice || item.price).toLocaleString()} RWF</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-50 text-gray-600">−</button>
                    <span className="px-3 py-1 text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-50 text-gray-600">+</button>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="text-xs text-red-400 hover:text-red-600 transition">Remove</button>
                </div>
              </div>
              <p className="font-bold text-gray-800 flex-shrink-0">{((item.discountPrice || item.price) * item.quantity).toLocaleString()} RWF</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
          <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-semibold">{total.toLocaleString()} RWF</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className={shipping === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>{shipping === 0 ? 'FREE' : `${shipping.toLocaleString()} RWF`}</span></div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-base"><span>Total</span><span className="text-orange-500">{(total + shipping).toLocaleString()} RWF</span></div>
          </div>
          {user ? (
            <Link to="/checkout" className="block w-full text-center py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition">Proceed to Checkout</Link>
          ) : (
            <button onClick={onLoginClick} className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition">Login to Checkout</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartPage
