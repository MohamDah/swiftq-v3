export interface LoginProps {
  email: string
  password: string
}

export interface LoginResponse {
  token: string,
  user: {
    id: string,
    email: string,
    displayName: string
  }
}

export interface SignupProps {
  displayName: string
  email: string
  password: string
}

export interface SignupResponse {
  token: string,
  user: {
    id: string,
    email: string,
    displayName: string
  }
}

