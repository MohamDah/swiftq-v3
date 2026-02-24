import { useState, useEffect } from 'react';
import { BarChart, BarChart2, PieChart } from 'lucide-react';
import { useAnalytics } from '@/queries/useAnalytics';
import { TimeFilter } from '@/types/api';

// /analytics
export default function Analytics() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const {data: analytics, isLoading, isError} = useAnalytics({filter: timeFilter})

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour} ${period}`;
  };

  const getFilterDisplayName = (filter: TimeFilter): string => {
    switch (filter) {
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'all': return 'All Time';
      default: return 'All Time';
    }
  };

  return (
    <div className="py-12 bg-primary">
      <h1 className="text-2xl font-semibold mb-6 text-center bg-white py-5">Analytics</h1>

      <div className="px-6 mb-6 container mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-wrap justify-center gap-2">
          {(['today', 'yesterday', 'week', 'month', 'all'] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-2 rounded-md transition-colors ${timeFilter === filter
                ? 'bg-green-700 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
                }`}
            >
              {getFilterDisplayName(filter)}
            </button>
          ))}
        </div>
      </div>

      {isLoading || !analytics ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 container mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 relative">
              <div className='absolute top-4 right-4'>
                <BarChart className='size-10' />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 md:text-sm lg:text-lg">Peak Hour</h2>
              <p className="text-3xl font-bold text-green-700">{
                analytics.peakHour.count > 0
                  ? formatHour(analytics.peakHour.hour)
                  : "N/A"
              }</p>
              <p className="text-sm text-gray-500 mt-1">
                {analytics.peakHour.count > 0
                  ? `${analytics.peakHour.count} customers joined during this hour`
                  : "Not enough data to determine peak hour"}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 relative">
              <div className='absolute top-4 right-4'>
                <PieChart className='size-10' />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 md:text-sm lg:text-lg">Avg. Wait Time</h2>
              <p className="text-3xl font-bold text-green-700">
                {analytics.averageWaitTime > 0
                  ? `${analytics.averageWaitTime} min`
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {analytics.averageWaitTime > 0
                  ? "Average time customers waited to be served"
                  : "No wait time data available yet"}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 relative">
              <div className='absolute top-4 right-4'>
                <BarChart2 className='size-10' />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 md:text-sm lg:text-lg">Avg. No. Customers</h2>
              <p className="text-3xl font-bold text-green-700">
                {analytics.averageCustomers > 0
                  ? analytics.averageCustomers
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Average number of customers per queue
              </p>
            </div>
          </div>

          <div className="mt-8 px-6 container mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-3">Summary for {getFilterDisplayName(timeFilter)}</h2>
              <p className="text-gray-700">
                {analytics.totalCustomers > 0 ? (
                  <>
                    You have {timeFilter === 'all' ? 'served' : 'served during this period'} a total of {analytics.totalCustomers} customers
                    {analytics.totalQueues > 0 ? ` across ${analytics.totalQueues} queues` : ''}.
                    {analytics.peakHour.count > 0 ? ` The busiest time is at ${formatHour(analytics.peakHour.hour)}, when most customers join your queues.` : ''}
                  </>
                ) : (
                  `No customer data available for ${getFilterDisplayName(timeFilter).toLowerCase()}.`
                )}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
