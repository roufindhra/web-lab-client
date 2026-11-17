import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  alatService,
  KETERSEDIAAN_STATUSES,
  KONDISI_STATUSES,
  peminjamanService,
  type Alat,
  type AlatLogListMeta,
  type KatalogAlat,
  type KetersediaanStatus,
  type KondisiStatus,
  type Peminjaman,
  type PeminjamanStatus,
} from '@/services'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import AlatDetailModal from '@/components/AlatDetailModal'
import PeminjamanFormModal from '@/components/PeminjamanFormModal'
import { Button } from '@/components/ui/Button'
import { CartIcon } from '@/components/ui/CartIcon'
import { EmptyState } from '@/components/ui/EmptyState'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Steps } from '@/components/ui/Steps'
import { cn } from '@/utils/cn'

const KETERSEDIAAN_LABELS: Record<KetersediaanStatus, string> = {
  tersedia: 'Tersedia',
  dipinjam: 'Dipinjam',
  perbaikan: 'Perbaikan',
}

const KETERSEDIAAN_BADGE_CLASSES: Record<KetersediaanStatus, string> = {
  tersedia: 'bg-emerald-100 text-emerald-800',
  dipinjam: 'bg-amber-100 text-amber-800',
  perbaikan: 'bg-rose-100 text-rose-800',
}

const KONDISI_LABELS: Record<KondisiStatus, string> = {
  baik: 'baik',
  rusak_ringan: 'rusak ringan',
  rusak_berat: 'rusak berat',
  maintenance: 'maintenance',
}

const kondisiRingkas = (alat: Alat) =>
  KONDISI_STATUSES.filter((status) => (alat.kondisi_ringkas[status] ?? 0) > 0)
    .map((status) => `${alat.kondisi_ringkas[status]} ${KONDISI_LABELS[status]}`)
    .join(' · ')

const STATUS_LABELS: Record<PeminjamanStatus, string> = {
  pending: 'Menunggu Persetujuan',
  disetujui: 'Disetujui',
  ditolak: 'Ditolak',
}

const STATUS_BADGE_CLASSES: Record<PeminjamanStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  disetujui: 'bg-emerald-100 text-emerald-800',
  ditolak: 'bg-rose-100 text-rose-800',
}

type FilterKetersediaan = 'semua' | KetersediaanStatus

const FILTER_OPTIONS: { value: FilterKetersediaan; label: string }[] = [
  { value: 'semua', label: 'Semua' },
  ...KETERSEDIAAN_STATUSES.map((status) => ({
    value: status,
    label: KETERSEDIAAN_LABELS[status],
  })),
]

const ALUR_PEMINJAMAN = ['Pilih alat', 'Isi keperluan', 'Ajukan'] as const

