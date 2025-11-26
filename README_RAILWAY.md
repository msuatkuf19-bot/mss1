# QR Menu System - Canlı Ortam (Railway)

Bu proje Railway platformunda PostgreSQL database kullanarak deploy edilebilir.

## 🚀 Hızlı Deploy

### 1. Railway'e Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

1. Railway hesabı oluşturun: https://railway.app
2. GitHub repository'nizi bağlayın
3. PostgreSQL database ekleyin
4. Environment variables ayarlayın

### 2. Gerekli Environment Variables

Railway Dashboard → Variables:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=<Railway tarafından otomatik eklenir>
JWT_SECRET=<güçlü-bir-secret-oluşturun>
FRONTEND_URL=<frontend-domain-adresiniz>
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### 3. Database Migration

Deploy sonrası otomatik olarak migration çalışacak:
- ✅ Prisma migrate deploy
- ✅ 11 tablo oluşturulacak
- ✅ Enum types (UserRole, ImageType) oluşturulacak

### 4. Seed Data (Opsiyonel)

İlk admin kullanıcısı ve örnek data için Railway CLI ile:

```bash
railway run npm run prisma:seed
```

Default kullanıcılar:
- **Super Admin**: admin@qrmenu.com / admin123
- **Restaurant Admin**: restaurant1@example.com / password123

## 📊 Database Yapısı

Railway üzerinde PostgreSQL 15+ kullanılıyor:

**Tablolar:**
- users (Kullanıcılar)
- restaurants (Restoranlar)
- categories (Kategoriler)
- products (Ürünler)
- qr_codes (QR Kodlar)
- images (Resim yönetimi)
- analytics (Analitik veriler)
- menu_views (Menü görüntülenme)
- product_views (Ürün görüntülenme)
- restaurant_stats_daily (Günlük istatistikler)

## 🔧 Backend API Endpoints

Base URL: `https://your-project.up.railway.app`

**Kimlik Doğrulama:**
- POST `/api/auth/register` - Kayıt
- POST `/api/auth/login` - Giriş
- GET `/api/auth/profile` - Profil

**Restoran Yönetimi:**
- GET/POST `/api/restaurants` - Restoranlar
- GET/PUT/DELETE `/api/restaurants/:id` - Restoran detay

**Menü Yönetimi:**
- GET/POST `/api/menu/categories` - Kategoriler
- GET/POST `/api/menu/products` - Ürünler
- PUT/DELETE `/api/menu/products/:id` - Ürün işlemleri

**QR Kod:**
- GET `/api/qr/generate/:restaurantId` - QR kod oluştur
- GET `/api/qr/download/:qrCodeId` - QR kod indir

**Public API:**
- GET `/api/public/menu/:slug` - Public menü (QR'dan erişim)

**Analytics:**
- GET `/api/analytics/dashboard` - Dashboard verileri
- GET `/api/analytics/restaurant/:id` - Restoran analytics

## 🌐 Frontend Integration

Frontend'i Vercel'e deploy ederken:

```env
# .env.production
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
```

## 📝 Railway Deployment Ayarları

**Build Command:**
```bash
cd backend && npm install && npm run build && npx prisma migrate deploy
```

**Start Command:**
```bash
cd backend && npm start
```

**Root Directory:** `/` (monorepo değil)

## 🔍 Monitoring

Railway Dashboard'da:
- **Deployments**: Build durumu ve loglar
- **Metrics**: CPU, RAM, Network kullanımı
- **Observability**: Runtime loglar
- **Database**: PostgreSQL metrics

## 🔒 Güvenlik

Production'da mutlaka yapın:

1. ✅ Güçlü `JWT_SECRET` kullanın (32+ karakter)
2. ✅ Default admin şifresini değiştirin
3. ✅ CORS'u sadece frontend domain'inize kısıtlayın
4. ✅ Rate limiting aktif (production'da otomatik)
5. ✅ Helmet güvenlik headers aktif

## 🚨 Troubleshooting

**Build hatası alıyorum:**
- `DATABASE_URL` environment variable eklenmiş mi kontrol edin
- Railway PostgreSQL plugin'i eklendi mi?

**Migration çalışmıyor:**
- Build command'da `npx prisma migrate deploy` var mı kontrol edin

**CORS hatası alıyorum:**
- `FRONTEND_URL` environment variable doğru mu?
- Frontend domain'i `allowedOrigins` listesinde mi?

**Upload çalışmıyor:**
- Railway ephemeral storage kullanır
- Kalıcı dosyalar için AWS S3/Cloudinary entegrasyonu gerekli

## 📞 Destek

Railway documentation: https://docs.railway.app
Prisma documentation: https://www.prisma.io/docs

## 🎯 Sonraki Adımlar

- [ ] Railway'e deploy
- [ ] PostgreSQL database ekle
- [ ] Environment variables ayarla
- [ ] Domain bağla
- [ ] Frontend'i Vercel'e deploy et
- [ ] SSL sertifikası otomatik (Railway tarafından)
- [ ] Monitoring aktif et
- [ ] Backup stratejisi belirle
