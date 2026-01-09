<<<<<<< HEAD
# 🛠️ motochatz-ai - Setup & Development Guide

Dokumentasi ini adalah panduan tunggal untuk menjalankan seluruh ekosistem **motochatz-ai** menggunakan Docker. Setiap anggota tim **WAJIB** mengikuti alur ini agar tidak ada lagi alasan "di laptop saya jalan, di laptop kamu enggak."

---

## 📂 Struktur Project
Pastikan struktur folder kamu terlihat seperti ini sebelum menjalankan Docker:

```
/motochatz-ai
├── docker-compose.yml
├── .env                  <-- Buat manual (LIHAT BAGIAN ENV)
├── /frontend
│   └── Dockerfile.dev
├── /backend
│   └── Dockerfile.dev
└── /ai-engine
    └── Dockerfile.dev
```

---

## 🚀 Langkah Persiapan (First-Time Setup)

1. Inisialisasi Folder & File
   - Jika folder masih kosong, lakukan inisialisasi dasar agar Docker bisa berjalan:
     - Frontend: `npm create vite@latest . -- --template react-ts`
     - Backend: `npm init -y` (Pastikan entry point di `src/index.ts`)
     - AI Engine: Buat file `requirements.txt` dan `main.py`.

2. Konfigurasi Environment (`.env`)
   - Buat file `.env` di root folder. Jangan membagi-bagi file `.env` ke sub-folder kecuali diperlukan. Isi minimal:

```env
# AI & Database
GEMINI_API_KEY=your_key_here
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
MONGODB_URL=mongodb://root:password@mongodb:27017

# MinIO
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=password123
```

> ⚠️ **Note:** Jangan commit file `.env` ke repository publik. Gunakan `.gitignore` untuk menghindari kebocoran rahasia.

---

## 🐳 Konfigurasi Docker (Development Mode)
Salin kode di bawah ini ke file `Dockerfile.dev` masing-masing folder. Kita menggunakan flag `--host` dan `nodemon`/`uvicorn --reload` agar perubahan kode di lokal langsung terasa di dalam kontainer (Hot Reloading).

### 🖥️ Frontend (`frontend/Dockerfile.dev`)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
```

### ⚙️ Backend (`backend/Dockerfile.dev`)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon
COPY . .
EXPOSE 5000
CMD ["nodemon", "src/index.ts"]
```

### 🧠 AI Engine (`ai-engine/Dockerfile.dev`)
```dockerfile
FROM python:3.11-slim
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

---

## 🛠️ Cara Menjalankan Sistem
Gunakan perintah ini di terminal root project:

**Build & Run:**
```
docker-compose up --build
```

**Akses Dashboard:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- AI Engine Docs: `http://localhost:8000/docs`
- MinIO Console: `http://localhost:9001`

---

## 🔄 Workflow & Maintenance (PENTING!)
Sebagai tim yang kolaboratif, kamu **HARUS** melakukan build ulang dalam kondisi berikut:

1. **Setelah Pull Request (PR) atau `git pull`**
   - Jika temanmu menambah library baru (di `package.json` atau `requirements.txt`), Docker image yang lama tidak akan tahu.
   - Tindakan: Jalankan `docker-compose up --build`.

2. **Penambahan Environment Variable**
   - Jika ada variabel baru di `.env`, kamu harus restart container.
   - Tindakan: `docker-compose down` lalu `docker-compose up`.

3. **Pembersihan Cache (Jika Error Aneh)**
   - Jika merasa kode sudah benar tapi Docker tetap error:
   ```bash
docker system prune -a  # Hapus semua image/cache tak terpakai (Hati-hati!)
```

---

## 🛑 Rule Emas Kolaborasi
- Jangan push folder `node_modules` atau `__pycache__`! Pastikan `.gitignore` sudah benar.
- **Wajib Docker.** Jangan mencoba menjalankan service secara manual (misal `npm run dev` di luar Docker) untuk menghindari perbedaan versi Node/Python antar anggota.
- **Log Check.** Jika service mati, cek log dengan `docker-compose logs -f [nama_service]`.

---

## ❓ Troubleshooting singkat
- Jika `docker-compose.yml` berisi baris `KEY=VALUE` (mirip file `.env`) — itu salah tempat. Buat file `.env` dan pindahkan baris tersebut, lalu pastikan `docker-compose.yml` adalah file YAML yang valid.

---

Jika kamu mau, aku bisa:
1. Memindahkan isi `docker-compose.yml` yang sekarang ke file `.env` dan memperbaiki `docker-compose.yml` sehingga siap digunakan, atau
2. Cek dan validasi `docker-compose.yml` sekarang agar bisa langsung `docker-compose up --build`.

> **Catatan:** Beri tahu pilihanmu — aku bantu lanjutkan langkah berikutnya untuk memastikan semua anggota tim bisa jalankan proyek tanpa drama. ✅
=======
# motochatz-ai
>>>>>>> 1da7f383699aa31cde7f4a4f92b3adf85ffc0584
