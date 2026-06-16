# Product Requirement Document (PRD)

## Projek: Sistem Manajemen Tugas (To-Do App)

---

## 1. Ringkasan Projek (Project Overview)

Aplikasi Sistem Manajemen Tugas (To-Do App) adalah sebuah platform web responsif yang dirancang untuk membantu pengguna mengatur, melacak, dan mengelola tugas harian mereka secara efisien. Projek ini difokuskan sebagai sarana pembelajaran untuk menguasai arsitektur full-stack, manajemen database relasional, autentikasi aman, dan pembuatan antarmuka pengguna (UI) modern berkarakter kuat menggunakan tren desain Neobrutalism.

## 2. Tujuan Pembelajaran & Utama (Objectives)

- **Implementasi CRUD Lengkap:** Mampu membuat, membaca, memperbarui, dan menghapus data tugas.
- **Sistem Autentikasi Aman:** Mengimplementasikan registrasi pengguna dan login menggunakan enkripsi password dan session/token.
- **Relasi Data (User-to-Tasks):** Memastikan setiap tugas terikat pada pengguna yang spesifik (One-to-Many Relationship).
- **Manajemen Status & UI Interaktif:** Menyediakan fitur filter dan dashboard visual ringkas untuk metrik produktivitas pengguna menggunakan komponen Neobrutalism berestetika tinggi.

---

## 3. Spesifikasi Teknologi (Tech Stack)

### Frontend

- **Framework:** React.js (menggunakan Vite sebagai build tool yang cepat).
- **Styling:** Tailwind CSS (utility-first CSS framework untuk implementasi utilitas custom border dan shadow Neobrutalism).
- **Komponen UI:** shadcn/ui (dikustomisasi dengan mengubah radius border menjadi tajam/minimal, memberikan border solid tebal, dan bayangan mentah tanpa blur).
- **State Management & Fetching:** Axios / TanStack Query (React Query) untuk manajemen sinkronisasi data dengan API.

### Backend

- **Framework:** **Express.js** (Framework minimalis dan paling populer untuk Node.js untuk membuat RESTful API).
- **Database:** **PostgreSQL** (Database relasional yang sangat cocok untuk mengimplementasikan relasi terstruktur antara _User_ dan _Tasks_).
- **ORM (Object-Relational Mapping):** **Prisma ORM** (Mempermudah query database, migrasi skema, dan menyediakan tipe data yang aman/type-safe).
- **Authentication:** **JSON Web Tokens (JWT)** & **bcrypt** (Bcrypt untuk hashing password di database, JWT untuk mengamankan endpoint API melalui token).
- **Validasi Data:** **Zod** (Untuk memvalidasi skema request dari frontend agar selaras dengan validasi shadcn/ui di frontend).

---

## 4. Panduan Desain Neobrutalism & Palet Warna (UI/UX Style Guide)

Gaya tampilan antarmuka (terutama pada Desktop) mengadopsi aliran **Neobrutalism** dengan karakteristik: border hitam/gelap yang tebal solid (`border-[3px]`), hard drop shadow tanpa blur (`shadow-[4px_4px_0px_0px_...]`), warna saturasi tinggi, kontras ekstrem, dan tipografi tegas.

### Deklarasi Variabel Warna (CSS Custom Properties)

