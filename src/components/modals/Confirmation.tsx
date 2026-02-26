import React from 'react'

import ModalWrapper, { ModalProps } from './ModalWrapper'

interface ConfirmationProps extends ModalProps {
  onConfirm: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  isLoading = false,
}: ConfirmationProps) {
  const handleConfirm = () => {
    onConfirm()
  }

  const iconColors = {
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  }

  const confirmButtonColors = {
    danger: 'bg-red-500 hover:bg-red-600 border-red-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600 border-yellow-600',
    info: 'bg-blue-500 hover:bg-blue-600 border-blue-600',
  }

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="bg-white rounded-3xl shadow-lg shadow-black/25 border-4 border-primary p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-center mb-4">
          <div className={`rounded-full bg-gray-100 p-3 ${iconColors[variant]}`}>
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-xl font-bold text-center text-gray-900 mb-2">{title}</h3>

        <p className="text-sm text-gray-600 text-center mb-6">{message}</p>

        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 border-2 border-gray-400 text-sm font-semibold rounded-xl bg-white hover:bg-gray-50 shadow-md shadow-black/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-6 py-2 border-2 text-sm font-semibold rounded-xl text-white shadow-md shadow-black/25 disabled:opacity-50 disabled:cursor-not-allowed ${confirmButtonColors[variant]}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </ModalWrapper>
  )
}
