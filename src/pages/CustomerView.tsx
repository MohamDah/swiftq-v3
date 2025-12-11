import { useCustomerStatus } from '@/queries/useCustomerStatus';
import { useParams, useNavigate } from 'react-router-dom';

// /queue/:queueId/customer
export default function CustomerView() {
  const { qrCode } = useParams<{ qrCode: string; }>();
  console.log(qrCode)
  const { data: status, isLoading, error: statusError } = useCustomerStatus(qrCode || null)
  const navigate = useNavigate();


  // Helper function to format status for display
  const getStatusDisplay = () => {
    if (!status) return '';

    switch (status.status) {
      case 'CALLED':
        return 'It\'s your turn! Please proceed to the service point.';
      case 'WAITING':
        return 'Waiting in queue';
      case 'SERVED':
        return 'You have been served';
      case 'NO_SHOW':
        return 'You were skipped';
      default:
        return 'Unknown status';
    }
  };

  const getStatusColor = () => {
    if (!status) return 'bg-gray-100';

    switch (status.status) {
      case 'CALLED':
        return 'bg-green-100 border-green-500';
      case 'WAITING':
        return 'bg-primary/60 border-primary-sat';
      case 'SERVED':
        return 'bg-gray-100 border-gray-300';
      case 'NO_SHOW':
        return 'bg-yellow-100 border-yellow-400';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };


  if (isLoading || !status) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow text-center">
        <p className="text-gray-600">Loading your position...</p>
      </div>
    );
  }

  if (statusError) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Queue Status</h2>
          <p className="text-gray-600 mb-4">
            {statusError instanceof Error ? statusError.message : 'Unable to load your queue status. Please try again.'}
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full font-semibold bg-primary-sat py-2 px-4 rounded-xl hover:bg-primary shadow-lg shadow-black/25"
          >
            Retry
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full font-semibold bg-lime-100 py-2 px-4 rounded-xl hover:bg-gray-300 shadow-lg shadow-black/25"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const etaWaitTime = status.queue.totalWaiting

  return (
    <div className="max-w-md mx-auto mt-10 p-6 pb-9 bg-white rounded-[40px] shadow-lg shadow-black/25">

      <h1 className="text-xl font-bold mb-2 text-center">{status.queue.name}</h1>
      <p className="mb-6 text-center font-medium">
        Host: {status.queue.businessName}
      </p>

      <div className={`p-4 border rounded-3xl mb-6 ${getStatusColor()}`}>
        <div className={`flex justify-around flex-wrap`}>
          <h2 className="font-bold text-lg">
            {status.customerName}
          </h2>
          <div className="font-semibold mb-2">
            {getStatusDisplay()}
          </div>
        </div>

        <div className="mt-5 flex justify-between items-center mb-2">
          <span className='text-sm'>Your number:</span>
          <span className="font-bold">#{status.position.toString().padStart(3, "0")}</span>
        </div>
        {status.status === 'WAITING' && (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className='text-sm'>People ahead of you:</span>
              <span className="font-bold">{status.peopleAhead}</span>
            </div>
            {status.estimatedWaitTime && (
              <div className="flex justify-between items-center">
                <span className='text-sm'>Estimated wait time:</span>
                <span className="font-bold text-end">{etaWaitTime} minutes</span>
              </div>
            )}
          </>
        )}

        {status.status === 'CALLED' && status.calledAt && (
          <>
            <div className="text-green-700 font-medium mt-2">
              You were called at {new Date(status.calledAt).toLocaleTimeString()}
            </div>
          </>
        )}
      </div>

      <div className="mb-4 text-xs text-center text-gray-900">
        <p>You joined this queue on {new Date(status.joinedAt).toLocaleString()}</p>
      </div>

      {!status.queue.isActive && (
        <div className="bg-yellow-100 p-3 rounded-md mb-4 text-yellow-800 text-xs">
          Note: This queue is currently not accepting new customers.
        </div>
      )}

      <div className="mt-8 border-t pt-4 space-y-3">
        <p className="text-xs text-gray-900 mb-3">
          Keep this page open to maintain your position and receive notifications when it's your turn.
        </p>
        <button
          onClick={() => navigate("/")}
          className="w-full font-semibold bg-primary-sat py-2 px-4 rounded-xl hover:bg-primary shadow-lg shadow-black/25"
        >
          Return to Home
        </button>

        {/* Add Exit Queue button - only show if customer is waiting or notified */}
        {(status.status === 'WAITING' || status.status === 'CALLED') && (
          <button
            // onClick={handleExitQueue}
            // disabled={exitingQueue}
            className="w-full font-semibold bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 shadow-lg shadow-black/25"
          >
            {false ? 'Exiting...' : 'Exit Queue'}
          </button>
        )}
      </div>

    </div>
  );
}