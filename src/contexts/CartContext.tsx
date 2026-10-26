import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export interface CartItem {
  alat_id: number
  nama_alat: string
  inventaris: string
  jumlah: number
  max_jumlah: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'jumlah'>) => void
  setQty: (alat_id: number, jumlah: number) => void
  removeItem: (alat_id: number) => void
  clear: () => void
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CART_STORAGE_KEY = 'client_cart'

function readStoredItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (raw === null) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is CartItem =>
        typeof item === 'object' &&
        item !== null &&
        Number.isInteger((item as CartItem).alat_id) &&
        typeof (item as CartItem).nama_alat === 'string' &&
        typeof (item as CartItem).inventaris === 'string' &&
        Number.isInteger((item as CartItem).jumlah) &&
        Number.isInteger((item as CartItem).max_jumlah),
    )
  } catch {
    return []
  }
}

const CartContext = createContext<CartContextValue | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredItems)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((item: Omit<CartItem, 'jumlah'>) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.alat_id === item.alat_id)
      if (existing) {
        return current.map((entry) =>
          entry.alat_id === item.alat_id
            ? { ...entry, jumlah: Math.min(entry.jumlah + 1, entry.max_jumlah) }
            : entry,
        )
      }
      return [...current, { ...item, jumlah: 1 }]
    })
  }, [])

  const setQty = useCallback((alat_id: number, jumlah: number) => {
    setItems((current) =>
      current.map((item) =>
        item.alat_id === alat_id ? { ...item, jumlah: Math.min(Math.max(1, jumlah), item.max_jumlah) } : item,
      ),
    )
  }, [])

  const removeItem = useCallback((alat_id: number) => {
    setItems((current) => current.filter((item) => item.alat_id !== alat_id))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  return (
    <CartContext.Provider
      value={{ items, addItem, setQty, removeItem, clear, isCartOpen, openCart, closeCart }}
    >
      {children}
    </CartContext.Provider>
  )
}
