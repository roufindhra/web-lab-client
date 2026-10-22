import React from 'react'

interface FooterProps {
  companyName: string
  variant?: 'default' | 'landing'
}

const KontakLab = () => (
  <div className="grid gap-6 sm:grid-cols-2">
    <div>
      <h3 className="font-semibold text-accent-yellow">Alamat</h3>
      <p className="mt-2 text-sm text-gray-200">
        Jalan Tambak Bayan No. 2, Caturtunggal,
        <br />
        Depok, Sleman, Daerah Istimewa Yogyakarta
      </p>
    </div>
    <div>
      <h3 className="font-semibold text-accent-yellow">Kontak</h3>
      <p className="mt-2 text-sm text-gray-200">
        Email: teknikgeomatika@upnyk.ac.id
        <br />
        Program Studi Teknik Geomatika
      </p>
    </div>
  </div>
)

const Footer: React.FC<FooterProps> = ({ companyName, variant = 'default' }) => {
  if (variant === 'landing') {
    return (
      <footer className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="font-semibold">{companyName}</p>
          <div className="mt-4">
            <KontakLab />
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-sm text-gray-300">
          &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-gray-200 bg-gray-50 p-2 text-center">
      <p className="text-sm text-gray-600">
        &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
