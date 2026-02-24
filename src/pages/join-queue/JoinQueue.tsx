import { useJoinQueueMutation } from "@/queries/mutations/useJoinQueue";
import { useExistingPositionQuery } from "@/queries/useExistingPosition";
import { usePublicQueueDetailsQuery } from "@/queries/usePublicQueueDetails";
import { displayError } from "@/utils/displayError";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface JoinQueueForm {
  customerName?: string
}

// Join Queue page - allows customers to join a queue by ID
// Route: /join/:qrCode
export default function JoinQueue() {
  const { qrCode } = useParams<{ qrCode: string; }>();
  const { data: queueData, isLoading, error: queueError } = usePublicQueueDetailsQuery(qrCode || null)
  const { data: entryStatus, isLoading: isLoadingStatus } = useExistingPositionQuery(qrCode)
  const { mutateAsync: joinQueue, isPending: joining, error: joinError } = useJoinQueueMutation()
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { isValid, errors } } = useForm<JoinQueueForm>()

  // Check if user already has an active position
  useEffect(() => {
    if (entryStatus?.hasEntry) {
      navigate(`/queue/${qrCode}/customer`, { replace: true });
    }
  }, [entryStatus, qrCode, navigate]);

  // Handle form submission to join the queue
  const handleJoinQueue = async (data: JoinQueueForm) => {

    if (!qrCode) return;

    await joinQueue({
      qrCode,
      customerName: data.customerName || undefined
    })

    navigate(`/queue/${qrCode}/customer`);
  };

  if (queueError) {
    return (
      <div className="bg-primary max-w-md mx-auto mt-10 p-6  rounded-lg shadow">
        <div className="text-red-500 text-center">{displayError(queueError)}</div>
        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (isLoading || isLoadingStatus || !queueData) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow text-center flex flex-col items-center">
        <LoadingSpinner />
        <p className="text-gray-600 mt-4">Loading queue details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-[40px] shadow-lg shadow-black/25">
      <h1 className="text-xl text-center font-bold mb-4">{queueData.name}</h1>

      {!queueData.isActive ? (
        <div className="bg-yellow-100 p-4 rounded-md text-yellow-800 mb-4">
          This queue is currently closed and not accepting new customers.
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleJoinQueue)}>
          {joinError && (
            <div className="mb-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {displayError(joinError)}
            </div>
          )}
          <div className="mb-4">
            <label className="block font-semibold mb-2" htmlFor="name">
              Your Name {!queueData.requireNames ? '(Optional)' : ''}
            </label>
            <input
              {...register('customerName', {
                required: queueData.requireNames
              })}
              type="text"
              id="name"
              className="w-full px-3 py-2 text-sm border-2 border-primary rounded-md focus:outline-none"
              placeholder="Enter your name"
              required={queueData.requireNames}
            />
            {errors.customerName && <p className="mt-1 text-sm text-red-700">{errors.customerName.message}</p>}
          </div>

          <button
            type="submit"
            disabled={!isValid || joining}
            className="w-full bg-primary-sat font-semibold shadow-lg shadow-black/25 py-2 px-4 mt-4 rounded-xl hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {joining ? "Joining..." : "Join Queue"}
          </button>
        </form>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Host:</span>
          <span>{queueData.businessName}</span>
        </div>
        {queueData.averageServiceTime && (
          <div className="flex justify-between items-center">
            <span className="font-semibold">Est. wait per person:</span>
            <span>{queueData.averageServiceTime} min</span>
          </div>
        )}
      </div>
    </div>
  );
}