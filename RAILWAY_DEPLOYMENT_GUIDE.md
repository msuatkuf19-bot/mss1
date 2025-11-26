# 🚀 QR Menü Sistemi - Railway Deployment Rehberi

Bu rehber, QR Menü Sistemi backend'ini Railway platformunda PostgreSQL ile deploy etmek için hazırlanmıştır.

## 📋 İçindekiler

- [Proje Hakkında](#proje-hakkında)
- [Teknolojiler](#teknolojiler)
- [Railway'e Deployment](#railwaye-deployment)
- [Local Geliştirme](#local-geliştirme)
- [API Endpoints](#api-endpoints)
- [Test Örnekleri](#test-örnekleri)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Proje Hakkında

QR Menü Sistemi, restoranların dijital menülerini QR kod ile sunabilecekleri modern bir platformdur.

**Özellikler:**
- ✅ RESTful API
- ✅ JWT Authentication
- ✅ PostgreSQL veritabanı (Prisma ORM)
- ✅ File upload (logo, ürün resimleri)
- ✅ QR kod oluşturma ve yönetimi
- ✅ Analytics ve istatistikler
- ✅ CORS ve güvenlik middleware'leri
- ✅ Rate limiting

---

## 🛠️ Teknolojiler

| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| Node.js | 20.x | JavaScript runtime |
| TypeScript | 5.3+ | Type-safe development |
| Express | 4.18+ | Web framework |
| Prisma | 5.7+ | ORM |
| PostgreSQL | 15+ | Veritabanı |
| Railway | - | Deployment platform |

**Bağımlılıklar:**
```json
{
  "@prisma/client": "^5.7.1",
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "helmet": "^7.1.0",
  "multer": "^1.4.5",
  "sharp": "^0.33.1",
  "qrcode": "^1.5.3"
}
```

---

## 🚂 Railway'e Deployment

### Adım 1: Railway Hesabı ve Proje Oluşturma

1. [Railway.app](https://railway.app) adresine gidin ve hesap oluşturun
2. **"New Project"** butonuna tıklayın
3. **"Deploy from GitHub repo"** seçeneğini seçin
4. GitHub hesabınızı bağlayın
5. `msuatkuf19-bot/Mss-qrgit` repository'sini seçin

### Adım 2: PostgreSQL Database Ekleme

1. Proje dashboard'ında **"+ New"** butonuna tıklayın
2. **"Database"** → **"Add PostgreSQL"** seçin
3. PostgreSQL database otomatik olarak oluşturulacak
4. `DATABASE_URL` environment variable otomatik eklenecek

### Adım 3: Environment Variables Ayarlama

**backend** servisine tıklayın → **Variables** sekmesine gidin:

```bash
# ZORUNLU DEĞİŞKENLER
NODE_ENV=production
PORT=5000  # Railway otomatik sağlar, opsiyonel
DATABASE_URL=<Railway tarafından otomatik eklenir>

# JWT AYARLARI
JWT_SECRET=<güçlü-rastgele-bir-key-oluşturun>
JWT_EXPIRES_IN=7d

# FRONTEND URL
FRONTEND_URL=https://your-frontend-domain.vercel.app

# UPLOAD AYARLARI (Opsiyonel)
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

**JWT_SECRET Oluşturma:**
```bash
# Terminal'de çalıştırın:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Adım 4: PostgreSQL Reference Ekleme

1. **Variables** sekmesinde **"+ New Variable"** tıklayın
2. **"VARIABLE_NAME"** alanına `DATABASE_URL` yazın
3. **"Add Reference"** butonuna tıklayın
4. Service: **Postgres** seçin
5. Variable: **DATABASE_URL** seçin
6. **Add** butonuna tıklayın

### Adım 5: Root Directory Ayarlama

1. **Settings** sekmesine gidin
2. **"Root Directory"** bölümünü bulun
3. Değeri **`backend`** olarak ayarlayın
4. Kaydedin

### Adım 6: Deploy

1. **Deployments** sekmesine gidin
2. **"Deploy"** butonuna tıklayın
3. Build logs'u takip edin

**Build Süreci:**
```
✓ Initialization (1-2 dk)
✓ Build (1-2 dk)
  - npm install
  - npx prisma generate
  - npm run build
✓ Deploy (10-30 sn)
  - npx prisma migrate deploy
  - npm start
✓ Post-deploy
```

### Adım 7: Domain Oluşturma

1. **Settings** → **Networking** sekmesine gidin
2. **"Generate Domain"** butonuna tıklayın
3. Railway size bir domain verecek: `backend-production-xxxx.up.railway.app`

### Adım 8: Test

**Health Check:**
```bash
curl https://your-domain.up.railway.app/health
```

**Beklenen Response:**
```json
{
  "success": true,
  "status": "healthy",
  "message": "Server ve veritabanı çalışıyor",
  "environment": "production",
  "timestamp": "2025-11-22T12:00:00.000Z"
}
```

---

## 💻 Local Geliştirme

### Gereksinimler

- Node.js 20.x
- PostgreSQL 15+ (veya Railway PostgreSQL connection string)
- npm veya yarn

### Kurulum

1. **Repository'yi klonlayın:**
```bash
git clone https://github.com/msuatkuf19-bot/Mss-qrgit.git
cd Mss-qrgit/backend
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment variables ayarlayın:**
```bash
# .env.example dosyasını .env olarak kopyalayın
cp .env.example .env

# .env dosyasını düzenleyin
nano .env
```

4. **PostgreSQL bağlantısını ayarlayın:**

**Opsiyyon A - Local PostgreSQL:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/qr_menu_db"
```

**Opsiyyon B - Railway PostgreSQL:**
Railway dashboard'dan DATABASE_URL'i kopyalayın ve .env'e yapıştırın

5. **Prisma migration çalıştırın:**
```bash
# Development migration
npx prisma migrate dev --name init

# Veya production migration
npx prisma migrate deploy
```

6. **Seed data (opsiyonel):**
```bash
npm run prisma:seed
```

### Development Server

```bash
# Development mode (hot reload)
npm run dev

# Server başlatıldı:
# 🚀 Server başlatıldı - Port: 5000
# 📝 Ortam: development
# 🗄️  Veritabanı: PostgreSQL
# 🔗 Health Check: http://localhost:5000/health
```

### Production Build Test

```bash
# Build
npm run build

# Start
npm start
```

---

## 📡 API Endpoints

### Genel Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/health` | Health check | ❌ |
| GET | `/api` | API bilgisi | ❌ |

### Authentication

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı | ❌ |
| POST | `/api/auth/login` | Giriş yapma | ❌ |
| GET | `/api/auth/profile` | Profil bilgisi | ✅ |

### Users (Example - Test Amaçlı)

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/users/example` | Tüm kullanıcıları listele | ❌ |
| GET | `/api/users/example/:id` | Kullanıcı detayı | ❌ |
| POST | `/api/users/example` | Yeni kullanıcı oluştur | ❌ |
| PUT | `/api/users/example/:id` | Kullanıcı güncelle | ❌ |
| DELETE | `/api/users/example/:id` | Kullanıcı sil | ❌ |
| GET | `/api/users/example/test-connection` | DB test | ❌ |

### Restaurants

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/restaurants` | Restoranları listele | ✅ |
| POST | `/api/restaurants` | Yeni restoran oluştur | ✅ |
| GET | `/api/restaurants/:id` | Restoran detayı | ✅ |
| PUT | `/api/restaurants/:id` | Restoran güncelle | ✅ |
| DELETE | `/api/restaurants/:id` | Restoran sil | ✅ |

### Menu

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/menu/categories` | Kategorileri listele | ✅ |
| POST | `/api/menu/categories` | Kategori oluştur | ✅ |
| GET | `/api/menu/products` | Ürünleri listele | ✅ |
| POST | `/api/menu/products` | Ürün oluştur | ✅ |

### QR Codes

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/qr/generate/:restaurantId` | QR kod oluştur | ✅ |
| GET | `/api/qr/download/:qrCodeId` | QR kod indir | ✅ |

### Public (QR Erişim)

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/public/menu/:slug` | Public menü | ❌ |

### Analytics

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/analytics/dashboard` | Dashboard verileri | ✅ |
| GET | `/api/analytics/restaurant/:id` | Restoran analytics | ✅ |

---

## 🧪 Test Örnekleri

### 1. Health Check

```bash
curl https://your-domain.up.railway.app/health
```

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "message": "Server ve veritabanı çalışıyor",
  "environment": "production",
  "timestamp": "2025-11-22T12:00:00.000Z"
}
```

### 2. Database Connection Test

```bash
curl https://your-domain.up.railway.app/api/users/example/test-connection
```

**Response:**
```json
{
  "success": true,
  "message": "PostgreSQL bağlantısı başarılı",
  "data": {
    "database": [/* PostgreSQL info */],
    "userCount": 5,
    "timestamp": "2025-11-22T12:00:00.000Z"
  }
}
```

### 3. Kullanıcıları Listele

```bash
curl https://your-domain.up.railway.app/api/users/example
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-123",
      "email": "admin@qrmenu.com",
      "name": "Super Admin",
      "role": "SUPER_ADMIN",
      "isActive": true,
      "createdAt": "2025-11-22T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

### 4. Yeni Kullanıcı Oluştur

```bash
curl -X POST https://your-domain.up.railway.app/api/users/example \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "securePassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Kullanıcı başarıyla oluşturuldu",
  "data": {
    "id": "uuid-456",
    "email": "test@example.com",
    "name": "Test User",
    "role": "CUSTOMER",
    "createdAt": "2025-11-22T12:05:00.000Z"
  }
}
```

### 5. Login

```bash
curl -X POST https://your-domain.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@qrmenu.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-123",
    "email": "admin@qrmenu.com",
    "name": "Super Admin",
    "role": "SUPER_ADMIN"
  }
}
```

---

## 🔧 Troubleshooting

### Problem: Build başarısız oluyor

**Çözüm:**
1. `DATABASE_URL` environment variable eklenmiş mi kontrol edin
2. Railway PostgreSQL plugin'i eklenmiş mi?
3. Variables sekmesinde `DATABASE_URL` reference doğru mu?

### Problem: Migration hatası

**Hata:** `P1012: Environment variable not found: DATABASE_URL`

**Çözüm:**
```bash
# Railway dashboard'da Variables sekmesinden DATABASE_URL ekleyin
# PostgreSQL service'inden reference olarak ekleyin
```

### Problem: CORS hatası

**Hata:** `Access to fetch blocked by CORS policy`

**Çözüm:**
```bash
# FRONTEND_URL environment variable'ını doğru ayarlayın
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Problem: JWT secret varsayılan değerde

**Uyarı:** `⚠️  Production ortamında varsayılan JWT secret kullanılıyor`

**Çözüm:**
```bash
# Güçlü bir JWT secret oluşturun:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Railway Variables'a ekleyin:
JWT_SECRET=<oluşturduğunuz-key>
```

### Problem: Upload çalışmıyor

**Not:** Railway ephemeral storage kullanır. Upload edilen dosyalar restart sonrası kaybolur.

**Çözüm:**
- AWS S3 entegrasyonu
- Cloudinary entegrasyonu
- Railway Volumes (persistent storage)

### Problem: Database bağlantı sayısı limiti

**Hata:** `Too many connections`

**Çözüm:**
```typescript
// src/config/database.ts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Connection pool ayarları
  log: ['error'],
});
```

---

## 📊 Railway Dashboard - Monitoring

### Metrics

Railway dashboard'da şu metrikleri izleyebilirsiniz:
- **CPU Usage**: % kullanım
- **Memory Usage**: MB cinsinden
- **Network**: Gelen/giden trafik
- **Deployments**: Build history

### Logs

```bash
# Railway CLI ile logları görüntüleme:
railway logs
```

### Database Management

**Prisma Studio:**
```bash
# Local'de Prisma Studio açın:
npm run prisma:studio
```

**DBeaver / TablePlus:**
Railway PostgreSQL connection string'i kullanarak GUI araçlarla bağlanabilirsiniz.

---

## 🔒 Güvenlik Notları

### Production Checklist

- [ ] `JWT_SECRET` güçlü ve rastgele
- [ ] Default admin şifresi değiştirildi
- [ ] CORS sadece frontend domain'ine kısıtlandı
- [ ] Rate limiting aktif
- [ ] Helmet security headers aktif
- [ ] Environment variables Railway'de doğru ayarlandı
- [ ] `.env` dosyası `.gitignore`'da
- [ ] Database backups aktif

### Recommended JWT_SECRET

```bash
# Minimum 32 karakter, rastgele
openssl rand -base64 32
```

---

## 📚 Kaynaklar

- [Railway Documentation](https://docs.railway.app)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## 🆘 Destek

- **GitHub Issues**: [github.com/msuatkuf19-bot/Mss-qrgit/issues](https://github.com/msuatkuf19-bot/Mss-qrgit/issues)
- **Railway Support**: [railway.app/help](https://railway.app/help)

---

## 📝 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.
