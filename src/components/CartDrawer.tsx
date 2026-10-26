import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import PeminjamanFormModal from './PeminjamanFormModal'

interface Props {
  onClose: () => void
}

export default function CartDrawer({ onClose }: Props) {
  const { items, setQty, removeItem, clear } = useCart()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-bold">Keranjang</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
            aria-label="Tutup keranjang"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-6 text-center">
            <p className="text-sm text-gray-500">
              Keranjang masih kosong. Tambahkan alat dari katalog untuk mengajukan peminjaman.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <div key={item.alat_id} className="rounded-md border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.nama_alat}</p>
                      <p className="font-mono text-xs text-gray-500">{item.inventaris}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.alat_id)}
                      className="rounded-md p-1 text-red-600 hover:bg-red-50"
                      aria-label={`Hapus ${item.nama_alat}`}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => setQty(item.alat_id, item.jumlah - 1)}
                      disabled={item.jumlah <= 1}
                      className="h-7 w-7 rounded-md border text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Kurangi jumlah"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={item.max_jumlah}
                      value={item.jumlah}
                      onChange={(event) => setQty(item.alat_id, Number(event.target.value))}
                      className="w-16 rounded-md border px-2 py-1 text-center text-sm focus:border-gray-400 focus:outline-none"
                      aria-label="Jumlah"
                    />
                    <button
                      onClick={() => setQty(item.alat_id, item.jumlah + 1)}
                      disabled={item.jumlah >= item.max_jumlah}
                      className="h-7 w-7 rounded-md border text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Tambah jumlah"
                    >
                      +
                    </button>
                    <span className="text-xs text-gray-500">maks {item.max_jumlah} unit</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t px-5 py-4">
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
              >
                Ajukan Peminjaman
              </button>
            </div>
          </>
        )}
      </div>

      {isCheckoutOpen && (
        <PeminjamanFormModal
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={() => {
            clear()
            onClose()
            window.dispatchEvent(new Event('peminjaman:created'))
          }}
        />
      )}
    </div>
  )
}
