# Aplikasi Absensi (React + Node.js + MySQL)

Aplikasi absensi karyawan berbasis web dengan fitur manajemen karyawan, absensi, dan laporan.

## 🛠 Teknologi

- **Frontend**: React 18, TypeScript, Vite, Ant Design, Zustand, Axios
- **Backend**: Node.js v22, Express, TypeScript, Prisma ORM, JWT
- **Database**: MySQL 8.4 (via Laragon)

## 🚀 Cara Menjalankan Aplikasi

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

## 👤 Akun Default (Admin)

- **Email**: `admin@company.com`
- **NIK**: `ADMIN001`
- **Password**: `admin123`

## 📚 Fitur Utama

1.  **Authentication**: Login aman dengan JWT (Access & Refresh Token).
2.  **Master Karyawan**: CRUD data karyawan lengkap dengan jabatan dan departemen.
3.  **Absensi**: (Next Phase) Pencatatan kehadiran dengan lokasi dan foto.
4.  **Laporan**: (Next Phase) Rekapitulasi kehadiran.

## 🗂 Struktur Project

```
/
├── client/         # Source code Frontend (React)
│   ├── src/
│   │   ├── api/    # Konfigurasi Axios
│   │   ├── pages/  # Halaman aplikasi
│   │   └── store/  # State management (Zustand)
│
├── server/         # Source code Backend (Express)
│   ├── prisma/     # Schema Database
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   └── routes/
```

## 📝 Catatan Pengembangan
- Pastikan port 5000 (Server) dan 5173 (Client) tidak digunakan aplikasi lain.
- Untuk mengubah setting database, edit file `server/.env`.
