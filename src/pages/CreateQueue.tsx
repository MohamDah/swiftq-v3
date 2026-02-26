import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import {
  CreateQueueProps,
  useCreateQueueMutation,
} from '@/queries/mutations/useCreateQueueMutation'
import { displayError } from '@/utils/displayError'

// CreateQueue component - allows hosts to create new queues
// Route: /create
export default function CreateQueue() {
  const navigate = useNavigate()
  const { mutateAsync: createQueue, error } = useCreateQueueMutation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateQueueProps>({
    defaultValues: { name: '', requireNames: false },
  })

  // Handle form submission
  const onSubmit = async ({ name, requireNames }: CreateQueueProps) => {
    const queueId = await createQueue({ name, requireNames })

    navigate(`/my-queues/${queueId.id}`)
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-[40px] shadow-lg shadow-black/25 overflow-hidden">
      <div className="md:flex">
        <div className="p-8 w-full">
          <div className="text-center mb-8">
            <h1 className="text-lg font-bold text-gray-900">Create a New Queue</h1>
            <p className="mt-1 text-xs text-gray-600">
              Set up a new queue for your customers to join
            </p>
          </div>

          {error && (
            <div className="mb-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {displayError(error)}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold">
                Queue Name <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  type="text"
                  {...register('name', { required: 'Queue name is required' })}
                  className="appearance-none block w-full px-3 py-2 border-2 border-primary rounded-md shadow-sm placeholder-gray-500 focus:outline-none text-sm"
                  placeholder="e.g., Coffee Shop Queue"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-700">{errors.name.message}</p>}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="requireNames"
                  type="checkbox"
                  {...register('requireNames')}
                  className="h-4 w-4"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="requireNames" className="font-semibold">
                  Require customer names
                </label>
                <p className="text-gray-500 text-xs">
                  When enabled, customers will need to provide their name to join the queue
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-8">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="py-1 px-4 border border-red-500 rounded-xl text-sm font-semibold bg-white shadow-lg shadow-black/25"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-1 px-4 border border-transparent rounded-xl shadow-lg shadow-black/25 text-sm font-semibold bg-primary hover:bg-primary-sat  ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create Queue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
