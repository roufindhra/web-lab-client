import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { useAuth } from '@/contexts/AuthContext'
import { authService, ApiError } from '@/services'

export default function Akun() {
  const { user } = useAuth()

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-bold text-surface-text">Pengaturan Akun</h1>
        <p className="text-xs text-gray-500">
          Kelola informasi dan keamanan akun kamu.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Akun</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <InfoItem label="Nama" value={user?.nama} />
          <InfoItem label="NIM" value={user?.nim?.toString()} />
          <InfoItem label="Surel" value={user?.surel ?? '-'} />
        </CardContent>
      </Card>

      <UbahPasswordCard />
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="text-sm text-surface-text">{value ?? '-'}</p>
    </div>
  )
}

function UbahPasswordCard() {
  const [password, setPassword] = useState('')
  const [passwordBaru, setPasswordBaru] = useState('')
  const [konfirmasi, setKonfirmasi] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSaving) return

    if (passwordBaru.length < 8) {
      setError('Password baru minimal 8 karakter.')
      return
    }
    if (passwordBaru !== konfirmasi) {
      setError('Konfirmasi password baru tidak cocok.')
      return
    }

    setIsSaving(true)
    setError(null)
    setSuccess(false)

    authService
      .changePassword({
        password,
        password_baru: passwordBaru,
        password_baru_confirmation: konfirmasi,
      })
      .then(() => {
        setSuccess(true)
        setPassword('')
        setPasswordBaru('')
        setKonfirmasi('')
      })
      .catch((err) => {
        setError(
          err instanceof ApiError ? err.message : 'Gagal mengubah password.',
        )
      })
      .finally(() => setIsSaving(false))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ubah Password</CardTitle>
        <CardDescription>Password baru minimal 8 karakter.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:max-w-sm">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-surface-text">
                Password Saat Ini
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-surface-text">
                Password Baru
              </label>
              <Input
                type="password"
                value={passwordBaru}
                onChange={(e) => setPasswordBaru(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-surface-text">
                Konfirmasi Password Baru
              </label>
              <Input
                type="password"
                value={konfirmasi}
                onChange={(e) => setKonfirmasi(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}
          {success && (
            <p className="text-xs font-semibold text-emerald-700">
              Password berhasil diubah.
            </p>
          )}

          <div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Menyimpan...' : 'Simpan Password Baru'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
