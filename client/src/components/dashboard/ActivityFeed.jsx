import Card from '../ui/Card'
import Avatar from '../ui/Avatar'
import Skeleton from '../ui/Skeleton'

export default function ActivityFeed({ data, loading }) {
  return (
    <Card>
      <h3 className='text-sm font-semibold text-gray-900 mb-4'>Recent Activity</h3>

      {loading ? (
        <div className='space-y-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='flex items-center gap-3'>
              <Skeleton width='w-9' height='h-9' className='rounded-full' />
              <div className='flex-1 space-y-1'>
                <Skeleton height='h-3' width='w-48' />
                <Skeleton height='h-3' width='w-24' />
              </div>
            </div>
          ))}
        </div>
      ) : data?.length === 0 ? (
        <p className='text-sm text-gray-400 text-center py-8'>No activity yet</p>
      ) : (
        <ul className='space-y-4'>
          {data?.map((item, i) => (
            <li key={i} className='flex items-start gap-3'>
              <Avatar name={item.userName} size='sm' />
              <div className='flex-1 min-w-0'>
                <p className='text-sm text-gray-900'>
                  <span className='font-medium'>{item.userName}</span>{' '}
                  <span className='text-gray-500'>{item.action}</span>
                </p>
                <p className='text-xs text-gray-400 mt-0.5'>{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}