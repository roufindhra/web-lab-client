import { useEffect, useMemo, useRef, useState } from 'react'
import { getPublicAkademik, type AkademikPraktikum } from '@/services/public'
import { useScrollSpy } from '@/hooks/useScrollSpy'

const subSections = ['Dosen', 'Jadwal', 'Materi'] as const

export default function Pembelajaran() {
  const [praktikumList, setPraktikumList] = useState<AkademikPraktikum[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getPublicAkademik()
      .then((response) => setPraktikumList(response.data))
      .catch(() => setError('Gagal memuat data pembelajaran.'))
  }, [])

  const navIds = useMemo(
    () =>
      praktikumList?.flatMap((praktikum) => [
        praktikum.slug,
        ...subSections.map((s) => `${praktikum.slug}-${s.toLowerCase()}`),
        ...praktikum.materi.map((m) => `${praktikum.slug}-materi-${m.materi_id}`),
      ]) ?? [],
    [praktikumList],
  )

  const activeId = useScrollSpy(navIds)

  const navRef = useRef<HTMLElement>(null)

  // Item aktif bisa berada di luar area terlihat nav (nav punya scrollbar
  // internal sendiri) — gulirkan nav agar item aktif selalu tampak.
  useEffect(() => {
    const nav = navRef.current
    if (!nav || !activeId) return
    const el = nav.querySelector<HTMLElement>(`[data-nav-id="${CSS.escape(activeId)}"]`)
    if (!el) return
    const top = el.offsetTop
    const bottom = top + el.offsetHeight
    if (top < nav.scrollTop) {
      nav.scrollTop = top
    } else if (bottom > nav.scrollTop + nav.clientHeight) {
      nav.scrollTop = bottom - nav.clientHeight
    }
  }, [activeId])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy">Pembelajaran</h1>
      <p className="mt-2 text-gray-600">
        Praktikum, dosen pengampu, jadwal, dan susunan materi yang diajarkan di Lab SGG.
      </p>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      {!praktikumList && !error && <p className="mt-6 text-sm text-gray-500">Memuat...</p>}

      {praktikumList && praktikumList.length === 0 && (
        <p className="mt-6 text-sm text-gray-500">Belum ada praktikum aktif.</p>
      )}

      {praktikumList && praktikumList.length > 0 && (
        <div className="mt-10 flex gap-10">
          {/* Konten */}
          <div className="min-w-0 flex-1">
            {praktikumList.map((praktikum, index) => (
              <PraktikumSection key={praktikum.slug} praktikum={praktikum} zebra={index % 2 === 1} />
            ))}
          </div>

          {/* Side-nav gaya dokumentasi (kanan) */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <nav
              ref={navRef}
              className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pl-2"
            >
              {praktikumList.map((praktikum) => (
                <div key={praktikum.slug} className="mb-5">
                  <NavItem
                    id={praktikum.slug}
                    activeId={activeId}
                    onClick={scrollTo}
                    className="font-semibold"
                  >
                    {praktikum.label}
                  </NavItem>
                  <div className="mt-1 space-y-0.5 border-l border-gray-200 pl-3">
                    {subSections.map((sub) => (
                      <NavItem
                        key={sub}
                        id={`${praktikum.slug}-${sub.toLowerCase()}`}
                        activeId={activeId}
                        onClick={scrollTo}
                      >
                        {sub}
                      </NavItem>
                    ))}
                    {praktikum.materi.map((materi) => (
                      <NavItem
                        key={materi.materi_id}
                        id={`${praktikum.slug}-materi-${materi.materi_id}`}
                        activeId={activeId}
                        onClick={scrollTo}
                        className="pl-3 text-xs"
                      >
                        {materi.materi_nama}
                      </NavItem>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  )
}

function NavItem({
  id,
  activeId,
  onClick,
  children,
  className = '',
}: {
  id: string
  activeId: string | null
  onClick: (id: string) => void
  children: React.ReactNode
  className?: string
}) {
  const isActive = activeId === id
  return (
    <button
      type="button"
      data-nav-id={id}
      onClick={() => onClick(id)}
      className={`block w-full truncate rounded px-2 py-1 text-left text-sm transition ${
        isActive ? 'bg-navy/5 font-semibold text-navy' : 'text-gray-600 hover:text-navy'
      } ${className}`}
    >
      {children}
    </button>
  )
}

function PraktikumSection({ praktikum, zebra }: { praktikum: AkademikPraktikum; zebra: boolean }) {
  const slug = praktikum.slug

  return (
    <section id={slug} className={`scroll-mt-24 rounded-xl p-6 md:p-8 ${zebra ? 'bg-gray-50' : ''}`}>
      <h2 className="text-2xl font-bold text-navy md:text-3xl">{praktikum.label}</h2>
      <span className="mt-2 inline-block rounded-full bg-navy/5 px-3 py-1 text-xs font-medium text-navy">
        Semester {praktikum.semester}
      </span>

      {/* Dosen */}
      <h3 id={`${slug}-dosen`} className="mt-8 scroll-mt-24 text-lg font-semibold text-navy">
        Dosen Pengampu
      </h3>
      {praktikum.dosen.length > 0 ? (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {praktikum.dosen.map((nama) => (
            <li key={nama} className="text-sm text-gray-700">
              {nama}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-gray-500">Belum ada dosen pengampu.</p>
      )}

      {/* Jadwal */}
      <h3 id={`${slug}-jadwal`} className="mt-8 scroll-mt-24 text-lg font-semibold text-navy">
        Jadwal Tersedia
      </h3>
      {praktikum.jadwal.length > 0 ? (
        <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2">Plug</th>
                <th className="px-4 py-2">Hari</th>
                <th className="px-4 py-2">Jam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {praktikum.jadwal.map((jadwal) => (
                <tr key={`${jadwal.plug}-${jadwal.hari}-${jadwal.jam_mulai}`}>
                  <td className="px-4 py-2 font-medium text-gray-900">{jadwal.plug}</td>
                  <td className="px-4 py-2 text-gray-700">{jadwal.hari}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {jadwal.jam_mulai?.slice(0, 5)} – {jadwal.jam_selesai?.slice(0, 5)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-2 text-sm text-gray-500">Belum ada jadwal.</p>
      )}

      {/* Materi */}
      <h3 id={`${slug}-materi`} className="mt-8 scroll-mt-24 text-lg font-semibold text-navy">
        Materi
      </h3>
      {praktikum.materi.length > 0 ? (
        <div className="mt-3 space-y-6">
          {praktikum.materi.map((materi) => (
            <article
              key={materi.materi_id}
              id={`${slug}-materi-${materi.materi_id}`}
              className="scroll-mt-24 border-l-2 border-navy/10 pl-4"
            >
              <h4 className="text-base font-semibold text-gray-900">
                {materi.materi_id}. {materi.materi_nama}
              </h4>
              <div
                className="prose prose-sm mt-2 max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: materi.deskripsi }}
              />
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-gray-500">Susunan materi belum tersedia.</p>
      )}
    </section>
  )
}
