import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { sewaService, type SewaOption } from '@/services'
import { getFormErrorMessages } from '@/utils/errors'
import { useSewaCart } from '@/contexts/SewaCartContext'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CartIcon } from '@/components/ui/CartIcon'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Steps } from '@/components/ui/Steps'

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)

const hariIni = () => new Date().toISOString().slice(0, 10)

const ALUR_SEWA = ['Pilih alat', 'Isi data', 'Ajukan'] as const

function hitungHari(tanggalPinjam: string, tanggalKembali: string): number {
  if (tanggalPinjam === '' || tanggalKembali === '') return 0
  const selisih =
    (new Date(tanggalKembali).getTime() - new Date(tanggalPinjam).getTime()) / (1000 * 60 * 60 * 24)
  return Math.max(1, Math.round(selisih) + 1)
}

export default function SewaPage() {
  const { items: cartItems, addItem, setQty, removeItem, clear } = useSewaCart()
  const { hash } = useLocation()
  const [katalog, setKatalog] = useState<SewaOption[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
      .catch(() => {
        // Error sudah ditampilkan otomatis di modal global.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Dipakai tombol keranjang di navbar/drawer: /sewa#keranjang-sewa.
  useEffect(() => {
    if (hash !== '#keranjang-sewa') return
    document.getElementById('keranjang-sewa')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])

  const jumlahHari = hitungHari(tanggalPinjam, tanggalKembali)

  const totalEstimasi = useMemo(
    () => cartItems.reduce((total, item) => total + item.jumlah * item.tarif_per_hari * jumlahHari, 0),
    [cartItems, jumlahHari],
  )

  const tanggalError =
    tanggalPinjam !== '' && tanggalKembali !== '' && tanggalKembali < tanggalPinjam
      ? 'Tanggal kembali tidak boleh sebelum tanggal pinjam.'
      : null

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

  const disabledReason = isFormValid
    ? null
    : cartItems.length === 0
      ? 'Tambahkan minimal satu alat ke keranjang.'
      : nama.trim() === '' || noHp.trim() === '' || email.trim() === ''
        ? 'Lengkapi nama, no. HP, dan email.'
        : tanggalPinjam === '' || tanggalKembali === ''
          ? 'Pilih tanggal pinjam dan tanggal kembali.'
          : tanggalError === null
            ? 'Periksa kembali data pengajuan.'
            : null

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
      setIsSubmitting(false)
      setSukses({ id: response.data.id, totalEstimasi: response.total_estimasi })
      clear()
    } catch (err) {
      // Error validasi (422) tampil inline; error lain ditangani modal global.
      const messages = getFormErrorMessages(err)
      setSubmitError(messages.length > 0 ? messages.join(' ') : null)
      setIsSubmitting(false)
    }
  }

  if (sukses) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-xl border border-gray-200 bg-surface p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-surface-text">Pengajuan Sewa Terkirim</h1>
          <p className="mt-2 text-sm text-gray-500">
            Pengajuanmu sudah masuk dan akan diperiksa oleh laboran. Bila disetujui, detail konfirmasi
            akan dikirim ke email kamu.
          </p>

          <dl className="mt-6 divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200 bg-surface-container/50 text-left text-sm">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-gray-500">Nomor Pengajuan</dt>
              <dd className="font-mono font-semibold text-surface-text">#{sukses.id}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-gray-500">Estimasi Biaya Sewa</dt>
              <dd className="font-bold text-surface-text">{formatRupiah(sukses.totalEstimasi)}</dd>
            </div>
          </dl>

          <p className="mt-4 text-xs leading-relaxed text-gray-500">
            Untuk pertanyaan atau follow-up, hubungi narahubung lab di{' '}
            <a href="mailto:geodesigeometri@gmail.com" className="font-medium text-primary underline">
              geodesigeometri@gmail.com
            </a>
            .
          </p>

          <div className="mt-6 flex justify-center">
            <Button variant="outline" onClick={() => setSukses(null)}>
              Ajukan Sewa Lain
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-text">Sewa Alat Lab</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Penyewaan alat survei terbuka untuk umum — tanpa perlu akun. Isi data diri, pilih alat, lalu
          ajukan. Pengajuan akan diperiksa oleh laboran.
        </p>
        <Steps
          steps={ALUR_SEWA}
          active={cartItems.length === 0 ? 0 : !isFormValid ? 1 : 2}
          className="mt-4"
        />
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-lg font-bold text-surface-text">Katalog Alat</h2>
            {!isLoading && katalog.length > 0 && (
              <p className="text-xs text-gray-500">{katalog.length} jenis alat tersedia untuk disewa</p>
            )}
          </div>

          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-3 rounded-xl border border-gray-200 bg-surface p-4 shadow-sm">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
                  <div className="h-8 w-full animate-pulse rounded bg-gray-100" />
                </div>
              ))}
            </div>
          ) : katalog.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-surface shadow-sm">
              <EmptyState
                title="Belum ada alat untuk disewakan"
                description="Katalog sewa belum tersedia. Silakan hubungi laboran untuk informasi lebih lanjut."
              />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {katalog.map((alat) => {
                const inCart = cartItems.find((item) => item.nama_alat === alat.nama_alat)
                const penuh = (inCart?.jumlah ?? 0) >= alat.jumlah_unit
                const tersedia = alat.jumlah_tersedia > 0
                const persenTersedia =
                  alat.jumlah_unit > 0
                    ? Math.round((alat.jumlah_tersedia / alat.jumlah_unit) * 100)
                    : 0

                return (
                  <div
                    key={alat.nama_alat}
                    className="flex flex-col rounded-xl border border-gray-200 bg-surface p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-surface-text">{alat.nama_alat}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {alat.jumlah_tersedia}/{alat.jumlah_unit} unit tersedia
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-surface-text">
                          {formatRupiah(alat.tarif_per_hari)}
                        </p>
                        <p className="text-[10px] text-gray-500">per hari</p>
                      </div>
                    </div>

                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${persenTersedia}%` }}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
                      <Badge variant={tersedia ? 'available' : 'maintenance'}>
                        {tersedia ? 'Tersedia' : 'Habis'}
                      </Badge>
                      <Button
                        size="sm"
                        variant={penuh ? 'outline' : 'primary'}
                        onClick={() =>
                          addItem({
                            nama_alat: alat.nama_alat,
                            max_jumlah: alat.jumlah_unit,
                            tarif_per_hari: alat.tarif_per_hari,
                          })
                        }
                        disabled={penuh || !tersedia}
                        aria-label={
                          !tersedia
                            ? 'Stok sedang tidak tersedia'
                            : penuh
                              ? 'Semua unit sudah ada di keranjang'
                              : 'Tambah ke keranjang'
                        }
                        title={
                          !tersedia
                            ? 'Stok sedang tidak tersedia'
                            : penuh
                              ? 'Semua unit sudah ada di keranjang'
                              : 'Tambah ke keranjang'
                        }
                        className="gap-1 whitespace-nowrap"
                      >
                        {penuh ? (
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
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <aside id="keranjang-sewa" className="w-full shrink-0 scroll-mt-24 lg:w-96">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-surface shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
              <h2 className="text-sm font-bold text-surface-text">Keranjang Sewa</h2>
              <span className="rounded-full bg-surface-accent px-2 py-0.5 text-xs font-semibold text-primary">
                {cartItems.length} jenis
              </span>
            </div>

            <div className="space-y-5 px-5 py-4">
              {submitError && (
                <p className="rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">{submitError}</p>
              )}

              <section>
                <SectionHeading step={1} title="Item Sewa" />
                {cartItems.length === 0 ? (
                  <EmptyState
                    title="Belum ada alat dipilih"
                    description="Tambahkan alat dari katalog untuk mulai mengajukan sewa."
                    className="px-0 py-6"
                  />
                ) : (
                  <ul className="mt-3 space-y-2.5">
                    {cartItems.map((item) => (
                      <li key={item.nama_alat} className="rounded-lg border border-gray-200 p-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="min-w-0 truncate text-sm font-medium text-surface-text">
                            {item.nama_alat}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeItem(item.nama_alat)}
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
                            onChange={(value) => setQty(item.nama_alat, value)}
                          />
                          <span className="text-xs text-gray-500">
                            {formatRupiah(item.tarif_per_hari)}/hari
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="border-t border-gray-100 pt-5">
                <SectionHeading step={2} title="Data Penyewa" />
                <div className="mt-3 space-y-3">
                  <div>
                    <label htmlFor="sewa-nama" className="text-xs font-semibold text-surface-text">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      id="sewa-nama"
                      value={nama}
                      onChange={(event) => setNama(event.target.value)}
                      placeholder="Nama lengkap penyewa"
                      className="mt-1"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label htmlFor="sewa-nohp" className="text-xs font-semibold text-surface-text">
                      No. HP/WhatsApp <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      id="sewa-nohp"
                      type="tel"
                      value={noHp}
                      onChange={(event) => setNoHp(event.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="mt-1"
                      autoComplete="tel"
                    />
                  </div>
                  <div>
                    <label htmlFor="sewa-institusi" className="text-xs font-semibold text-surface-text">
                      Institusi/Instansi <span className="font-normal text-gray-400">(opsional)</span>
                    </label>
                    <Input
                      id="sewa-institusi"
                      value={institusi}
                      onChange={(event) => setInstitusi(event.target.value)}
                      placeholder="Nama instansi asal"
                      className="mt-1"
                      autoComplete="organization"
                    />
                  </div>
                  <div>
                    <label htmlFor="sewa-email" className="text-xs font-semibold text-surface-text">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      id="sewa-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="nama@email.com"
                      className="mt-1"
                      autoComplete="email"
                    />
                  </div>
                </div>
              </section>

              <section className="border-t border-gray-100 pt-5">
                <SectionHeading step={3} title="Jadwal Sewa" />
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="sewa-pinjam" className="text-xs font-semibold text-surface-text">
                      Tgl Pinjam <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      id="sewa-pinjam"
                      type="date"
                      min={hariIni()}
                      value={tanggalPinjam}
                      onChange={(event) => setTanggalPinjam(event.target.value)}
                      className="mt-1 px-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="sewa-kembali" className="text-xs font-semibold text-surface-text">
                      Tgl Kembali <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      id="sewa-kembali"
                      type="date"
                      min={tanggalPinjam || hariIni()}
                      value={tanggalKembali}
                      onChange={(event) => setTanggalKembali(event.target.value)}
                      className="mt-1 px-2"
                    />
                  </div>
                </div>
                {tanggalError ? (
                  <p className="mt-2 text-xs text-rose-600">{tanggalError}</p>
                ) : (
                  jumlahHari > 0 && (
                    <p className="mt-2 text-xs text-gray-500">Durasi sewa: {jumlahHari} hari</p>
                  )
                )}
              </section>

              {cartItems.length > 0 && (
                <div className="rounded-lg bg-surface-container px-3 py-3 text-sm">
                  {jumlahHari > 0 ? (
                    <>
                      <ul className="space-y-1">
                        {cartItems.map((item) => (
                          <li
                            key={item.nama_alat}
                            className="flex items-start justify-between gap-3 text-xs text-gray-600"
                          >
                            <span className="min-w-0 truncate">
                              {item.nama_alat} × {item.jumlah} × {jumlahHari} hari
                            </span>
                            <span className="shrink-0">
                              {formatRupiah(item.jumlah * item.tarif_per_hari * jumlahHari)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 flex items-center justify-between border-t border-gray-300/60 pt-2 font-bold text-surface-text">
                        <span>Estimasi ({jumlahHari} hari)</span>
                        <span>{formatRupiah(totalEstimasi)}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Isi tanggal pinjam & tanggal kembali untuk melihat estimasi biaya.
                    </p>
                  )}
                </div>
              )}

              <div className="border-t border-gray-100 pt-4">
                {disabledReason && <p className="mb-2 text-xs text-gray-500">{disabledReason}</p>}
                <Button
                  className="w-full"
                  onClick={() => void handleSubmit()}
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? 'Mengirim...' : 'Ajukan Sewa'}
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function SectionHeading({ step, title }: { step: number; title: string }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold text-surface-text">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-accent text-[11px] font-bold text-primary">
        {step}
      </span>
      {title}
    </h3>
  )
}
