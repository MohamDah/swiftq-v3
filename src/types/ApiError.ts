export interface ApiError {
  response?: {
    data?: {
      message: string
      error: string
      statusCode: number
    }
    status: number
  }
}
