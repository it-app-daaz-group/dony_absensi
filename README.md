# Aplikasi Absensi (React + Node.js + MySQL)

Aplikasi absensi karyawan berbasis web dengan fitur manajemen karyawan, absensi, dan laporan.

## 🛠 Teknologi

- **Frontend**: React 18, TypeScript, Vite, Ant Design, Zustand, Axios
- **Backend**: Node.js v22, Express, TypeScript, Prisma ORM, JWT
- **Database**: MySQL 8.4 (via Laragon) / TiDB Cloud (Production)

## 🚀 Cara Menjalankan Aplikasi (Lokal)

### Prasyarat
1. Pastikan **Laragon** sudah berjalan (Start All).
2. Pastikan MySQL berjalan di port `3306`.
3. Node.js sudah terinstall.

### 1. Setup Backend (Server)

Buka terminal baru:

```bash
cd server
npm install
```

**Konfigurasi Database:**
- Edit `.env` jika password MySQL Anda bukan kosong.
- Sinkronisasi database:
```bash
npx prisma db push
```
- Seeding data awal (Admin User):
```bash
npm run prisma:seed
```

**Jalankan Server:**
```bash
npm run dev
```
Server akan berjalan di `http://localhost:5000`.

### 2. Setup Frontend (Client)

Buka terminal baru:

```bash
cd client
npm install
npm run dev
```
Akses aplikasi di `http://localhost:5173`.

## 🌐 Panduan Deployment ke Vercel

Aplikasi ini menggunakan struktur Monorepo (Frontend dan Backend dalam satu repository). Untuk deployment yang optimal di Vercel, kita perlu membuat **2 Project Vercel terpisah** yang terhubung ke repository GitHub yang sama.

### Persiapan Database (TiDB Cloud)
1. Buat akun di [TiDB Cloud](https://tidbcloud.com/).
2. Buat cluster baru (Serverless Tier gratis).
3. Dapatkan **Connection String** (Format: `mysql://USER:PASSWORD@HOST:4000/DB_NAME?sslaccept=strict`).
4. Jalankan migrasi schema ke TiDB dari lokal:
   ```bash
   # Di folder server/
   # Update .env dengan DATABASE_URL TiDB Anda sementara
   npx prisma db push
   node dist/prisma/seed.js # Atau jalankan seed jika perlu
   ```

---

### 1. Deployment Backend (API)

Project ini akan men-hosting Server Express.js sebagai Serverless Function.

1.  **Buat Project Baru di Vercel:**
    *   Klik **Add New Project**.
    *   Import repository GitHub `dony_absensi`.
    *   Beri nama project, misal: `dony-absensi-api`.

2.  **Konfigurasi Project (PENTING):**
    *   **Root Directory**: Klik Edit, ubah menjadi `server`.
    *   **Framework Preset**: Biarkan `Other`.
    *   **Build Command**: Biarkan default (atau `npm run build`).
    *   **Output Directory**: Biarkan default.

3.  **Environment Variables:**
    Tambahkan variable berikut di menu Environment Variables:
    *   `DATABASE_URL`: Connection string dari TiDB Cloud.
    *   `JWT_SECRET`: String acak untuk keamanan token.
    *   `JWT_REFRESH_SECRET`: String acak untuk refresh token.
    *   `CORS_ORIGIN`: URL Frontend Anda nanti (misal: `https://dony-absensi.vercel.app`).
        *   *Untuk deployment pertama, bisa diisi `*` (allow all) dulu, lalu update setelah frontend deploy.*

4.  **Deploy:** Klik **Deploy**.
    *   Setelah sukses, copy domain backend Anda (misal: `https://dony-absensi-api.vercel.app`).

---

### 2. Deployment Frontend (Client)

Project ini akan men-hosting aplikasi React (Vite).

1.  **Buat Project Baru di Vercel:**
    *   Klik **Add New Project**.
    *   Import repository GitHub `dony_absensi` (Repo yang SAMA).
    *   Beri nama project, misal: `dony-absensi`.

2.  **Konfigurasi Project:**
    *   **Root Directory**: Biarkan `.` (Root repository).
    *   **Framework Preset**: `Vite`.
    *   **Build Command**: `npm run build` (Script ini sudah diset untuk membuild folder `client`).
    *   **Output Directory**: `client/dist`.

3.  **Environment Variables:**
    Tambahkan variable berikut:
    *   `VITE_API_URL`: URL Backend yang sudah dideploy tadi (misal: `https://dony-absensi-api.vercel.app`).
        *   **PENTING:** Jangan akhiri dengan slash `/`.

4.  **Deploy:** Klik **Deploy**.

---

### 3. Langkah Terakhir (Menghubungkan Keduanya)

1.  Setelah Frontend berhasil dideploy dan mendapat URL (misal: `https://dony-absensi.vercel.app`).
2.  Kembali ke **Project Backend** di dashboard Vercel.
3.  Masuk ke **Settings > Environment Variables**.
4.  Edit `CORS_ORIGIN` menjadi URL Frontend tersebut (tanpa slash di akhir).
5.  Masuk ke tab **Deployments**, klik titik tiga pada deployment terakhir, pilih **Redeploy** agar perubahan Environment Variable aktif.

## 👤 Akun Default (Admin)

- **Email**: `admin@company.com`
- **NIK**: `ADMIN001`
- **Password**: `admin123`

## 🗂 Struktur Project

```
/
├── client/         # Source code Frontend (React)
├── server/         # Source code Backend (Express)
├── package.json    # Script root untuk deployment Frontend
├── vercel.json     # Konfigurasi rewrite Frontend
└── README.md       # Dokumentasi ini
```