function formatWaktu(value: string): string {
  return new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AlatPage() {
  const { user } = useAuth()
  const { items: cartItems, addItem, setQty, removeItem, clear } = useCart()
  const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>([])
  const [peminjamanMeta, setPeminjamanMeta] = useState<AlatLogListMeta | null>(null)
  const [peminjamanPage, setPeminjamanPage] = useState(1)
  const [katalog, setKatalog] = useState<KatalogAlat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedNama, setExpandedNama] = useState<string | null>(null)
  const [detailTarget, setDetailTarget] = useState<Alat | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterKetersediaan>('semua')

  const inCartQty = useMemo(
    () => new Map(cartItems.map((item) => [item.alat_id, item.jumlah])),
    [cartItems],
  )

  const totalUnit = useMemo(
    () => cartItems.reduce((total, item) => total + item.jumlah, 0),
    [cartItems],
  )

  const loadPeminjaman = useCallback((page: number) => {
    return peminjamanService.list(page).then((response) => {
      setPeminjamanList(response.data)
      setPeminjamanMeta(response.meta)
    })
  }, [])

  const loadAlat = useCallback(() => {
    return alatService.getAll().then((response) => {
      setKatalog(response.data)
    })
  }, [])

  useEffect(() => {
    let cancelled = false

    Promise.all([loadPeminjaman(peminjamanPage), loadAlat()])
      .catch(() => {
        // Error sudah ditampilkan otomatis di modal global.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [loadPeminjaman, loadAlat, peminjamanPage])

  useEffect(() => {
    const refresh = () => void Promise.all([loadPeminjaman(1), loadAlat()])
    window.addEventListener('peminjaman:created', refresh)
    return () => window.removeEventListener('peminjaman:created', refresh)
  }, [loadPeminjaman, loadAlat])

  const goToPeminjamanPage = (page: number) => {
    setIsLoading(true)
    setPeminjamanPage(page)
  }

  const toggleExpand = (nama: string) => {
    setExpandedNama((current) => (current === nama ? null : nama))
  }

  const isFiltering = query.trim() !== '' || statusFilter !== 'semua'

  const filteredKatalog = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    return katalog
      .map((grup) => {
        const items = grup.items.filter((alat) => {
          const matchStatus = statusFilter === 'semua' || alat.ketersediaan === statusFilter
          if (!matchStatus) return false
          if (keyword === '') return true

          return [grup.nama_alat, alat.inventaris, alat.merk, alat.tipe, alat.serial_number].some(
            (value) => value.toLowerCase().includes(keyword),
          )
        })

        return { ...grup, items }
      })
      .filter((grup) => grup.items.length > 0)
  }, [katalog, query, statusFilter])

  const resetFilter = () => {
    setQuery('')
    setStatusFilter('semua')
  }

  const handleCheckoutSuccess = () => {
    clear()
    setIsCheckoutOpen(false)
    window.dispatchEvent(new Event('peminjaman:created'))
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-text">Peminjaman Alat</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Halo {user?.nama}, pilih alat yang kamu butuhkan lalu ajukan peminjaman. Pengajuan harus
            disetujui laboran sebelum alat bisa diambil.
          </p>
          <Steps
            steps={ALUR_PEMINJAMAN}
            active={cartItems.length === 0 ? 0 : 1}
            className="mt-4"
          />
        </div>
        <a
          href="#riwayat"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-surface-container"
        >
          Riwayat Pengajuan
        </a>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-surface p-3 shadow-sm sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari nama alat, inventaris, merk, atau tipe..."
                aria-label="Cari alat"
                className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-9 text-sm text-surface-text placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {query !== '' && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Hapus pencarian"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-surface-container hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter ketersediaan">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatusFilter(option.value)}
                  aria-pressed={statusFilter === option.value}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    statusFilter === option.value
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 text-gray-600 hover:bg-surface-container',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3 mt-6 flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-lg font-bold text-surface-text">Katalog Alat Lab</h2>
            {isFiltering && !isLoading && (
              <p className="text-xs text-gray-500">
                {filteredKatalog.length} dari {katalog.length} jenis alat
              </p>
            )}
          </div>

          {isLoading ? (
            <CatalogSkeleton />
          ) : katalog.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-surface shadow-sm">
              <EmptyState
                title="Belum ada data alat"
                description="Katalog alat laboratorium belum tersedia. Silakan hubungi laboran."
              />
            </div>
          ) : filteredKatalog.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-surface shadow-sm">
              <EmptyState
                title="Alat tidak ditemukan"
                description="Coba ubah kata kunci pencarian atau filter ketersediaan."
                action={
                  <Button variant="outline" size="sm" onClick={resetFilter}>
                    Reset pencarian
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-surface shadow-sm">
              {filteredKatalog.map((grup) => {
                const isExpanded = isFiltering || expandedNama === grup.nama_alat
                const persenTersedia =
                  grup.jumlah_unit > 0
                    ? Math.round((grup.jumlah_tersedia / grup.jumlah_unit) * 100)
                    : 0

                return (
                  <div key={grup.nama_alat}>
                    <button
                      type="button"
                      onClick={() => toggleExpand(grup.nama_alat)}
                      aria-expanded={isExpanded}
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-surface-container/60"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-surface-text">{grup.nama_alat}</span>
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                              grup.jumlah_tersedia > 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800',
                            )}
                          >
                            {grup.jumlah_tersedia > 0 ? 'Tersedia' : 'Habis'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {grup.jumlah_tersedia}/{grup.jumlah_unit} unit tersedia
                          {isFiltering && ` · ${grup.items.length} unit cocok`}
                        </p>
                        <div className="mt-2 h-1.5 w-1/2 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${persenTersedia}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 text-xs text-gray-400">
                        <span className="hidden sm:inline">{isExpanded ? 'Tutup' : 'Lihat unit'}</span>
                        <svg
                          className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-surface-container/40">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-surface-container text-[11px] uppercase tracking-wider text-gray-500">
                              <tr>
                                <th className="px-4 py-2.5 font-semibold">Inventaris</th>
                                <th className="px-4 py-2.5 font-semibold">Merk / Tipe</th>
                                <th className="px-4 py-2.5 font-semibold">Ketersediaan</th>
                                <th className="px-4 py-2.5 font-semibold">Kondisi</th>
                                <th className="px-4 py-2.5 text-right font-semibold">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-surface">
                              {grup.items.map((alat) => {
                                const cartQty = inCartQty.get(alat.id) ?? 0
                                const sudahDiKeranjang = cartQty > 0
                                const tidakTersedia = alat.ketersediaan !== 'tersedia'

                                return (
                                  <tr key={alat.id} className="transition-colors hover:bg-surface-accent/20">
                                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-700">
                                      {alat.inventaris}
                                    </td>
                                    <td className="px-4 py-3">
                                      <p className="text-gray-700">{alat.merk}</p>
                                      <p className="text-xs text-gray-500">{alat.tipe}</p>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                      <span
                                        className={cn(
                                          'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                                          KETERSEDIAAN_BADGE_CLASSES[alat.ketersediaan] ??
                                            'bg-gray-100 text-gray-800',
                                        )}
                                      >
                                        {KETERSEDIAAN_LABELS[alat.ketersediaan] ?? alat.ketersediaan}
                                      </span>
                                      <span className="ml-2 text-xs text-gray-400">
                                        dari {alat.jumlah} unit
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-600">
                                      {kondisiRingkas(alat) || '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setDetailTarget(alat)}
                                          className="whitespace-nowrap rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-surface-container"
                                        >
                                          Detail
                                        </button>
                                        <Button
                                          size="sm"
                                          variant={sudahDiKeranjang ? 'outline' : 'primary'}
                                          onClick={() => {
                                            if (sudahDiKeranjang) {
                                              removeItem(alat.id)
                                              return
                                            }
                                            addItem({
                                              alat_id: alat.id,
                                              nama_alat: alat.nama_alat,
                                              inventaris: alat.inventaris,
                                              max_jumlah: alat.jumlah,
                                            })
                                          }}
                                          disabled={!sudahDiKeranjang && tidakTersedia}
                                          aria-label={
                                            sudahDiKeranjang
                                              ? 'Batalkan dari keranjang'
                                              : tidakTersedia
                                                ? 'Alat tidak tersedia'
                                                : 'Tambah ke keranjang'
                                          }
                                          title={
                                            sudahDiKeranjang
                                              ? 'Batalkan dari keranjang'
                                              : tidakTersedia
                                                ? 'Alat tidak tersedia'
                                                : 'Tambah ke keranjang'
                                          }
                                          className="gap-1 whitespace-nowrap"
                                        >
                                          {sudahDiKeranjang ? (
                                            <>
                                              <svg
                                                className="h-3.5 w-3.5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                aria-hidden="true"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2.5}
                                                  d="M5 13l4 4L19 7"
                                                />
                                              </svg>
                                              <CartIcon />
                                            </>
                                          ) : (
                                            <>
                                              <span className="text-sm leading-none" aria-hidden="true">
                                                +
                                              </span>
                                              <CartIcon />
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <aside className="w-full shrink-0 lg:w-96">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-surface shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
              <h2 className="text-sm font-bold text-surface-text">Keranjang Peminjaman</h2>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-surface-accent px-2 py-0.5 text-xs font-semibold text-primary">
                  {totalUnit} unit
                </span>
                {cartItems.length > 0 && (
                  <button
                    type="button"
                    onClick={clear}
                    className="text-xs text-gray-500 underline hover:text-gray-700"
                  >
                    Kosongkan
                  </button>
                )}
              </div>
            </div>

            {cartItems.length === 0 ? (
              <EmptyState
                title="Keranjang masih kosong"
                description="Pilih alat dari katalog untuk mulai mengajukan peminjaman."
                className="py-8"
              />
            ) : (
              <ul className="max-h-80 space-y-2.5 overflow-y-auto px-4 py-4">
                {cartItems.map((item) => (
                  <li key={item.alat_id} className="rounded-lg border border-gray-200 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-surface-text">{item.nama_alat}</p>
                        <p className="font-mono text-xs text-gray-500">{item.inventaris}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.alat_id)}
                        aria-label={`Hapus ${item.nama_alat}`}
                        className="rounded p-0.5 text-rose-600 transition-colors hover:bg-rose-50"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <QuantityStepper
                        value={item.jumlah}
                        max={item.max_jumlah}
                        onChange={(value) => setQty(item.alat_id, value)}
                      />
                      <span className="text-xs text-gray-500">maks {item.max_jumlah} unit</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="border-t border-gray-100 px-4 py-4">
              <p className="text-xs leading-relaxed text-gray-500">
                Alat diambil di laboratorium setelah pengajuan disetujui laboran.
              </p>
              <Button
                className="mt-3 w-full"
                onClick={() => setIsCheckoutOpen(true)}
                disabled={cartItems.length === 0}
              >
                Ajukan Peminjaman
              </Button>
            </div>
          </div>
        </aside>
      </div>

      <section id="riwayat" className="mt-12 scroll-mt-24">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-surface-text">Pengajuan Peminjamanmu</h2>
          {peminjamanMeta && peminjamanMeta.total > 0 && (
            <p className="text-xs text-gray-500">{peminjamanMeta.total} pengajuan</p>
          )}
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container text-[11px] uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Diajukan</th>
                  <th className="px-4 py-3 font-semibold">Keperluan</th>
                  <th className="px-4 py-3 font-semibold">Alat</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <SkeletonRows colSpan={4} />
                ) : peminjamanList.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <EmptyState
                        title="Belum ada pengajuan"
                        description="Pengajuan peminjaman alat yang kamu kirim akan muncul di sini."
                        className="py-10"
                      />
                    </td>
                  </tr>
                ) : (
                  peminjamanList.map((peminjaman) => (
                    <tr key={peminjaman.id} className="transition-colors hover:bg-surface-accent/20">
                      <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                        {formatWaktu(peminjaman.dibuat_pada)}
                      </td>
                      <td className="max-w-48 px-4 py-3">
                        {peminjaman.keperluan_label}
                        {peminjaman.praktikum_slug && (
                          <span className="block text-xs text-gray-500">{peminjaman.praktikum_slug}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <ul className="space-y-0.5">
                          {peminjaman.items.map((item) => (
                            <li key={item.id} className="text-gray-600">
                              <span className="font-mono text-xs">{item.inventaris}</span>{' '}
                              {item.nama_alat ?? '-'} ×{item.jumlah}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium',
                            STATUS_BADGE_CLASSES[peminjaman.status],
                          )}
                        >
                          {STATUS_LABELS[peminjaman.status]}
                        </span>
                        {peminjaman.status === 'ditolak' && peminjaman.catatan && (
                          <span className="mt-1 block text-xs text-rose-600">
                            Alasan: {peminjaman.catatan}
                          </span>
                        )}
                        {peminjaman.status === 'disetujui' && peminjaman.returned_at === null && (
                          <span className="mt-1 block text-xs text-gray-500">
                            Ambil alat di lab, lalu kembalikan setelah selesai.
                          </span>
                        )}
                        {peminjaman.returned_at !== null && (
                          <span className="mt-1 block text-xs text-gray-500">
                            Dikembalikan {formatWaktu(peminjaman.returned_at)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {peminjamanMeta && peminjamanMeta.last_page > 1 && (
          <Pagination page={peminjamanPage} meta={peminjamanMeta} onChange={goToPeminjamanPage} />
        )}
      </section>

      {detailTarget && <AlatDetailModal alat={detailTarget} onClose={() => setDetailTarget(null)} />}

      {isCheckoutOpen && (
        <PeminjamanFormModal
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  )
}

function CatalogSkeleton() {
  return (
    <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-surface shadow-sm">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2 px-4 py-4">
          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-1/4 animate-pulse rounded bg-gray-100" />
        </div>
      ))}
    </div>
  )
}

function SkeletonRows({ colSpan }: { colSpan: number }) {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <tr key={index}>
          <td colSpan={colSpan} className="px-4 py-3">
            <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
          </td>
        </tr>
      ))}
    </>
  )
}

interface PaginationProps {
  page: number
  meta: AlatLogListMeta
  onChange: (page: number) => void
}

function Pagination({ page, meta, onChange }: PaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-end gap-2 text-sm text-gray-600">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-md border border-gray-300 px-3 py-1.5 transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
      >
        Sebelumnya
      </button>
      <span>
        Halaman {meta.current_page} / {meta.last_page}
      </span>
      <button
        type="button"
        disabled={page >= meta.last_page}
        onClick={() => onChange(page + 1)}
        className="rounded-md border border-gray-300 px-3 py-1.5 transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
      >
        Berikutnya
      </button>
    </div>
  )
}
