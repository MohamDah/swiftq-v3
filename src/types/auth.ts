export interface User {
  id: string
  email: string
  businessName: string
}

export interface LoginProps {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
}

export interface SignupProps {
  businessName: string
  email: string
  password: string
}

export interface SignupResponse {
  accessToken: string
  user: User
}
