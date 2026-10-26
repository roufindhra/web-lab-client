import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export interface SewaCartItem {
  nama_alat: string
  jumlah: number
  max_jumlah: number
  tarif_per_hari: number
}

interface SewaCartContextValue {
  items: SewaCartItem[]
  addItem: (item: Omit<SewaCartItem, 'jumlah'>) => void
  setQty: (nama_alat: string, jumlah: number) => void
  removeItem: (nama_alat: string) => void
  clear: () => void
}

const SEWA_CART_STORAGE_KEY = 'sewa_cart'

function readStoredItems(): SewaCartItem[] {
  try {
    const raw = localStorage.getItem(SEWA_CART_STORAGE_KEY)
    if (raw === null) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is SewaCartItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as SewaCartItem).nama_alat === 'string' &&
        Number.isInteger((item as SewaCartItem).jumlah) &&
        Number.isInteger((item as SewaCartItem).max_jumlah) &&
        typeof (item as SewaCartItem).tarif_per_hari === 'number',
    )
  } catch {
    return []
  }
}

const SewaCartContext = createContext<SewaCartContextValue | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useSewaCart(): SewaCartContextValue {
  const context = useContext(SewaCartContext)
  if (!context) {
    throw new Error('useSewaCart must be used within SewaCartProvider')
  }
  return context
}

export function SewaCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<SewaCartItem[]>(readStoredItems)

  useEffect(() => {
    localStorage.setItem(SEWA_CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((item: Omit<SewaCartItem, 'jumlah'>) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.nama_alat === item.nama_alat)
      if (existing) {
        return current.map((entry) =>
          entry.nama_alat === item.nama_alat
            ? { ...entry, jumlah: Math.min(entry.jumlah + 1, entry.max_jumlah) }
            : entry,
        )
      }
      return [...current, { ...item, jumlah: 1 }]
    })
  }, [])

  const setQty = useCallback((nama_alat: string, jumlah: number) => {
    setItems((current) =>
      current.map((item) =>
        item.nama_alat === nama_alat
          ? { ...item, jumlah: Math.min(Math.max(1, jumlah), item.max_jumlah) }
          : item,
      ),
    )
  }, [])

  const removeItem = useCallback((nama_alat: string) => {
    setItems((current) => current.filter((item) => item.nama_alat !== nama_alat))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  return (
    <SewaCartContext.Provider value={{ items, addItem, setQty, removeItem, clear }}>
      {children}
    </SewaCartContext.Provider>
  )
}
