# 🛠️ VocabForge

**VocabForge** adalah aplikasi web pencatat kosakata personal berbasis PWA (*Progressive Web App*) yang menggabungkan kecepatan performa **Astro JS** dengan pengalaman bermain game (**Gamifikasi**). Aplikasi ini dirancang untuk membantu pengguna memperkaya kosakata bahasa asing dengan cara yang interaktif, taktil, dan menyenangkan.

---

## ✨ Fitur Utama

- **🚀 App-First Experience**: Tidak ada landing page yang membosankan. Pengguna langsung masuk ke dashboard aplikasi untuk mulai belajar.
- **🎮 Sistem Gamifikasi**:
  - **XP & Level**: Dapatkan +10 XP untuk setiap kata baru yang ditempa.
  - **Lencana (Badges)**: Buka koleksi lencana unik (Novice Smith, Word Weaver, dll.) berdasarkan jumlah kosakata.
  - **Celebration Modal**: Animasi perayaan instan saat naik level atau membuka badge baru.
- **📱 PWA & Mobile Optimized**:
  - **Installable**: Dapat di-instal di Android, iOS, dan Desktop sebagai aplikasi native.
  - **Smart Detection**: Deteksi perangkat otomatis dengan instruksi instalasi khusus untuk iOS (Safari) dan Android (Chrome).
  - **Offline Ready**: Tetap bisa diakses tanpa koneksi internet setelah load pertama.
- **💎 Design Claymorphic**: Antarmuka 3D minimalis yang taktil dan nyata (Neo-Brutalism Minimalist).
- **🔒 Zero-Server Architecture**: Seluruh data disimpan secara aman dan instan di `localStorage` perangkat Anda. Data Anda adalah milik Anda sepenuhnya.
- **🔍 Fast Search**: Cari kosakata yang sudah ditempa dengan fitur filter instan.
- **⚡ SPA Feel**: Navigasi antar halaman super mulus tanpa reload menggunakan Astro View Transitions.

---

## 🛠️ Tech Stack

- **Framework**: [Astro JS](https://astro.build/) (v5+)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4+)
- **PWA**: [@vite-pwa/astro](https://vite-pwa-org.netlify.app/frameworks/astro.html)
- **Icons**: Lucide Icons
- **Storage**: LocalStorage API

---

## 🚀 Cara Setup Lokal

Pastikan Anda sudah menginstal **Node.js** (versi 22 atau lebih baru).

1. **Clone Repositori**:
   ```bash
   git clone <url-repository>
   cd I-VOC
   ```

2. **Instal Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Mode Pengembangan**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:4321`.

4. **Build untuk Produksi**:
   ```bash
   npm run build
   ```
   Hasil build akan berada di folder `dist/`.

5. **Preview Build**:
   ```bash
   npm run preview
   ```

---

## 📱 Cara Instal di Mobile

### **Android (Chrome)**
1. Buka URL aplikasi di Chrome.
2. Tunggu popup **"Instal Sekarang"** muncul di bawah layar, atau:
3. Tap ikon titik tiga (menu) di pojok kanan atas.
4. Pilih **"Instal Aplikasi"** atau **"Tambahkan ke Layar Utama"**.

### **iOS (Safari)**
1. Buka URL aplikasi di Safari.
2. Tap ikon **Share** (kotak dengan panah ke atas) di bagian bawah.
3. Scroll ke bawah dan pilih **"Add to Home Screen"** (Tambah ke Layar Utama).
4. Tap **"Add"** di pojok kanan atas.

---

## 📂 Struktur Proyek

```text
├── src/
│   ├── components/       # Komponen UI (Modal, InstallPrompt, dll)
│   ├── layouts/          # Template layout utama (Mobile Frame)
│   ├── pages/            # Halaman aplikasi (Dashboard, Add, Badges)
│   ├── styles/           # Konfigurasi CSS global & Tema
│   └── utils/            # Logika storage dan gamifikasi
├── public/               # Aset statis (Favicon, Badges SVG)
├── astro.config.mjs      # Konfigurasi PWA & Astro
└── PRD.md                # Dokumen kebutuhan produk awal
```

---

## ⚙️ Konfigurasi Penting

- **PWA Manifest**: Diatur di `astro.config.mjs` untuk mengatur warna tema (`#10B981`), ikon, dan `start_url`.
- **View Transitions**: Diaktifkan di `src/layouts/Layout.astro` menggunakan `<ClientRouter />`.
- **Storage Events**: Menggunakan CustomEvent `vocab-forge-change` di `src/utils/storage.js` untuk sinkronisasi state global.

---

Dibangun dengan ❤️ untuk para penempa kata. Selamat belajar! 🔨🔥