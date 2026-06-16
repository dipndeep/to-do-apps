# ⚡ DipInToDo - Neobrutalist Productivity App ⚡

**DipInToDo** adalah aplikasi Sistem Manajemen Tugas (To-Do App) yang dibangun menggunakan React.js dan Tailwind CSS v4 dengan konsep estetika **Neobrutalism** yang berani, dinamis, dan modern. 

Aplikasi ini menyajikan antarmuka visual premium dengan garis tepi tebal (thick borders), bayangan jatuh yang kaku (offset hard shadows), sudut tajam, micro-animations mekanis, dan halaman login bergaya kertas cetak biru (*blueprint*) yang dimiringkan.

---

## 🚀 Fitur Utama

Aplikasi ini dilengkapi dengan 6 area kerja utama yang dapat diakses melalui sidebar navigasi yang responsif dan dapat diminimalkan:

1. **📋 Daftar Tugas (Task Manager):**
   * Tambah, perbarui, dan hapus tugas secara instan.
   * Filter tugas berdasarkan status (Semua, Selesai, Belum Selesai) dan tingkat prioritas (Tinggi, Sedang, Rendah).
   * Urutkan tugas berdasarkan tenggat waktu (jatuh tempo terdekat/terjauh) atau tanggal pembuatan.
   * Pencarian judul dan deskripsi tugas secara *real-time*.

2. **🏷️ Kategori & Label:**
   * Kelola kategori kustom Anda sendiri.
   * Pilih warna aksen Neobrutalist untuk membedakan kategori tugas Anda.
   * Hapus kategori dengan pembaruan otomatis pada tugas yang terasosiasi.

3. **📊 Statistik (Productivity Insights):**
   * Widget analitik penyelesaian tugas harian.
   * Diagram batang flat murni berbasis CSS untuk visualisasi sebaran prioritas dan kategori tugas.
   * Kartu nasihat produktivitas pintar berdasarkan data kinerja tugas Anda.

4. **⏱️ Fokus Pomodoro:**
   * Jam hitung mundur interaktif (25 Menit Sesi Fokus / 5 Menit Sesi Istirahat).
   * Fitur hubungkan timer dengan tugas aktif untuk meningkatkan fokus kerja.
   * Notifikasi toast saat sesi selesai.

5. **🗂️ Arsip Tugas:**
   * Riwayat pencapaian tugas yang telah diselesaikan.
   * Kembalikan tugas yang tidak sengaja selesai ke daftar aktif, atau hapus permanen dari sistem.

6. **⚙️ Pengaturan & Tema:**
   * Kelola detail profil akun pengguna (Nama, Email, dan Password).
   * Switcher instan antara **☀️ Mode Terang (Light Mode)** dan **🌙 Mode Gelap (Dark Mode)** yang secara otomatis meredireksi seluruh skema warna antarmuka.

---

## 🛠️ Tech Stack

Aplikasi ini berjalan sepenuhnya secara *frontend-only* dengan simulasi penyimpanan data dinamis:
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS v4 & Vanilla CSS (Outfit Font)
* **Icons:** Lucide React
* **Penyimpanan Data:** Database lokal virtual berbasis `localStorage` untuk menjaga otentikasi sesi pengguna, profil, kategori, dan tugas agar tidak hilang saat memuat ulang halaman.

---

## ⚡ Cara Menjalankan Aplikasi Secara Lokal

### Prasyarat
Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) di komputer Anda.

### Langkah-langkah
1. **Clone repositori dan masuk ke direktori proyek:**
   ```bash
   git clone https://github.com/dipndeep/to-do-apps.git
   cd to-do-apps
   ```

2. **Instal seluruh dependensi proyek:**
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan lokal:**
   ```bash
   npm run dev
   ```

4. **Buka aplikasi di browser:**
   Akses alamat lokal yang tertera di terminal (biasanya `http://localhost:5173/` atau `http://localhost:5174/`).

---

## 🎨 Panduan Kontribusi Estetika Neobrutalism
Jika Anda ingin menambahkan elemen UI baru, pastikan mengikuti panduan gaya berikut:
* **Border:** Gunakan border tebal hitam (`border-3 border-ink-black-900`).
* **Shadow:** Gunakan bayangan jatuh keras kaku tanpa blur (`shadow-[4px_4px_0px_0px_#011c32]`).
* **Active State:** Tombol harus memberikan feedback mekanis saat diklik (`active:translate-x-[4px] active:translate-y-[4px] active:shadow-none`).
* **Warna:** Gunakan warna aksen dengan saturasi tinggi dan kontras tinggi.
