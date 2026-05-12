import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getReports } from '../api/reports.api'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import { formatDate } from '../utils/formatDate'

export default function Reports() {
  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => getReports().then((r) => r.data),
  })

  return (
    <div className='space-y-6'>

      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-semibold text-gray-900'>Weekly Reports</h2>
          <p className='text-sm text-gray-500 mt-0.5'>
            AI-generated business reports delivered every Monday
          </p>
        </div>
      </div>

      {/* Reports list */}
      {isLoading ? (
        <div className='space-y-3'>
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <div className='space-y-2'>
                <Skeleton height='h-4' width='w-48' />
                <Skeleton height='h-3' width='w-72' />
              </div>
            </Card>
          ))}
        </div>
      ) : reports?.length === 0 ? (
        <Card>
          <div className='text-center py-12'>
            <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-6 h-6 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
            </div>
            <p className='text-sm font-medium text-gray-900'>No reports yet</p>
            <p className='text-sm text-gray-400 mt-1'>
              Your first report will be generated next Monday
            </p>
          </div>
        </Card>
      ) : (
        <div className='space-y-3'>
          {reports?.map((report) => (
            <Link key={report._id} to={`/reports/${report._id}`}>
              <Card className='hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <svg className='w-5 h-5 text-indigo-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                      </svg>
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-900'>
                        Week of {formatDate(report.weekStart)}
                      </p>
                      <p className='text-xs text-gray-500 mt-0.5 line-clamp-1'>
                        {report.summary}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3 flex-shrink-0'>
                    <Badge variant={report.growth >= 0 ? 'green' : 'red'}>
                      {report.growth >= 0 ? '+' : ''}{report.growth}%
                    </Badge>
                    <svg className='w-4 h-4 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}