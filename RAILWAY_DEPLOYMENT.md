# Railway Deployment Rehberi

## 1. Railway'e Proje Oluşturma

1. [Railway](https://railway.app) hesabınıza giriş yapın
2. "New Project" → "Deploy from GitHub repo" seçin
3. `msuatkuf19-bot/Mss-qrgit` repository'sini seçin

## 2. PostgreSQL Database Ekleme

1. Proje içinde "New" → "Database" → "PostgreSQL" seçin
2. Database otomatik olarak oluşturulacak
3. `DATABASE_URL` environment variable otomatik eklenecek

## 3. Environment Variables Ekleme

Railway dashboard'da "Variables" sekmesine gidin ve şu değişkenleri ekleyin:

```env
NODE_ENV=production
PORT=5000

# DATABASE_URL zaten PostgreSQL tarafından otomatik eklendi

# JWT Secret - Güçlü bir secret oluşturun
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL - Domain deploy edildikten sonra güncellenecek
FRONTEND_URL=https://your-domain.com

# File Upload Settings
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

## 4. Build & Deploy Ayarları

Railway otomatik olarak şu ayarları algılayacak:
- **Builder**: NIXPACKS
- **Build Command**: `cd backend && npm install && npm run build && npx prisma migrate deploy`
- **Start Command**: `cd backend && npm start`

## 5. Domain Ayarlama

1. Railway dashboard'da "Settings" → "Networking"
2. "Generate Domain" tıklayın (örnek: `your-project.up.railway.app`)
3. Veya kendi domain'inizi ekleyin

## 6. Database Migration

İlk deployment'ta migration otomatik çalışacak. Seed data için:

```bash
# Railway CLI ile bağlanın
railway run npm run prisma:seed
```

## 7. Frontend için Environment Variable

Frontend'i deploy ederken (Vercel/Netlify):

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.up.railway.app
```

## 8. Deployment Sonrası Kontroller

✅ Backend health check: `https://your-domain.up.railway.app/health`
✅ Database bağlantısı kontrol
✅ Login testi: `admin@qrmenu.com` / `admin123`

## 9. Logs ve Monitoring

Railway dashboard'da:
- **Deployments**: Build logları
- **Observability**: Runtime logları
- **Metrics**: CPU, Memory, Network kullanımı

## 10. Güvenlik Notları

🔒 Production için mutlaka değiştirin:
- `JWT_SECRET` - Çok güçlü bir key kullanın
- Default admin şifresi değiştirin
- CORS ayarlarını sadece domain'inize kısıtlayın

## Yararlı Railway CLI Komutları

```bash
# Railway CLI kurulum
npm i -g @railway/cli

# Login
railway login

# Project'e bağlan
railway link

# Logs
railway logs

# Variables
railway variables

# Shell access
railway run bash
```

## Troubleshooting

**Problem**: Build fails with Prisma error
**Çözüm**: `DATABASE_URL` environment variable eklenmiş mi kontrol edin

**Problem**: Port binding error
**Çözüm**: Railway otomatik `PORT` variable'ı sağlar, kodda `process.env.PORT` kullanıldığından emin olun

**Problem**: Static files (uploads) kaybolur
**Çözüm**: Railway ephemeral storage kullanır. Kalıcı dosyalar için AWS S3 veya Cloudinary entegrasyonu gerekir
