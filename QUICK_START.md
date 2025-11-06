# 🚀 QUICK START GUIDE

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database MySQL
```bash
mysql -u root -p < database.sql
```

### 3. Setup Environment Variables
Buat file `.env` di root project dan isi dengan konfigurasi berikut:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nutech_test_db
DB_PORT=3306

# JWT Configuration (generate dengan: openssl rand -base64 32)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRE=12h

# Server Configuration
PORT=3000
NODE_ENV=development

# Application URL (untuk generate full URL file upload)
APP_URL=http://localhost:3000

# Bcrypt
BCRYPT_SALT_ROUNDS=10
```

**⚠️ PENTING:** 
- `APP_URL` digunakan untuk generate full URL pada profile image
- Development: `http://localhost:3000`
- Production: `https://your-app.up.railway.app`

### 4. Jalankan Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

---

### Buka Swagger Documentation

```
http://localhost:3000/api-docs
```

---

## 📚 Struktur Project

```
NUTECH_TEST/
├── src/
│   ├── config/           # Database & Swagger config
│   ├── controllers/      # HTTP request handlers
│   ├── services/         # Business logic
│   ├── repositories/     # Database queries
│   ├── middlewares/      # Auth & validation
│   ├── routes/           # API routes
│   └── utils/            # Helpers (JWT, Response)
├── server.js             # Entry point
├── database.sql          # Database schema
└── .env                  # Configuration
```

## 🛠️ Tools

- **Swagger UI:** http://localhost:3000/api-docs
- **Health Check:** http://localhost:3000/health

## 📚 Dokumentasi Lengkap

- **Environment Variables:** Lihat `ENV_SETUP.md` untuk detail lengkap
- **Railway Deployment:** Lihat `RAILWAY_DEPLOY.md` (jika ada)

## 💡 Catatan File Upload

Sistem menyimpan **hanya path/filename** di database, bukan full URL:
- **Database:** `profile-1-1234567890.jpg`
- **Response API:** `http://localhost:3000/uploads/profiles/profile-1-1234567890.jpg`

Full URL dibuat dengan formula: `APP_URL + /uploads/profiles/ + filename`

**Format Image yang diperbolehkan:**
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ❌ Format lainnya akan ditolak dengan pesan: "Format Image tidak sesuai"
- 📦 Maksimal ukuran file: 2MB