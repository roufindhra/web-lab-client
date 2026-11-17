import { type Alat, type KetersediaanStatus } from '@/services'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

const KETERSEDIAAN_LABELS: Record<KetersediaanStatus, string> = {
  tersedia: 'Tersedia',
  dipinjam: 'Dipinjam',
  perbaikan: 'Perbaikan',
}

const KETERSEDIAAN_VARIANTS: Record<KetersediaanStatus, 'available' | 'borrowed' | 'maintenance'> = {
  tersedia: 'available',
  dipinjam: 'borrowed',
  perbaikan: 'maintenance',
}

const KONDISI_LABELS: Record<string, string> = {
  baik: 'Baik',
  rusak_ringan: 'Rusak Ringan',
  rusak_berat: 'Rusak Berat',
  maintenance: 'Maintenance',
}

const KONDISI_VARIANTS: Record<string, 'available' | 'borrowed' | 'maintenance'> = {
  baik: 'available',
  rusak_ringan: 'borrowed',
  rusak_berat: 'maintenance',
  maintenance: 'borrowed',
}

interface Props {
  alat: Alat
  onClose: () => void
}

export default function AlatDetailModal({ alat, onClose }: Props) {
  let unitCounter = 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-surface p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-surface-text">{alat.nama_alat}</h2>
            <p className="text-sm text-gray-500">
              {alat.merk} {alat.tipe}
            </p>
          </div>
          <Badge variant={KETERSEDIAAN_VARIANTS[alat.ketersediaan]} className="shrink-0">
            {KETERSEDIAAN_LABELS[alat.ketersediaan] ?? alat.ketersediaan}
          </Badge>
        </div>

        <dl className="mt-4 grid gap-x-4 gap-y-3 rounded-lg border border-gray-200 bg-surface-container/50 p-3 text-sm sm:grid-cols-2">
          <div className="min-w-0">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              No. Inventaris
            </dt>
            <dd className="break-words font-mono text-surface-text">{alat.inventaris}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Serial Number
            </dt>
            <dd className="break-words font-mono text-surface-text">{alat.serial_number}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Jumlah Unit
            </dt>
            <dd className="text-surface-text">{alat.jumlah} unit</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Lokasi Penyimpanan
            </dt>
            <dd className="break-words text-surface-text">{alat.lokasi_penyimpanan}</dd>
          </div>
        </dl>

        <h3 className="mt-5 text-sm font-bold text-surface-text">Kondisi Unit</h3>
        <ul className="mt-2 space-y-2">
          {alat.kondisi.length === 0 ? (
            <li className="text-sm text-gray-500">Tidak ada data kondisi.</li>
          ) : (
            alat.kondisi.map((entry, index) => {
              const unitAwal = unitCounter + 1
              unitCounter += entry.jumlah
              const unitLabel =
                entry.jumlah === 1 ? `Unit ${unitAwal}` : `Unit ${unitAwal}–${unitCounter}`

              return (
                <li key={index} className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-gray-700">{unitLabel}</span>
                    <Badge variant={KONDISI_VARIANTS[entry.status] ?? 'borrowed'}>
                      {KONDISI_LABELS[entry.status] ?? entry.status}
                      {entry.jumlah > 1 && ` ×${entry.jumlah}`}
                    </Badge>
                  </div>
                  {entry.catatan.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {entry.catatan.map((catatan, catatanIndex) => (
                        <span
                          key={catatanIndex}
                          className="rounded-full bg-surface-container px-2 py-0.5 text-xs text-gray-700"
                        >
                          {catatan.komponen}: {catatan.keterangan}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              )
            })
          )}
        </ul>

        <div className="mt-5 flex justify-end">
          <Button onClick={onClose}>Tutup</Button>
        </div>
      </div>
    </div>
  )
}
