import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useSewaCart } from '@/contexts/SewaCartContext'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import PeminjamanFormModal from './PeminjamanFormModal'

interface Props {
  onClose: () => void
}

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)

export default function CartDrawer({ onClose }: Props) {
  const { isAuthenticated } = useAuth()
  const {
    items: peminjamanItems,
    setQty: setPeminjamanQty,
    removeItem: removePeminjamanItem,
    clear: clearPeminjaman,
  } = useCart()
  const {
    items: sewaItems,
    setQty: setSewaQty,
    removeItem: removeSewaItem,
    clear: clearSewa,
  } = useSewaCart()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const totalItems = (isAuthenticated ? peminjamanItems.length : 0) + sewaItems.length

  const goToSewa = () => {
    onClose()
    if (pathname === '/sewa') {
      document.getElementById('keranjang-sewa')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    navigate('/sewa#keranjang-sewa')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-surface-text">Keranjang</h2>
            <span className="rounded-full bg-surface-accent px-2 py-0.5 text-xs font-semibold text-primary">
              {totalItems} item
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-surface-container"
            aria-label="Tutup keranjang"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {totalItems === 0 ? (
            <EmptyState
              title="Keranjang masih kosong"
              description="Tambahkan alat dari katalog peminjaman atau sewa untuk mulai mengajukan."
              className="py-16"
            />
          ) : (
            <div className="space-y-6">
              {isAuthenticated && peminjamanItems.length > 0 && (
                <section>
                  <CartSectionHeader
                    title="Peminjaman Alat"
                    count={`${peminjamanItems.length} alat`}
                    onClear={clearPeminjaman}
                  />
                  <ul className="mt-3 space-y-2.5">
                    {peminjamanItems.map((item) => (
                      <li key={item.alat_id} className="rounded-lg border border-gray-200 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-surface-text">{item.nama_alat}</p>
                            <p className="font-mono text-xs text-gray-500">{item.inventaris}</p>
                          </div>
                          <button
                            onClick={() => removePeminjamanItem(item.alat_id)}
                            className="rounded p-0.5 text-rose-600 transition-colors hover:bg-rose-50"
                            aria-label={`Hapus ${item.nama_alat}`}
                          >
                            ✕
                          </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <QuantityStepper
                            value={item.jumlah}
                            max={item.max_jumlah}
                            onChange={(value) => setPeminjamanQty(item.alat_id, value)}
                          />
                          <span className="text-xs text-gray-500">maks {item.max_jumlah} unit</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-3 w-full" onClick={() => setIsCheckoutOpen(true)}>
                    Ajukan Peminjaman
                  </Button>
                </section>
              )}

              {sewaItems.length > 0 && (
                <section>
                  <CartSectionHeader
                    title="Sewa Alat"
                    count={`${sewaItems.length} jenis`}
                    onClear={clearSewa}
                  />
                  <ul className="mt-3 space-y-2.5">
                    {sewaItems.map((item) => (
                      <li key={item.nama_alat} className="rounded-lg border border-gray-200 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-surface-text">{item.nama_alat}</p>
                            <p className="text-xs text-gray-500">
                              {formatRupiah(item.tarif_per_hari)}/hari
                            </p>
                          </div>
                          <button
                            onClick={() => removeSewaItem(item.nama_alat)}
                            className="rounded p-0.5 text-rose-600 transition-colors hover:bg-rose-50"
                            aria-label={`Hapus ${item.nama_alat}`}
                          >
                            ✕
                          </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <QuantityStepper
                            value={item.jumlah}
                            max={item.max_jumlah}
                            onChange={(value) => setSewaQty(item.nama_alat, value)}
                          />
                          <span className="text-xs text-gray-500">maks {item.max_jumlah} unit</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-3 w-full" variant="outline" onClick={goToSewa}>
                    Lanjut ke Sewa
                  </Button>
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      {isCheckoutOpen && (
        <PeminjamanFormModal
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={() => {
            clearPeminjaman()
            onClose()
            window.dispatchEvent(new Event('peminjaman:created'))
          }}
        />
      )}
    </div>
  )
}

function CartSectionHeader({
  title,
  count,
  onClear,
}: {
  title: string
  count: string
  onClear: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold text-surface-text">{title}</h3>
        <span className="rounded-full bg-surface-accent px-2 py-0.5 text-[11px] font-semibold text-primary">
          {count}
        </span>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="text-xs text-gray-500 underline transition-colors hover:text-gray-700"
      >
        Kosongkan
      </button>
    </div>
  )
}
