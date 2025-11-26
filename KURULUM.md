# QR Menü Sistemi - Kurulum Rehberi

## 🚀 Hızlı Başlangıç

### 1. Gereksinimler
- Node.js 18+
- PostgreSQL 14+
- npm veya yarn

### 2. Kurulum Adımları

#### Root bağımlılıkları yükleyin:
```powershell
npm install
```

#### Environment dosyalarını oluşturun:

**Backend (.env):**
```powershell
Copy-Item ".env.example" -Destination "backend\.env"
```

Sonra `backend\.env` dosyasını düzenleyin:
```env
DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/qr_menu_db"
JWT_SECRET="güvenli-bir-secret-key-buraya"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

**Frontend (.env.local):**
```powershell
Copy-Item "frontend\.env.local.example" -Destination "frontend\.env.local"
```

#### 3. PostgreSQL veritabanı oluşturun:
```powershell
# PostgreSQL'e bağlanın
psql -U postgres

# Veritabanı oluşturun
CREATE DATABASE qr_menu_db;
\q
```

#### 4. Prisma migration ve seed:
```powershell
cd backend
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed
cd ..
```

#### 5. Uygulamayı başlatın:

**Hem backend hem frontend (root'tan):**
```powershell
npm run dev
```

**Veya ayrı ayrı:**
```powershell
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

### 🌐 Erişim URL'leri

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health
- **Prisma Studio:** `npm run prisma:studio`

### 👤 Demo Hesaplar

**Süper Admin:**
- Email: admin@qrmenu.com
- Şifre: admin123

**Restoran Admin (Lezzetli Lokanta):**
- Email: restaurant1@example.com
- Şifre: password123

### 📚 API Dokümantasyonu

#### Authentication
- `POST /api/auth/register` - Kayıt
- `POST /api/auth/login` - Giriş
- `GET /api/auth/profile` - Profil

#### Restaurants (Süper Admin)
- `GET /api/restaurants` - Tüm restoranlar
- `POST /api/restaurants` - Yeni restoran
- `PUT /api/restaurants/:id` - Güncelle
- `DELETE /api/restaurants/:id` - Sil

#### Menu (Restoran Admin)
- `GET /api/menu/categories` - Kategoriler
- `POST /api/menu/categories` - Yeni kategori
- `GET /api/menu/products` - Ürünler
- `POST /api/menu/products` - Yeni ürün

#### QR Codes
- `POST /api/qr/generate/:restaurantId` - QR oluştur
- `GET /api/qr/:restaurantId` - QR listesi

#### Public (Müşteriler)
- `GET /api/public/menu/:slug` - Menü görüntüle

#### Analytics
- `GET /api/analytics/dashboard` - Dashboard
- `GET /api/analytics` - Detaylı veriler

### 🐳 Docker ile Kurulum

```powershell
docker-compose up -d
```

Veritabanını hazırlamak için:
```powershell
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:seed
```

### 🔧 Sorun Giderme

**"Cannot find module" hatası:**
```powershell
# Root'ta
npm install

# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

**Prisma hataları:**
```powershell
cd backend
npx prisma generate
npx prisma migrate dev
```

**Port çakışması:**
- Backend portu (5000) veya Frontend portu (3000) kullanımdaysa `.env` dosyalarında değiştirin

### 📝 Geliştirme Notları

- Backend hot-reload için `nodemon` kullanır
- Frontend Next.js hot-reload varsayılan olarak aktif
- Prisma Studio: `npm run prisma:studio`
- TypeScript hatalarını düzeltmek: `npm run build`

### 🌟 Özellikler

✅ Rol bazlı yetkilendirme (Süper Admin, Restoran Admin, Müşteri)
✅ QR kod oluşturma ve tracking
✅ Menü CRUD işlemleri
✅ Görsel yükleme ve optimizasyon
✅ Detaylı analytics ve raporlama
✅ Multi-tenant restoran yapısı
✅ Mobil responsive tasarım

### 📞 Destek

Sorunlarınız için GitHub Issues kullanabilirsiniz.
