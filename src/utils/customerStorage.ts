import { CustomerSessions } from "@/types/api";

export const CUSTOMER_STORAGE_KEY = 'queue_history'

const getAllPositions = (): CustomerSessions => {
  return JSON.parse(localStorage.getItem(CUSTOMER_STORAGE_KEY) || '{}')
}

const savePositions = (positions: CustomerSessions) => {
  localStorage.setItem(
    CUSTOMER_STORAGE_KEY,
    JSON.stringify(positions)
  )
}

export const getPositionToken = (qrCode: string) => {
  const allPositions = getAllPositions()
  return allPositions[qrCode]
}

export const saveNewPosition = (qrCode: string, sessionId: string) => {
  const allPositions = getAllPositions()

  allPositions[qrCode] = sessionId

  savePositions(allPositions)
}

export const removeCustomerPosition = (qrCode: string) => {
  const allPositions = getAllPositions()

  delete allPositions[qrCode]

  savePositions(allPositions)
}