import { useCustomerStatus } from '@/queries/useCustomerStatus';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmationModal from '@/components/modals/Confirmation';
import { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorComponent from '@/components/ErrorComponent';
import { useCancelEntryMutation } from '@/queries/mutations/useCancelEntry';
import { useCustomerES } from '@/hooks/useCustomerES';
import { useAudio } from '@/hooks/useAudio';

// /queue/:queueId/customer
export default function CustomerView() {
  const { qrCode } = useParams<{ qrCode: string; }>();
  const { data: status, isLoading, error: statusError } = useCustomerStatus(qrCode || null)
  const { mutateAsync: cancelEntry, isPending: isCancelling } = useCancelEntryMutation()
  const navigate = useNavigate();
  const { playAudio } = useAudio('/notification-sound.mp3')

  useCustomerES({
    qrCode,
    sessionToken: status?.sessionToken,
    onMessage: (data) => {
      if (data.type === 'CALL') {
        playAudio()
      }
      return true
    }
  })

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

  return (
    <div className="max-w-md mx-auto mt-10 p-6 pb-9 bg-white rounded-[40px] shadow-lg shadow-black/25">

      <h1 className="text-xl font-bold mb-2 text-center">{status.queue.name}</h1>
      <p className="mb-6 text-center font-medium">
        Host: {status.queue.businessName}
      </p>

      <div className='flex justify-center gap-6 mb-6'>
        {/* Customer Name if exists */}
        {status.customerName && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Customer</p>
            <p className="text-lg font-semibold text-primary-text">{status.customerName}</p>
          </div>
        )}

        {/* Display Number prominently */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Your Number</p>
          <p className="text-4xl font-bold text-primary-text">{status.displayNumber}</p>
        </div>
      </div>


      {/* Actual Position Highlight Box - only show when waiting */}
      {status.status === 'WAITING' && (
        <div className="bg-primary/20 border-2 border-primary-sat rounded-xl p-4 mb-6 text-center">
          <p className="text-xl font-bold">
            You are #{(status.peopleAhead + 1).toString().padStart(2, "0")} in line
          </p>
        </div>
      )}

      <div className={`p-4 border rounded-3xl mb-6 ${getStatusColor()}`}>
        {status.status === 'WAITING' && (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className='text-sm'>People ahead of you</span>
              <span className="font-bold">{status.peopleAhead}</span>
            </div>
            {status.estimatedWaitTime && (
              <div className="flex justify-between items-center mb-2">
                <span className='text-sm'>Estimated wait:</span>
                <span className="font-bold">{Math.ceil((status.peopleAhead + 1) * (status.queue.averageServiceTime || 0))} minutes</span>
              </div>
            )}
            <div className="flex justify-between items-center mb-2">
              <span className='text-sm'>Total in queue:</span>
              <span className="font-bold">{etaWaitTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className='text-sm'>Status:</span>
              <span className="font-bold capitalize">{status.status.toLowerCase()}</span>
            </div>
          </>
        )}

        {status.status === 'CALLED' && (
          <>
            <div className="text-center">
              <p className="font-bold text-lg text-green-700 mb-2">
                It's your turn! Please proceed to the service point.
              </p>
              {status.calledAt && (
                <p className="text-sm text-green-700">
                  Called at {new Date(status.calledAt).toLocaleTimeString()}
                </p>
              )}
            </div>
          </>
        )}

        {(status.status !== 'WAITING' && status.status !== 'CALLED') && (
          <div className="text-center font-semibold">
            {getStatusDisplay()}
          </div>
        )}
      </div>

      <div className="mb-4 text-xs text-center text-gray-900">
        <p>You {status.status === 'CANCELLED' ? 'left' : 'joined'} this queue on {new Date(status.status === 'CANCELLED' ? new Date() : status.joinedAt).toLocaleString()}</p>
      </div>

      {!status.queue.isActive && (
        <div className="bg-yellow-100 p-3 rounded-md mb-4 text-yellow-800 text-xs">
          Note: This queue is currently not accepting new customers.
        </div>
      )}

      <div className="mt-8 border-t pt-4 space-y-3">
        {status.status === 'CANCELLED' ? (
          <>
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
          </>
        ) : (
          <>
            <p className="text-xs text-gray-900 mb-3">
              Keep this page open to maintain your position and receive notifications when it's your turn.
            </p>
            {status.status === 'SERVED' && (
              <button
                onClick={() => navigate(`/join/${qrCode}`)}
                className="w-full font-semibold bg-secondary-light py-2 px-4 rounded-xl hover:bg-secondary shadow-lg shadow-black/25"
              >
                Rejoin Queue
              </button>
            )}
            <button
              onClick={() => navigate("/")}
              className="w-full font-semibold bg-primary py-2 px-4 rounded-xl hover:bg-primary shadow-lg shadow-black/25"
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
                {isCancelling ? 'Leaving Queue...' : 'Leave Queue'}
              </button>
            )}
          </>
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