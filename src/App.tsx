import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

// Pages
import MainLayout from '@/layouts/MainLayout'
import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import AlatPage from '@/pages/Alat'
import Pembelajaran from '@/pages/Pembelajaran'
import Riset from '@/pages/Riset'
import SewaPage from '@/pages/Sewa'
import Akun from '@/pages/Akun'

// Auth function
import ProtectedRoute from '@/routes/ProtectedRoute'

// Test 
import { DesignSystemTest } from "@/pages/designsystemtest"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public access */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Landing />}/>
          <Route path="akademik" element={<Pembelajaran />}/>
          <Route path="riset" element={<Riset />}/>
          <Route path="sewa" element={<SewaPage />}/>
        </Route>

        {/* Auth needed */}
        <Route element={<MainLayout />}>
          <Route path="dashboard" element={<ProtectedRoute roles={['mahasiswa', 'asisten']}><Dashboard /></ProtectedRoute>}/>
          <Route path="alat" element={<ProtectedRoute roles={['mahasiswa', 'asisten']}> <AlatPage /> </ProtectedRoute>}/>
          <Route path="akun" element={<ProtectedRoute roles={['mahasiswa', 'asisten']}><Akun /></ProtectedRoute>}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        {/* cuma buat ngetes doang */}
        <Route path="/test" element={<DesignSystemTest />} />
      </Routes>
    </BrowserRouter>
  );
}
