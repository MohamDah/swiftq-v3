import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQueue } from '../firebase/services/queues';

export default function CreateQueue() {
  const [queueName, setQueueName] = useState('');
  const [requireNames, setRequireNames] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!queueName.trim()) {
      setError('Queue name is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Create the queue in Firestore, passing the requireNames parameter
      const queueId = await createQueue(queueName, requireNames);
      
      // Redirect to the queue details page
      navigate(`/my-queues/${queueId}`);
    } catch (err) {
      console.error('Error creating queue:', err);
      setError('Failed to create queue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Create a New Queue</h1>
              <p className="mt-2 text-sm text-gray-600">
                Set up a new queue for your customers to join
              </p>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="queueName" className="block text-sm font-medium text-gray-700">
                  Queue Name *
                </label>
                <div className="mt-1">
                  <input
                    id="queueName"
                    name="queueName"
                    type="text"
                    required
                    value={queueName}
                    onChange={(e) => setQueueName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Coffee Shop Queue"
                  />
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="requireNames"
                    name="requireNames"
                    type="checkbox"
                    checked={requireNames}
                    onChange={(e) => setRequireNames(e.target.checked)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="requireNames" className="font-medium text-gray-700">
                    Require customer names
                  </label>
                  <p className="text-gray-500">When enabled, customers will need to provide their name to join the queue</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-8">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Creating...' : 'Create Queue'}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Queue Features</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-sm text-gray-600">Track customer wait times</span>
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-sm text-gray-600">Notify customers when it's their turn</span>
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-sm text-gray-600">Shareable link and QR code</span>
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-sm text-gray-600">Real-time queue status</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}