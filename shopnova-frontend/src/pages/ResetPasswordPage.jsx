import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const token = new URLSearchParams(window.location.search).get('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    try {
      await axios.post(`${BASE}/api/auth/reset-password`, { token, password })
      setStatus('success')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password')
    }
  }

  if (status === 'success') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl p-10 shadow-sm text-center max-w-md w-full">
        <p className="text-5xl mb-4">✅</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Password Reset!</h2>
        <p className="text-gray-500 mb-6">You can now sign in with your new password.</p>
        <Link to="/" className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition">Go to Home</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl p-8 shadow-sm w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Reset Password</h2>
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">New Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
          </div>
          <button type="submit" className="w-full py-2.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition">Reset Password</button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage
