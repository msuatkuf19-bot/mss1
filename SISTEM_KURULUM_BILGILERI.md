# 🔐 QR MENÜ SİSTEMİ - TAM KURULUM BİLGİLERİ

Bu dosya başka bir PC'den sisteme bağlanmak için gerekli tüm bilgileri içerir.

---

## 📦 DATABASE (Neon.tech PostgreSQL)

### Connection String:
```
postgresql://neondb_owner:npg_0HO3cftNaVzL@ep-winter-hat-adt73z8b-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Bileşenler:
- **Host**: `ep-winter-hat-adt73z8b-pooler.c-2.us-east-1.aws.neon.tech`
- **Database**: `neondb`
- **User**: `neondb_owner`
- **Password**: `npg_0HO3cftNaVzL`
- **Port**: `5432`
- **SSL**: `require`

### Neon Dashboard:
- **URL**: https://console.neon.tech
- **Project**: qr-menu-production

---

## 🔑 ENVIRONMENT VARIABLES

### Backend (.env dosyası):
```env
# Server
NODE_ENV=development
PORT=5000

# Database (Neon.tech)
DATABASE_URL="postgresql://neondb_owner:npg_0HO3cftNaVzL@ep-winter-hat-adt73z8b-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# JWT
JWT_SECRET="zNGdoLUh4jW6IQqeacuXwxHFMO05JsVv"
JWT_EXPIRES_IN=7d

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# CORS - Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local dosyası):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🌐 PRODUCTION URLs

### Railway Backend:
- **URL**: `https://backend-production-f340d.up.railway.app`
- **Status**: Deployment sorunlu (health check problemi)

### Vercel Frontend:
- **URL**: `https://qr-men-g-ncel.vercel.app`

### GitHub Repository:
- **URL**: `https://github.com/msuatkuf19-bot/qr-men-g-ncel`
- **Branch**: `main`

---

## 💻 YENİ PC'DE KURULUM

### 1. Repository'yi Klonla:
```bash
git clone https://github.com/msuatkuf19-bot/qr-men-g-ncel.git
cd qr-men-g-ncel
```

### 2. Backend Kurulumu:
```bash
cd backend

# .env dosyası oluştur (yukarıdaki değerlerle)
# Veya bu dosyadan kopyala

# Dependencies kur
npm install

# Prisma client oluştur
npx prisma generate

# Database migration (Neon'a bağlanır)
npx prisma migrate deploy

# Development server başlat
npm run dev
```

### 3. Frontend Kurulumu:
```bash
cd frontend

# .env.local dosyası oluştur
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Dependencies kur
npm install

# Development server başlat
npm run dev
```

### 4. Tarayıcıda Aç:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## 🗄️ DATABASE ŞEMASI

### Tablolar:
- `users` - Kullanıcılar
- `restaurants` - Restoranlar
- `categories` - Menü kategorileri
- `products` - Ürünler
- `qr_codes` - QR kodları
- `analytics` - İstatistikler
- `images` - Görseller
- `menu_views` - Menü görüntüleme
- `product_views` - Ürün görüntüleme
- `restaurant_stats_daily` - Günlük istatistikler

### Prisma Studio (Database GUI):
```bash
cd backend
npx prisma studio
# http://localhost:5555 açılır
```

---

## 👤 KULLANICI ROLLERİ

- **SUPER_ADMIN**: Tüm sistemi yönetir
- **RESTAURANT_ADMIN**: Kendi restoranını yönetir
- **CUSTOMER**: Müşteri (menü görüntüler)

---

## 🔧 RAILWAY PRODUCTION AYARLARI

### Environment Variables (Railway Dashboard):
```
DATABASE_URL=postgresql://neondb_owner:npg_0HO3cftNaVzL@ep-winter-hat-adt73z8b-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
NODE_ENV=production
JWT_SECRET=zNGdoLUh4jW6IQqeacuXwxHFMO05JsVv
FRONTEND_URL=https://qr-men-g-ncel.vercel.app
```

### Service Settings:
- **Root Directory**: `backend`
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npx prisma migrate deploy && node dist/server.js`

### Health Check (KAPALI OLMALI):
Railway Settings → Deploy → Healthchecks → Disable

---

## 🔄 VERCEL FRONTEND AYARLARI

### Environment Variables:
```
NEXT_PUBLIC_API_URL=https://backend-production-f340d.up.railway.app
```

### Build Settings:
- **Framework**: Next.js
- **Root Directory**: `frontend`

---

## 📝 ÖNEMLİ NOTLAR

1. **Database her yerden erişilebilir** - Neon.tech cloud database
2. **Şifreleri güvenli tutun** - Bu dosyayı paylaşmayın
3. **Production'da JWT_SECRET değiştirin** - Güçlü rastgele şifre kullanın
4. **CORS ayarları** - Production'da frontend URL'ini ekleyin

---

## 🆘 SORUN GİDERME

### Database bağlantı hatası:
```bash
# Connection string'i test et
npx prisma db pull
```

### Migration hatası:
```bash
# Migration'ları sıfırla
npx prisma migrate reset
npx prisma migrate deploy
```

### Build hatası:
```bash
# Cache temizle
rm -rf node_modules
rm -rf dist
npm install
npm run build
```

---

## 📅 Son Güncelleme: 1 Aralık 2025

Bu dosyayı güvenli bir yerde saklayın! 🔒
