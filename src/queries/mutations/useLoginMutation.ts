import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LoginProps } from '@/types/auth'
import { login } from '@/utils/auth'
import { QueryKeys } from '../queryKeys'

export function useLoginMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (credentials: LoginProps) => await login(credentials),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: [QueryKeys.CURRENT_USER]})
    }
  })
}
