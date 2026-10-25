import { useEffect, useState } from 'react'

/**
 * Melacak id section yang sedang berada di dekat atas viewport
 * (untuk highlight side-nav gaya dokumentasi).
 */
export function useScrollSpy(ids: string[], offset = 96) {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null)

  useEffect(() => {
    const onScroll = () => {
      let current: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= offset) {
          current = id
        }
      }
      // belum scroll sama sekali -> aktifkan item pertama
      setActiveId(current ?? ids[0] ?? null)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ids, offset])

  return activeId
}
