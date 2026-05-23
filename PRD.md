# Product Requirement Document (PRD)

## Project Name: VocabForge

**Version:** 1.0

**Author:** Product Development Team

**Status:** Ready for Implementation

**Tech Stack Baselgine:** Astro JS, Tailwind CSS, LocalStorage (Zero-Server Architecture)

---

## 1. Executive Summary & Objective

### 1.1 Problem Statement

Belajar bahasa asing (khususnya bahasa Inggris) membutuhkan konsistensi tinggi dalam memperkaya kosakata (*vocabulary*). Banyak aplikasi *vocab tracker* atau kamus digital terasa hambar, terlalu kaku, dan membosankan, sehingga pengguna cepat kehilangan motivasi untuk mencatat dan menghafal kata-kata baru.

### 1.2 Product Vision

**VocabForge** adalah aplikasi web pencatat kosakata personal berbasis PWA (*Progressive Web App*) yang menggabungkan kecepatan performa **Astro JS** dengan pengalaman bermain game (**Gamifikasi**). Aplikasi ini dirancang dengan pendekatan *Mobile-First* yang bersih, interaktif dengan efek visual 3D yang minimalis (tidak terlalu ramai warna), serta menyimpan seluruh data secara instan dan aman di sisi klien melalui **LocalStorage** tanpa memerlukan registrasi akun.

---

## 2. User Personas & Target Audience

* **Persona:** Pelajar/Mahasiswa Indonesia yang sedang aktif meningkatkan kemampuan bahasa Inggris.
* **Kebutuhan Utama:** Aplikasi yang ringan, cepat dibuka di HP saat menemukan kata asing di jalan/buku, mudah digunakan tanpa perlu *login*, dan memberikan kepuasan instan (*instant gratification*) saat berhasil mencapai target hafalan tertentu.

---

## 3. Product Scope & Functional Requirements

### 3.1 Core Features (MVP Scope)

| ID | Fitur | Deskripsi | Prioritas |
| --- | --- | --- | --- |
| **FR-01** | **PWA Capabilities** | Aplikasi dapat di-instal di Android/iOS (*Add to Home Screen*) dan bekerja secara offline. | P0 |
| **FR-02** | **Vocab CRUD (Lokal)** | Pengguna dapat menambah, melihat, dan menghapus kata (Bahasa Indonesia $\leftrightarrow$ Inggris) secara lokal. | P0 |
| **FR-03** | **Sistem XP & Level** | Setiap menginput 1 kata baru, pengguna mendapat **+10 XP**. Setiap mencapai **100 XP**, level pengguna akan naik. | P0 |
| **FR-04** | **Milestone Badges** | Sistem otomatis membuka (*unlock*) lencana khusus saat total *vocab* mencapai angka 10, 25, 50, dan 100 kata. | P0 |
| **FR-05** | **Celebration Modal** | Efek pop-up interaktif saat pengguna naik level atau berhasil membuka kunci badge baru. | P1 |

### 3.2 Non-Functional Requirements

* **Performance:** Skor *Lighthouse Performance* $\ge$ 95 (dioptimalkan oleh Astro JS).
* **Storage Limit:** Menggunakan kapasitas standar LocalStorage ($\approx 5\text{MB}$, sangat lebih dari cukup untuk ribuan baris teks kosakata).
* **Security:** Data bersifat privat karena sepenuhnya tersimpan di perangkat fisik pengguna sendiri.

---

## 4. UI/UX Design Specifications (Mobile-First)

### 4.1 Design System & Aesthetic Archetype

