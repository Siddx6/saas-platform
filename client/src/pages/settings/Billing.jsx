import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getWorkspace } from '../../api/workspace.api'
import { createOrder, verifyPayment } from '../../api/billing.api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import useWorkspaceStore from '../../store/workspaceStore'

const features = {
  free: [
    '1 user',
    '30 days of data history',
    'Basic dashboard',
    'Manual CSV upload',
  ],
  pro: [
    'Unlimited users',
    'Full data history',
    'AI weekly reports',
    'Email report delivery',
    'Priority support',
  ],
}

export default function Billing() {
  const { workspace, setWorkspace } = useWorkspaceStore()
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const { data: workspaceData } = useQuery({
    queryKey: ['workspace'],
    queryFn: () => getWorkspace().then((r) => r.data),
  })

  const isPro = workspaceData?.plan === 'pro'

  const handleUpgrade = async () => {
    try {
      setLoading(true)
      const res = await createOrder()
      const { orderId, amount, currency, key } = res.data

      const options = {
        key,
        amount,
        currency,
        name: 'SaaSPlatform',
        description: 'Pro Plan — Monthly',
        order_id: orderId,
        handler: async (response) => {
          const verifyRes = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })
          if (verifyRes.data.success) {
            setWorkspace({ ...workspace, plan: 'pro' })
            queryClient.invalidateQueries(['workspace'])
            window.location.reload()
          }
        },
        theme: { color: '#6366f1' },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error('Payment failed', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6 max-w-3xl'>

      <div>
        <h2 className='text-lg font-semibold text-gray-900'>Billing & Plan</h2>
        <p className='text-sm text-gray-500 mt-0.5'>Manage your subscription</p>
      </div>

      {/* Current plan */}
      <Card>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-sm font-semibold text-gray-900'>Current Plan</h3>
          <Badge variant={isPro ? 'purple' : 'gray'}>
            {isPro ? 'Pro' : 'Free'}
          </Badge>
        </div>
        <div className='flex items-baseline gap-1 mb-1'>
          <span className='text-3xl font-semibold text-gray-900'>
            {isPro ? '₹999' : '₹0'}
          </span>
          <span className='text-sm text-gray-500'>/month</span>
        </div>
        <p className='text-sm text-gray-500'>
          {isPro ? 'You are on the Pro plan' : 'You are on the Free plan'}
        </p>
      </Card>

      {/* Plans comparison */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

        {/* Free plan */}
        <Card className={!isPro ? 'border-indigo-200 ring-1 ring-indigo-200' : ''}>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-semibold text-gray-900'>Free</h3>
            {!isPro && <Badge variant='indigo'>Current</Badge>}
          </div>
          <p className='text-2xl font-semibold text-gray-900 mb-4'>₹0</p>
          <ul className='space-y-2'>
            {features.free.map((f) => (
              <li key={f} className='flex items-center gap-2 text-sm text-gray-600'>
                <svg className='w-4 h-4 text-green-500 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </Card>

        {/* Pro plan */}
        <Card className={isPro ? 'border-indigo-200 ring-1 ring-indigo-200' : ''}>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-semibold text-gray-900'>Pro</h3>
            {isPro && <Badge variant='purple'>Current</Badge>}
          </div>
          <p className='text-2xl font-semibold text-gray-900 mb-4'>₹999<span className='text-sm font-normal text-gray-500'>/mo</span></p>
          <ul className='space-y-2 mb-6'>
            {features.pro.map((f) => (
              <li key={f} className='flex items-center gap-2 text-sm text-gray-600'>
                <svg className='w-4 h-4 text-indigo-500 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          {!isPro && (
            <Button fullWidth loading={loading} onClick={handleUpgrade}>
              Upgrade to Pro
            </Button>
          )}
        </Card>

      </div>

    </div>
  )
}