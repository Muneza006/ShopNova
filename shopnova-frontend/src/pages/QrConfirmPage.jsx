import { useEffect, useState } from 'react'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const QrConfirmPage = ({ user }) => {
  const [status, setStatus] = useState('idle')
  const token = new URLSearchParams(window.location.search).get('token')

  const confirm = async () => {
    if (!user) { setStatus('not-logged-in'); return }
    setStatus('loading')
    try {
      await axios.post(`${BASE}/api/auth/qr/confirm`, { token }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => { if (token && user) confirm() }, [token, user])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl p-10 shadow-sm text-center max-w-sm w-full">
        {status === 'idle' && <><p className="text-4xl mb-4">📱</p><p className="text-gray-600">Confirming QR login...</p></>}
        {status === 'loading' && <><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-gray-500">Confirming...</p></>}
        {status === 'success' && <><p className="text-5xl mb-4">✅</p><p className="text-gray-800 font-semibold">Login confirmed! The other device is now signed in.</p></>}
        {status === 'not-logged-in' && <><p className="text-5xl mb-4">🔒</p><p className="text-gray-600">You need to be logged in to confirm QR login.</p></>}
        {status === 'error' && <><p className="text-5xl mb-4">❌</p><p className="text-gray-600">Failed to confirm. The QR code may have expired.</p></>}
      </div>
    </div>
  )
}

export default QrConfirmPage
