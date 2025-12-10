import { useMutation } from '@tanstack/react-query'
import { LoginProps } from '@/types/auth'
import { login } from '@/utils/auth'

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (credentials: LoginProps) => await login(credentials),
  })
}
