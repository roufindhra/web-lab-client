import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Pages
import MainLayout from '@/layouts/MainLayout'
import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import AlatPage from '@/pages/Alat'

// Auth function
import ProtectedRoute from '@/routes/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public access */}
        <Route path="/" element={<MainLayout headerVariant="landing" />}>
          <Route index element={<Landing />}/>
        </Route>

        {/* Auth needed */}
        <Route element={<MainLayout />}>
          <Route path="dashboard" element={<ProtectedRoute roles={['mahasiswa', 'asisten']}><Dashboard /></ProtectedRoute>}/>
          <Route path="alat" element={<ProtectedRoute roles={['mahasiswa', 'asisten']}> <AlatPage /> </ProtectedRoute>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
