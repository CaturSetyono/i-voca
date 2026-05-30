# REPORT — Inventaris Fitur & Rekomendasi untuk I-VOC

Tanggal: 2026-06-03

Ringkasan singkat

- Proyek ini adalah aplikasi web statis/SSG dengan dukungan PWA, halaman untuk menampilkan badge, dan komponen UI modular.

Fitur yang sudah diimplementasikan

- PWA (service worker & Workbox): file hasil build di `dev-dist/` termasuk `sw.js` dan `workbox-2fbc6a65.js` — memungkinkan caching dan instalasi sebagai aplikasi.
- Komponen instalasi PWA: `src/components/InstallPrompt.astro` — memfasilitasi prompt pemasangan pada perangkat yang mendukung.
- Modal perayaan: `src/components/CelebrationModal.astro` — komponen presentasi untuk momen pencapaian.
- Halaman utama: [src/pages/index.astro](src/pages/index.astro) — entry point aplikasi.
- Halaman penambahan data: [src/pages/add.astro](src/pages/add.astro) — UI untuk menambah konten/entri.
- Halaman badge: [src/pages/badges.astro](src/pages/badges.astro) — menampilkan koleksi badge yang ada di `public/assets/badges/`.
- Layout terpusat: [src/layouts/Layout.astro](src/layouts/Layout.astro) — struktur halaman bersama.
- Utility penyimpanan: `src/utils/storage.js` — abstraksi penyimpanan (kemungkinan `localStorage`).
- Tipe deklarasi PWA: `src/pwa.d.ts` — definisi TypeScript untuk API PWA.
- Styling global: [src/styles/global.css](src/styles/global.css).
- Konfigurasi & infra ringan: `astro.config.mjs`, `Dockerfile`, `nginx.conf`, `vercel.json`, serta skrip start (`start.mjs`).

Catatan teknis singkat

- Aset statis berada di `public/assets/` (termasuk badge images).
- Struktur proyek mengikuti pola Astro + static build; PWA sudah di-bundle ke `dev-dist/`.

Rekomendasi fitur dan peningkatan (prioritas tertinggi → rendah)

1. Offline data sync & cache strategy: implementasikan strategi sinkronisasi (background sync / IndexedDB) untuk memastikan data user tersimpan dan disinkronkan saat online.
2. CRUD untuk badges: tambahkan UI/backend ringan untuk membuat, mengedit, dan menghapus badge (upload gambar, metadata).
3. User profiles / Auth (opsional): dukungan akun pengguna (email OAuth/SSO) untuk menyimpan progres dan preferensi.
4. Analytics & Error Reporting: integrasi analytics (mis. Plausible/Google Analytics) dan Sentry/LogRocket untuk memantau runtime errors.
5. Onboarding & UX: tutorial langkah demi langkah, feed membantu pengguna memahami fitur utama (install prompt, penambahan badge).
6. Accessibility (A11y): audit dan perbaikan ARIA, kontras warna, dan navigasi keyboard.
7. Testing: tambah unit tests untuk utilitas dan komponen, serta E2E smoke tests (Playwright atau Cypress).
8. CI/CD: pipeline build → test → deploy (GitHub Actions) dengan linting dan checks.
9. Performance & Asset Optimization: optimalkan gambar badges (webp), gunakan responsive images, dan atur caching headers di `nginx.conf` / platform hosting.
10. Internationalization (i18n): sokong multi-bahasa bila target pengguna beragam.

Aksi cepat yang bisa dikerjakan (quick wins)

- Tambahkan meta manifest & properia 'theme-color' bila belum lengkap (perbaiki experience PWA).
- Implementasikan basic offline fallback page untuk request yang gagal.
- Tambah form validasi di [src/pages/add.astro](src/pages/add.astro) dan simpan sementara ke `src/utils/storage.js` sebelum sinkronisasi.
- Dokumentasikan struktur folder dan scripts di `README.md` untuk onboarding contributor.

Prioritas & estimasi singkat

- Prioritas 1 (1–2 minggu): CRUD badges minimal, offline cache improvements, manifest + install prompt polishing.
- Prioritas 2 (2–4 minggu): Auth dasar, analytics, CI pipeline, accessibility fixes.
- Prioritas 3 (4+ minggu): Full sync engine, multi-language, advanced performance tuning.

Next steps

- Konfirmasi prioritas fitur mana yang ingin dikerjakan terlebih dahulu.
- Jika setuju, saya bisa mulai dengan implementasi CRUD badges atau menambahkan caching/offline sync (pilih salah satu untuk sprint awal).

Kontak teknis / referensi file

- Halaman utama: [src/pages/index.astro](src/pages/index.astro)
- Halaman add: [src/pages/add.astro](src/pages/add.astro)
- Halaman badges: [src/pages/badges.astro](src/pages/badges.astro)
- Komponen: [src/components/InstallPrompt.astro](src/components/InstallPrompt.astro) — [src/components/CelebrationModal.astro](src/components/CelebrationModal.astro)
- Util: [src/utils/storage.js](src/utils/storage.js)
