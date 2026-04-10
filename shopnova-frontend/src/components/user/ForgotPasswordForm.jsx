const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
import { useState } from 'react'
import axios from 'axios'

const ACCENT = '#E8813A'

const ForgotPasswordForm = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post(`${BASE}/api/auth/forgot-password`, { email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-8" onClick={e => e.stopPropagation()}>
        {sent ? (
          <div className="text-center">
            <p className="text-5xl mb-4">📧</p>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Check your email</h2>
            <p className="text-gray-500 text-sm mb-6">We sent a password reset link to <strong>{email}</strong></p>
            <button onClick={onSuccess} className="px-6 py-2.5 text-white rounded-xl font-semibold" style={{ backgroundColor: ACCENT }}>Done</button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Forgot Password</h2>
            <p className="text-sm text-gray-500 mb-5">Enter your email and we'll send you a reset link.</p>
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: ACCENT }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <button onClick={onClose} className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition">Cancel</button>
          </>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordForm
