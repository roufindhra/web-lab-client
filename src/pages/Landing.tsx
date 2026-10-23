import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Hero from '../components/Hero'
import ProfilLab from '../components/ProfilLab'
import DaftarPraktikum from '../components/DaftarPraktikum'
import AgendaPraktikum from '../components/AgendaPraktikum'
import LoginModal from '@/components/LoginModal'
import { getPublicAgenda, getPublicPraktikum, type JadwalItem, type PraktikumItem } from '@/services/public'

export default function Landing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isLoginOpen = searchParams.get('login') === '1'
  const openLogin = () => setSearchParams({ login: '1' }, { replace: true })
  const closeLogin = () => setSearchParams({}, { replace: true })
  const [praktikum, setPraktikum] = useState<PraktikumItem[] | null>(null)
  const [agenda, setAgenda] = useState<JadwalItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    Promise.all([getPublicPraktikum(), getPublicAgenda()])
      .then(([p, a]) => {
        setPraktikum(p.data)
        setAgenda(a.data)
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Terjadi kesalahan.'))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const retry = () => {
    setError(null)
    setPraktikum(null)
    setAgenda(null)
    load()
  }

  return (
    <>
      <Hero onLoginClick={openLogin} />
      <ProfilLab />
      {error && (
        <div className="bg-red-50 py-3 text-center text-sm text-red-700">
          {error}{' '}
          <button onClick={retry} className="font-semibold underline hover:text-red-900">
            Coba lagi
          </button>
        </div>
      )}
      <DaftarPraktikum praktikum={praktikum} />
      <AgendaPraktikum agenda={agenda} />
      <LoginModal open={isLoginOpen} onClose={closeLogin} />
    </>
  )
}
