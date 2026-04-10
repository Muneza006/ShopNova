import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const VerifyEmailPage = () => {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token')
    if (!token) { setStatus('error'); return }
    axios.get(`${BASE}/api/auth/verify-email?token=${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl p-10 shadow-sm text-center max-w-md w-full">
        {status === 'loading' && <><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-gray-500">Verifying your email...</p></>}
        {status === 'success' && <><p className="text-5xl mb-4">✅</p><h2 className="text-xl font-bold text-gray-800 mb-2">Email Verified!</h2><p className="text-gray-500 mb-6">Your account is now active. You can sign in.</p><Link to="/" className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition">Go to Home</Link></>}
        {status === 'error' && <><p className="text-5xl mb-4">❌</p><h2 className="text-xl font-bold text-gray-800 mb-2">Invalid Link</h2><p className="text-gray-500 mb-6">This verification link is invalid or expired.</p><Link to="/" className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition">Go to Home</Link></>}
      </div>
    </div>
  )
}

export default VerifyEmailPage
