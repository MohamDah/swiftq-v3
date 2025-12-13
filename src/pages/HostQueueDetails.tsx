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

// /my-queues/:queueId
export default function HostQueueDetails() {
  const { queueId = "" } = useParams<{ queueId: string; }>();
  const navigate = useNavigate();
  const { data: queue, isLoading, error } = useHostQueueDetailsQuery(queueId)

  const { mutateAsync: deleteQueue, isPending: isDeleting } = useDeleteQueueMutation()
  const { mutateAsync: updateQueue, isPending: isUpdating } = useUpdateQueueMutation()

  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDelete = async () => {
    if (!queue) return

    await deleteQueue({ id: queue.id })
    setConfirmDelete(false)
  }

  const handleToggleActive = async () => {
    if (!queue) return

    await updateQueue({
      queueId: queue.id,
      isActive: !queue.isActive
    })
  }

  // Calculate average time
  // const avgWaitTime = useMemo(() => queue?.data.waitTimes ? queue?.data.waitTimes.reduce((a, i) => a + i, 0) / queue?.data.waitTimes.length : null, [queue?.data.waitTimes]);

  // Set up real-time listeners for queue and customers
  // useEffect(() => {
  //   if (!queueId) return;
  //   if (!currentUser) {
  //     setIsAuthorized(false);
  //     setIsLoading(false);
  //     return;
  //   }

  //   setIsLoading(true);

  //   // Set up listener for queue document
  //   // const queueRef = doc(db, "queues", queueId);
  //   // const unsubscribeQueue = onSnapshot(queueRef,
  //   //   (doc) => {
  //   //     console.log("ran");
  //   //     if (doc.exists()) {
  //   //       const queueData = {
  //   //         id: doc.id,
  //   //         data: doc.data() as Queue
  //   //       };

  //   //       // Check if current user is the owner of the queue
  //   //       if (queueData.data.hostId === currentUser.uid) {
  //   //         setIsAuthorized(true);
  //   //         setQueue(queueData);
  //   //         setIsQueueActive(queueData.data.isActive);
  //   //       } else {
  //   //         setIsAuthorized(false);
  //   //       }
  //   //       setIsLoading(false);
  //   //     } else {
  //   //       setError("Queue not found.");
  //   //       setIsLoading(false);
  //   //     }
  //   //   },
  //   //   (err) => {
  //   //     console.error("Error listening to queue:", err);
  //   //     setError("Failed to load queue data.");
  //   //     setIsLoading(false);
  //   //   }
  //   // );

  //   // Only set up customer listener if user is authorized
  //   // let unsubscribeCustomers = () => { };

  //   // if (isAuthorized) {
  //   //   // Set up listener for customers collection
  //   //   const customersRef = collection(db, "queues", queueId, "customers");
  //   //   const customersQuery = query(
  //   //     customersRef,
  //   //     where("status", "in", ["waiting", "notified", "exited"]),
  //   //   );

  //   //   unsubscribeCustomers = onSnapshot(customersQuery,
  //   //     (snapshot) => {
  //   //       const customersList = snapshot.docs.map(doc => ({
  //   //         id: doc.id,
  //   //         data: doc.data() as Customer
  //   //       }))
  //   //         .sort((a, b) => a.data.position - b.data.position)
  //   //         // Filter out exited customers from the active display
  //   //         .filter(customer => customer.data.status !== "exited");
  //   //       setCustomers(customersList);
  //   //     },
  //   //     (err) => {
  //   //       console.error("Error listening to customers:", err);
  //   //       setError("Failed to load customers data.");
  //   //     }
  //   //   );
  //   // }

  //   // Clean up listeners when component unmounts
  //   return () => {
  //     unsubscribeQueue();
  //     unsubscribeCustomers();
  //   };
  // }, [queueId, currentUser, isAuthorized]);

  // Toggle queue active state
  // const toggleQueueStatus = async () => {
  //   if (!queueId || !queue) return;

  //   try {
  //     await updateDoc(doc(db, "queues", queueId), {
  //       isActive: !isQueueActive
  //     });
  //     // No need to manually update state or refetch data
  //     // The onSnapshot listener will automatically update the UI
  //   } catch (err) {
  //     console.error("Error updating queue status:", err);
  //     setError("Failed to update queue status.");
  //   }
  // };

  // Mark customer as served and remove from queue
  // const serveCustomer = async (customer: QueueCustomer) => {
  //   if (!queueId || !queue) return;

  //   try {
  //     const customerRef = doc(db, "queues", queueId, "customers", customer.id);
  //     await updateDoc(customerRef, {
  //       status: "served",
  //       servedAt: serverTimestamp()
  //     });

  //     const queueRef = doc(db, "queues", queueId);
  //     const newWaitTimes = [...(queue.data.waitTimes || []), (new Date()).getTime() - customer.data.joinedAt.toDate().getTime()];
  //     await updateDoc(queueRef, {
  //       waitTimes: newWaitTimes,
  //       estimatedWaitPerPerson: newWaitTimes.reduce((a, i) => a + i, 0) / newWaitTimes.length
  //     });

  //   } catch (err) {
  //     console.error("Error serving customer:", err);
  //     setError("Failed to update customer status.");
  //   }
  // };

  // Mark customer as notified
  // const notifyCustomer = async (customerId: string) => {
  //   if (!queueId) return;

  //   try {
  //     // Update customer status in Firestore
  //     const customerRef = doc(db, "queues", queueId, "customers", customerId);
  //     await updateDoc(customerRef, {
  //       notified: true,
  //       status: "notified",
  //       notifiedAt: serverTimestamp(),
  //       lastNotifiedAt: serverTimestamp()
  //     });

  //     // Send push notification
  //     await sendCustomerNotification(queueId, customerId, queue?.data.id || "")
  //   } catch (err) {
  //     console.error("Error notifying customer:", err);
  //     setError("Failed to notify customer.");
  //   }
  // };

  // Generate shareable join link
  const getJoinLink = () => {
    if (!queue) return ''
    return `${window.location.origin}/join/${queue.qrCode}`;
  };

  // Copy join link to clipboard
  const copyJoinLink = () => {
    navigator.clipboard.writeText(getJoinLink());
  };

  // Add function to handle removing a customer
  // const handleRemoveCustomer = async (customerId: string) => {
  //   if (!queueId) return;

  //   if (confirm('Are you sure you want to remove this customer from the queue?')) {
  //     try {
  //       await removeCustomer(queueId, customerId);
  //       // No need to update state manually as the listener will handle it
  //     } catch (err) {
  //       console.error("Error removing customer:", err);
  //       setError("Failed to remove customer.");
  //     }
  //   }
  // };

  // Add a function to handle queue deletion
  // const handleDeleteQueue = async () => {
  //   if (!queueId) return;

  //   if (window.confirm('Are you sure you want to delete this queue? This action cannot be undone.')) {
  //     try {
  //       setIsLoading(true);
  //       await deleteQueue(queueId);
  //       navigate('/my-queues', { replace: true });
  //     } catch (err) {
  //       console.error("Error deleting queue:", err);
  //       setError("Failed to delete queue.");
  //       setIsLoading(false);
  //     }
  //   }
  // };

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
                    to={`/qr/${queue.qrCode}`}
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
