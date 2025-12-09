import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/types/ApiError'
import axiosInstance from '@/api/axiosInstance'
import { QueueItem } from '@/types/api'

interface CreateQueueProps {
  queueName: string
  requireCustomerName?: boolean
}
async function createQueue(body: CreateQueueProps) {
  const { data } = await axiosInstance.post("/queues", body)
  return data as QueueItem
}

export function useCreateQueueMutation() {
  const queryClient = useQueryClient()
  return useMutation<QueueItem, ApiError, CreateQueueProps>({
    mutationFn: createQueue,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ["queues"]})
    }
  })
}
