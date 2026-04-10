import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const PROVINCES = { 'Kigali': ['Gasabo', 'Kicukiro', 'Nyarugenge'], 'Northern': ['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'], 'Southern': ['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'], 'Eastern': ['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'], 'Western': ['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rutsiro', 'Rusizi'] }

const CheckoutPage = ({ cartItems = [], user, onOrderSuccess }) => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ province: '', district: '', sector: '', street: '', phone: user?.phone || '', paymentMethod: 'CASH_ON_DELIVERY', momoNumber: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const total = cartItems.reduce((s, i) => s + (i.discountPrice || i.price) * i.quantity, 0)
  const shipping = total >= 5000 ? 0 : 500
  const districts = PROVINCES[form.province] || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.province || !form.district || !form.sector) { setError('Please fill in all address fields.'); return }
    setLoading(true)
    setError('')
    try {
      const payload = {
        shippingAddress: `${form.street}, ${form.sector}, ${form.district}, ${form.province}`,
        customerPhone: form.phone,
        paymentMethod: form.paymentMethod,
        momoNumber: form.momoNumber,
        items: cartItems.map(i => ({ productId: i.id, quantity: i.quantity, price: i.discountPrice || i.price })),
        totalAmount: total + shipping,
      }
      await axios.post(`${BASE}/api/orders`, payload, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      onOrderSuccess()
      navigate('/account')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Delivery Address</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Province *</label>
                <select value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value, district: '', sector: '' }))} required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400">
                  <option value="">Select Province</option>
                  {Object.keys(PROVINCES).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">District *</label>
                <select value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value, sector: '' }))} required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400">
                  <option value="">Select District</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Sector *</label>
                <input value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))} placeholder="e.g. Kimironko" required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Street / Details</label>
                <input value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} placeholder="Street or landmark"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number *</label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="07XXXXXXXX" required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">Payment Method</h2>
            <div className="space-y-3">
              {[{ value: 'CASH_ON_DELIVERY', label: '💵 Cash on Delivery' }, { value: 'MOMO', label: '📱 MTN Mobile Money' }].map(opt => (
                <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${form.paymentMethod === opt.value ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" value={opt.value} checked={form.paymentMethod === opt.value} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))} className="accent-orange-500" />
                  <span className="font-medium text-sm">{opt.label}</span>
                </label>
              ))}
              {form.paymentMethod === 'MOMO' && (
                <input value={form.momoNumber} onChange={e => setForm(f => ({ ...f, momoNumber: e.target.value }))} placeholder="MTN MoMo number (07XXXXXXXX)"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 mt-2" />
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
          <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            {cartItems.map(i => (
              <div key={i.id} className="flex justify-between"><span className="text-gray-500 truncate mr-2">{i.name} x{i.quantity}</span><span className="font-semibold flex-shrink-0">{((i.discountPrice || i.price) * i.quantity).toLocaleString()}</span></div>
            ))}
            <div className="border-t border-gray-100 pt-2 flex justify-between"><span className="text-gray-500">Shipping</span><span className={shipping === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>{shipping === 0 ? 'FREE' : `${shipping.toLocaleString()} RWF`}</span></div>
            <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-orange-500">{(total + shipping).toLocaleString()} RWF</span></div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50">
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CheckoutPage
