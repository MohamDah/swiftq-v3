import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getQueue, 
  getCustomerStatus, 
  getCustomerPosition 
} from '../../../../../firebase/services/queues';
import { 
  doc, 
  onSnapshot,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../../../../firebase/config';
import type { Queue, Customer } from '../../../../../firebase/schema';

export default function CustomerView() {
  const { queueId, customerId } = useParams<{ queueId: string; customerId: string }>();
  const navigate = useNavigate();
  
  const [queue, setQueue] = useState<Queue | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [position, setPosition] = useState<{ position: number; totalAhead: number; estimatedWaitTime: number | null }>({
    position: 0,
    totalAhead: 0,
    estimatedWaitTime: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial data fetch
  useEffect(() => {
    if (!queueId || !customerId) {
      setError('Invalid queue or customer ID');
      setLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      try {
        // Get queue data
        const queueData = await getQueue(queueId);
        if (!queueData) {
          setError('Queue not found');
          setLoading(false);
          return;
        }
        setQueue(queueData.data);

        // Get customer data
        const customerData = await getCustomerStatus(queueId, customerId);
        if (!customerData) {
          setError('Customer position not found');
          setLoading(false);
          return;
        }
        setCustomer(customerData);

        // Get position data
        const positionData = await getCustomerPosition(queueId, customerId);
        setPosition(positionData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load queue information');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [queueId, customerId]);

  // Set up real-time listeners
  useEffect(() => {
    if (!queueId || !customerId || loading) return;

    // Listen for changes to the customer document
    const customerUnsubscribe = onSnapshot(
      doc(db, 'queues', queueId, 'customers', customerId),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Customer;
          setCustomer(data);
        } else {
          setError('Customer position no longer exists');
        }
      },
      (err) => {
        console.error('Error in customer listener:', err);
        setError('Failed to get real-time updates');
      }
    );

    // Listen for changes to customers ahead in the queue to update position
    const customersAheadUnsubscribe = onSnapshot(
      query(
        collection(db, 'queues', queueId, 'customers'),
        where('status', 'in', ['waiting', 'notified']),
      ),
      async (snapshot) => {
        try {
          // Recalculate total customers ahead
          if (customer) {
            const ahead = snapshot.docs.filter(
              doc => (doc.data() as Customer).position < customer.position
            ).length;
            
            setPosition(prev => ({
              ...prev,
              totalAhead: ahead,
              estimatedWaitTime: queue?.estimatedWaitPerPerson ? ahead * queue.estimatedWaitPerPerson : null
            }));
          }
        } catch (err) {
          console.error('Error calculating position:', err);
        }
      },
      (err) => {
        console.error('Error in queue listener:', err);
      }
    );

    // Listen for changes to the queue document
    const queueUnsubscribe = onSnapshot(
      doc(db, 'queues', queueId),
      (snapshot) => {
        if (snapshot.exists()) {
          const queueData = snapshot.data() as Queue;
          setQueue(queueData);
          
          // Update estimated wait time if applicable
          if (queueData.estimatedWaitPerPerson) {
            setPosition(prev => ({
              ...prev,
              estimatedWaitTime: prev.totalAhead * queueData.estimatedWaitPerPerson!
            }));
          }
        } else {
          setError('Queue no longer exists');
        }
      },
      (err) => {
        console.error('Error in queue listener:', err);
      }
    );

    // Clean up listeners
    return () => {
      customerUnsubscribe();
      customersAheadUnsubscribe();
      queueUnsubscribe();
    };
  }, [queueId, customerId, customer, queue, loading]);

  // Helper function to format status for display
  const getStatusDisplay = () => {
    if (!customer) return '';
    
    switch (customer.status) {
      case 'notified':
        return 'It\'s your turn! Please proceed to the service point.';
      case 'waiting':
        return 'Waiting in queue';
      case 'served':
        return 'You have been served';
      case 'skipped':
        return 'You were skipped';
      default:
        return 'Unknown status';
    }
  };

  const getStatusColor = () => {
    if (!customer) return 'bg-gray-100';
    
    switch (customer.status) {
      case 'notified':
        return 'bg-green-100 border-green-500';
      case 'waiting':
        return 'bg-blue-50 border-blue-300';
      case 'served':
        return 'bg-gray-100 border-gray-300';
      case 'skipped':
        return 'bg-yellow-100 border-yellow-400';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow text-center">
        <p className="text-gray-600">Loading your position...</p>
      </div>
    );
  }

  if (error || !queue || !customer) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
        <div className="text-red-500 text-center mb-4">{error || "Could not find your position in queue"}</div>
        <button
          onClick={() => navigate("/")}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-2">{queue.queueName}</h1>
      <p className="text-gray-600 mb-6">
        Host: {queue.hostName}
      </p>

      <div className={`p-4 border rounded-md mb-6 ${getStatusColor()}`}>
        <h2 className="font-bold text-lg mb-2">
          {customer.name}
        </h2>
        <div className="text-lg font-medium mb-2">
          {getStatusDisplay()}
        </div>
        
        {customer.status === 'waiting' && (
          <>
            <div className="flex justify-between items-center mb-1">
              <span>Your position:</span>
              <span className="font-bold text-lg">{position.position}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span>People ahead of you:</span>
              <span className="font-bold text-lg">{position.totalAhead}</span>
            </div>
            {position.estimatedWaitTime !== null && (
              <div className="flex justify-between items-center">
                <span>Estimated wait time:</span>
                <span className="font-bold text-lg">~{position.estimatedWaitTime} minutes</span>
              </div>
            )}
          </>
        )}
        
        {customer.status === 'notified' && (
          <div className="text-green-700 font-medium mt-2">
            You were called at {customer.notifiedAt?.toDate().toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="mb-6 text-sm text-gray-600">
        <p>You joined this queue on {customer.joinedAt.toDate().toLocaleString()}</p>
      </div>

      {!queue.isActive && (
        <div className="bg-yellow-100 p-3 rounded-md mb-4 text-yellow-800 text-sm">
          Note: This queue is currently not accepting new customers.
        </div>
      )}

      <div className="mt-8 border-t pt-4">
        <p className="text-sm text-gray-500 mb-3">
          Keep this page open to maintain your position and receive notifications when it's your turn.
        </p>
        <button
          onClick={() => navigate("/")}
          className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded hover:bg-gray-200"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
