import { useEffect, useMemo, useState } from 'react'
import { ApiError, sewaService, type SewaOption } from '@/services'
import { useSewaCart } from '@/contexts/SewaCartContext'

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)

const hariIni = () => new Date().toISOString().slice(0, 10)

function hitungHari(tanggalPinjam: string, tanggalKembali: string): number {
  if (tanggalPinjam === '' || tanggalKembali === '') return 0
  const selisih =
    (new Date(tanggalKembali).getTime() - new Date(tanggalPinjam).getTime()) / (1000 * 60 * 60 * 24)
  return Math.max(1, Math.round(selisih) + 1)
}

export default function SewaPage() {
  const { items: cartItems, addItem, setQty, removeItem, clear } = useSewaCart()
  const [katalog, setKatalog] = useState<SewaOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [nama, setNama] = useState('')
  const [noHp, setNoHp] = useState('')
  const [institusi, setInstitusi] = useState('')
  const [email, setEmail] = useState('')
  const [tanggalPinjam, setTanggalPinjam] = useState('')
  const [tanggalKembali, setTanggalKembali] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [sukses, setSukses] = useState<{ id: number; totalEstimasi: number } | null>(null)

  useEffect(() => {
    let cancelled = false
    sewaService
      .options()
      .then((response) => {
        if (!cancelled) setKatalog(response.data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Gagal memuat katalog sewa.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const jumlahHari = hitungHari(tanggalPinjam, tanggalKembali)

  const totalEstimasi = useMemo(
    () => cartItems.reduce((total, item) => total + item.jumlah * item.tarif_per_hari * jumlahHari, 0),
    [cartItems, jumlahHari],
  )

  const isFormValid = useMemo(() => {
    return (
      nama.trim() !== '' &&
      noHp.trim() !== '' &&
      email.trim() !== '' &&
      tanggalPinjam !== '' &&
      tanggalKembali !== '' &&
      tanggalKembali >= tanggalPinjam &&
      cartItems.length > 0 &&
      cartItems.every((item) => item.jumlah >= 1 && item.jumlah <= item.max_jumlah)
    )
  }, [nama, noHp, email, tanggalPinjam, tanggalKembali, cartItems])

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const response = await sewaService.ajukan({
        nama: nama.trim(),
        no_hp: noHp.trim(),
        email: email.trim(),
        ...(institusi.trim() !== '' && { institusi: institusi.trim() }),
        tanggal_pinjam: tanggalPinjam,
        tanggal_kembali: tanggalKembali,
        items: cartItems.map((item) => ({ nama_alat: item.nama_alat, jumlah: item.jumlah })),
      })
      setSukses({ id: response.data.id, totalEstimasi: response.total_estimasi })
      clear()
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Terjadi kesalahan.')
      setIsSubmitting(false)
    }
  }

  if (sukses) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Pengajuan Sewa Terkirim</h1>
        <p className="mt-3 text-sm text-gray-600">
          Nomor pengajuan <span className="font-mono font-medium">#{sukses.id}</span>. Estimasi biaya sewa{' '}
          <span className="font-medium">{formatRupiah(sukses.totalEstimasi)}</span>.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Mohon menunggu, pengajuan akan diproses oleh laboran. Bila disetujui, detail konfirmasi akan dikirim
          ke email kamu.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Untuk pertanyaan atau follow-up, hubungi narahubung lab di{' '}
          <a href="mailto:geodesigeometri@gmail.com" className="font-medium text-gray-900 underline">
            geodesigeometri@gmail.com
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Sewa Alat Lab</h1>
        <p className="mt-1 text-sm text-gray-500">
          Penyewaan alat survei terbuka untuk umum — tanpa perlu akun. Isi data diri, pilih alat, dan ajukan.
          Pengajuan akan diperiksa oleh laboran.
        </p>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex flex-col-reverse gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold">Katalog Alat</h2>
          {isLoading ? (
            <p className="mt-4 text-sm text-gray-500">Memuat...</p>
          ) : katalog.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">Belum ada alat yang tersedia untuk disewakan.</p>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {katalog.map((alat) => {
                const inCart = cartItems.find((item) => item.nama_alat === alat.nama_alat)
                const penuh = (inCart?.jumlah ?? 0) >= alat.jumlah_unit
                return (
                  <div key={alat.nama_alat} className="flex flex-col rounded-lg border bg-white p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{alat.nama_alat}</p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {alat.jumlah_tersedia}/{alat.jumlah_unit} unit tersedia
                        </p>
                      </div>
                      <p className="whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatRupiah(alat.tarif_per_hari)}
                        <span className="block text-right text-[10px] font-normal text-gray-500">per hari</span>
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        addItem({
                          nama_alat: alat.nama_alat,
                          max_jumlah: alat.jumlah_unit,
                          tarif_per_hari: alat.tarif_per_hari,
                        })
                      }
                      disabled={penuh}
                      className="mt-3 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {penuh ? '✓ Di keranjang' : '+ Tambah ke Keranjang'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="w-full shrink-0 lg:w-96">
          <div className="rounded-lg border bg-white p-4 lg:sticky lg:top-20">
            <h2 className="text-lg font-bold">Keranjang Sewa</h2>

            {submitError && <p className="mt-3 text-sm text-red-600">{submitError}</p>}

            {cartItems.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">Keranjang masih kosong.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {cartItems.map((item) => (
                  <li key={item.nama_alat} className="rounded-md border p-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 truncate text-sm font-medium">{item.nama_alat}</p>
                      <button
                        onClick={() => removeItem(item.nama_alat)}
                        className="rounded p-0.5 text-red-600 hover:bg-red-50"
                        aria-label={`Hapus ${item.nama_alat}`}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <button
                        onClick={() => setQty(item.nama_alat, item.jumlah - 1)}
                        disabled={item.jumlah <= 1}
                        className="h-6 w-6 rounded-md border text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Kurangi jumlah"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={item.max_jumlah}
                        value={item.jumlah}
                        onChange={(event) => setQty(item.nama_alat, Number(event.target.value))}
                        className="w-14 rounded-md border px-1.5 py-0.5 text-center text-sm focus:border-gray-400 focus:outline-none"
                        aria-label="Jumlah"
                      />
                      <button
                        onClick={() => setQty(item.nama_alat, item.jumlah + 1)}
                        disabled={item.jumlah >= item.max_jumlah}
                        className="h-6 w-6 rounded-md border text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Tambah jumlah"
                      >
                        +
                      </button>
                      <span className="ml-auto text-xs text-gray-500">
                        {formatRupiah(item.jumlah * item.tarif_per_hari)}/hari
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 space-y-3 border-t pt-4">
              <div>
                <label htmlFor="sewa-nama" className="text-sm font-medium">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  id="sewa-nama"
                  value={nama}
                  onChange={(event) => setNama(event.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="sewa-nohp" className="text-sm font-medium">
                  No. HP/WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  id="sewa-nohp"
                  type="tel"
                  value={noHp}
                  onChange={(event) => setNoHp(event.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="sewa-institusi" className="text-sm font-medium">
                  Institusi/Instansi
                </label>
                <input
                  id="sewa-institusi"
                  value={institusi}
                  onChange={(event) => setInstitusi(event.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="sewa-email" className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="sewa-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="sewa-pinjam" className="text-sm font-medium">
                    Tgl Pinjam <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="sewa-pinjam"
                    type="date"
                    min={hariIni()}
                    value={tanggalPinjam}
                    onChange={(event) => setTanggalPinjam(event.target.value)}
                    className="mt-1 w-full rounded-md border px-2 py-2 text-sm focus:border-gray-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="sewa-kembali" className="text-sm font-medium">
                    Tgl Kembali <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="sewa-kembali"
                    type="date"
                    min={tanggalPinjam || hariIni()}
                    value={tanggalKembali}
                    onChange={(event) => setTanggalKembali(event.target.value)}
                    className="mt-1 w-full rounded-md border px-2 py-2 text-sm focus:border-gray-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {cartItems.length > 0 && jumlahHari > 0 && (
              <div className="mt-4 flex items-center justify-between rounded-md bg-gray-50 px-3 py-2.5 text-sm">
                <span className="text-gray-600">
                  Estimasi ({jumlahHari} hari)
                </span>
                <span className="font-bold">{formatRupiah(totalEstimasi)}</span>
              </div>
            )}

            <button
              onClick={() => void handleSubmit()}
              disabled={!isFormValid || isSubmitting}
              className="mt-4 w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? 'Mengirim...' : 'Ajukan Sewa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
