import type { JadwalItem } from '@/services/public'

const URUTAN_HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

interface AgendaPraktikumProps {
  agenda: JadwalItem[] | null
}

export default function AgendaPraktikum({ agenda }: AgendaPraktikumProps) {
  const perHari = new Map<string, JadwalItem[]>()
  for (const jadwal of agenda ?? []) {
    const list = perHari.get(jadwal.hari) ?? []
    list.push(jadwal)
    perHari.set(jadwal.hari, list)
  }
  const hariTersortir = [...perHari.entries()].sort(
    ([a], [b]) => URUTAN_HARI.indexOf(a) - URUTAN_HARI.indexOf(b),
  )

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-navy">Agenda Praktikum</h2>
        <p className="mt-2 text-gray-600">
          Jadwal mingguan kegiatan praktikum di laboratorium.
        </p>

        {agenda === null ? (
          <p className="mt-8 text-gray-500">Memuat agenda…</p>
        ) : agenda.length === 0 ? (
          <p className="mt-8 text-gray-500">Belum ada agenda praktikum.</p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hariTersortir.map(([hari, jadwalHari]) => (
              <div key={hari} className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="border-b border-gray-100 pb-3 font-semibold text-navy">{hari}</h3>
                <ul className="mt-4 space-y-4">
                  {jadwalHari.map((j) => (
                    <li key={j.id} className="text-sm">
                      <p className="font-semibold text-gray-900">{j.praktikum?.label}</p>
                      <p className="mt-0.5 text-gray-500">
                        Plug {j.plug} · {j.jam_mulai}–{j.jam_selesai}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
