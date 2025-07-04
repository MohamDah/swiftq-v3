import { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { deleteQueue } from '../../firebase/services/queues';
import type { QueueItem } from '../../firebase/schema';

type LoaderData = {
  queues: (QueueItem & {count: number})[]
}

export default function HostQueues() {
  const loaderData = useLoaderData() as LoaderData
  const [queues, setQueues] = useState(loaderData.queues);

  const handleDelete = async (queueId: string) => {
    await deleteQueue(queueId)
    setQueues(queues.filter(i => i.id !== queueId))
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Queues</h1>
          <Link 
            to="/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Queue
          </Link>
        </div>


        {queues.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No queues yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first queue.</p>
            <div className="mt-6">
              <Link
                to="/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Queue
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {queues.map((queue) => (
                <li key={queue.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">{queue.count}</span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{queue.data.queueName}</h3>
                          <p className="text-sm text-gray-500">
                            Created {queue.data.createdAt.toDate().toLocaleDateString()} • 
                            {queue.data.requireCustomerName ? " Names required" : " Names not required"}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/my-queues/${queue.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Manage
                        </Link>
                        <Link
                          to={`/join/${queue.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Join Link
                        </Link>
                        <button
                          onClick={() => handleDelete(queue.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
