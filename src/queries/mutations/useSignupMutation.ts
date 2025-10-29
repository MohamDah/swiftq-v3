import { useMutation } from '@tanstack/react-query'
import { SignupProps } from '@/types/auth'
import { signup } from '@/utils/auth'
import { ApiError } from '@/types/ApiError'

export function useSignupMutation() {
  return useMutation<string, ApiError, SignupProps>({
    mutationFn: async credentials => await signup(credentials),
  })
}
