import { AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

import Skeleton from '@/components/Skeleton'
import { useHostQueuesQuery } from '@/queries/useHostQueuesQuery'

import HostQueueCard from '../_components/HostQueueCard'

// Main component for displaying the user's created queues
export default function HostQueues() {
  const { data: queues, isLoading, error } = useHostQueuesQuery()

  return (
    <div className="py-8">
      <div className="flex flex-col justify-between items-center mb-6">
        <h1 className="text-2xl font-bold py-5 bg-primary w-full text-center">My Queues</h1>
      </div>
      <div className="mx-auto mt-11 py-12 px-5 bg-primary">
        {isLoading ? (
          <div className="container max-w-5xl mx-auto py-8 bg-white shadow-lg shadow-black/25 overflow-hidden rounded-[40px]">
            <ul className="space-y-6 px-4">
              {[1, 2, 3].map(i => (
                <li key={i}>
                  <Skeleton className="w-full h-20 rounded-3xl" />
                </li>
              ))}
            </ul>
          </div>
        ) : error ? (
          <div className="container max-w-5xl mx-auto text-center py-10 bg-white rounded-lg shadow-lg shadow-black/25 border border-gray-200">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading queues</h3>
            <p className="mt-1 text-sm text-gray-500">
              There was a problem loading your queues. Please try again.
            </p>
            <div className="mt-6">
              <button
                onClick={() => globalThis.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-lg shadow-black/25 bg-primary hover:bg-primary-sat focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Retry
              </button>
            </div>
          </div>
        ) : queues?.length === 0 ? (
          <div className="containe max-w-5xl mx-auto text-center py-10 bg-white rounded-lg shadow-lg shadow-black/25 border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No queues yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first queue.</p>
            <div className="mt-6">
              <Link
                to="/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-lg shadow-black/25 bg-primary hover:bg-primary-sat focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Queue
              </Link>
            </div>
          </div>
        ) : (
          <div className="container max-w-5xl mx-auto py-8 bg-white shadow-lg shadow-black/25 overflow-hidden rounded-[40px]">
            <ul className="space-y-6 px-4">
              {queues?.map(queue => (
                <HostQueueCard key={queue.id} queue={queue} />
              ))}
            </ul>
          </div>
        )}
        <Link
          to="/create"
          className="block w-10/12 max-w-3xl mx-auto text-center mt-11 py-2 text-lg font-semibold rounded-xl shadow-lg shadow-black/25 bg-white"
        >
          Create New Queue
        </Link>
      </div>
    </div>
  )
}
