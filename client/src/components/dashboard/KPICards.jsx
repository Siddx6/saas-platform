import Card from '../ui/Card'
import Skeleton from '../ui/Skeleton'

const cards = [
  {
    label: 'Total Revenue',
    key: 'totalRevenue',
    prefix: '₹',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
      </svg>
    ),
  },
  {
    label: 'Growth',
    key: 'growth',
    suffix: '%',
    color: 'text-green-600',
    bg: 'bg-green-50',
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' />
      </svg>
    ),
  },
  {
    label: 'Total Orders',
    key: 'totalOrders',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
      </svg>
    ),
  },
  {
    label: 'Active Users',
    key: 'activeUsers',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    icon: (
      <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' />
      </svg>
    ),
  },
]

export default function KPICards({ data, loading }) {
  if (loading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <Skeleton height='h-3' width='w-24' className='mb-3' />
            <Skeleton height='h-8' width='w-32' />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      {cards.map((card) => (
        <Card key={card.key}>
          <div className='flex items-center justify-between mb-3'>
            <p className='text-sm text-gray-500'>{card.label}</p>
            <div className={`w-9 h-9 rounded-lg ${card.bg} ${card.color} flex items-center justify-center`}>
              {card.icon}
            </div>
          </div>
          <p className='text-2xl font-semibold text-gray-900'>
            {card.prefix || ''}
            {data?.[card.key]?.toLocaleString('en-IN') ?? '—'}
            {card.suffix || ''}
          </p>
        </Card>
      ))}
    </div>
  )
}