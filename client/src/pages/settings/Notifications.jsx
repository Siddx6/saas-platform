import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import api from '../../api/axios'
import useAuthStore from '../../store/authStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const notificationSettings = [
  {
    key: 'weeklyReport',
    label: 'Weekly AI Reports',
    description: 'Receive your AI-generated business report every Monday morning',
  },
  {
    key: 'teamActivity',
    label: 'Team Activity',
    description: 'Get notified when team members join or are removed',
  },
  {
    key: 'billing',
    label: 'Billing Alerts',
    description: 'Receive notifications for payment success and failures',
  },
]

export default function Notifications() {
  const { user, updateUser } = useAuthStore()
  const [prefs, setPrefs] = useState({
    weeklyReport: true,
    teamActivity: true,
    billing: true,
  })
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user?.notifications) setPrefs(user.notifications)
  }, [user])

  const mutation = useMutation({
    mutationFn: () => api.patch('/users/notifications', { notifications: prefs }),
    onSuccess: (res) => {
      updateUser({ notifications: prefs })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    },
  })

  const toggle = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className='space-y-6 max-w-2xl'>

      <div>
        <h2 className='text-lg font-semibold text-gray-900'>Notifications</h2>
        <p className='text-sm text-gray-500 mt-0.5'>
          Manage which emails you receive
        </p>
      </div>

      <Card>
        <h3 className='text-sm font-semibold text-gray-900 mb-4'>Email Notifications</h3>

        <ul className='divide-y divide-gray-100'>
          {notificationSettings.map((item) => (
            <li key={item.key} className='flex items-center justify-between py-4 first:pt-0 last:pb-0'>
              <div className='flex-1 pr-6'>
                <p className='text-sm font-medium text-gray-900'>{item.label}</p>
                <p className='text-xs text-gray-500 mt-0.5'>{item.description}</p>
              </div>

              {/* Toggle switch */}
              <button
                onClick={() => toggle(item.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  prefs[item.key] ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    prefs[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <div className='flex items-center gap-3'>
        <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>
          Save preferences
        </Button>
        {success && (
          <span className='text-sm text-green-600 flex items-center gap-1'>
            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
            Saved
          </span>
        )}
      </div>

    </div>
  )
}