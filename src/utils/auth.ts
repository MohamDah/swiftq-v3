import axios from 'axios'
import { apiUrl } from './apiUrl'
import { LoginProps, LoginResponse, SignupProps } from '@/types/auth'

export function getAuthToken(): string | null {
  return localStorage.getItem('token')
}

export async function login({ email, password }: LoginProps): Promise<string> {
  const { data } = await axios.post<LoginResponse>(`${apiUrl}auth/login`, { email, password })

  localStorage.setItem('token', data.token)

  return data.token
}

export async function signup({ email, password, displayName }: SignupProps): Promise<string> {
  const { data } = await axios.post<LoginResponse>(`${apiUrl}auth/register`, { email, password, displayName })

  localStorage.setItem('token', data.token)

  return data.token
}

export function logout() {
  localStorage.removeItem('token')
}
