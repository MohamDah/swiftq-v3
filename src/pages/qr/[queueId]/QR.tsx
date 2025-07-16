import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { getQueue } from '../../../firebase/services/queues'
import type { Queue } from '../../../firebase/schema'

export default function QR() {
  const { queueId } = useParams<{ queueId: string }>()
  const navigate = useNavigate()
  
  const [queue, setQueue] = useState<{ id: string, data: Queue } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joinLink, setJoinLink] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchQueue = async () => {
      if (!queueId) {
        setError('Queue ID not found')
        setLoading(false)
        return
      }

      try {
        const queueData = await getQueue(queueId)
        if (!queueData) {
          setError('Queue not found')
          setLoading(false)
          return
        }

        setQueue(queueData)
        // Create the join link
        const baseUrl = window.location.origin
        setJoinLink(`${baseUrl}/join/${queueId}`)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching queue data:', err)
        setError('Failed to load queue information')
        setLoading(false)
      }
    }

    fetchQueue()
  }, [queueId])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(joinLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading QR code...</p>
        </div>
      </div>
    )
  }

  if (error || !queue) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <div className="text-red-500 mb-4">{error || "Queue not found"}</div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Queue QR Code</h1>
              <p className="text-sm text-gray-500">Scan to join the queue</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Queue Info with Code */}
          <div className="p-5 bg-blue-50 border-b border-blue-100">
            <div className="flex flex-col justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-blue-900">{queue.data.queueName}</h2>
                <p className="text-sm text-blue-700">Host: {queue.data.hostName}</p>
                <div className="mt-2 text-xs inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                  Status: {queue.data.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="text-center self-center mt-4">
                <div className="text-xs text-blue-700 mb-1">Queue Code</div>
                <div className="text-xl font-bold bg-white px-3 py-2 rounded-lg shadow-sm border border-blue-200">
                  {queueId}
                </div>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="p-8 flex flex-col items-center">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <QRCodeSVG
                value={joinLink}
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                includeMargin={false}
              />
            </div>

            {/* Join Link */}
            <div className="mt-8 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Join Link:
              </label>
              <div className="flex rounded-md shadow-sm">
                <input
                  type="text"
                  readOnly
                  value={joinLink}
                  className="flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 bg-gray-50 p-2 focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className={`inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 ${copied ? 'text-green-700' : 'text-gray-700'} hover:bg-gray-100`}
                >
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                      <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 010 2h-2v-2z" />
                    </svg>
                  )}
                </button>
              </div>
              {copied && (
                <p className="mt-1 text-sm text-green-600">
                  Link copied to clipboard!
                </p>
              )}
            </div>
          </div>

          {/* Instructions with Queue Code */}
          <div className="p-5 border-t border-gray-200 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900">Instructions:</h3>
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Display this QR code for customers to scan</li>
              <li>When scanned, customers will be directed to the join page</li>
              <li>Customers can enter their information and join the queue</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex space-x-4 justify-center">
          <button
            onClick={() => navigate(`/my-queues/${queue.id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Manage Queue
          </button>
        </div>
      </div>
    </div>
  )
}
