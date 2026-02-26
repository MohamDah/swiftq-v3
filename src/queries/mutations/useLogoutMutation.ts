import { useMutation, useQueryClient } from '@tanstack/react-query'

import { logout } from '@/utils/auth'

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}
