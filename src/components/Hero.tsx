import "@radix-ui/colors"

interface HeroProps {
  onLoginClick: () => void
}



export default function Hero({ onLoginClick }: HeroProps) {
  return (
    <section className="bg-surface-container text-black">
      <div className="mx-auto max-w-6xl px-4 py-24 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-accent-orange">
          Fakultas Teknologi Mineral — UPN "Veteran" Yogyakarta
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold sm:text-5xl">
          Lab Survei Geodesi dan Geometri
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray">
          Mendukung kegiatan praktikum survei, riset, dan pelayanan laboratorium
          bagi mahasiswa dan dosen Program Studi Teknik Geomatika.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={onLoginClick}
            className="rounded-md bg-accent-orange px-6 py-3 font-semibold text-white transition hover:brightness-110"
          >
            Login Mahasiswa / Asisten
          </button>
          <a
            href="#praktikum"
            className="rounded-md bg-primary px-6 py-3 font-semibold text-white transition hover:brightness-110"
          >
            Lihat Praktikum
          </a>
        </div>
      </div>
    </section>
  )
}
