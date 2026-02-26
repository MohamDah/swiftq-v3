import { Dialog, DialogPanel } from '@headlessui/react'
import React, { ReactNode } from 'react'

export interface ModalProps {
  onClose: () => void
  open?: boolean
}

export default function ModalWrapper({
  onClose,
  open = true,
  children,
}: ModalProps & { children: ReactNode }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel>{children}</DialogPanel>
      </div>
    </Dialog>
  )
}
