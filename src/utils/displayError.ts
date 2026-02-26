import { AxiosError } from 'axios'

export function displayError(error: Error) {
  if (error instanceof AxiosError) {
    const message = error.response?.data.message

    return Array.isArray(message) ? message.join(', ') : message
  }
  return error.message
}
