import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import axiosInstance from '@/api/axiosInstance'
import { displayError } from '@/utils/displayError'

import { invalidateEntryQueries } from './helpers'

export function useCancelEntryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ entryId }: { entryId: string }) =>
      axiosInstance.post(`entries/${entryId}/cancel`),
    onSuccess: async () => {
      await invalidateEntryQueries(queryClient)
    },
    onError: error => {
      toast.error(displayError(error))
    },
  })
}
