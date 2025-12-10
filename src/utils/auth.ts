import axios from 'axios'
import { apiUrl } from './apiUrl'
import { LoginProps, LoginResponse, SignupProps } from '@/types/auth'

export const TOKEN_KEY = 'accessToken' as const

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export async function login({ email, password }: LoginProps): Promise<string> {
  const { data } = await axios.post<LoginResponse>(`${apiUrl}auth/login`, { email, password })

  localStorage.setItem(TOKEN_KEY, data[TOKEN_KEY])

  return data[TOKEN_KEY]
}

export async function signup({ email, password, businessName }: SignupProps): Promise<string> {
  const { data } = await axios.post<LoginResponse>(`${apiUrl}auth/register`, { email, password, businessName })

  localStorage.setItem(TOKEN_KEY, data[TOKEN_KEY])

  return data[TOKEN_KEY]
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}
