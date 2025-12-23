import { useCallEntry } from '@/queries/mutations/useCallEntry';
import { useServeEntry } from '@/queries/mutations/useServeEntry';
import { Customer } from '@/types/api'

export default function QueueEntryCard({ customer }: { customer: Customer }) {
  const { mutateAsync: callEntry, isPending: isCalling } = useCallEntry()
  const { mutateAsync: serveEntry, isPending: isServing } = useServeEntry()

  // Get wait time in minutes
  const getWaitTimeDisplay = () => {
    return customer.estimatedWaitTime + ' minutes';
  };

  return (
    <div className={`mx-2 p-2 rounded-md bg-primary/40`}>
      <div className="flex sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <span className="font-medium text-sm text-green-800">#{customer.displayNumber}</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {customer.customerName || 'Customer'} {" "}
              <span className='text-xs'>#{customer.position.toString().padStart(2, "0")}</span>
            </h3>
            <div className="flex flex-col items-start mt-1">
              <span className="text-sm text-gray-600">Wait: {getWaitTimeDisplay()}</span>
              <span className={`inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium shadow-md shadow-black/25 ${customer.status === 'CALLED'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
                }`}>
                {customer.status === 'CALLED' ? 'Called' : 'Waiting'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 self-center justify-end flex-wrap max-w-40">
          {customer.position === 1 && (
            <>
              {(customer.status === 'WAITING') && (
                <button
                  onClick={() => callEntry({ entryId: customer.id })}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-md shadow-black/25 text-yellow-700 bg-yellow-100 hover:bg-yellow-200 disabled:opacity-50"
                  disabled={isCalling}
                >
                  Call
                </button>
              )}
              {customer.status === 'CALLED' && (
                <button
                  onClick={() => serveEntry({ entryId: customer.id })}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-md shadow-black/25 text-green-700 bg-green-100 hover:bg-green-200 disabled:opacity-50"
                  disabled={isServing}
                >
                  Serve
                </button>
              )}
            </>
          )}

          {/* <button
            // onClick={() => handleRemoveCustomer(customer.id)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-md shadow-black/25 text-red-700 bg-red-100 hover:bg-red-200"
          >
            Skip
          </button> */}
        </div>
      </div>
    </div>
  )
}
