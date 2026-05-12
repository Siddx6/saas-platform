import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../../api/auth.api'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return setError('Email is required')
    if (!/\S+@\S+\.\S+/.test(email)) return setError('Enter a valid email')

    try {
      setLoading(true)
      await forgotPassword({ email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
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
          {sent ? (
            <div className='text-center'>
              <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-6 h-6 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <h2 className='text-xl font-semibold text-gray-900 mb-2'>Check your email</h2>
              <p className='text-sm text-gray-500 mb-6'>
                We sent a password reset link to <span className='font-medium text-gray-700'>{email}</span>
              </p>
              <Link to='/login' className='text-indigo-600 text-sm font-medium hover:underline'>
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <h2 className='text-2xl font-semibold text-gray-900 mb-1'>Forgot password?</h2>
              <p className='text-sm text-gray-500 mb-6'>
                Enter your email and we'll send you a reset link
              </p>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <Input
                  label='Email'
                  type='email'
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  error={error}
                  required
                />
                <Button type='submit' fullWidth loading={loading}>
                  Send reset link
                </Button>
              </form>
            </>
          )}
        </div>

        {!sent && (
          <p className='text-center text-sm text-gray-500 mt-6'>
            Remember your password?{' '}
            <Link to='/login' className='text-indigo-600 font-medium hover:underline'>
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}