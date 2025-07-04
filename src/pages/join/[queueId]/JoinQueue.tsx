/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import { joinQueue } from "../../../firebase/services/queues";
import { type CustomerItem, type Queue } from "../../../firebase/schema";

type LoaderData = {
  queue: { id: string, data: Queue };
  prevPositions: CustomerItem[];
};

export default function JoinQueue() {
  const { queueId } = useParams<{ queueId: string }>();
  const navigate = useNavigate();
  const {queue, prevPositions} = useLoaderData() as LoaderData
  const queueData = queue.data

  const [customerName, setCustomerName] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoinQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!queueId) return;
    
    // If queue requires name but none provided
    if (queueData?.requireCustomerName && !customerName.trim()) {
      setError("Please enter your name to join this queue");
      return;
    }
    
    setJoining(true);
    setError(null);
    
    try {
      const customerId = await joinQueue(queueId, customerName.trim() || undefined);
      
      // Navigate to customer view
      navigate(`/queue/${queueId}/customer/${customerId}`);
    } catch (err: any) {
      console.error("Error joining queue:", err);
      setError(err.message || "Failed to join the queue");
    } finally {
      setJoining(false);
    }
  };

  const goToPreviousPosition = (customerId: string) => {
    navigate(`/queue/${queueId}/customer/${customerId}`);
  };


  if (error || !queueData) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
        <div className="text-red-500 text-center">{error}</div>
        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">{queueData.queueName}</h1>
      <p className="text-gray-600 mb-6">
        {queueData.isActive 
          ? "Please provide your information below to join this queue." 
          : "This queue is currently not accepting new customers."}
      </p>

      {prevPositions.length > 0 && (
        <div className="mb-6 bg-blue-50 p-4 rounded-md">
          <h2 className="font-semibold text-lg mb-2">Your Previous Positions</h2>
          <p className="text-sm text-gray-600 mb-3">
            You already have active positions in this queue. You can return to one of them:
          </p>
          <div className="space-y-2">
            {prevPositions.map((position) => (
              <div key={position.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{position.data.name || 'Anonymous'}</p>
                  <p className="text-xs text-gray-500">
                    Joined: {position.data.joinedAt.toDate().toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Status: {position.data.status === 'notified' ? 'Ready to be served' : 'Waiting'}
                  </p>
                </div>
                <button
                  onClick={() => goToPreviousPosition(position.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Return
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-blue-100">
            <p className="text-sm text-blue-700">Or join as a new customer below.</p>
          </div>
        </div>
      )}

      {!queueData.isActive ? (
        <div className="bg-yellow-100 p-4 rounded-md text-yellow-800 mb-4">
          This queue is currently closed and not accepting new customers.
        </div>
      ) : (
        <form onSubmit={handleJoinQueue}>
          {queueData.requireCustomerName && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          {!queueData.requireCustomerName && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Your Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter your name (optional)"
              />
              <p className="text-sm text-gray-500 mt-1">
                You can join this queue without providing your name.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={joining || (queueData.requireCustomerName && !customerName.trim())}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${
              joining || (queueData.requireCustomerName && !customerName.trim())
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {joining ? "Joining..." : "Join Queue"}
          </button>
        </form>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Host:</span>
          <span>{queueData.hostName}</span>
        </div>
        {queueData.estimatedWaitPerPerson && (
          <div className="flex justify-between items-center">
            <span className="font-semibold">Est. wait per person:</span>
            <span>~{queueData.estimatedWaitPerPerson} minutes</span>
          </div>
        )}
      </div>
    </div>
  );
}