import { api } from './api'

export interface JadwalItem {
  id: number
  plug: string
  hari: string
  jam_mulai: string | null
  jam_selesai: string | null
  is_active: boolean
  praktikum?: {
    id: number
    label: string
    semester: string
    slug: string
  }
}

export interface PraktikumItem {
  id: number
  label: string
  semester: string
  slug: string
  is_active: boolean
  plugs: Omit<JadwalItem, 'praktikum'>[]
}

export function getPublicPraktikum() {
  return api<{ data: PraktikumItem[] }>('/api/public/praktikum')
}

export function getPublicAgenda() {
  return api<{ data: JadwalItem[] }>('/api/public/agenda')
}

export interface AkademikMateri {
  materi_id: number
  materi_nama: string
  deskripsi: string
}

export interface AkademikPraktikum {
  id: number
  label: string
  slug: string
  semester: string
  dosen: string[]
  jadwal: {
    plug: string
    hari: string
    jam_mulai: string
    jam_selesai: string
  }[]
  materi: AkademikMateri[]
}

export function getPublicAkademik() {
  return api<{ data: AkademikPraktikum[] }>('/api/public/akademik')
}
