import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { acceptInvite } from '../../api/workspace.api'
import useAuthStore from '../../store/authStore'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function AcceptInvite() {
  const { token } = useParams()
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const [form, setForm] = useState({ name: '', password: '', confirmPassword: '' })
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
    if (!form.name.trim()) newErrors.name = 'Name is required'
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
      const res = await acceptInvite(token, {
        name: form.name,
        password: form.password,
      })
      setAuth(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid or expired invite link.')
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
          <div className='w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-6 h-6 text-indigo-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' />
            </svg>
          </div>

          <h2 className='text-2xl font-semibold text-gray-900 mb-1 text-center'>You're invited!</h2>
          <p className='text-sm text-gray-500 mb-6 text-center'>
            Complete your profile to join the workspace
          </p>

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
              Join workspace
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}