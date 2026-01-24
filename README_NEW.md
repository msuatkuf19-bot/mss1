# 🍽️ BEN Medya - QR Menü Yönetim Sistemi

<div align="center">

<img src="https://img.shields.io/badge/BEN%20Medya-QR%20Menü%20Sistemi-0066FF?style=for-the-badge&logo=qrcode&logoColor=white" alt="BEN Medya Logo"/>

<br/><br/>

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br/>

**🚀 Modern, Ölçeklenebilir, Multi-Tenant Dijital Menü Yönetim Platformu**

*Restoranlar, kafeler, oteller ve tüm işletmeler için profesyonel QR kodlu dijital menü çözümü*

<br/>

[🌐 Canlı Demo](https://qr-menu.benmedya.com) • [📖 Dokümantasyon](#-kurulum) • [🐛 Sorun Bildir](https://github.com/benmedya/qr-menu/issues) • [💬 Destek](mailto:info@benmedya.com)

</div>

---

## 📋 İçindekiler

<details>
<summary>Tıklayarak genişletin</summary>

- [✨ Özellikler](#-özellikler)
- [🖼️ Ekran Görüntüleri](#️-ekran-görüntüleri)
- [🛠️ Teknoloji Stack](#️-teknoloji-stack)
- [📁 Proje Yapısı](#-proje-yapısı)
- [🚀 Hızlı Başlangıç](#-hızlı-başlangıç)
- [⚙️ Konfigürasyon](#️-konfigürasyon)
- [📚 API Dokümantasyonu](#-api-dokümantasyonu)
- [🐳 Docker Deployment](#-docker-deployment)
- [☁️ Cloud Deployment](#️-cloud-deployment)
- [🔒 Güvenlik](#-güvenlik)
- [📊 Performans](#-performans)
- [🔧 Troubleshooting](#-troubleshooting)
- [🤝 Katkıda Bulunma](#-katkıda-bulunma)
- [📜 Lisans](#-lisans)
- [📞 İletişim](#-iletişim)

</details>

---

## ✨ Özellikler

### 🎯 Temel Özellikler

<table>
<tr>
<td width="50%">

#### 🏢 Multi-Tenant Mimari
- Her işletme için izole veri alanı
- Otomatik üye numarası ve slug oluşturma
- İşletme bazlı yetkilendirme

</td>
<td width="50%">

#### 📱 QR Kod Sistemi
- Otomatik QR kod üretimi
- Özelleştirilebilir tasarım
- PNG/SVG formatında indirme

</td>
</tr>
<tr>
<td width="50%">

#### ⚡ Gerçek Zamanlı
- Anlık menü güncellemeleri
- Canlı görüntüleme istatistikleri
- Aktif durum yönetimi

</td>
<td width="50%">

#### 🎨 Modern UI/UX
- Responsive tasarım
- Smooth animasyonlar
- Dark/Light tema desteği

</td>
</tr>
<tr>
<td width="50%">

#### 🔐 Gelişmiş Güvenlik
- JWT tabanlı kimlik doğrulama
- Role-Based Access Control (RBAC)
- Rate limiting & CORS koruması

</td>
<td width="50%">

#### 📈 Analytics Dashboard
- Görüntüleme istatistikleri
- Popüler ürün analizi
- Zaman bazlı raporlar

</td>
</tr>
</table>

### 👑 Süper Admin Paneli

```
✅ Tüm işletmeleri görüntüleme ve yönetme
✅ Yeni işletme ve kullanıcı oluşturma
✅ Otomatik üye numarası, slug ve QR kod oluşturma
✅ Üyelik başlangıç/bitiş tarihi yönetimi
✅ İşletme tipi seçimi (Restoran/Kafe/Otel/Bar/Pastane)
✅ Platform geneli istatistikler ve raporlar
✅ E-posta bildirim sistemi yönetimi
✅ Demo talep yönetimi ve CRM entegrasyonu
```

### 🏪 İşletme Admin Paneli

```
✅ Kendi işletmesine özel yönetim paneli
✅ Menü kategorileri ve ürün yönetimi
✅ Ürün görselleri (Cloudinary entegrasyonu)
✅ Fiyat ve açıklama düzenleme
✅ QR kod özelleştirme ve indirme
✅ Görüntüleme raporları
✅ İşletme bilgileri ve logo yönetimi
✅ Çalışma saatleri ve iletişim bilgileri
```

### 👥 Müşteri Deneyimi

```
✅ QR kod ile anında menü erişimi
✅ Ultra hızlı mobil menü görüntüleme
✅ Kategorilere göre filtreleme
✅ Ürün arama ve detay görüntüleme
✅ Alerjen ve besin bilgisi gösterimi
✅ Sosyal medya paylaşım linkleri
✅ İşletme konum ve iletişim bilgileri
```

---

## 🖼️ Ekran Görüntüleri

<div align="center">
<table>
<tr>
<td align="center"><b>📱 Mobil Menü</b></td>
<td align="center"><b>👑 Admin Panel</b></td>
<td align="center"><b>📊 Analytics</b></td>
</tr>
<tr>
<td><img src="docs/screenshots/mobile-menu.png" alt="Mobil Menü" width="200"/></td>
<td><img src="docs/screenshots/admin-panel.png" alt="Admin Panel" width="300"/></td>
<td><img src="docs/screenshots/analytics.png" alt="Analytics" width="300"/></td>
</tr>
</table>
</div>

---

## 🛠️ Teknoloji Stack

### Backend

| Teknoloji | Versiyon | Açıklama |
|:---------:|:--------:|:---------|
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) | 20.x | JavaScript Runtime |
| ![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white) | 4.18 | Web Framework |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | 5.3 | Type Safety |
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) | 15+ | Veritabanı |
| ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white) | 5.22 | ORM |
| ![JWT](https://img.shields.io/badge/-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) | 9.0 | Authentication |

### Frontend

| Teknoloji | Versiyon | Açıklama |
|:---------:|:--------:|:---------|
| ![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white) | 14.0 | React Framework (App Router) |
| ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) | 18.2 | UI Library |
| ![Tailwind](https://img.shields.io/badge/-Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | 3.4 | CSS Framework |
| ![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=flat-square&logo=reactquery&logoColor=white) | 5.14 | Server State Management |
| ![Zustand](https://img.shields.io/badge/-Zustand-443E38?style=flat-square) | 4.4 | Client State |
| ![Framer Motion](https://img.shields.io/badge/-Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white) | 12.x | Animations |

### DevOps & Servisler

| Servis | Açıklama |
|:------:|:---------|
| 🐳 **Docker** | Container Platform |
| 🚂 **Railway** | Backend Hosting |
| ▲ **Vercel** | Frontend Hosting |
| 🐘 **Neon** | Serverless PostgreSQL |
| ☁️ **Cloudinary** | Görsel CDN & Optimization |
| 📧 **Nodemailer** | E-posta Servisi |

---

## 📁 Proje Yapısı

```
ben medya qr menü/
│
├── 📂 backend/                      # Express.js Backend API
│   ├── 📂 prisma/
│   │   ├── 📄 schema.prisma         # Veritabanı şeması
│   │   └── 📄 seed.ts               # Demo veri seed
│   ├── 📂 src/
│   │   ├── 📂 config/               # Konfigürasyon (DB, Cloudinary, etc.)
│   │   ├── 📂 controllers/          # API Controller'ları
│   │   ├── 📂 middlewares/          # Auth, CORS, Rate Limiter
│   │   ├── 📂 routes/               # Express Route tanımları
│   │   ├── 📂 services/             # İş mantığı katmanı
│   │   ├── 📂 types/                # TypeScript tip tanımları
│   │   ├── 📂 utils/                # Yardımcı fonksiyonlar
│   │   └── 📄 server.ts             # Ana sunucu dosyası
│   ├── 📄 Dockerfile                # Docker build config
│   ├── 📄 package.json
│   └── 📄 tsconfig.json
│
├── 📂 frontend/                     # Next.js 14 Frontend
│   ├── 📂 public/                   # Statik dosyalar
│   ├── 📂 src/
│   │   ├── 📂 app/                  # Next.js App Router
│   │   │   ├── 📂 admin/            # Admin panel sayfaları
│   │   │   ├── 📂 auth/             # Giriş/Kayıt sayfaları
│   │   │   ├── 📂 menu/             # Müşteri menü sayfaları
│   │   │   └── 📄 layout.tsx        # Root layout
│   │   ├── 📂 components/           # React bileşenleri
│   │   ├── 📂 hooks/                # Custom React hooks
│   │   ├── 📂 lib/                  # API client, utilities
│   │   ├── 📂 store/                # Zustand state store
│   │   ├── 📂 types/                # TypeScript tipleri
│   │   └── 📂 utils/                # Helper fonksiyonlar
│   ├── 📄 Dockerfile
│   ├── 📄 next.config.js
│   ├── 📄 tailwind.config.js
│   └── 📄 package.json
│
├── 📂 docs/                         # Dokümantasyon
├── 📄 docker-compose.yml            # Docker Compose config
├── 📄 package.json                  # Root monorepo config
└── 📄 README.md                     # Bu dosya
```

---

## 🚀 Hızlı Başlangıç

### Sistem Gereksinimleri

| Araç | Versiyon | Kontrol Komutu |
|------|----------|----------------|
| Node.js | 20.x+ | `node --version` |
| npm | 10.x+ | `npm --version` |
| PostgreSQL | 15+ | `psql --version` |
| Git | 2.x+ | `git --version` |

### 📥 1. Projeyi Klonlayın

```bash
git clone https://github.com/benmedya/qr-menu-system.git
cd qr-menu-system
```

### 📦 2. Bağımlılıkları Yükleyin

```bash
# Root bağımlılıkları
npm install

# Backend bağımlılıkları
cd backend && npm install && cd ..

# Frontend bağımlılıkları
cd frontend && npm install && cd ..
```

Veya PowerShell script ile:

```powershell
.\setup.ps1
```

### ⚙️ 3. Environment Dosyalarını Oluşturun

**Backend** (`backend/.env`):

```env
# 🗄️ Database
DATABASE_URL="postgresql://qrmenu:qrmenu123@localhost:5432/qr_menu_db"
DIRECT_URL="postgresql://qrmenu:qrmenu123@localhost:5432/qr_menu_db"

# 🔐 JWT
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"

# 🖥️ Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# ☁️ Cloudinary (Görsel Yönetimi - Opsiyonel)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# 📧 Email (SMTP - Opsiyonel)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
```

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME="BEN Medya QR Menü"
```

### 🗄️ 4. Veritabanını Hazırlayın

```bash
cd backend

# Prisma migration çalıştır
npm run prisma:migrate

# Prisma Client oluştur
npm run prisma:generate

# Demo veri yükle (opsiyonel)
npm run prisma:seed

cd ..
```

### 🚀 5. Geliştirme Sunucusunu Başlatın

```bash
# Her iki servisi aynı anda başlat
npm run dev
```

| Servis | URL | Açıklama |
|--------|-----|----------|
| 🌐 Frontend | http://localhost:3000 | Next.js UI |
| 🔧 Backend API | http://localhost:5000 | Express API |
| 📊 Prisma Studio | `npm run prisma:studio` | DB GUI |

### 🔑 Demo Hesapları

| Rol | Email | Şifre | Erişim |
|-----|-------|-------|--------|
| 👑 Süper Admin | `admin@qrmenu.com` | `admin123` | Tüm sistem |
| 🏪 Restoran Admin | `restaurant1@example.com` | `password123` | Kendi işletmesi |

---

## ⚙️ Konfigürasyon

### Backend Environment Variables

| Değişken | Zorunlu | Açıklama | Örnek |
|----------|:-------:|----------|-------|
| `DATABASE_URL` | ✅ | PostgreSQL bağlantı URL | `postgresql://user:pass@host:5432/db` |
| `DIRECT_URL` | ✅ | Direct DB bağlantı (Neon için) | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | ✅ | JWT imzalama anahtarı (min 32 char) | `your-secret-key...` |
| `PORT` | ❌ | API sunucu portu | `5000` |
| `NODE_ENV` | ❌ | Ortam değişkeni | `development` / `production` |
| `CORS_ORIGIN` | ❌ | İzin verilen origin | `http://localhost:3000` |
| `CLOUDINARY_CLOUD_NAME` | ❌ | Cloudinary hesap adı | `my-cloud` |
| `CLOUDINARY_API_KEY` | ❌ | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | ❌ | Cloudinary API secret | `abc123...` |

### Frontend Environment Variables

| Değişken | Zorunlu | Açıklama | Örnek |
|----------|:-------:|----------|-------|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API URL | `http://localhost:5000` |
| `NEXT_PUBLIC_APP_NAME` | ❌ | Uygulama adı | `BEN Medya QR Menü` |

---

## 📚 API Dokümantasyonu

### 🔐 Authentication

<details>
<summary><code>POST /api/auth/login</code> - Kullanıcı Girişi</summary>

**Request:**
```json
{
  "email": "admin@qrmenu.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "name": "Admin",
      "email": "admin@qrmenu.com",
      "role": "SUPER_ADMIN"
    }
  }
}
```
</details>

<details>
<summary><code>POST /api/auth/register</code> - Yeni Kullanıcı Kaydı</summary>

**Request:**
```json
{
  "name": "İşletme Sahibi",
  "email": "owner@restaurant.com",
  "password": "password123"
}
```
</details>

### 🏪 Restoranlar

<details>
<summary><code>GET /api/restaurants</code> - Tüm Restoranları Listele</summary>

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "memberNumber": "BM-0001",
      "name": "Lezzet Durağı",
      "slug": "lezzet-duragi",
      "businessType": "RESTORAN",
      "isActive": true
    }
  ]
}
```
</details>

<details>
<summary><code>POST /api/admin/restaurants</code> - Yeni Restoran Oluştur (Super Admin)</summary>

**Request:**
```json
{
  "businessType": "RESTORAN",
  "name": "Lezzet Durağı",
  "email": "info@lezzetduragi.com",
  "phone": "+90 555 123 4567",
  "address": "İstanbul, Türkiye",
  "membershipStartDate": "2026-01-01",
  "membershipEndDate": "2027-01-01",
  "ownerName": "Ahmet Yılmaz",
  "ownerEmail": "ahmet@lezzetduragi.com",
  "ownerPassword": "secure123"
}
```
</details>

### 🍔 Menü Yönetimi

<details>
<summary><code>GET /api/menu/categories</code> - Kategorileri Listele</summary>

**Query Parameters:**
- `restaurantId` - Restoran UUID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Ana Yemekler",
      "description": "Nefis ana yemek seçenekleri",
      "order": 1,
      "products": []
    }
  ]
}
```
</details>

<details>
<summary><code>POST /api/menu/categories</code> - Yeni Kategori Oluştur</summary>

**Request:**
```json
{
  "name": "Ana Yemekler",
  "description": "Nefis ana yemek seçenekleri",
  "order": 1
}
```
</details>

<details>
<summary><code>POST /api/menu/products</code> - Yeni Ürün Oluştur</summary>

**Request (multipart/form-data):**
```json
{
  "name": "Izgara Köfte",
  "description": "Özel baharatlarla hazırlanmış köfte",
  "price": 89.90,
  "categoryId": "category-uuid",
  "image": "[file]"
}
```
</details>

### 📱 QR Kod & Public API

<details>
<summary><code>GET /api/qr/:restaurantId</code> - QR Kod Oluştur/Getir</summary>

**Response:**
```json
{
  "success": true,
  "data": {
    "qrCode": "base64-encoded-png",
    "menuUrl": "https://menu.benmedya.com/lezzet-duragi"
  }
}
```
</details>

<details>
<summary><code>GET /api/public/menu/:slug</code> - Public Menü (Üyelik Kontrolü)</summary>

**Response:**
```json
{
  "success": true,
  "data": {
    "restaurant": {
      "name": "Lezzet Durağı",
      "logo": "https://...",
      "description": "..."
    },
    "categories": [],
    "membershipValid": true
  }
}
```
</details>

---

## 🐳 Docker Deployment

### Tek Komutla Başlatma

```bash
docker-compose up -d
```

### Docker Compose Yapılandırması

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: qrmenu-db
    environment:
      POSTGRES_DB: qr_menu_db
      POSTGRES_USER: qrmenu
      POSTGRES_PASSWORD: qrmenu123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U qrmenu"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    container_name: qrmenu-backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://qrmenu:qrmenu123@postgres:5432/qr_menu_db
      - JWT_SECRET=docker-jwt-secret-key-32-characters
      - NODE_ENV=production
      - CORS_ORIGIN=http://localhost:3000
    depends_on:
      postgres:
        condition: service_healthy

  frontend:
    build: ./frontend
    container_name: qrmenu-frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Docker Komutları

```bash
# Tüm servisleri başlat
docker-compose up -d

# Logları izle
docker-compose logs -f

# Belirli servis logları
docker-compose logs -f backend

# Servisleri yeniden başlat
docker-compose restart

# Servisleri durdur
docker-compose down

# Servisleri ve volume'ları sil
docker-compose down -v
```

---

## ☁️ Cloud Deployment

### 🚂 Railway (Backend)

1. [Railway](https://railway.app) hesabı oluşturun
2. GitHub repo'nuzu bağlayın
3. Environment variables ekleyin
4. Deploy!

```bash
# Railway CLI ile
npm install -g @railway/cli
railway login
railway init
railway up
```

📖 Detaylı rehber: [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)

### ▲ Vercel (Frontend)

1. [Vercel](https://vercel.com) hesabı oluşturun
2. GitHub repo'nuzu import edin
3. Root directory: `frontend`
4. Environment variables ekleyin

```bash
# Vercel CLI ile
npm install -g vercel
cd frontend
vercel --prod
```

📖 Detaylı rehber: [FRONTEND_DEPLOY_GUIDE.md](FRONTEND_DEPLOY_GUIDE.md)

### 🐘 Neon (PostgreSQL)

1. [Neon](https://neon.tech) hesabı oluşturun
2. Yeni proje oluşturun
3. Connection string'i kopyalayın
4. `DATABASE_URL` ve `DIRECT_URL` olarak ekleyin

📖 Detaylı rehber: [NEON_DEPLOYMENT_GUIDE.md](NEON_DEPLOYMENT_GUIDE.md)

### ☁️ Cloudinary (Görsel CDN)

1. [Cloudinary](https://cloudinary.com) hesabı oluşturun
2. Dashboard'dan API credentials alın
3. Environment variables'a ekleyin

📖 Detaylı rehber: [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md)

---

## 🔒 Güvenlik

| Özellik | Uygulama | Açıklama |
|---------|----------|----------|
| 🔐 **JWT Auth** | jsonwebtoken | 7 gün geçerli token |
| 👤 **RBAC** | Custom middleware | SUPER_ADMIN, RESTAURANT_ADMIN, USER |
| 🔑 **Password** | bcrypt (12 rounds) | Güvenli şifre hashleme |
| 🛡️ **Rate Limit** | express-rate-limit | 100 istek/dakika/IP |
| 🌐 **CORS** | cors | Whitelist origin |
| 🪖 **Helmet** | helmet | HTTP güvenlik headers |
| 💉 **SQL Injection** | Prisma ORM | Parameterized queries |
| ⚔️ **XSS** | CSP | Content Security Policy |
| 📁 **File Upload** | multer | Tip & boyut validasyonu |
| 🔒 **HTTPS** | Production | SSL/TLS encryption |

---

## 📊 Performans

### Backend Metrikleri

| Metrik | Hedef | Durum |
|--------|-------|:-----:|
| API Response Time | < 200ms | ✅ |
| Database Query | < 50ms | ✅ |
| Throughput | 1000 req/s | ✅ |
| Memory Usage | < 256MB | ✅ |

### Frontend Metrikleri (Lighthouse)

| Metrik | Hedef | Durum |
|--------|-------|:-----:|
| Performance | > 90 | ✅ |
| Accessibility | > 95 | ✅ |
| Best Practices | > 90 | ✅ |
| SEO | > 90 | ✅ |
| First Contentful Paint | < 1.5s | ✅ |
| Largest Contentful Paint | < 2.5s | ✅ |
| Time to Interactive | < 3s | ✅ |

### Optimizasyon Stratejileri

- 📦 Next.js Image optimization
- 🗜️ Gzip/Brotli compression
- 📄 Static page generation
- 🔄 React Query caching
- 📊 Prisma query optimization
- 🖼️ Cloudinary image CDN

---

## 🔧 Troubleshooting

### ❌ Sık Karşılaşılan Hatalar

<details>
<summary><b>🔴 Database bağlantı hatası</b></summary>

```bash
# PostgreSQL servisini kontrol et
pg_ctl status

# Bağlantı string'ini doğrula
echo $DATABASE_URL

# Prisma bağlantısını test et
cd backend
npx prisma db pull
```
</details>

<details>
<summary><b>🔴 Port kullanımda hatası (Windows)</b></summary>

```powershell
# Port kullanan process'i bul
netstat -ano | findstr :3000

# Process'i sonlandır
taskkill /PID <PID> /F
```
</details>

<details>
<summary><b>🔴 Port kullanımda hatası (Linux/Mac)</b></summary>

```bash
# Port kullanan process'i bul
lsof -i :3000

# Process'i sonlandır
kill -9 <PID>
```
</details>

<details>
<summary><b>🔴 Prisma migration hatası</b></summary>

```bash
cd backend

# Veritabanını sıfırla (DİKKAT: Veriler silinir!)
npx prisma migrate reset

# Migration'ı yeniden çalıştır
npm run prisma:migrate

# Demo veri yükle
npm run prisma:seed
```
</details>

<details>
<summary><b>🔴 npm install hatası</b></summary>

```bash
# Cache temizle
npm cache clean --force

# node_modules sil
rm -rf node_modules package-lock.json

# Yeniden yükle
npm install
```
</details>

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! 🎉

### Katkı Adımları

1. 🍴 Repository'yi fork edin
2. 🌿 Feature branch oluşturun
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. 💾 Değişikliklerinizi commit edin
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. 📤 Branch'i push edin
   ```bash
   git push origin feature/amazing-feature
   ```
5. 🔄 Pull Request açın

### Commit Mesaj Kuralları

| Prefix | Açıklama | Örnek |
|--------|----------|-------|
| `feat:` | Yeni özellik | `feat: add dark mode support` |
| `fix:` | Hata düzeltme | `fix: resolve login issue` |
| `docs:` | Dokümantasyon | `docs: update README` |
| `style:` | Kod formatı | `style: fix indentation` |
| `refactor:` | Kod yeniden yapılandırma | `refactor: simplify auth logic` |
| `test:` | Test ekleme | `test: add unit tests` |
| `chore:` | Genel bakım | `chore: update dependencies` |
| `perf:` | Performans | `perf: optimize image loading` |

---

## 📜 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır.

```
MIT License

Copyright (c) 2024-2026 BEN Medya

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 📞 İletişim

<div align="center">

| Platform | Link |
|:--------:|:----:|
| 🌐 **Website** | [benmedya.com](https://benmedya.com) |
| 📧 **Email** | [info@benmedya.com](mailto:info@benmedya.com) |
| 🐙 **GitHub** | [github.com/benmedya](https://github.com/benmedya) |
| 💼 **LinkedIn** | [linkedin.com/company/benmedya](https://linkedin.com/company/benmedya) |

<br/>

---

<br/>

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın! ⭐**

<br/>

<sub>Made with ❤️ by <b>BEN Medya</b> Team | © 2024-2026</sub>

</div>
