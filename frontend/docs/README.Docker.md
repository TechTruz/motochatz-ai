# Docker Setup - Frontend

Dokumentasi singkat untuk menjalankan frontend menggunakan Docker.

## 📋 Prerequisites

- Docker Desktop terinstall
- Port 5173 tersedia

## 🚀 Cara Menjalankan

```bash
# 1. Pindah ke folder frontend
cd frontend

# 2. Copy environment file
cp .env.example .env.docker

# 3. Edit .env.docker dan isi VITE_API_BASE_URL
# VITE_API_BASE_URL=http://localhost:8080

# 4. Jalankan Docker
docker compose up -d --build
```

**Akses aplikasi**: http://localhost:5173

✅ Hot reload aktif - perubahan code otomatis terdeteksi

## 🛠️ Command Docker

```bash
# Start
docker compose up -d

# Stop
docker compose down

# View logs
docker compose logs -f frontend-dev

# Restart
docker compose restart frontend-dev

# Rebuild (jika ada perubahan)
docker compose up -d --build
```

## 🔧 Environment Variables

Edit file `.env.docker`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Ganti dengan URL backend yang sesuai.

## 🐛 Troubleshooting

**Port 5173 sudah digunakan:**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /F /PID <PID>
```

**Container tidak jalan:**
```bash
docker compose down
docker compose up -d --build
```

**Hot reload tidak jalan:**
```bash
docker compose restart frontend-dev
```

---

**Status**: Development Mode  
**Port**: 5173  
**Hot Reload**: ✅ Active
