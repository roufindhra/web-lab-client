import { useCallback, useEffect, useState } from 'react'
import Hero from './_components/Hero'
import ProfilLab from './_components/ProfilLab'
import DaftarPraktikum from './_components/DaftarPraktikum'
import AgendaPraktikum from './_components/AgendaPraktikum'
import { getPublicAgenda, getPublicPraktikum, type JadwalItem, type PraktikumItem } from '@/services/public'

export default function Landing() {
  const [praktikum, setPraktikum] = useState<PraktikumItem[] | null>(null)
  const [agenda, setAgenda] = useState<JadwalItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setError(null)
    setPraktikum(null)
    setAgenda(null)
    Promise.all([getPublicPraktikum(), getPublicAgenda()])
      .then(([p, a]) => {
        setPraktikum(p.data)
        setAgenda(a.data)
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Terjadi kesalahan.'))
  }, [])

  useEffect(load, [load])

  return (
    <>
      <Hero />
      <ProfilLab />
      {error && (
        <div className="bg-red-50 py-3 text-center text-sm text-red-700">
          {error}{' '}
          <button onClick={load} className="font-semibold underline hover:text-red-900">
            Coba lagi
          </button>
        </div>
      )}
      <DaftarPraktikum praktikum={praktikum} />
      <AgendaPraktikum agenda={agenda} />
    </>
  )
}
