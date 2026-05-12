import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { verifyEmail } from '../../api/auth.api'

export default function VerifyEmail() {
  const { token } = useParams()
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>

        <div className='flex justify-center mb-8'>
          <div className='w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center'>
            <span className='text-white font-bold text-lg'>S</span>
          </div>
        </div>

        <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center'>
          {status === 'loading' && (
            <>
              <div className='w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
              <p className='text-gray-600'>Verifying your email...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-6 h-6 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <h2 className='text-xl font-semibold text-gray-900 mb-2'>Email verified!</h2>
              <p className='text-sm text-gray-500 mb-6'>Your account is now active.</p>
              <Link
                to='/login'
                className='inline-block px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors'
              >
                Go to login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-6 h-6 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </div>
              <h2 className='text-xl font-semibold text-gray-900 mb-2'>Verification failed</h2>
              <p className='text-sm text-gray-500 mb-6'>
                This link is invalid or has expired.
              </p>
              <Link
                to='/login'
                className='inline-block px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors'
              >
                Back to login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}