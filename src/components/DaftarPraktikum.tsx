import type { PraktikumItem } from '@/services/public'

interface DaftarPraktikumProps {
  praktikum: PraktikumItem[] | null
}

export default function DaftarPraktikum({ praktikum }: DaftarPraktikumProps) {
  return (
    <section id="praktikum" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-navy">Daftar Praktikum</h2>
        <p className="mt-2 text-gray-600">
          Mata praktikum aktif di Lab Survei Geodesi dan Geometri beserta jadwal plug-nya.
        </p>

        {praktikum === null ? (
          <p className="mt-8 text-gray-500">Memuat daftar praktikum…</p>
        ) : praktikum.length === 0 ? (
          <p className="mt-8 text-gray-500">Belum ada praktikum aktif.</p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {praktikum.map((p) => (
              <div
                key={p.id}
                className="flex flex-col rounded-lg border border-gray-200 p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-navy">{p.label}</h3>
                  <span className="shrink-0 rounded-full bg-navy/5 px-3 py-1 text-xs font-medium capitalize text-navy">
                    {p.semester}
                  </span>
                </div>

                {p.plugs.length === 0 ? (
                  <p className="mt-4 text-sm text-gray-500">
                    Belum ada jadwal plug untuk praktikum ini.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-2">
                    {p.plugs.map((j) => (
                      <li
                        key={j.id}
                        className="flex items-center justify-between text-sm text-gray-700"
                      >
                        <span>
                          <span className="font-semibold">Plug {j.plug}</span> — {j.hari}
                        </span>
                        <span className="text-gray-500">
                          {j.jam_mulai}–{j.jam_selesai}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
