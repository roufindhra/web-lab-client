import { api } from './api'

export interface SewaOption {
  nama_alat: string
  jumlah_unit: number
  jumlah_tersedia: number
  tarif_per_hari: number
}

export interface SewaOptionsResponse {
  data: SewaOption[]
}

export interface AjukanSewaPayload {
  nama: string
  no_hp: string
  institusi?: string
  email?: string
  tanggal_pinjam: string
  tanggal_kembali: string
  items: { nama_alat: string; jumlah: number }[]
}

export interface AjukanSewaResponse {
  data: { id: number; status: string }
  total_estimasi: number
}

export const sewaService = {
  async options(): Promise<SewaOptionsResponse> {
    return api<SewaOptionsResponse>('/api/public/sewa/options')
  },

  async ajukan(payload: AjukanSewaPayload): Promise<AjukanSewaResponse> {
    return api<AjukanSewaResponse>('/api/public/sewa', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}
