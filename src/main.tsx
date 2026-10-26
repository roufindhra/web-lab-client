import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from '@/contexts/AuthContext.tsx'
import { CartProvider } from '@/contexts/CartContext.tsx'
import { SewaCartProvider } from '@/contexts/SewaCartContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <SewaCartProvider>
          <App />
        </SewaCartProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
