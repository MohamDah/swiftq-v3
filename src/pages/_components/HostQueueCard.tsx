import ConfirmationModal from '@/components/modals/Confirmation'
import { useDeleteQueueMutation } from '@/queries/mutations/useDeleteQueue'
import { useUpdateQueueMutation } from '@/queries/mutations/useUpdateQueue'
import { QueueItem } from '@/types/api'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function HostQueueCard({ queue }: { queue: QueueItem }) {
  const { mutateAsync: deleteQueue, isPending: isDeleting } = useDeleteQueueMutation()
  const {mutateAsync: updateQueue, isPending: isUpdating} = useUpdateQueueMutation()

  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDelete = async () => {
    await deleteQueue({ id: queue.id })
    setConfirmDelete(false)
  }

  const handleToggleActive = async () => {
    await updateQueue({
      queueId: queue.id,
      isActive: !queue.isActive
    })
  }

  return (
    <li>
      <div className="px-4 py-4 sm:px-6 bg-primary/50 rounded-3xl shadow-md shadow-black/25">
        <div className="flex items-center justify-between flex-wrap gap-y-2">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-white rounded-full flex items-center justify-center">
              <span className="font-semibold">{queue._count?.entries}</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 break-words">{queue.name}</h3>
              <p className="text-sm text-gray-500">
                Created {new Date(queue.createdAt).toLocaleDateString()} •
                {queue.requireNames ? " Names required" : " Names not required"}
              </p>
            </div>
          </div>
          <div className="flex gap-x-2 gap-y-2 justify-end flex-wrap">
            <Link
              to={`/my-queues/${queue.id}`}
              className="inline-flex items-center px-3 py-1 border-2 text-xs font-medium rounded-lg border-blue-500 bg-blue-300 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Manage
            </Link>
            <Link
              to={`/join/${queue.qrCode}`}
              className="inline-flex items-center px-3 py-1 border-2 text-xs font-medium rounded-lg border-green-500 bg-green-300 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Join Link
            </Link>
            <button
              disabled={isUpdating}
              className="inline-flex items-center px-3 py-1 border-2 text-xs font-medium rounded-lg border-red-500 bg-red-300 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-200 disabled:border-transparent"
              onClick={handleToggleActive}
            >
              {isUpdating ? "Toggling" : queue.isActive ? "Deactivate" : "Activate"}
            </button>
            <button
              disabled={isDeleting}
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center px-3 py-1 border-2 text-xs font-medium rounded-lg border-red-700 bg-red-400 hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 disabled:bg-red-300 disabled:border-transparent"
            >
              {isDeleting? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
      <ConfirmationModal
        variant='danger'
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        confirmText='Delete'
        title='Delete Queue'
        message={`Are you sure you want to delete "${queue.name}"? This action is unreversible!`}
        isLoading={isDeleting}
      />
    </li>
  )
}
