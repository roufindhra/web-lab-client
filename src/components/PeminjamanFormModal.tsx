import { useEffect, useMemo, useState } from 'react'
import { ApiError, peminjamanService, type PeminjamanOptions } from '@/services'
import { useCart } from '@/contexts/CartContext'

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export default function PeminjamanFormModal({ onClose, onSuccess }: Props) {
  const { items } = useCart()
  const [options, setOptions] = useState<PeminjamanOptions | null>(null)
  const [keperluan, setKeperluan] = useState('')
  const [praktikumSlug, setPraktikumSlug] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    peminjamanService
      .options()
      .then(setOptions)
      .catch(() => setError('Gagal memuat pilihan keperluan.'))
  }, [])

  const praktikumOptions = keperluan === 'praktikum' ? (options?.praktikum ?? []) : []

  const isFormValid = useMemo(() => {
    return (
      keperluan !== '' &&
      (keperluan !== 'praktikum' || praktikumSlug !== '') &&
      items.length > 0 &&
      items.every((item) => item.jumlah >= 1 && item.jumlah <= item.max_jumlah)
    )
  }, [keperluan, praktikumSlug, items])

  const handleSubmit = async () => {
    if (!isFormValid || isSaving) return
    setIsSaving(true)
    setError(null)
    try {
      await peminjamanService.create({
        keperluan,
        ...(keperluan === 'praktikum' && { praktikum_slug: praktikumSlug }),
        items: items.map((item) => ({ alat_id: item.alat_id, jumlah: item.jumlah })),
      })
      onSuccess()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Terjadi kesalahan.')
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-lg font-bold">Ajukan Peminjaman Alat</h2>
        <p className="mt-1 text-xs text-gray-500">
          Pengajuan akan diperiksa oleh laboran. Statusnya bisa kamu lihat di daftar pengajuan.
        </p>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-4 rounded-md border p-3">
          <span className="text-sm font-medium">Alat yang akan dipinjam</span>
          <ul className="mt-2 space-y-1">
            {items.map((item) => (
              <li key={item.alat_id} className="flex items-center justify-between text-sm">
                <span className="min-w-0 truncate">
                  {item.nama_alat} <span className="font-mono text-xs text-gray-500">({item.inventaris})</span>
                </span>
                <span className="shrink-0 text-gray-700">× {item.jumlah}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <label htmlFor="keperluan" className="text-sm font-medium">
            Keperluan
          </label>
          <select
            id="keperluan"
            value={keperluan}
            onChange={(event) => {
              setKeperluan(event.target.value)
              setPraktikumSlug('')
            }}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
          >
            <option value="">Pilih keperluan...</option>
            {(options?.keperluan ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {keperluan === 'praktikum' && (
          <div className="mt-4">
            <label htmlFor="praktikum" className="text-sm font-medium">
              Praktikum
            </label>
            <select
              id="praktikum"
              value={praktikumSlug}
              onChange={(event) => setPraktikumSlug(event.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
            >
              <option value="">Pilih praktikum...</option>
              {praktikumOptions.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.label}
                </option>
              ))}
            </select>
            {options !== null && praktikumOptions.length === 0 && (
              <p className="mt-1 text-xs text-gray-500">Kamu tidak terdaftar pada praktikum mana pun.</p>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={() => void handleSubmit()}
            disabled={!isFormValid || isSaving}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? 'Mengirim...' : 'Kirim Pengajuan'}
          </button>
        </div>
      </div>
    </div>
  )
}
