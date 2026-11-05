import React from 'react'
import { Dialog, DialogContent } from './Dialog'
import { Button } from './Button'
import type { ErrorKind, FriendlyError } from '@/utils/errors'

export type ActiveError = FriendlyError & { onRetry?: () => void }

interface ErrorModalProps {
  error: ActiveError | null
  onClose: () => void
}

const ICONS: Record<ErrorKind, React.ReactNode> = {
  network: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8.8a16 16 0 0 1 20 0" />
      <path d="M5 12.5a11 11 0 0 1 14 0" />
      <path d="M8.5 16a6 6 0 0 1 7 0" />
      <path d="M12 20h.01" />
      <path d="m2 2 20 20" />
    </svg>
  ),
  unauthorized: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  ),
  forbidden: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m5.6 5.6 12.8 12.8" />
    </svg>
  ),
  notfound: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m8.5 8.5 5 5m0-5-5 5" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  validation: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  ),
  server: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H6.5a4.5 4.5 0 0 1-.4-9A7 7 0 0 1 19.7 10a4.5 4.5 0 0 1-.2 9Z" />
      <path d="M12 12v3" />
      <path d="M12 16.5h.01" />
    </svg>
  ),
  unknown: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  ),
}

/**
 * Modal error global untuk aplikasi client — dipakai oleh ErrorProvider.
 * Semua kegagalan API (kecuali validasi 422) ditampilkan di sini.
 */
export function ErrorModal({ error, onClose }: ErrorModalProps) {
  if (!error) return null

  const showRetry = error.onRetry !== undefined && error.kind !== 'unauthorized'

  const handleRetry = () => {
    onClose()
    error.onRetry?.()
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent title={error.title} className="max-w-md" aria-describedby={undefined}>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 shrink-0 text-red-600" aria-hidden="true">
              {ICONS[error.kind]}
            </span>
            <p className="text-sm leading-relaxed text-gray-600">{error.message}</p>
          </div>

          {import.meta.env.DEV && error.detail && (
            <details className="rounded-md border border-gray-200 px-3 py-2">
              <summary className="cursor-pointer select-none text-xs font-semibold text-gray-500">
                Detail teknis
              </summary>
              <p className="mt-1 break-words text-xs text-gray-400">{error.detail}</p>
            </details>
          )}

          <div className="flex justify-end gap-2 pt-2">
            {showRetry && (
              <Button variant="outline" onClick={handleRetry}>
                Coba Lagi
              </Button>
            )}
            <Button variant="primary" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