```css
:root {
  /* Ink Black - Digunakan untuk Teks Utama, Border Tebal, dan Elemen Gelap */
  --color-ink-black-50: #e6f3fe;
  --color-ink-black-100: #cde8fe;
  --color-ink-black-200: #9cd1fc;
  --color-ink-black-300: #6abafb;
  --color-ink-black-400: #38a3fa;
  --color-ink-black-500: #068cf9;
  --color-ink-black-600: #0570c7;
  --color-ink-black-700: #045495;
  --color-ink-black-800: #033863;
  --color-ink-black-900: #011c32;
  --color-ink-black-950: #011423;

  /* Porcelain - Aksen Hijau Vibrant untuk Status Sukses / Selesai */
  --color-porcelain-50: #eeffe5;
  --color-porcelain-100: #ddffcc;
  --color-porcelain-200: #bbff99;
  --color-porcelain-300: #99ff66;
  --color-porcelain-400: #77ff33;
  --color-porcelain-500: #55ff00;
  --color-porcelain-600: #44cc00;
  --color-porcelain-700: #339900;
  --color-porcelain-800: #226600;
  --color-porcelain-900: #113300;
  --color-porcelain-950: #0c2400;

  /* Light Sea Green - Warna Sekunder untuk Dashboard & Filter Area */
  --color-light-sea-green-50: #eafaf9;
  --color-light-sea-green-100: #d6f5f2;
  --color-light-sea-green-200: #acece5;
  --color-light-sea-green-300: #83e2d8;
  --color-light-sea-green-400: #5ad8cc;
  --color-light-sea-green-500: #30cfbf;
  --color-light-sea-green-600: #27a599;
  --color-light-sea-green-700: #1d7c72;
  --color-light-sea-green-800: #13534c;
  --color-light-sea-green-900: #0a2926;
  --color-light-sea-green-950: #071d1b;

  /* Punch Red - Indikator Destruktif, Hapus Tugas, Status Belum Selesai / Overdue */
  --color-punch-red-50: #fde8ea;
  --color-punch-red-100: #fad1d6;
  --color-punch-red-200: #f5a3ac;
  --color-punch-red-300: #f07583;
  --color-punch-red-400: #ec465a;
  --color-punch-red-500: #e71830;
  --color-punch-red-600: #b91327;
  --color-punch-red-700: #8a0f1d;
  --color-punch-red-800: #5c0a13;
  --color-punch-red-900: #2e050a;
  --color-punch-red-950: #200307;

  /* Amber Glow - Indikator Peringatan & Badge Prioritas Tugas */
  --color-amber-glow-50: #fff4e5;
  --color-amber-glow-100: #ffeacc;
  --color-amber-glow-200: #ffd599;
  --color-amber-glow-300: #ffbf66;
  --color-amber-glow-400: #ffaa33;
  --color-amber-glow-500: #ff9500;
  --color-amber-glow-600: #cc7700;
  --color-amber-glow-700: #995900;
  --color-amber-glow-800: #663c00;
  --color-amber-glow-900: #331e00;
  --color-amber-glow-950: #241500;
}
```

### Aturan Utility Class Neobrutalism (Tailwind Spec)

- **Borders:** Setiap komponen kartu, tombol, dialog, dan input menggunakan kelas `border-[3px] border-[#011c32]` (Ink Black 900).
- **Hard Shadows:** Menggunakan drop shadow solid tanpa efek blur, contoh kelas Tailwind: `shadow-[4px_4px_0px_0px_#011c32]`. Ketika tombol ditekan (`active:`), bayangan bergeser menjadi `shadow-[0px_0px_0px_0px_#011c32] translate-x-[4px] translate-y-[4px]` untuk efek mekanis Neobrutalism yang nyata.
- **Border Radius:** Nilai border radius diatur kaku (tajam) menggunakan `rounded-none` atau maksimal `rounded-md` untuk menjaga konsistensi gaya mentah.

---

## 5. Kebutuhan Fungsional (Functional Requirements)

### Fitur Pengguna & Autentikasi

- **Registrasi Akun:** Pengguna dapat mendaftar dengan email, nama, dan kata sandi. Form dikemas dalam card Neobrutalism berlatar belakang `--color-ink-black-50`.
- **Login Akun:** Pengguna dapat masuk ke sistem untuk mengakses dashboard pribadi.
- **Autentikasi Endpoint:** Pengguna hanya dapat melihat, menambah, mengubah, atau menghapus tugas milik mereka sendiri.

### Manajemen Tugas (CRUD & Fitur Utama)

- **Tambah Tugas (Create):** Pengguna membuat tugas baru via modal dialog Neobrutalism. Input mencakup judul, deskripsi, tanggal jatuh tempo (due date), tingkat prioritas, dan status awal.
- **Tampilkan Tugas (Read):** Menampilkan daftar tugas dalam grid berbentuk card dengan border tebal solid.
- **Edit Tugas (Update):** Pengguna dapat memodifikasi detail tugas yang sudah ada.
- **Status Selesai/Belum (Toggle Status):** Mengubah status secara instan. Jika selesai, card akan berganti latar menjadi warna hijau `--color-porcelain-100`.
- **Hapus Tugas (Delete):** Tombol hapus menggunakan latar warna merah `--color-punch-red-400` dengan efek shadow Neobrutalism.

