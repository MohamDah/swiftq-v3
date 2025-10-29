import { useMutation } from '@tanstack/react-query'
import { LoginProps } from '@/types/auth'
import { login } from '@/utils/auth'
import { ApiError } from '@/types/ApiError'

export function useLoginMutation() {
  return useMutation<string, ApiError, LoginProps>({
    mutationFn: async credentials => await login(credentials),
  })
}
