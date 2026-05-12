import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSummary, getRevenueChart, getTopProducts } from '../api/data.api'
import KPICards from '../components/dashboard/KPICards'
import RevenueChart from '../components/dashboard/RevenueChart'
import TopProducts from '../components/dashboard/TopProducts'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import CSVUpload from '../components/dashboard/CSVUpload'

export default function Dashboard() {
  const [range, setRange] = useState('daily')

  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary } = useQuery({
    queryKey: ['summary'],
    queryFn: () => getSummary().then((r) => r.data),
  })

  const { data: chartData, isLoading: chartLoading, refetch: refetchChart } = useQuery({
    queryKey: ['revenue-chart', range],
    queryFn: () => getRevenueChart(range).then((r) => r.data),
  })

  const { data: topProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['top-products'],
    queryFn: () => getTopProducts().then((r) => r.data),
  })

  const handleUploadSuccess = () => {
    refetchSummary()
    refetchChart()
  }

  return (
    <div className='space-y-6'>

      {/* KPI Cards */}
      <KPICards data={summary} loading={summaryLoading} />

      {/* Charts row */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <RevenueChart
            data={chartData}
            loading={chartLoading}
            onRangeChange={setRange}
          />
        </div>
        <TopProducts data={topProducts} loading={productsLoading} />
      </div>

      {/* Bottom row */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <ActivityFeed data={summary?.recentActivity} loading={summaryLoading} />
        </div>
        <CSVUpload onUploadSuccess={handleUploadSuccess} />
      </div>

    </div>
  )
}