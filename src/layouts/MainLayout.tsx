import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'

interface MainLayoutProps {
  headerVariant?: 'light' | 'landing'
}

export default function MainLayout({ headerVariant = 'light' }: MainLayoutProps) {
  const isLanding = headerVariant === 'landing'

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer
        companyName="Lab Survei Geodesi dan Geometri - UPN Veteran Yogyakarta"
        variant={isLanding ? 'landing' : 'default'}
      />
    </div>
  )
}
