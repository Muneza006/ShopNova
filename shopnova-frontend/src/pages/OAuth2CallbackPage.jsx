import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const OAuth2CallbackPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const error     = params.get('error')
    const token     = params.get('token')
    const id        = params.get('id')
    const email     = params.get('email')
    const firstName = params.get('firstName')
    const lastName  = params.get('lastName')
    const role      = params.get('role')

    if (error === 'blocked') {
      navigate('/?blocked=true')
      return
    }

    if (token) {
      const user = { id: parseInt(id), email, firstName, lastName, role }
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      if (role === 'SUPER_ADMIN' || role === 'BACKUP_ADMIN') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/'
      }
    } else {
      window.location.href = '/'
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Signing you in...</p>
      </div>
    </div>
  )
}

export default OAuth2CallbackPage
