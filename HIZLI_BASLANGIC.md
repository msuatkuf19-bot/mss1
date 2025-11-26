# 🚀 Hızlı Başlangıç Komutları

## İlk Kurulum (Sadece bir kez)

```powershell
# 1. Tüm paketleri yükle
npm install

# 2. Backend .env dosyasını oluştur
Copy-Item ".env.example" -Destination "backend\.env"

# 3. Frontend .env.local dosyasını oluştur  
Copy-Item "frontend\.env.local.example" -Destination "frontend\.env.local"

# 4. PostgreSQL veritabanı oluştur (PostgreSQL kurulu olmalı)
# psql -U postgres
# CREATE DATABASE qr_menu_db;
# \q

# 5. Veritabanını hazırla
cd backend
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed
cd ..
```

## Günlük Kullanım

```powershell
# Hem backend hem frontend'i aynı anda başlat
npm run dev

# Tarayıcıda aç:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

## Demo Hesaplar

**Süper Admin:**
- Email: `admin@qrmenu.com`
- Şifre: `admin123`

**Restoran Admin:**
- Email: `restaurant1@example.com`
- Şifre: `password123`

## Önemli Komutlar

```powershell
# Sadece backend başlat
npm run dev:backend

# Sadece frontend başlat
npm run dev:frontend

# Prisma Studio (veritabanı yönetimi)
npm run prisma:studio

# Build (production)
npm run build

# Docker ile başlat
docker-compose up -d
```

## Sorun Giderme

```powershell
# Tüm node_modules'leri temizle ve yeniden yükle
Remove-Item -Recurse -Force node_modules, backend/node_modules, frontend/node_modules
npm install

# Prisma client'ı yeniden oluştur
cd backend
npx prisma generate
cd ..

# Port çakışması varsa başka port kullan
# backend/.env dosyasında PORT=5001 gibi değiştir
```

## Proje Durumu

✅ **Backend API** - %100 Hazır
- Authentication & Authorization
- Restoran yönetimi
- Menü yönetimi (Kategori/Ürün)
- QR kod sistemi
- Analytics
- Görsel upload

🚧 **Frontend** - %25 Hazır
- Temel yapı
- Login sayfası
- API client
- **Eksik:** Admin dashboards, Menü yönetim UI, Public menü sayfası

📦 **Database** - %100 Hazır
- Multi-tenant yapı
- 7 tablo (Users, Restaurants, Categories, Products, QRCodes, Analytics, Images)
- Demo data (1 admin, 1 restoran, 3 kategori, 10 ürün)

## Teknoloji Stack

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- QRCode, Sharp, Multer

**Frontend:**
- Next.js 14 + TypeScript
- Tailwind CSS
- React Query + Zustand
- Axios

## Klasör Yapısı

```
qr-menu-system/
├── backend/         # API sunucusu
├── frontend/        # Next.js uygulaması
├── KURULUM.md       # Detaylı kurulum
├── PROJE_DURUMU.md  # Tamamlanan özellikler
└── HIZLI_BASLANGIC.md # Bu dosya
```
