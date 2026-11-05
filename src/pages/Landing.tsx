import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Hero from '../components/Hero'
import ProfilLab from '../components/ProfilLab'
import DaftarPraktikum from '../components/DaftarPraktikum'
import AgendaPraktikum from '../components/AgendaPraktikum'
import LoginModal from '@/components/LoginModal'
import { useError } from '@/contexts/ErrorContext'
import { getPublicAgenda, getPublicPraktikum, type JadwalItem, type PraktikumItem } from '@/services/public'

export default function Landing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { showError } = useError()
  const isLoginOpen = searchParams.get('login') === '1'
  const openLogin = () => setSearchParams({ login: '1' }, { replace: true })
  const closeLogin = () => setSearchParams({}, { replace: true })
  const [praktikum, setPraktikum] = useState<PraktikumItem[] | null>(null)
  const [agenda, setAgenda] = useState<JadwalItem[] | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      // silent: error ditangani lewat showError supaya tombol "Coba Lagi" bisa memuat ulang.
      getPublicPraktikum({ silent: true }),
      getPublicAgenda({ silent: true }),
    ])
      .then(([p, a]) => {
        if (cancelled) return
        setPraktikum(p.data)
        setAgenda(a.data)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        showError(err, { onRetry: () => setRefreshKey((key) => key + 1) })
      })

    return () => {
      cancelled = true
    }
  }, [showError, refreshKey])

  return (
    <>
      <Hero onLoginClick={openLogin} />
      <ProfilLab />
      <DaftarPraktikum praktikum={praktikum} />
      <AgendaPraktikum agenda={agenda} />
      <LoginModal open={isLoginOpen} onClose={closeLogin} />
    </>
  )
}
