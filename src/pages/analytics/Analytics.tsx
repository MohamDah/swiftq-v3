import { useState, useEffect } from 'react';
import { getAllCustomersForHost, getHostQueues } from '../../firebase/services/queues';
import { Timestamp } from 'firebase/firestore';
import { BarChart, BarChart2, PieChart } from 'lucide-react';

interface Analytics {
  peakHour: {
    hour: number;
    count: number;
  };
  averageWaitTime: number;
  averageCustomers: number;
  totalCustomers: number;
  totalQueues: number;
}

export default function Analytics() {
  const [loading, setLoading] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<Analytics>({
    peakHour: { hour: 0, count: 0 },
    averageWaitTime: 0,
    averageCustomers: 0,
    totalCustomers: 0,
    totalQueues: 0
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);

        // Fetch all customer data for all queues
        const allCustomerData = await getAllCustomersForHost();
        const queues = await getHostQueues();

        // Calculate analytics
        const hourCounts: Record<number, number> = {};
        let totalWaitTimeMinutes = 0;
        let waitTimeCustomers = 0;
        let totalCustomers = 0;

        // Process each queue's customers
        allCustomerData.forEach(queueData => {
          queueData.customers.forEach(customer => {
            totalCustomers++;

            // Count joinedAt hour for peak hour analysis
            if (customer.data.joinedAt) {
              const joinDate = (customer.data.joinedAt as Timestamp).toDate();
              const hour = joinDate.getHours();
              hourCounts[hour] = (hourCounts[hour] || 0) + 1;
            }

            // Calculate wait time if applicable
            if (customer.data.joinedAt && customer.data.servedAt) {
              const joinTime = (customer.data.joinedAt as Timestamp).toDate().getTime();
              const serveTime = (customer.data.servedAt as Timestamp).toDate().getTime();
              const waitTimeMs = serveTime - joinTime;
              const waitTimeMinutes = waitTimeMs / (1000 * 60);
              totalWaitTimeMinutes += waitTimeMinutes;
              waitTimeCustomers++;
            }
          });
        });

        // Find peak hour
        let peakHour = 0;
        let peakCount = 0;
        Object.entries(hourCounts).forEach(([hour, count]) => {
          if (count > peakCount) {
            peakHour = parseInt(hour);
            peakCount = count;
          }
        });

        // Calculate averages
        const averageWaitTime = waitTimeCustomers > 0 ? totalWaitTimeMinutes / waitTimeCustomers : 0;
        const averageCustomers = queues.length > 0 ? totalCustomers / queues.length : 0;

        setAnalytics({
          peakHour: {
            hour: peakHour,
            count: peakCount
          },
          averageWaitTime,
          averageCustomers,
          totalCustomers,
          totalQueues: queues.length
        });

      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour} ${period}`;
  };

  return (
    <div className="py-12 bg-primary">
      <h1 className="text-2xl font-semibold mb-6 text-center bg-white py-5">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        <div className="bg-white rounded-lg shadow-md p-6 relative">
          <div className='absolute top-4 right-4'>
            <BarChart className='size-10' />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Peak Hour</h2>
          <p className="text-3xl font-bold text-green-700">{formatHour(analytics.peakHour.hour)}</p>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Avg. Wait Time</h2>
          <p className="text-3xl font-bold text-green-700">
            {analytics.averageWaitTime > 0
              ? `${analytics.averageWaitTime.toFixed(1)} min`
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
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Avg. No. Customers</h2>
          <p className="text-3xl font-bold text-green-700">
            {analytics.averageCustomers > 0
              ? analytics.averageCustomers.toFixed(1)
              : "N/A"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Average number of customers per queue
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">Summary</h2>
          <p className="text-gray-700">
            You have created {analytics.totalQueues} queues with a total of {analytics.totalCustomers} customers.
            The busiest time is at {formatHour(analytics.peakHour.hour)}, when most customers join your queues.
          </p>
        </div>
      </div>
    </div>
  );
}
