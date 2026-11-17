import { useEffect, useMemo, useState } from 'react'
import { peminjamanService, type PeminjamanOptions } from '@/services'
import { getFormErrorMessages } from '@/utils/errors'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/Button'

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
      .catch(() => {
        // Error sudah ditampilkan otomatis di modal global.
      })
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
      // Error validasi (422) tampil inline; error lain ditangani modal global.
      const messages = getFormErrorMessages(err)
      setError(messages.length > 0 ? messages.join(' ') : null)
      setIsSaving(false)
    }
  }

  const selectClass =
    'mt-1 w-full rounded-md border border-gray-300 bg-surface px-3 py-2 text-sm text-surface-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-surface p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-surface-text">Ajukan Peminjaman Alat</h2>
            <p className="mt-1 text-xs text-gray-500">
              Pengajuan akan diperiksa oleh laboran. Statusnya bisa kamu lihat pada riwayat pengajuan.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-surface-container hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
        )}

        <div className="mt-4 rounded-lg border border-gray-200 bg-surface-container/50 p-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Alat yang akan dipinjam
          </span>
          <ul className="mt-2 space-y-1">
            {items.map((item) => (
              <li key={item.alat_id} className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-surface-text">
                  {item.nama_alat}{' '}
                  <span className="font-mono text-xs text-gray-500">({item.inventaris})</span>
                </span>
                <span className="shrink-0 text-gray-700">× {item.jumlah}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <label htmlFor="keperluan" className="text-sm font-semibold text-surface-text">
            Keperluan <span className="text-rose-500">*</span>
          </label>
          <select
            id="keperluan"
            value={keperluan}
            onChange={(event) => {
              setKeperluan(event.target.value)
              setPraktikumSlug('')
            }}
            className={selectClass}
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
            <label htmlFor="praktikum" className="text-sm font-semibold text-surface-text">
              Praktikum <span className="text-rose-500">*</span>
            </label>
            <select
              id="praktikum"
              value={praktikumSlug}
              onChange={(event) => setPraktikumSlug(event.target.value)}
              className={selectClass}
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
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={!isFormValid || isSaving}>
            {isSaving ? 'Mengirim...' : 'Kirim Pengajuan'}
          </Button>
        </div>
      </div>
    </div>
  )
}
