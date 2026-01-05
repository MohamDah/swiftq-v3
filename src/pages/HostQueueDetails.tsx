import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { useHostQueueDetailsQuery } from '@/queries/useHostQueueDetails';
import QueueEntryCard from '@/components/host/QueueEntryCard';
import { useDeleteQueueMutation } from '@/queries/mutations/useDeleteQueue';
import { useUpdateQueueMutation } from '@/queries/mutations/useUpdateQueue';
import { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorComponent from '@/components/ErrorComponent';
import ConfirmationModal from '@/components/modals/Confirmation';
import { useHostES } from '@/hooks/useHostES';

// /my-queues/:queueId
export default function HostQueueDetails() {
  const { queueId = "" } = useParams<{ queueId: string; }>();
  const navigate = useNavigate();
  const { data: queue, isLoading, error } = useHostQueueDetailsQuery(queueId)

  const { mutateAsync: deleteQueue, isPending: isDeleting } = useDeleteQueueMutation()
  const { mutateAsync: updateQueue, isPending: isUpdating } = useUpdateQueueMutation()

  useHostES({ queueId })

  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDelete = async () => {
    if (!queue) return

    await deleteQueue({ id: queue.id })
    setConfirmDelete(false)
    navigate('/my-queues')
  }

  const handleToggleActive = async () => {
    if (!queue) return

    await updateQueue({
      queueId: queue.id,
      isActive: !queue.isActive
    })
  }

  // Generate shareable join link
  const getJoinLink = () => {
    if (!queue) return ''
    return `${window.location.origin}/join/${queue.qrCode}`;
  };

  // Copy join link to clipboard
  const copyJoinLink = () => {
    navigator.clipboard.writeText(getJoinLink());
  };

  if (error) {
    return (
      <ErrorComponent
        error={error}
        title="Error Loading Queue"
        message="Queue not found or you don't have access"
        onGoBack={() => navigate('/my-queues')}
        onRetry={() => window.location.reload()}
        goBackText="Back to My Queues"
        fullScreen
      />
    );
  }

  if (isLoading || !queue) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="bg-primary">
      <h1 className="text-2xl text-center font-bold flex-1 bg-white py-5 mt-6">{queue.name}</h1>
      <div className="container px-4 mx-auto my-10 lg:grid grid-cols-2 grid-rows-2 grid-flow-col lg:items-start lg:gap-x-10">
        {/* Queue status and actions */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl overflow-hidden mb-6 shadow-md shadow-black/25">
            <div className="m-4 p-4 bg-primary/60 rounded-2xl">
              <div className="flex flex-col md:flex-row gap-2 flex-wrap md:items-center justify-between">
                <div className='min-w-fit'>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border-2 ${queue.isActive ? 'bg-green-200 text-green-800 border-green-500' : 'bg-red-200 text-red-800 border-red-500'
                      }`}>
                      {queue.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="ml-2 font-medium">{queue.entries.length} in queue</span>
                  </div>
                  <p className="mt-2 text-sm">
                    Created: {new Date(queue.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    Names required: {queue.requireNames ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-4 flex-wrap justify-center text-xs *:shadow-lg *:shadow-black/25">
                  <button
                    onClick={handleToggleActive}
                    disabled={isUpdating}
                    className={`px-3 py-2 text-white rounded-md disabled:opacity-50 ${queue.isActive
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                      }`}
                  >
                    {queue.isActive ? 'Deactivate Queue' : 'Activate Queue'}
                  </button>
                  <button
                    onClick={copyJoinLink}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Copy Join Link
                  </button>
                  <Link
                    target='_blank'
                    to={`/qr/${queue.id}`}
                    className="px-3 py-2 bg-primary-sat rounded-md hover:bg-primary disabled:opacity-50"
                  >
                    View QR Code
                  </Link>
                  <button
                    onClick={() => setConfirmDelete(true)}
                    disabled={isDeleting}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete Queue
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Queue stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-2xl shadow-md shadow-black/25">
            <div className="bg-primary/60 rounded-lg shadow-md p-4">
              <h3 className=" font-semibold text-gray-900">Current Queue Size</h3>
              <p className="text-2xl font-bold text-green-700 mt-2">{queue.entries.length}</p>
            </div>
            <div className="bg-primary/60 rounded-lg shadow-md p-4">
              <h3 className=" font-semibold text-gray-900">Average Wait Time</h3>
              <p className="text-2xl font-bold text-green-700 mt-2">
                {queue.averageServiceTime
                  ? `${formatDistance(new Date(Date.now() - queue.averageServiceTime), new Date())}`
                  : 'N/A'}
              </p>
            </div>
            <div className="bg-primary/60 rounded-lg shadow-md p-4">
              <h3 className=" font-semibold text-gray-900">Est. Total Time</h3>
              <p className="text-2xl font-bold text-green-700 mt-2">
                {queue.averageServiceTime && queue.entries.length
                  ? `${formatDistance(new Date(Date.now() - (queue.averageServiceTime * queue.entries.length)), new Date())}`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Customers list */}
        <div className="lg:row-span-2 bg-white rounded-xl overflow-hidden shadow-md shadow-black/25">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Customers in Queue</h2>
            <p className="mt-1 text-xs text-gray-500">
              Manage customers and their status in the queue.
            </p>
          </div>

          {queue.entries.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">No customers in the queue.</p>
            </div>
          ) : (
            <div className="space-y-4 my-3">
              {queue.entries.map((customer) => (
                <QueueEntryCard key={customer.id} customer={customer} />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Queue?"
        message="Are you sure you want to delete this queue? This action cannot be undone and all customer data will be lost."
        confirmText="Yes, Delete Queue"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
