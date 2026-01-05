import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SignupProps } from '@/types/auth'
import { signup } from '@/utils/auth'
import { ApiError } from '@/types/ApiError'
import { QueryKeys } from '../queryKeys'

export function useSignupMutation() {
  const queryClient = useQueryClient()
  return useMutation<string, ApiError, SignupProps>({
    mutationFn: async credentials => await signup(credentials),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.CURRENT_USER] })
    }
  })
}
