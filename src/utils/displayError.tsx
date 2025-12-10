import { AxiosError } from "axios"

export function displayError(error: Error) {
  if (error instanceof AxiosError) {
    const message = error.response?.data.message

    if (Array.isArray(message)) {
      return (
        <ul className="text-xs space-y-0.5">
          {message.map((i: string) => (
            <li>{i}</li>
          ))}
        </ul>
      )
    } else
      return message
  }
  return error.message
}