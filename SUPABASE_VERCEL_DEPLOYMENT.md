# 🚀 Supabase + Vercel Deployment Rehberi

## Menü Ben - QR Menü Sistemi Canlıya Alma

---

## 📋 Adım 1: Supabase Veritabanı Kurulumu

### 1.1 Supabase Hesabı Oluşturma
1. https://supabase.com adresine gidin
2. "Start your project" tıklayın
3. GitHub ile giriş yapın

### 1.2 Yeni Proje Oluşturma
1. "New Project" tıklayın
2. Bilgileri girin:
   - **Name**: `menuben-db`
   - **Database Password**: Güçlü bir şifre oluşturun (KESİNLİKLE NOT ALIN!)
   - **Region**: `Frankfurt (eu-central-1)` - Türkiye'ye yakın
3. "Create new project" tıklayın
4. 2-3 dakika bekleyin

### 1.3 Bağlantı Bilgilerini Alma
1. Sol menüden **Settings** > **Database** gidin
2. **Connection string** bölümünde:
   - **URI** kopyalayın → Bu `DATABASE_URL` olacak
   - **Mode**: `Transaction` seçili olmalı (pooler için)
   
3. Bağlantı dizesi şuna benzer:
```
postgresql://postgres.[project-ref]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

4. Direct connection için (migrations):
   - Port'u `5432` yapın
   - `?pgbouncer=true` kaldırın

---

## 📋 Adım 2: Backend'i Vercel'e Deploy Etme

### 2.1 Vercel Hesabı
1. https://vercel.com adresine gidin
2. GitHub ile giriş yapın

### 2.2 Backend Reposu Deploy
1. "Add New" > "Project" tıklayın
2. GitHub reponuzu import edin
3. **Root Directory**: `backend` yazın
4. **Framework Preset**: `Other` seçin

### 2.3 Environment Variables (Backend)
"Environment Variables" bölümünde şunları ekleyin:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `postgresql://postgres.[ref]:[SIFRE]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | `postgresql://postgres.[ref]:[SIFRE]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres` |
| `JWT_SECRET` | `rastgele-guclu-bir-anahtar-32-karakter-uzunlugunda` |
| `JWT_EXPIRES_IN` | `7d` |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` (sonra güncelleyeceksiniz) |
| `API_URL` | `https://your-backend.vercel.app` (sonra güncelleyeceksiniz) |

5. "Deploy" tıklayın
6. Deploy tamamlandığında URL'i not alın (örn: `https://menuben-backend.vercel.app`)

### 2.4 Veritabanı Migration
Terminal'de şu komutları çalıştırın:

```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

---

## 📋 Adım 3: Frontend'i Vercel'e Deploy Etme

### 3.1 Frontend Reposu Deploy
1. Vercel'de "Add New" > "Project" tıklayın
2. Aynı repoyu import edin
3. **Root Directory**: `frontend` yazın
4. **Framework Preset**: `Next.js` seçin

### 3.2 Environment Variables (Frontend)
| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://menuben-backend.vercel.app` (backend URL'iniz) |

5. "Deploy" tıklayın
6. Deploy tamamlandığında URL'i not alın (örn: `https://menuben.vercel.app`)

---

## 📋 Adım 4: Backend Environment Güncelleme

1. Vercel'de backend projesine gidin
2. Settings > Environment Variables
3. `FRONTEND_URL` değerini frontend URL'i ile güncelleyin
4. Redeploy yapın

---

## ✅ Adım 5: Test Etme

### 5.1 Backend Health Check
```
https://your-backend.vercel.app/health
```
Yanıt: `{"success": true, "status": "healthy"}`

### 5.2 Frontend
```
https://your-frontend.vercel.app
```

### 5.3 Giriş Bilgileri
- **Email**: admin@benmedya.com
- **Şifre**: Admin123!

---

## 🔧 Sorun Giderme

### Veritabanı Bağlantı Hatası
- Supabase'de IP whitelist kontrol edin (genellikle `0.0.0.0/0` açık olmalı)
- Connection string'deki şifreyi kontrol edin
- `?pgbouncer=true` eklemeyi unutmayın

### CORS Hatası
- Backend'de `FRONTEND_URL` doğru ayarlandığından emin olun
- Vercel'de redeploy yapın

### Migration Hatası
- `DIRECT_URL` environment variable'ı eklediğinizden emin olun
- `npx prisma migrate deploy` komutunu local'de çalıştırın

---

## 📝 Önemli Notlar

1. **Dosya Upload**: Vercel serverless fonksiyonlarında kalıcı dosya sistemi yok. Görseller için Supabase Storage veya Cloudinary kullanın.

2. **Cold Start**: Serverless fonksiyonlar ilk istekte yavaş olabilir (5-10 saniye).

3. **Timeout**: Vercel hobby planında 10 saniye timeout var. Pro plan'da 60 saniye.

4. **Custom Domain**: Vercel Settings > Domains'den özel domain ekleyebilirsiniz.

---

## 🎉 Tebrikler!

Menü Ben sisteminiz artık canlıda! 🚀

- Frontend: https://your-frontend.vercel.app
- Backend API: https://your-backend.vercel.app
- Müşteri Menü: https://your-frontend.vercel.app/menu/[restoran-slug]