* **Layout Style:** *Mobile-First Frame*. Di perangkat mobile tampil *full-screen*. Di desktop tampil dalam bentuk *smartphone frame* proporsional di tengah layar.
* **Theme Concept:** **Clean Matte 3D / Neo-Brutalism Minimalist**. Tombol dan komponen memiliki efek bayangan jatuh (*flat block shadow*) tebal yang akan amblas ke bawah saat di-tap, meniru interaksi fisik Duolingo.
* **Warna (Restricted Palette):**
* *Background Utama:* Off-White / Light Grey (#F3F4F6 atau #F0F2F5)
* *Aksen Utama (Struktur):* Deep Navy Blue (#1E3A8A)
* *Aksen Sukses/Progress:* Mint / Emerald Green (#34D399)
* *Warna Teks:* Dark Charcoal (#1F2937)



### 4.2 Wireframe Screen Flow

1. **Home / Dashboard Screen:**
* *Top Section:* Progress bar level saat ini (XP berjalan / XP target).
* *Stats Section:* Grid 3D berisi total kata dan jumlah *badge* yang terkumpul.
* *Action Section:* Tombol besar mencolok bertuliskan "TAMBAH KOSAKATA".
* *List Section:* Daftar *scrollable* kosakata terbaru yang diurutkan secara kronologis terbalik (paling baru di atas).


2. **Add Vocab Modal/Screen:**
* Input field tebal untuk kata asal (Bahasa Indonesia).
* Input field tebal untuk hasil terjemahan (Bahasa Inggris).
* Tombol simpan bertipe 3D *Tactile Button*.


3. **Badge Room Screen:**
* Grid menu menampilkan daftar seluruh *badge*.
* *Badge* yang belum diraih akan tampil dalam mode *grayscale* (abu-abu matte) dengan ikon gembok kecil.
* *Badge* yang sudah dibuka akan menyala dengan aset 3D berwarna.



---

## 5. Gamification Logic & Data Schema

### 5.1 LocalStorage Data Structure

Aplikasi akan menyimpan dua kunci utama di dalam localStorage:

1. vocab_forge_data: Larik objek berisi daftar kata yang disimpan.
2. vocab_forge_profile: Objek status gamifikasi pengguna.

```json
// Key: vocab_forge_profile
{
  "current_xp": 140,
  "level": 2,
  "unlocked_badges": ["badge_01"]
}

// Key: vocab_forge_data
[
  {
    "id": "1716383742000",
    "word_id": "Buku",
    "word_en": "Book",
    "created_at": "2026-05-22T14:35:42Z"
  }
]

```

### 5.2 Milestone Matrix & Badges Blueprint

| Badge ID | Nama Badge | Syarat Unlock | Deskripsi Filosofi |
| --- | --- | --- | --- |
| badge_01 | **Novice Smith** | 10 Kata Pertama | Menandakan pengguna mulai menempa fondasi bahasanya. |
| badge_02 | **Word Weaver** | 25 Kata | Pengguna mulai bisa merajut kata-kata dasar. |
| badge_03 | **Fluent Voyager** | 50 Kata | Pengguna siap berlayar lebih jauh ke percakapan kasual. |
| badge_04 | **Vocab Titan** | 100 Kata | Pengguna memiliki kekuatan memori kosakata yang besar. |

---

## 6. AI Asset Generation Kit (Prompt Generator)

Gunakan perintah (*prompts*) di bawah ini pada mesin generator gambar kecerdasan buatan (seperti Midjourney atau DALL-E 3) untuk mendapatkan aset visual yang presisi, seragam, dan bertekstur 3D minimalis.

> ### 🎨 Global Master Style Guide (Tambahkan di setiap akhir prompt)
> 
> 
> ...isometric 3D icon, claymorphic style, matte finish, minimal shading, clean solid pure white background, corporate memphis meets duolingo aesthetic, no text, no shiny gloss, raytracing depth, --ar 1:1

### Prompt Spesifik untuk Setiap Aset:

* **Palu Besi (10 Kata - Novice Smith)**
> A minimalist 3D claymorphic icon of a small blacksmith hammer, matte dark navy handle and light grey iron head, soft shadows, isometric view, isolated on a solid pure white background --ar 1:1


* **Buku Terbuka (25 Kata - Word Weaver)**
> A minimalist 3D claymorphic icon of a thick open book with rounded pages, clean white and soft grey pages, deep navy blue outer cover, matte finish, soft studio lighting, isolated on a solid pure white background --ar 1:1


* **Kompas Navigasi (50 Kata - Fluent Voyager)**
> A minimalist 3D matte plastic icon of a round navigation compass, simple geometric design, monochrome soft grey body with a single sharp deep navy blue pointer needle, isometric view, isolated on a solid pure white background --ar 1:1


* **Mahkota Silinder (100 Kata - Vocab Titan)**
> A minimalist 3D claymorphic crown, chunky and thick geometric design, matte soft white body with a subtle silver band, zero gold, soft ambient occlusion shadows, game reward badge style, isolated on a solid pure white background --ar 1:1



---

## 7. Development Roadmap & Key Milestones

* **Milestone 1 (UI & Layout):** Setup proyek Astro JS, integrasi Tailwind CSS, pembuatan kerangka tata letak *Mobile-First*, dan penataan komponen tombol 3D.
* **Milestone 2 (Core Logic):** Implementasi fungsi JavaScript untuk membaca, menambah, dan menghapus data pada localStorage.
* **Milestone 3 (Gamification Engine):** Pembuatan logika penghitung XP, kalkulasi kenaikan level secara dinamis, dan fungsi pengecekan otomatis untuk membuka kunci *badge*.
* **Milestone 4 (PWA Setup & Polish):** Konfigurasi manifest.json dan *Service Worker* agar aplikasi siap di-instal, diakhiri dengan pengujian responsivitas pada perangkat seluler.

---

PRD ini dirancang sebagai panduan mutlak pengembangan agar pengerjaan aplikasi tetap fokus pada fungsionalitas utama (*core loops*) tanpa mengalami pembengkakan fitur (*scope creep*).