import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../../api/auth.api'
import useAuthStore from '../../store/authStore'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function Signup() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setServerError('')
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name) newErrors.name = 'Name is required'
    if (!form.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email'
    if (!form.password) newErrors.password = 'Password is required'
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors)

    try {
      setLoading(true)
      const res = await signup(form)
      setAuth(res.data.user, res.data.token)
      navigate('/onboarding')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Signup failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>

        <div className='flex justify-center mb-8'>
          <div className='w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center'>
            <span className='text-white font-bold text-lg'>S</span>
          </div>
        </div>

        <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-8'>
          <h2 className='text-2xl font-semibold text-gray-900 mb-1'>Create your account</h2>
          <p className='text-sm text-gray-500 mb-6'>Start your 14-day free trial</p>

          {serverError && (
            <div className='mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600'>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              label='Full name'
              name='name'
              placeholder='John Doe'
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            <Input
              label='Email'
              type='email'
              name='email'
              placeholder='you@example.com'
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <Input
              label='Password'
              type='password'
              name='password'
              placeholder='Min. 8 characters'
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            <Input
              label='Confirm password'
              type='password'
              name='confirmPassword'
              placeholder='••••••••'
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            <Button type='submit' fullWidth loading={loading}>
              Create account
            </Button>
          </form>

          <div className='flex items-center gap-3 my-5'>
            <div className='flex-1 h-px bg-gray-200' />
            <span className='text-xs text-gray-400'>or</span>
            <div className='flex-1 h-px bg-gray-200' />
          </div>

          <button
            onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
            className='w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors'
          >
            <svg className='w-5 h-5' viewBox='0 0 24 24'>
              <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
              <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
              <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
              <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
            </svg>
            Continue with Google
          </button>
        </div>

        <p className='text-center text-sm text-gray-500 mt-6'>
          Already have an account?{' '}
          <Link to='/login' className='text-indigo-600 font-medium hover:underline'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}