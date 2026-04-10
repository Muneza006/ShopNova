const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
import { useState } from 'react'
import axios from 'axios'

const ACCENT = '#E8813A'

const SignUpForm = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await axios.post(`${BASE}/api/auth/register`, form)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-8 text-center" onClick={e => e.stopPropagation()}>
        <p className="text-5xl mb-4">📧</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Check your email!</h2>
        <p className="text-gray-500 text-sm mb-6">We sent a verification link to <strong>{form.email}</strong>. Click it to activate your account.</p>
        <button onClick={onSuccess} className="px-6 py-2.5 text-white rounded-xl font-semibold" style={{ backgroundColor: ACCENT }}>Go to Login</button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: ACCENT }}>S</div>
            <span className="text-lg font-bold text-gray-900">Shop<span style={{ color: ACCENT }}>Nova</span></span>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-6 pb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
          <p className="text-sm text-gray-500 mb-5">Join ShopNova today</p>
          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">First Name *</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Last Name *</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="07XXXXXXXX" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Password *</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition hover:opacity-90 disabled:opacity-50 mt-1" style={{ backgroundColor: ACCENT }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 pt-3">
            Already have an account?{' '}
            <button onClick={onClose} className="font-semibold hover:underline" style={{ color: ACCENT }}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUpForm
