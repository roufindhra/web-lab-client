const PROFIL_ITEMS = [
  {
    judul: 'Praktikum',
    deskripsi:
      'Melayani seluruh kegiatan praktikum mata kuliah survei, mulai dari survei terestris, GNSS, hidrografi, kadaster, hingga survei rekayasa.',
  },
  {
    judul: 'Riset',
    deskripsi:
      'Fasilitas laboratorium terbuka untuk kegiatan riset mahasiswa dan dosen, termasuk pengolahan data hasil pengukuran lapangan.',
  },
  {
    judul: 'Peminjaman Alat',
    deskripsi:
      'Alat survei dapat dipinjam melalui sistem informasi laboratorium dengan persetujuan asisten lab dan koordinator praktikum.',
  },
]

export default function ProfilLab() {
  return (
    <section className="bg-teal-section text-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">Profil Laboratorium</h2>
        <p className="mt-4 max-w-3xl text-gray-100">
          Lab Survei Geodesi dan Geometri adalah laboratorium di bawah Program Studi
          Teknik Geomatika, Fakultas Teknologi Mineral, UPN "Veteran" Yogyakarta.
          Laboratorium ini berperan sebagai pusat kegiatan praktikum, riset, dan
          pelayanan di bidang survei dan pemetaan.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {PROFIL_ITEMS.map((item) => (
            <div key={item.judul} className="rounded-lg bg-white/10 p-6">
              <h3 className="text-lg font-semibold text-accent-yellow">{item.judul}</h3>
              <p className="mt-2 text-sm text-gray-100">{item.deskripsi}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
