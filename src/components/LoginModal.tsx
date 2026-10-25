import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ApiError } from '@/services'

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [nim, setNim] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    setNim('')
    setPassword('')
    setError(null)
    onClose()
  }

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await login(nim, password)
      onClose()
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal login.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/60 px-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <section
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold text-navy">Login Mahasiswa</h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Tutup"
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="nim" className="block text-sm font-medium text-gray-700">
              NIM
            </label>
            <input
              id="nim"
              type="text"
              inputMode="numeric"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-gray-900 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Memproses...' : 'Login'}
          </button>
        </form>
      </section>
    </div>
  )
}
