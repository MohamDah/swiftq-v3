import { useCustomerStatus } from '@/queries/useCustomerStatus';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmationModal from '@/components/modals/Confirmation';
import { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorComponent from '@/components/ErrorComponent';
import { getCustomerName } from '@/utils/utils';
import { useCancelEntryMutation } from '@/queries/mutations/useCancelEntry';

// /queue/:queueId/customer
export default function CustomerView() {
  const { qrCode } = useParams<{ qrCode: string; }>();
  const { data: status, isLoading, error: statusError } = useCustomerStatus(qrCode || null)
  const { mutateAsync: cancelEntry, isPending: isCancelling } = useCancelEntryMutation()
  const navigate = useNavigate();
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const exitQueue = async () => {
    if (!status) return
    await cancelEntry({ entryId: status.sessionToken })
    setShowExitConfirmation(false)
  }

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
      case 'CANCELLED':
        return 'You have left the queue';
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
      case 'CANCELLED':
        return 'bg-red-100 border-red-400';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };


  if (isLoading || !status) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow text-center">
        <LoadingSpinner />
        <p className="text-gray-600 mt-4">Loading your position...</p>
      </div>
    );
  }

  if (statusError) {
    return (
      <ErrorComponent
        error={statusError}
        title="Error Loading Queue Status"
        onRetry={() => window.location.reload()}
        onGoBack={() => navigate("/")}
        goBackText="Return to Home"
        fullScreen
      />
    );
  }

  const etaWaitTime = status.queue.totalWaiting

  // Show cancelled state UI
  if (status.status === 'CANCELLED') {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 pb-9 bg-white rounded-[40px] shadow-lg shadow-black/25">
        <h1 className="text-xl font-bold mb-2 text-center">{status.queue.name}</h1>
        <p className="mb-6 text-center font-medium">
          Host: {status.queue.businessName}
        </p>

        <div className="p-4 border rounded-3xl mb-6 bg-red-100 border-red-400">
          <div className="text-center">
            <h2 className="font-bold text-lg mb-2">
              {getCustomerName(status)}
            </h2>
            <div className="font-semibold text-red-700">
              You have left the queue
            </div>
          </div>
        </div>

        <div className="mb-4 text-xs text-center text-gray-900">
          <p>You left this queue on {new Date().toLocaleString()}</p>
        </div>

        <div className="mt-8 border-t pt-4 space-y-3">
          <p className="text-xs text-gray-600 mb-3 text-center">
            You can join the queue again if it's still active.
          </p>
          <button
            onClick={() => navigate(`/join/${qrCode}`)}
            className="w-full font-semibold bg-secondary-light py-2 px-4 rounded-xl hover:bg-secondary shadow-lg shadow-black/25"
          >
            Rejoin Queue
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full font-semibold bg-primary-sat py-2 px-4 rounded-xl hover:bg-primary shadow-lg shadow-black/25"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 pb-9 bg-white rounded-[40px] shadow-lg shadow-black/25">

      <h1 className="text-xl font-bold mb-2 text-center">{status.queue.name}</h1>
      <p className="mb-6 text-center font-medium">
        Host: {status.queue.businessName}
      </p>

      <div className={`p-4 border rounded-3xl mb-6 ${getStatusColor()}`}>
        <div className={`flex justify-around flex-wrap`}>
          <h2 className="font-bold text-lg">
            {getCustomerName(status)}
          </h2>
          <div className="font-semibold mb-2">
            {getStatusDisplay()}
          </div>
        </div>

        <div className="mt-5 flex justify-between items-center mb-2">
          <span className='text-sm'>Your position:</span>
          <span className="font-bold">#{(status.peopleAhead + 1).toString().padStart(3, "0")}</span>
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
            onClick={() => setShowExitConfirmation(true)}
            disabled={isCancelling}
            className="w-full font-semibold bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 shadow-lg shadow-black/25 disabled:opacity-50"
          >
            {isCancelling ? 'Exiting...' : 'Exit Queue'}
          </button>
        )}
      </div>

      <ConfirmationModal
        open={showExitConfirmation}
        onClose={() => setShowExitConfirmation(false)}
        onConfirm={exitQueue}
        title="Exit Queue?"
        message="Are you sure you want to leave this queue? You will lose your position and need to rejoin if you change your mind."
        confirmText="Yes, Exit Queue"
        cancelText="Stay in Queue"
        variant="danger"
        isLoading={isCancelling}
      />
    </div>
  );
}