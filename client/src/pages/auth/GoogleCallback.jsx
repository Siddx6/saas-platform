import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { getMe } from '../../api/auth.api'

export default function GoogleCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setAuth = useAuthStore((state) => state.setAuth)

  useEffect(() => {
    const token = searchParams.get('token')
    const refreshToken = searchParams.get('refreshToken')

    if (!token) {
      navigate('/login')
      return
    }

    // Temporarily set token to fetch user data
    useAuthStore.setState({ token, isLoggedIn: true })

    getMe()
      .then((res) => {
        setAuth(res.data, token)
        navigate('/dashboard')
      })
      .catch(() => {
        navigate('/login')
      })
  }, [])

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='flex flex-col items-center gap-3'>
        <div className='w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin' />
        <p className='text-sm text-gray-500'>Signing you in...</p>
      </div>
    </div>
  )
}