### Filtrasi & Dashboard Sederhana

- **Filter Status:** Menyaring tugas menggunakan elemen navigasi tab Neobrutalism (_Semua, Selesai, Belum Selesai_).
- **Prioritas Tugas:** Pembagian tingkat urgensi tugas menggunakan penanda warna:
  - _Tinggi (High):_ Menggunakan aksen `--color-punch-red-400`.
  - _Sedang (Medium):_ Menggunakan aksen `--color-amber-glow-400`.
  - _Rendah (Low):_ Menggunakan aksen `--color-light-sea-green-400`.
- **Dashboard Statistik:** Menampilkan total tugas, jumlah selesai, dan sisa tugas dalam bentuk deretan blok Card Neobrutalism dengan warna latar kontras tinggi berurutan memanfaatkan shade 100/200 dari palet warna di atas.

---

## 6. Arsitektur Data & Skema Database (Prisma Schema Model)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String   // Hashed password
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  status      Status   @default(BELUM_SELESAI)
  priority    Priority @default(SEDANG)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  dueDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Status {
  SELESAI
  BELUM_SELESAI
}

enum Priority {
  TINGGI
  SEDANG
  RENDAH
}
```

---

## 7. Rancangan Antarmuka Pengguna (UI Wireframe Desktop Spec)

Komponen dari **shadcn/ui** dimodifikasi dengan utilitas kustom Neobrutalism:

1.  **Sidebar Navigasi:** Menggunakan latar belakang utama `--color-ink-black-900` dengan teks kontras tinggi putih/`--color-ink-black-50`.
2.  **Dashboard Stats Row:** Deretan 3 komponen `Card` Neobrutalism:
    - Card 1 (Total Tugas): Latar `--color-light-sea-green-100`, border hitam tebal, bayangan hitam tajam.
    - Card 2 (Selesai): Latar `--color-porcelain-100`.
    - Card 3 (Belum Selesai): Latar `--color-punch-red-100`.
3.  **Action Bar & Filters:** Komponen `Select` dan `Button` dari shadcn dengan modifikasi `rounded-none border-[3px] border-[#011c32] shadow-[4px_4px_0px_0px_#011c32]`.
4.  **Task Grid/List Area:** Setiap baris atau grid item dibungkus oleh boks ber-border solid. Badge prioritas di dalam list menggunakan warna solid ber-saturasi tinggi (`--color-amber-glow-300`, dsb) berisikan teks tebal (_bold_).

---

## 8. Desain API Endpoints (REST API)

| Method   | Endpoint               | Deskripsi                                                              | Proteksi      |
| :------- | :--------------------- | :--------------------------------------------------------------------- | :------------ |
| `POST`   | `/api/auth/register`   | Mendaftarkan pengguna baru                                             | Publik        |
| `POST`   | `/api/auth/login`      | Autentikasi pengguna & mengembalikan JWT                               | Publik        |
| `GET`    | `/api/tasks`           | Mengambil seluruh data tugas milik user aktif (mendukung query filter) | Private (JWT) |
| `POST`   | `/api/tasks`           | Membuat tugas baru                                                     | Private (JWT) |
| `PUT`    | `/api/tasks/:id`       | Memperbarui detail tugas / status berdasarkan ID                       | Private (JWT) |
| `DELETE` | `/api/tasks/:id`       | Menghapus data tugas berdasarkan ID                                    | Private (JWT) |
| `GET`    | `/api/dashboard/stats` | Mengambil data agregat untuk komponen statistik                        | Private (JWT) |

---

## 9. Kebutuhan Non-Fungsional (Non-Functional Requirements)

- **Responsivitas Desktop-First:** Optimasi khusus pada layout desktop untuk menangani interaksi hover dan click pada bayangan mekanis Neobrutalism.
- **Keamanan Data:** Enkripsi password dengan `bcrypt` dan pengamanan token JWT.
- **Validasi & Error Handling:** Setiap form input divalidasi silang menggunakan kombinasi React Hook Form + Zod di frontend dan backend, menampilkan status error dengan pop-up `Toast` shadcn yang dimodifikasi menggunakan warna `--color-punch-red-50` dan border Neobrutalism tebal.
