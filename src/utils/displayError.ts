import { AxiosError } from "axios"

export function displayError(error: Error) {
  if (error instanceof AxiosError) {
    const message = error.response?.data.message

    if (Array.isArray(message)) {
      return message.join(', ')
    } else
      return message
  }
  return error.message
}