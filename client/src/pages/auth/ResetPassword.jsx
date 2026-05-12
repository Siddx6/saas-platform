import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { resetPassword } from '../../api/auth.api'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({ password: '', confirmPassword: '' })
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
    if (!form.password) newErrors.password = 'Password is required'
    else if (form.password.length < 8) newErrors.password = 'Minimum 8 characters'
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors)

    try {
      setLoading(true)
      await resetPassword(token, { password: form.password })
      navigate('/login')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Reset failed. Link may have expired.')
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
          <h2 className='text-2xl font-semibold text-gray-900 mb-1'>Set new password</h2>
          <p className='text-sm text-gray-500 mb-6'>Must be at least 8 characters</p>

          {serverError && (
            <div className='mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600'>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              label='New password'
              type='password'
              name='password'
              placeholder='••••••••'
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            <Input
              label='Confirm new password'
              type='password'
              name='confirmPassword'
              placeholder='••••••••'
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />
            <Button type='submit' fullWidth loading={loading}>
              Reset password
            </Button>
          </form>
        </div>

        <p className='text-center text-sm text-gray-500 mt-6'>
          <Link to='/login' className='text-indigo-600 font-medium hover:underline'>
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}