# 🍽️ BEN Medya - QR Menü Yönetim Sistemi

<div align="center">

![BEN Medya Logo](https://img.shields.io/badge/BEN%20Medya-QR%20Men%C3%BC%20Sistemi-FF6B35?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xOSAzSDVjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJWNWMwLTEuMS0uOS0yLTItMnptLTUgMTRIN3YtMmg3djJ6bTMtNEg3di0yaDEwdjJ6bTAtNEg3VjdoMTB2MnoiLz48L3N2Zz4=)

### 🚀 Modern, Ölçeklenebilir, Multi-Tenant Dijital Menü Platformu

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

*Restoranlar, kafeler, oteller ve gıda işletmeleri için profesyonel QR kodlu dijital menü çözümü*

---

[📖 Dokümantasyon](#-kurulum) • [🎯 Özellikler](#-özellikler) • [🔧 API](#-api-dokümantasyonu) • [🚀 Deployment](#%EF%B8%8F-deployment) • [🐛 Sorun Bildir](https://github.com/benmedya/qr-menu/issues)

</div>

---

## 📑 İçindekiler

- [✨ Özellikler](#-özellikler)
  - [Ana Özellikler](#-ana-özellikler)
  - [Süper Admin Paneli](#-süper-admin-paneli)
  - [İşletme Admin Paneli](#-işletme-admin-paneli)
  - [Müşteri Deneyimi](#-müşteri-deneyimi)
  - [CRM ve Demo Yönetimi](#-crm-ve-demo-yönetimi)
- [🛠️ Teknoloji Stack](#%EF%B8%8F-teknoloji-stack)
- [📁 Proje Mimarisi](#-proje-mimarisi)
- [🚀 Kurulum](#-kurulum)
  - [Ön Koşullar](#ön-koşullar)
  - [Hızlı Başlangıç](#hızlı-başlangıç)
  - [Manuel Kurulum](#manuel-kurulum)
  - [Docker ile Kurulum](#docker-ile-kurulum)
- [⚙️ Konfigürasyon](#%EF%B8%8F-konfigürasyon)
- [📊 Veritabanı Şeması](#-veritabanı-şeması)
- [📚 API Dokümantasyonu](#-api-dokümantasyonu)
- [☁️ Deployment](#%EF%B8%8F-deployment)
- [🔒 Güvenlik](#-güvenlik)
- [📈 Performans Optimizasyonu](#-performans-optimizasyonu)
- [🧪 Test](#-test)
- [🔧 Troubleshooting](#-troubleshooting)
- [🗺️ Yol Haritası](#%EF%B8%8F-yol-haritası)
- [🤝 Katkıda Bulunma](#-katkıda-bulunma)
- [📜 Lisans](#-lisans)
- [📞 İletişim](#-i̇letişim)

---

## ✨ Özellikler

### 🎯 Ana Özellikler

| Özellik | Açıklama | Durum |
|---------|----------|-------|
| 🏢 **Multi-Tenant Mimari** | Her işletme izole veri alanına sahip | ✅ |
| 📱 **QR Kod Entegrasyonu** | Otomatik QR üretimi, PDF indirme, özelleştirme | ✅ |
| ⚡ **Gerçek Zamanlı Güncelleme** | Anlık menü değişiklikleri, sıfır downtime | ✅ |
| 🎨 **Responsive Design** | Mobil-first, tablet ve masaüstü uyumlu | ✅ |
| 🔐 **Rol Bazlı Erişim (RBAC)** | Süper Admin, Restoran Admin, Müşteri | ✅ |
| 📈 **Analytics Dashboard** | Görüntüleme, QR tarama, ürün istatistikleri | ✅ |
| 🖼️ **Cloudinary CDN** | Profesyonel görsel yönetimi ve optimizasyon | ✅ |
| 🌍 **Çoklu Dil Desteği** | Türkçe ve İngilizce | ✅ |
| 📧 **Email Sistemi** | Otomatik bildirimler ve raporlar | ✅ |
| 💼 **CRM Modülü** | Demo talep ve müşteri takip sistemi | ✅ |
| 📅 **Üyelik Yönetimi** | Başlangıç/bitiş tarihi, süspansiyon | ✅ |
| 🎨 **Tema Özelleştirme** | İşletmeye özel renk ve tasarım | ✅ |

---

### 👑 Süper Admin Paneli

```
┌─────────────────────────────────────────────────────────────────┐
│                    🔑 SÜPER ADMİN YETKİLERİ                     │
├─────────────────────────────────────────────────────────────────┤
│  ✅ Tüm işletmeleri görüntüleme, düzenleme ve silme             │
│  ✅ Yeni işletme oluşturma (otomatik üye no, slug, QR kod)      │
│  ✅ Kullanıcı yönetimi ve yetkilendirme                         │
│  ✅ Platform geneli istatistikler ve raporlar                   │
│  ✅ Üyelik yönetimi (ACTIVE/EXPIRED/SUSPENDED)                  │
│  ✅ İşletme tipi seçimi (Restoran/Kafe/Otel/Diğer)             │
│  ✅ Demo talep CRM yönetimi                                     │
│  ✅ Potansiyel müşteri takibi (HIGH_PROBABILITY/LONG_TERM)      │
│  ✅ Global analytics ve performans metrikleri                   │
│  ✅ Sistem logları ve hata takibi                               │
└─────────────────────────────────────────────────────────────────┘
```

---

### 🏪 İşletme Admin Paneli

```
┌─────────────────────────────────────────────────────────────────┐
│                  🏢 İŞLETME ADMİN PANELİ                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📂 KATEGORİ YÖNETİMİ              📦 ÜRÜN YÖNETİMİ             │
│  ├─ Kategori ekleme/düzenleme     ├─ Ürün ekleme/düzenleme     │
│  ├─ Sıralama (drag & drop)        ├─ Fiyat ve açıklama         │
│  ├─ Görsel yükleme                ├─ Görsel yükleme            │
│  └─ Aktif/pasif durumu            ├─ Yeni/Popüler badge        │
│                                   ├─ İndirim yönetimi          │
│  📊 ANALİTİKLER                   ├─ Alerjen ve içerik         │
│  ├─ Günlük/haftalık görüntüleme   └─ Vegan/Vejetaryen etiket   │
│  ├─ En popüler ürünler                                         │
│  ├─ QR tarama istatistikleri      ⚙️ AYARLAR                   │
│  └─ Grafik raporlar               ├─ İşletme bilgileri         │
│                                   ├─ Logo ve header görseli    │
│  📱 QR KOD                        ├─ Çalışma saatleri          │
│  ├─ Otomatik QR üretimi           ├─ Sosyal medya linkleri     │
│  ├─ PDF indirme                   ├─ Tema rengi                │
│  └─ Masa numarası ekleme          └─ Google Maps entegrasyonu  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 👥 Müşteri Deneyimi

```
┌─────────────────────────────────────────────────────────────────┐
│                    📱 MÜŞTERİ DENEYİMİ                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📷 QR Kod Tarama                                               │
│      ↓                                                          │
│  🌐 Mobil Responsive Menü Görüntüleme                           │
│      ↓                                                          │
│  ┌───────────────────────────────────────────┐                  │
│  │  🔍 Arama özelliği                        │                  │
│  │  📂 Kategorilere göre filtreleme          │                  │
│  │  🏷️ Yeni/Popüler/İndirimli ürün etiketleri│                  │
│  │  📸 Yüksek kaliteli ürün görselleri       │                  │
│  │  ℹ️ Alerjen ve besin bilgileri            │                  │
│  │  🌱 Vegan/Vejetaryen filtreleri           │                  │
│  │  ⏰ Çalışma saatleri görüntüleme          │                  │
│  │  📍 Konum ve iletişim bilgileri           │                  │
│  │  🎨 Smooth animasyonlar                   │                  │
│  │  ⚡ Hızlı yükleme süreleri (<2s)          │                  │
│  └───────────────────────────────────────────┘                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 💼 CRM ve Demo Yönetimi

| Özellik | Açıklama |
|---------|----------|
| 📝 **Demo Talep Formu** | Web sitesinden demo talep toplama |
| 📊 **Potansiyel Takibi** | HIGH_PROBABILITY, LONG_TERM, EVALUATING durumları |
| 📅 **Takip Tarihi** | Otomatik hatırlatmalar |
| 📝 **Satış Notları** | Her müşteri için detaylı notlar |
| 📧 **Email Bildirimleri** | Yeni demo talebi otomatik bildirim |
| 📈 **Dönüşüm Takibi** | Demo'dan müşteriye dönüşüm oranları |

---

## 🛠️ Teknoloji Stack

### Backend Teknolojileri

| Teknoloji | Versiyon | Kullanım Alanı |
|-----------|----------|----------------|
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) | 20.x | JavaScript Runtime |
| ![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white) | 4.18 | Web Framework |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | 5.3 | Type-safe JavaScript |
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) | 15+ | İlişkisel Veritabanı |
| ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white) | 5.22 | Next-gen ORM |
| ![JWT](https://img.shields.io/badge/-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) | 9.0 | Authentication |
| ![Multer](https://img.shields.io/badge/-Multer-FF6B6B?style=flat-square) | 1.4 | Dosya Yükleme |
| ![Sharp](https://img.shields.io/badge/-Sharp-99CC00?style=flat-square) | 0.33 | Görsel İşleme |
| ![QRCode](https://img.shields.io/badge/-QRCode-000000?style=flat-square) | 1.5 | QR Kod Üretimi |
| ![Nodemailer](https://img.shields.io/badge/-Nodemailer-22B573?style=flat-square) | 6.10 | Email Gönderimi |
| ![Helmet](https://img.shields.io/badge/-Helmet-7B68EE?style=flat-square) | 7.1 | Güvenlik Headers |

### Frontend Teknolojileri

| Teknoloji | Versiyon | Kullanım Alanı |
|-----------|----------|----------------|
| ![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white) | 14.0 | React Meta Framework |
| ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) | 18.2 | UI Library |
| ![Tailwind](https://img.shields.io/badge/-Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | 3.4 | Utility-first CSS |
| ![React Query](https://img.shields.io/badge/-TanStack%20Query-FF4154?style=flat-square&logo=reactquery&logoColor=white) | 5.14 | Server State Management |
| ![Zustand](https://img.shields.io/badge/-Zustand-FFD43B?style=flat-square) | 4.4 | Client State |
| ![Framer Motion](https://img.shields.io/badge/-Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white) | 12.x | Animasyonlar |
| ![React Hook Form](https://img.shields.io/badge/-React%20Hook%20Form-EC5990?style=flat-square) | 7.49 | Form Yönetimi |
| ![Zod](https://img.shields.io/badge/-Zod-3068B7?style=flat-square) | 3.22 | Şema Validasyonu |
| ![Axios](https://img.shields.io/badge/-Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) | 1.6 | HTTP Client |
| ![Recharts](https://img.shields.io/badge/-Recharts-22B5BF?style=flat-square) | 2.10 | Grafikler |
| ![Lucide](https://img.shields.io/badge/-Lucide-F56565?style=flat-square) | 0.303 | İkonlar |

### DevOps & Bulut Servisleri

| Servis | Kullanım |
|--------|----------|
| 🐳 **Docker** | Container Platform |
| 🚂 **Railway** | Backend Hosting |
| ▲ **Vercel** | Frontend Hosting |
| 🐘 **Neon** | Serverless PostgreSQL |
| ☁️ **Cloudinary** | Görsel CDN & Optimizasyon |
| 📧 **Resend** | Transactional Email |

---

## 📁 Proje Mimarisi

```
ben medya qr menü/
│
├── 📁 backend/                           # Express.js Backend API
│   ├── 📁 prisma/
│   │   ├── 📄 schema.prisma             # Veritabanı şeması
│   │   ├── 📄 seed.ts                   # Demo veri yükleme
│   │   └── 📁 migrations/               # Veritabanı migrasyonları
│   │
│   ├── 📁 src/
│   │   ├── 📁 config/                   # Uygulama konfigürasyonları
│   │   │   ├── 📄 index.ts              # Environment variables
│   │   │   ├── 📄 prisma.ts             # Prisma client instance
│   │   │   └── 📄 security.ts           # Güvenlik ayarları
│   │   │
│   │   ├── 📁 controllers/              # Request handlers
│   │   │   ├── 📄 auth.controller.ts    # Authentication
│   │   │   ├── 📄 restaurant.controller.ts
│   │   │   ├── 📄 menu.controller.ts
│   │   │   ├── 📄 qr.controller.ts
│   │   │   └── 📄 analytics.controller.ts
│   │   │
│   │   ├── 📁 middlewares/              # Express middlewares
│   │   │   ├── 📄 auth.middleware.ts    # JWT doğrulama
│   │   │   ├── 📄 error.middleware.ts   # Hata yakalama
│   │   │   ├── 📄 logger.middleware.ts  # Logging
│   │   │   └── 📄 sanitize.middleware.ts# XSS koruması
│   │   │
│   │   ├── 📁 routes/                   # API route tanımları
│   │   │   ├── 📄 auth.routes.ts
│   │   │   ├── 📄 restaurant.routes.ts
│   │   │   ├── 📄 menu.routes.ts
│   │   │   ├── 📄 qr.routes.ts
│   │   │   ├── 📄 public.routes.ts
│   │   │   ├── 📄 analytics.routes.ts
│   │   │   ├── 📄 upload.routes.ts
│   │   │   ├── 📄 demo-requests.routes.ts
│   │   │   ├── 📄 health.routes.ts
│   │   │   └── 📄 membership.routes.ts
│   │   │
│   │   ├── 📁 services/                 # İş mantığı
│   │   │   ├── 📄 auth.service.ts
│   │   │   ├── 📄 qr.service.ts
│   │   │   ├── 📄 email.service.ts
│   │   │   └── 📄 logger.service.ts
│   │   │
│   │   ├── 📁 types/                    # TypeScript type tanımları
│   │   ├── 📁 utils/                    # Yardımcı fonksiyonlar
│   │   └── 📄 server.ts                 # Express app entry point
│   │
│   ├── 📁 uploads/                      # Yüklenen dosyalar (geçici)
│   ├── 📁 logs/                         # Uygulama logları
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   └── 📄 tsconfig.json
│
├── 📁 frontend/                          # Next.js Frontend
│   ├── 📁 public/                       # Statik dosyalar
│   │
│   ├── 📁 src/
│   │   ├── 📁 app/                      # Next.js App Router
│   │   │   ├── 📁 admin/                # Admin panel sayfaları
│   │   │   │   ├── 📁 dashboard/
│   │   │   │   ├── 📁 restaurants/
│   │   │   │   ├── 📁 categories/
│   │   │   │   ├── 📁 products/
│   │   │   │   ├── 📁 qr/
│   │   │   │   ├── 📁 analytics/
│   │   │   │   └── 📁 demo-requests/    # CRM modülü
│   │   │   │
│   │   │   ├── 📁 auth/                 # Authentication sayfaları
│   │   │   │   ├── 📁 login/
│   │   │   │   └── 📁 register/
│   │   │   │
│   │   │   ├── 📁 menu/[slug]/          # Public menü sayfası
│   │   │   ├── 📁 m/[slug]/             # Kısa menü URL
│   │   │   ├── 📁 demo/                 # Demo talep formu
│   │   │   ├── 📁 api/                  # Next.js API routes
│   │   │   ├── 📄 layout.tsx            # Root layout
│   │   │   └── 📄 page.tsx              # Ana sayfa
│   │   │
│   │   ├── 📁 components/               # React bileşenleri
│   │   │   ├── 📁 ui/                   # Temel UI bileşenleri
│   │   │   ├── 📁 admin/                # Admin bileşenleri
│   │   │   ├── 📁 menu/                 # Menü bileşenleri
│   │   │   └── 📁 common/               # Ortak bileşenler
│   │   │
│   │   ├── 📁 hooks/                    # Custom React hooks
│   │   ├── 📁 lib/                      # Kütüphane konfigürasyonları
│   │   ├── 📁 store/                    # Zustand state yönetimi
│   │   ├── 📁 types/                    # TypeScript tipleri
│   │   └── 📁 utils/                    # Yardımcı fonksiyonlar
│   │
│   ├── 📄 Dockerfile
│   ├── 📄 next.config.js
│   ├── 📄 tailwind.config.js
│   ├── 📄 tsconfig.json
│   └── 📄 package.json
│
├── 📄 docker-compose.yml                 # Docker Compose konfigürasyonu
├── 📄 package.json                       # Root monorepo package.json
├── 📄 railway.json                       # Railway deployment config
├── 📄 README.md                          # Dokümantasyon
│
└── 📁 docs/                              # Ek dokümantasyonlar
    ├── 📄 CLOUDINARY_SETUP.md
    ├── 📄 RAILWAY_DEPLOYMENT.md
    ├── 📄 NEON_DEPLOYMENT_GUIDE.md
    └── 📄 API_TEST_GUIDE.md
```

---

## 🚀 Kurulum

### Ön Koşullar

| Gereksinim | Minimum Versiyon | İndirme |
|------------|------------------|---------|
| Node.js | 20.x | [nodejs.org](https://nodejs.org/) |
| PostgreSQL | 15+ | [postgresql.org](https://www.postgresql.org/download/) |
| npm/yarn | 9.x / 1.22+ | Node.js ile gelir |
| Git | 2.x | [git-scm.com](https://git-scm.com/) |

### Hızlı Başlangıç (PowerShell)

```powershell
# 1. Projeyi klonlayın
git clone https://github.com/benmedya/qr-menu-system.git
cd "ben medya qr menü"

# 2. Otomatik kurulum script'ini çalıştırın
.\quick-setup.ps1
```

### Manuel Kurulum

#### 1️⃣ Bağımlılıkları Yükleyin

```powershell
# Root bağımlılıkları
npm install

# Backend bağımlılıkları
cd backend
npm install
cd ..

# Frontend bağımlılıkları
cd frontend
npm install
cd ..
```

#### 2️⃣ Environment Dosyalarını Oluşturun

**Backend `.env` dosyası:**

```env
# ═══════════════════════════════════════════════════════════════
# 🔗 DATABASE
# ═══════════════════════════════════════════════════════════════
DATABASE_URL="postgresql://qrmenu:qrmenu123@localhost:5432/qr_menu_db"
DIRECT_URL="postgresql://qrmenu:qrmenu123@localhost:5432/qr_menu_db"

# ═══════════════════════════════════════════════════════════════
# 🔐 AUTHENTICATION
# ═══════════════════════════════════════════════════════════════
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-here"
JWT_EXPIRES_IN="7d"

# ═══════════════════════════════════════════════════════════════
# 🖥️ SERVER
# ═══════════════════════════════════════════════════════════════
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# ═══════════════════════════════════════════════════════════════
# ☁️ CLOUDINARY (Opsiyonel - Görsel CDN)
# ═══════════════════════════════════════════════════════════════
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# ═══════════════════════════════════════════════════════════════
# 📧 EMAIL (Opsiyonel - Demo bildirimler)
# ═══════════════════════════════════════════════════════════════
RESEND_API_KEY=""
EMAIL_FROM="noreply@yourdomain.com"
```

**Frontend `.env.local` dosyası:**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME="BEN Medya QR Menü"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 3️⃣ PostgreSQL Veritabanı Oluşturun

```powershell
# PostgreSQL'e bağlanın
psql -U postgres

# Veritabanı ve kullanıcı oluşturun
CREATE USER qrmenu WITH PASSWORD 'qrmenu123';
CREATE DATABASE qr_menu_db OWNER qrmenu;
GRANT ALL PRIVILEGES ON DATABASE qr_menu_db TO qrmenu;
\q
```

#### 4️⃣ Prisma Migrasyonları Çalıştırın

```powershell
cd backend

# Migrasyonları uygula
npm run prisma:migrate

# Prisma Client oluştur
npm run prisma:generate

# Demo verileri yükle
npm run prisma:seed

cd ..
```

#### 5️⃣ Geliştirme Sunucusunu Başlatın

```powershell
# Her iki servisi aynı anda başlat
npm run dev
```

#### ✅ Erişim URL'leri

| Servis | URL | Açıklama |
|--------|-----|----------|
| 🌐 Frontend | http://localhost:3000 | Ana uygulama |
| 🔧 Backend API | http://localhost:5000 | REST API |
| ❤️ Health Check | http://localhost:5000/api/health | Sunucu durumu |
| 📊 Prisma Studio | `npm run prisma:studio` | Veritabanı yönetimi |

#### 🔑 Demo Hesaplar

| Rol | Email | Şifre |
|-----|-------|-------|
| 👑 Süper Admin | admin@qrmenu.com | admin123 |
| 🏪 Restoran Admin | restaurant1@example.com | password123 |

---

### Docker ile Kurulum

```powershell
# 1. Tüm servisleri build ve başlat
docker-compose up -d --build

# 2. Logları izle
docker-compose logs -f

# 3. Sadece veritabanını başlat (local development için)
docker-compose up -d postgres

# 4. Servisleri durdur
docker-compose down

# 5. Verileri de silerek durdur
docker-compose down -v
```

**docker-compose.yml yapısı:**

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    ports: ["5432:5432"]
    environment:
      POSTGRES_USER: qrmenu
      POSTGRES_PASSWORD: qrmenu123
      POSTGRES_DB: qr_menu_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports: ["5000:5000"]
    depends_on: [postgres]
    environment:
      DATABASE_URL: postgresql://qrmenu:qrmenu123@postgres:5432/qr_menu_db

  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    depends_on: [backend]
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000

volumes:
  postgres_data:
```

---

## ⚙️ Konfigürasyon

### Backend Environment Variables

| Değişken | Açıklama | Zorunlu | Varsayılan |
|----------|----------|---------|------------|
| `DATABASE_URL` | PostgreSQL bağlantı URL'i | ✅ | - |
| `DIRECT_URL` | Direkt DB bağlantısı (Neon için) | ❌ | DATABASE_URL |
| `JWT_SECRET` | JWT imzalama anahtarı (min 32 char) | ✅ | - |
| `JWT_EXPIRES_IN` | Token geçerlilik süresi | ❌ | 7d |
| `PORT` | Sunucu portu | ❌ | 5000 |
| `NODE_ENV` | Ortam (development/production) | ❌ | development |
| `CORS_ORIGIN` | İzin verilen origin | ❌ | * |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary hesap adı | ❌ | - |
| `CLOUDINARY_API_KEY` | Cloudinary API anahtarı | ❌ | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ❌ | - |
| `RESEND_API_KEY` | Resend email API key | ❌ | - |
| `EMAIL_FROM` | Gönderen email adresi | ❌ | - |

### Frontend Environment Variables

| Değişken | Açıklama | Zorunlu | Varsayılan |
|----------|----------|---------|------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | ✅ | http://localhost:5000 |
| `NEXT_PUBLIC_APP_NAME` | Uygulama adı | ❌ | QR Menü |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | ❌ | http://localhost:3000 |

---

## 📊 Veritabanı Şeması

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      User       │       │   Restaurant    │       │    Category     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │──┐    │ id (PK)         │──┐    │ id (PK)         │
│ email           │  │    │ memberNo        │  │    │ name            │
│ password        │  │    │ businessType    │  │    │ description     │
│ name            │  └───►│ ownerId (FK)    │  │    │ image           │
│ role            │       │ name            │  └───►│ restaurantId(FK)│
│ isActive        │       │ slug            │       │ order           │
│ createdAt       │       │ description     │       │ isActive        │
│ updatedAt       │       │ address/phone   │       │ createdAt       │
└─────────────────┘       │ logo/headerImage│       └────────┬────────┘
                          │ membershipStatus│                │
UserRole ENUM:            │ themeColor      │                │
- SUPER_ADMIN             │ createdAt       │       ┌────────▼────────┐
- RESTAURANT_ADMIN        └─────────────────┘       │    Product      │
- CUSTOMER                         │                ├─────────────────┤
                                   │                │ id (PK)         │
BusinessType ENUM:                 │                │ name            │
- RESTORAN                         │                │ description     │
- KAFE                             │                │ price           │
- OTEL                             │                │ image/imageUrl  │
- DIGER                            │                │ isNew/isPopular │
                                   │                │ isDiscount      │
MembershipStatus ENUM:             │                │ discountPrice   │
- ACTIVE                           │                │ allergens       │
- EXPIRED                          │                │ isVegan/Vegeta..│
- SUSPENDED                        │                │ categoryId (FK) │
                                   │                │ order           │
                                   │                └─────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     QRCode      │       │    MenuView     │       │   Analytics     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ code            │       │ restaurantId(FK)│       │ restaurantId(FK)│
│ tableNumber     │       │ tableId         │       │ productId (FK)  │
│ imageUrl        │       │ userAgent       │       │ date            │
│ scanCount       │       │ deviceType      │       │ viewCount       │
│ isActive        │       │ ip              │       └─────────────────┘
│ restaurantId(FK)│       │ createdAt       │
└─────────────────┘       └─────────────────┘

┌─────────────────┐       ┌─────────────────────────┐
│  DemoRequest    │       │  RestaurantStatDaily    │
├─────────────────┤       ├─────────────────────────┤
│ id (PK)         │       │ id (PK)                 │
│ fullName        │       │ restaurantId (FK)       │
│ restaurantName  │       │ date                    │
│ phone           │       │ totalViews              │
│ email           │       │ totalProductViews       │
│ restaurantType  │       │ uniqueVisitors          │
│ tableCount      │       │ createdAt               │
│ status          │       └─────────────────────────┘
│ potential       │
│ potentialStatus │
│ notes           │
│ createdAt       │
└─────────────────┘
```

---

## 📚 API Dokümantasyonu

### Base URL

```
Development: http://localhost:5000/api
Production:  https://your-api-domain.com/api
```

### Authentication

Tüm korumalı endpoint'ler JWT token gerektirir:

```http
Authorization: Bearer <your-jwt-token>
```

---

### 🔐 Auth Endpoints

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@qrmenu.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@qrmenu.com",
    "name": "Admin",
    "role": "SUPER_ADMIN"
  }
}
```

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "İşletme Sahibi",
  "email": "owner@restaurant.com",
  "password": "securePassword123"
}
```

#### Get Profile

```http
GET /api/auth/profile
Authorization: Bearer <token>
```

---

### 🏢 Restaurant Endpoints

#### List Restaurants (Admin)

```http
GET /api/restaurants
Authorization: Bearer <token>
```

#### Create Restaurant (Super Admin)

```http
POST /api/admin/restaurants
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessType": "RESTORAN",
  "name": "Lezzet Durağı",
  "email": "info@lezzetduragi.com",
  "phone": "+90 555 123 4567",
  "address": "İstanbul, Türkiye",
  "city": "İstanbul",
  "district": "Kadıköy",
  "membershipStartDate": "2026-01-01",
  "membershipEndDate": "2027-01-01",
  "ownerName": "Ahmet Yılmaz",
  "ownerEmail": "ahmet@lezzetduragi.com",
  "ownerPassword": "secure123"
}
```

#### Update Restaurant

```http
PUT /api/restaurants/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Yeni İsim",
  "description": "Yeni açıklama",
  "themeColor": "#FF6B35"
}
```

#### Delete Restaurant

```http
DELETE /api/restaurants/:id
Authorization: Bearer <token>
```

---

### 📂 Menu Endpoints

#### List Categories

```http
GET /api/menu/categories?restaurantId=<uuid>
Authorization: Bearer <token>
```

#### Create Category

```http
POST /api/menu/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Ana Yemekler",
  "description": "Nefis ana yemek seçenekleri",
  "order": 1,
  "restaurantId": "<uuid>"
}
```

#### List Products

```http
GET /api/menu/products?categoryId=<uuid>
Authorization: Bearer <token>
```

#### Create Product

```http
POST /api/menu/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Izgara Köfte",
  "description": "Özel baharatlarla hazırlanmış köfte, yanında pilav ve salata",
  "price": 189.90,
  "categoryId": "<uuid>",
  "isNew": true,
  "isPopular": false,
  "isDiscount": true,
  "discountPrice": 159.90,
  "isVegetarian": false,
  "isVegan": false,
  "isGlutenFree": true,
  "allergens": "Gluten içermez"
}
```

---

### 📱 QR Code Endpoints

#### Generate QR Code

```http
GET /api/qr/:restaurantId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "qrCode": {
    "id": "uuid",
    "code": "abc123",
    "imageUrl": "https://...",
    "imageData": "data:image/png;base64,..."
  }
}
```

#### Scan QR (Public - Redirects to menu)

```http
GET /api/qr/scan/:code
```

---

### 🌐 Public Endpoints

#### Get Public Menu

```http
GET /api/public/menu/:slug
```

**Response:**
```json
{
  "restaurant": {
    "id": "uuid",
    "name": "Lezzet Durağı",
    "slug": "lezzet-duragi",
    "logo": "https://...",
    "themeColor": "#FF6B35"
  },
  "categories": [...],
  "products": [...]
}
```

---

### 📊 Analytics Endpoints

#### Get Restaurant Analytics

```http
GET /api/analytics/restaurant/:id?period=7d
Authorization: Bearer <token>
```

#### Record Menu View (Public)

```http
POST /api/analytics/view
Content-Type: application/json

{
  "restaurantId": "uuid",
  "deviceType": "mobile",
  "userAgent": "..."
}
```

---

### 📝 Demo Request Endpoints

#### Create Demo Request (Public)

```http
POST /api/demo-requests
Content-Type: application/json

{
  "fullName": "Ahmet Yılmaz",
  "restaurantName": "Cafe Lezzet",
  "phone": "+90 555 123 4567",
  "email": "ahmet@cafelezzet.com",
  "restaurantType": "KAFE",
  "tableCount": 25
}
```

#### List Demo Requests (Admin)

```http
GET /api/demo-requests
Authorization: Bearer <token>
```

#### Update Demo Request Status

```http
PATCH /api/demo-requests/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "FOLLOW_UP",
  "potentialStatus": "HIGH_PROBABILITY",
  "notes": "Müşteriyle görüşme yapıldı, ilgililer."
}
```

---

### ❤️ Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-28T10:30:00Z",
  "uptime": 86400,
  "database": "connected"
}
```

---

## ☁️ Deployment

### 🚂 Railway (Backend)

1. **Railway hesabı oluşturun:** [railway.app](https://railway.app)

2. **Yeni proje oluşturun:**
   ```bash
   # Railway CLI yükleyin
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Proje başlat
   cd backend
   railway init
   ```

3. **Environment variables ekleyin:**
   - `DATABASE_URL` - Neon veya Railway PostgreSQL
   - `JWT_SECRET` - Güvenli secret key
   - `NODE_ENV` - production
   - `CORS_ORIGIN` - Frontend URL

4. **Deploy:**
   ```bash
   railway up
   ```

📖 Detaylı rehber: [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)

---

### ▲ Vercel (Frontend)

1. **Vercel hesabı oluşturun:** [vercel.com](https://vercel.com)

2. **GitHub repo'yu bağlayın**

3. **Build ayarları:**
   ```
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   ```

4. **Environment variables:**
   - `NEXT_PUBLIC_API_URL` - Backend URL

📖 Detaylı rehber: [FRONTEND_DEPLOY_GUIDE.md](FRONTEND_DEPLOY_GUIDE.md)

---

### 🐘 Neon (PostgreSQL)

1. **Neon hesabı:** [neon.tech](https://neon.tech)

2. **Veritabanı oluşturun**

3. **Connection string'i alın:**
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

4. **Pooler URL (DIRECT_URL için):**
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require&pgbouncer=true
   ```

📖 Detaylı rehber: [NEON_DEPLOYMENT_GUIDE.md](NEON_DEPLOYMENT_GUIDE.md)

---

### ☁️ Cloudinary (Görsel CDN)

1. **Hesap oluşturun:** [cloudinary.com](https://cloudinary.com)

2. **Dashboard'dan credential'ları alın:**
   - Cloud Name
   - API Key
   - API Secret

3. **Environment variables'a ekleyin**

📖 Detaylı rehber: [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md)

---

## 🔒 Güvenlik

### Uygulanan Güvenlik Önlemleri

| Özellik | Uygulama | Detay |
|---------|----------|-------|
| 🔐 **Authentication** | JWT Tokens | 7 gün geçerlilik, HS256 algoritma |
| 👤 **Authorization** | Role-based (RBAC) | Super Admin, Restaurant Admin, Customer |
| 🔑 **Password Hashing** | bcrypt | 12 salt rounds |
| 🛡️ **Rate Limiting** | express-rate-limit | 100 req/min (API), 5 req/min (auth) |
| 🌐 **CORS** | Whitelist origin | Environment-based |
| 💉 **SQL Injection** | Prisma ORM | Parameterized queries |
| ⚔️ **XSS Protection** | Helmet + Sanitizer | CSP headers, input sanitization |
| 📁 **File Upload** | Multer + Sharp | Type validation, size limit, optimization |
| 🔒 **HTTPS** | Forced in production | SSL/TLS encryption |
| 📝 **Input Validation** | express-validator + Zod | Server & client-side |

### Güvenlik Headers (Helmet)

```javascript
// Content Security Policy
// X-Frame-Options: DENY
// X-Content-Type-Options: nosniff
// Referrer-Policy: strict-origin-when-cross-origin
// Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## 📈 Performans Optimizasyonu

### Backend Optimizasyonları

| Metrik | Hedef | Uygulama |
|--------|-------|----------|
| Response Time | < 200ms | Query optimization, indexes |
| Cold Start | < 3s | Lazy loading, minimal deps |
| Database | Optimized | Connection pooling, Prisma |
| Image Processing | < 500ms | Sharp, async processing |

### Frontend Optimizasyonları

| Metrik | Hedef | Uygulama |
|--------|-------|----------|
| FCP | < 1.5s | SSR, code splitting |
| LCP | < 2.5s | Image optimization, lazy load |
| TTI | < 3s | Tree shaking, bundle analysis |
| CLS | < 0.1 | Skeleton loaders, reserved space |
| Bundle Size | < 500KB | Dynamic imports, compression |

### Veritabanı Indexleri

```prisma
// Otomatik oluşturulan indexler
@@index([restaurantId])
@@index([categoryId])
@@index([slug])
@@index([memberNo])
@@index([createdAt])
@@index([membershipStatus])
```

---

## 🧪 Test

### Backend Testleri

```powershell
cd backend

# Unit testleri çalıştır
npm run test

# Test coverage
npm run test:coverage

# API endpoint testi
npm run test:api
```

### Frontend Testleri

```powershell
cd frontend

# Unit testleri
npm run test

# E2E testleri
npm run test:e2e

# Lint kontrolü
npm run lint
```

### Manuel API Testi

```powershell
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@qrmenu.com","password":"admin123"}'
```

📖 Detaylı test rehberi: [API_TEST_GUIDE.md](API_TEST_GUIDE.md)

---

## 🔧 Troubleshooting

### 🔴 Yaygın Sorunlar ve Çözümleri

#### Database Bağlantı Hatası

```powershell
# PostgreSQL servisini kontrol et
Get-Service postgresql*

# Bağlantı string'ini doğrula
echo $env:DATABASE_URL

# Prisma bağlantısını test et
cd backend
npx prisma db pull
```

#### Port Çakışması

```powershell
# Portu kullanan process'i bul
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Process'i sonlandır
taskkill /PID <PID> /F
```

#### Prisma Migration Hatası

```powershell
cd backend

# Migration'ları sıfırla (DİKKAT: Veri silinir!)
npx prisma migrate reset

# Migration'ları yeniden uygula
npm run prisma:migrate

# Seed verileri yükle
npm run prisma:seed
```

#### Node Modules Sorunu

```powershell
# node_modules temizle ve yeniden yükle
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Backend için
cd backend
Remove-Item -Recurse -Force node_modules
npm install
cd ..

# Frontend için
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
cd ..
```

#### CORS Hatası

```env
# Backend .env dosyasında CORS origin'i kontrol et
CORS_ORIGIN=http://localhost:3000

# Birden fazla origin için
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
```

#### JWT Token Hatası

```env
# JWT_SECRET en az 32 karakter olmalı
JWT_SECRET="bu-en-az-32-karakter-uzunlugunda-olmalidir"
```

---

## 🗺️ Yol Haritası

### ✅ Tamamlanan (v1.0)

- [x] Multi-tenant mimari
- [x] QR kod üretimi ve yönetimi
- [x] Rol bazlı erişim kontrolü
- [x] Menü yönetimi (kategori/ürün)
- [x] Cloudinary entegrasyonu
- [x] Analytics dashboard
- [x] CRM / Demo talep modülü
- [x] Üyelik yönetimi
- [x] Docker desteği
- [x] Railway/Vercel deployment

### 🔄 Devam Eden (v1.1)

- [ ] Çoklu dil desteği iyileştirmesi
- [ ] WhatsApp sipariş entegrasyonu
- [ ] Masa QR kodları
- [ ] Push notifications
- [ ] PWA desteği

### 📋 Planlanan (v2.0)

- [ ] Online sipariş modülü
- [ ] Ödeme gateway entegrasyonu
- [ ] Stok yönetimi
- [ ] Çoklu şube desteği
- [ ] Franchise yönetimi
- [ ] AI menü önerileri
- [ ] Sesli menü okuma
- [ ] Mobil uygulama (React Native)

---

## 🤝 Katkıda Bulunma

### Contribution Workflow

1. 🍴 **Fork** yapın
2. 🌿 **Branch** oluşturun:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. 💾 **Commit** yapın:
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. 📤 **Push** yapın:
   ```bash
   git push origin feature/amazing-feature
   ```
5. 🔄 **Pull Request** açın

### Commit Kuralları (Conventional Commits)

| Prefix | Kullanım |
|--------|----------|
| `feat:` | Yeni özellik |
| `fix:` | Hata düzeltme |
| `docs:` | Dokümantasyon |
| `style:` | Kod formatı (fonksiyonel değişiklik yok) |
| `refactor:` | Kod yeniden yapılandırma |
| `test:` | Test ekleme/düzeltme |
| `chore:` | Build, config, dependencies |
| `perf:` | Performans iyileştirmesi |

### Code Style

```powershell
# Lint kontrolü
npm run lint

# Format
npm run format

# Type check
npm run typecheck
```

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
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 İletişim

<div align="center">

| Platform | Link |
|----------|------|
| 🌐 **Website** | [benmedya.com](https://benmedya.com) |
| 📧 **Email** | info@benmedya.com |
| 🐙 **GitHub** | [github.com/benmedya](https://github.com/benmedya) |
| 📱 **Destek** | menuben.com |

---

### 🙏 Teşekkürler

Bu projeyi mümkün kılan harika açık kaynak araçlara teşekkür ederiz:

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

**⭐ Bu projeyi faydalı buldunuz mu? Yıldız vermeyi unutmayın! ⭐**

<sub>Made with ❤️ by BEN Medya Team | © 2024-2026</sub>

</div>
