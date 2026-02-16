# 🍽️ BEN Medya - QR Menü Yönetim Sistemi

<div align="center">

![BEN Medya Logo](https://img.shields.io/badge/BEN%20Medya-QR%20Men%C3%BC%20Sistemi-FF6B35?style=for-the-badge)

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

[📖 Kurulum](#-kurulum) • [🎯 Özellikler](#-özellikler) • [🔧 API](#-api-dokümantasyonu) • [🚀 Deployment](#%EF%B8%8F-deployment) • [📊 Veritabanı](#-veritabanı-şeması)

</div>

---

## 📑 İçindekiler

- [✨ Özellikler](#-özellikler)
- [🛠️ Teknoloji Stack](#️-teknoloji-stack)
- [📁 Proje Yapısı](#-proje-yapısı)
- [🚀 Kurulum](#-kurulum)
- [⚙️ Konfigürasyon](#️-konfigürasyon)
- [📊 Veritabanı Şeması](#-veritabanı-şeması)
- [📚 API Dokümantasyonu](#-api-dokümantasyonu)
- [☁️ Deployment](#️-deployment)
- [🐳 Docker](#-docker)
- [🔒 Güvenlik](#-güvenlik)
- [📈 Performans](#-performans)
- [🧪 Test](#-test)
- [🤝 Katkıda Bulunma](#-katkıda-bulunma)
- [📜 Lisans](#-lisans)

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
| 🖼️ **Görsel Galeri** | Hazır görsel galerisi ve yönetimi | ✅ |

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
│  ✅ Görsel galeri yönetimi (Gallery Assets)                     │
│  ✅ Aktif/Pasif üyelik takibi                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Admin Panel Sayfaları:**
- `/admin/dashboard` - Ana kontrol paneli
- `/admin/restaurants` - İşletme yönetimi
- `/admin/users` - Kullanıcı yönetimi
- `/admin/analytics` - Platform analizleri
- `/admin/demo-requests` - Demo talepleri
- `/admin/demo-memberships` - Demo üyelikleri
- `/admin/active-memberships` - Aktif üyelikler
- `/admin/inactive-memberships` - Pasif üyelikler
- `/admin/gallery-assets` - Görsel galeri yönetimi

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

**Restaurant Panel Sayfaları:**
- `/restaurant/dashboard` - İşletme dashboard
- `/restaurant/menu` - Ürün yönetimi
- `/restaurant/categories` - Kategori yönetimi
- `/restaurant/menu-appearance` - Menü görünüm ayarları
- `/restaurant/qr-codes` - QR kod yönetimi
- `/restaurant/settings` - İşletme ayarları

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
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  🔍 Arama özelliği                                        │  │
│  │  📂 Kategorilere göre filtreleme                          │  │
│  │  🏷️ Yeni/Popüler/İndirimli ürün etiketleri               │  │
│  │  📸 Yüksek kaliteli ürün görselleri                       │  │
│  │  ℹ️ Alerjen ve besin bilgileri                            │  │
│  │  🌱 Vegan/Vejetaryen filtreleri                           │  │
│  │  ⏰ Çalışma saatleri görüntüleme                          │  │
│  │  📍 Konum ve iletişim bilgileri                           │  │
│  │  🎨 Smooth animasyonlar                                   │  │
│  │  ⚡ Hızlı yükleme süreleri (<2s)                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Müşteri Erişim URL'leri:**
- `/menu/[slug]` - İşletme menü sayfası
- `/m/[slug]` - Mobil optimize menü

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
| ![Cloudinary](https://img.shields.io/badge/-Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white) | 1.41 | Bulut Görsel CDN |

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
| 📧 **Nodemailer** | Transactional Email |

---

## 📁 Proje Yapısı

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
│   │   │
│   │   ├── 📁 controllers/              # Request handlers
│   │   │   ├── 📄 auth.controller.ts
│   │   │   ├── 📄 restaurant.controller.ts
│   │   │   ├── 📄 menu.controller.ts
│   │   │   ├── 📄 qr.controller.ts
│   │   │   ├── 📄 analytics.controller.ts
│   │   │   ├── 📄 upload.controller.ts
│   │   │   ├── 📄 public.controller.ts
│   │   │   ├── 📄 demo-requests.controller.ts
│   │   │   ├── 📄 membership.controller.ts
│   │   │   ├── 📄 galleryAssets.controller.ts
│   │   │   ├── 📄 superadmin-analytics.controller.ts
│   │   │   └── 📄 user.controller.ts
│   │   │
│   │   ├── 📁 middlewares/              # Express middlewares
│   │   │   ├── 📄 auth.middleware.ts    # JWT doğrulama
│   │   │   └── 📄 error.middleware.ts   # Hata yakalama
│   │   │
│   │   ├── 📁 routes/                   # API route tanımları
│   │   │   ├── 📄 auth.routes.ts
│   │   │   ├── 📄 restaurant.routes.ts
│   │   │   ├── 📄 menu.routes.ts
│   │   │   ├── 📄 qr.routes.ts
│   │   │   ├── 📄 analytics.routes.ts
│   │   │   ├── 📄 upload.routes.ts
│   │   │   ├── 📄 public.routes.ts
│   │   │   ├── 📄 demo-requests.routes.ts
│   │   │   ├── 📄 membership.routes.ts
│   │   │   ├── 📄 galleryAssets.routes.ts
│   │   │   ├── 📄 superadmin-analytics.routes.ts
│   │   │   ├── 📄 user.routes.ts
│   │   │   └── 📄 health.routes.ts
│   │   │
│   │   ├── 📁 services/                 # Business logic
│   │   ├── 📁 utils/                    # Yardımcı fonksiyonlar
│   │   ├── 📁 types/                    # TypeScript tipleri
│   │   ├── 📁 lib/                      # Kütüphane fonksiyonları
│   │   └── 📄 server.ts                 # Express server
│   │
│   ├── 📁 uploads/                      # Yüklenen dosyalar
│   ├── 📁 logs/                         # Uygulama logları
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 Dockerfile
│   └── 📄 vercel.json
│
├── 📁 frontend/                          # Next.js Frontend
│   ├── 📁 public/                       # Statik dosyalar
│   │
│   ├── 📁 src/
│   │   ├── 📁 app/                      # Next.js App Router
│   │   │   ├── 📁 admin/                # Süper Admin paneli
│   │   │   │   ├── 📁 dashboard/
│   │   │   │   ├── 📁 restaurants/
│   │   │   │   ├── 📁 users/
│   │   │   │   ├── 📁 analytics/
│   │   │   │   ├── 📁 demo-requests/
│   │   │   │   ├── 📁 demo-memberships/
│   │   │   │   ├── 📁 active-memberships/
│   │   │   │   ├── 📁 inactive-memberships/
│   │   │   │   └── 📁 gallery-assets/
│   │   │   │
│   │   │   ├── 📁 restaurant/           # İşletme Admin paneli
│   │   │   │   ├── 📁 dashboard/
│   │   │   │   ├── 📁 menu/
│   │   │   │   ├── 📁 categories/
│   │   │   │   ├── 📁 menu-appearance/
│   │   │   │   ├── 📁 qr-codes/
│   │   │   │   └── 📁 settings/
│   │   │   │
│   │   │   ├── 📁 menu/[slug]/          # Public menü sayfası
│   │   │   ├── 📁 m/[slug]/             # Mobil menü sayfası
│   │   │   ├── 📁 login/                # Giriş sayfası
│   │   │   ├── 📁 register/             # Kayıt sayfası
│   │   │   ├── 📁 demo/                 # Demo talep sayfası
│   │   │   ├── 📁 blog/                 # Blog sayfaları
│   │   │   ├── 📁 ornek-menuler/        # Örnek menüler
│   │   │   ├── 📁 api/                  # API routes
│   │   │   ├── 📄 layout.tsx
│   │   │   ├── 📄 page.tsx              # Ana sayfa (Landing)
│   │   │   ├── 📄 providers.tsx
│   │   │   ├── 📄 globals.css
│   │   │   └── 📄 sitemap.ts
│   │   │
│   │   ├── 📁 components/               # React bileşenleri
│   │   │   ├── 📁 common/               # Ortak bileşenler
│   │   │   ├── 📁 customer/             # Müşteri bileşenleri
│   │   │   ├── 📁 restaurant/           # Restoran bileşenleri
│   │   │   ├── 📄 DashboardLayout.tsx
│   │   │   ├── 📄 ProtectedRoute.tsx
│   │   │   ├── 📄 QrBox.tsx
│   │   │   └── 📄 RestaurantLogo.tsx
│   │   │
│   │   ├── 📁 hooks/                    # Custom React hooks
│   │   ├── 📁 lib/                      # Yardımcı kütüphaneler
│   │   ├── 📁 store/                    # Zustand state management
│   │   ├── 📁 types/                    # TypeScript tipleri
│   │   ├── 📁 utils/                    # Utility fonksiyonları
│   │   └── 📁 data/                     # Statik veriler
│   │
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 next.config.js
│   ├── 📄 tailwind.config.js
│   ├── 📄 postcss.config.js
│   └── 📄 Dockerfile
│
├── 📁 hostinger/                         # Eski Hostinger dosyaları
├── 📁 yeni-hostinger/                    # Yeni Hostinger dosyaları
│   ├── 📄 index.html
│   ├── 📄 login.html
│   ├── 📁 admin/
│   ├── 📁 menu/
│   └── 📁 restaurant/
│
├── 📄 docker-compose.yml                 # Docker Compose konfigürasyonu
├── 📄 package.json                       # Root package.json
├── 📄 railway.json                       # Railway yapılandırması
├── 📄 nixpacks.toml                      # Nixpacks yapılandırması
├── 📄 setup.ps1                          # Windows PowerShell kurulum
├── 📄 quick-setup.ps1                    # Hızlı kurulum scripti
├── 📄 git-push.ps1                       # Git push script
└── 📄 README.md                          # Bu dosya
```

---

## 🚀 Kurulum

### Ön Koşullar

- **Node.js** v20.x veya üzeri
- **npm** veya **yarn** veya **pnpm**
- **PostgreSQL** 15+ (veya Neon Serverless)
- **Git**

### 🏃 Hızlı Başlangıç (PowerShell)

```powershell
# Otomatik kurulum scripti
.\quick-setup.ps1
```

### 📋 Manuel Kurulum

#### 1. Repoyu Klonlayın

```bash
git clone https://github.com/benmedya/qr-menu.git
cd qr-menu
```

#### 2. Bağımlılıkları Yükleyin

```bash
# Root bağımlılıkları
npm install

# Backend bağımlılıkları
cd backend
npm install

# Frontend bağımlılıkları
cd ../frontend
npm install
```

#### 3. Environment Dosyalarını Oluşturun

**Backend (.env)**:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/qr_menu_db"
DIRECT_URL="postgresql://user:password@localhost:5432/qr_menu_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# Cloudinary (Opsiyonel)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email (Opsiyonel)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### 4. Veritabanını Hazırlayın

```bash
cd backend

# Prisma client oluştur
npx prisma generate

# Migration çalıştır
npx prisma migrate deploy

# Seed data yükle (opsiyonel)
npx prisma db seed
```

#### 5. Uygulamayı Başlatın

```bash
# Root dizinden her iki uygulamayı başlat
npm run dev

# Veya ayrı ayrı:
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Uygulamaya Erişim:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Prisma Studio: `npx prisma studio` (http://localhost:5555)

#### 6. Demo Hesaplar

Seed çalıştırıldıktan sonra:

| Rol | Email | Şifre |
|-----|-------|-------|
| Super Admin | admin@benmedya.com | admin123 |
| Restaurant Admin | restoran@test.com | test123 |

---

## ⚙️ Konfigürasyon

### Backend Environment Değişkenleri

| Değişken | Zorunlu | Açıklama | Örnek |
|----------|---------|----------|-------|
| `DATABASE_URL` | ✅ | PostgreSQL bağlantı URL'i | `postgresql://user:pass@host:5432/db` |
| `DIRECT_URL` | ✅ | Doğrudan veritabanı URL'i | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | ✅ | JWT imzalama anahtarı (min 32 karakter) | `your-super-secret-key` |
| `JWT_EXPIRES_IN` | ❌ | Token geçerlilik süresi | `7d` |
| `PORT` | ❌ | Server port | `5000` |
| `NODE_ENV` | ❌ | Ortam | `development` / `production` |
| `CLOUDINARY_CLOUD_NAME` | ❌ | Cloudinary cloud name | `your-cloud` |
| `CLOUDINARY_API_KEY` | ❌ | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | ❌ | Cloudinary API secret | `abc123xyz` |
| `SMTP_HOST` | ❌ | Email SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | ❌ | SMTP port | `587` |
| `SMTP_USER` | ❌ | SMTP kullanıcı | `email@gmail.com` |
| `SMTP_PASS` | ❌ | SMTP şifresi | `app-password` |
| `FRONTEND_URL` | ❌ | Frontend URL'i | `http://localhost:3000` |

### Frontend Environment Değişkenleri

| Değişken | Zorunlu | Açıklama | Örnek |
|----------|---------|----------|-------|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API URL'i | `http://localhost:5000` |
| `NEXT_PUBLIC_SITE_URL` | ❌ | Site URL'i | `http://localhost:3000` |

---

## 📊 Veritabanı Şeması

### Ana Modeller

```prisma
┌─────────────────────────────────────────────────────────────────┐
│                        VERİTABANI ŞEMASI                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  👤 User                          🏪 Restaurant                 │
│  ├── id (UUID)                    ├── id (UUID)                 │
│  ├── email                        ├── memberNo                  │
│  ├── password (hashed)            ├── businessType              │
│  ├── name                         ├── name, slug                │
│  ├── role (ENUM)                  ├── description               │
│  └── isActive                     ├── address, city             │
│                                   ├── phone, email              │
│  📂 Category                      ├── logo, headerImage         │
│  ├── id (UUID)                    ├── themeColor                │
│  ├── name                         ├── membershipStatus          │
│  ├── description                  └── ownerId → User            │
│  ├── image                                                      │
│  ├── order                        📱 QRCode                     │
│  └── restaurantId → Restaurant    ├── id (UUID)                 │
│                                   ├── code (unique)             │
│  📦 Product                       ├── tableNumber               │
│  ├── id (UUID)                    ├── imageUrl, imageData       │
│  ├── name, price                  ├── scanCount                 │
│  ├── description                  └── restaurantId → Restaurant │
│  ├── image, imageUrl                                            │
│  ├── isNew, isPopular             📈 Analytics                  │
│  ├── isDiscount, discountPrice    ├── id (UUID)                 │
│  ├── ingredients, allergens       ├── date                      │
│  ├── isVegan, isVegetarian        ├── viewCount                 │
│  └── categoryId → Category        └── restaurantId → Restaurant │
│                                                                 │
│  📋 DemoRequest                   🖼️ GalleryAsset               │
│  ├── id (UUID)                    ├── id (UUID)                 │
│  ├── fullName                     ├── title, type               │
│  ├── restaurantName               ├── category, tags            │
│  ├── phone, email                 ├── imageUrl, thumbUrl        │
│  ├── status, potential            ├── scope (GLOBAL/RESTAURANT) │
│  └── notes                        └── isActive                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Enum Tipleri

```typescript
enum UserRole {
  SUPER_ADMIN      // Platform yöneticisi
  RESTAURANT_ADMIN // İşletme yöneticisi
  CUSTOMER         // Müşteri
}

enum BusinessType {
  RESTORAN  // Restoran
  KAFE      // Kafe
  OTEL      // Otel
  DIGER     // Diğer
}

enum MembershipStatus {
  ACTIVE     // Aktif üyelik
  EXPIRED    // Süresi dolmuş
  SUSPENDED  // Askıya alınmış
}

enum DemoRequestStatus {
  PENDING       // Beklemede
  DEMO_CREATED  // Demo oluşturuldu
  FOLLOW_UP     // Takipte
  NEGATIVE      // Olumsuz
}

enum GalleryAssetType {
  FOOD    // Yemek
  DRINK   // İçecek
  DESSERT // Tatlı
  OTHER   // Diğer
}
```

---

## 📚 API Dokümantasyonu

### Base URL

```
Development: http://localhost:5000/api
Production:  https://your-backend-url.com/api
```

### Authentication Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/auth/register` | Yeni kullanıcı kaydı | ❌ |
| POST | `/auth/login` | Kullanıcı girişi | ❌ |
| GET | `/auth/profile` | Profil bilgisi | ✅ |

### Restaurant Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/restaurants` | Tüm restoranlar (Admin) | ✅ Admin |
| GET | `/restaurants/my-restaurant` | Kendi restoranı | ✅ |
| GET | `/restaurants/:id` | Restoran detayı | ✅ |
| POST | `/restaurants` | Yeni restoran oluştur | ✅ Admin |
| PUT | `/restaurants/:id` | Restoran güncelle | ✅ |
| DELETE | `/restaurants/:id` | Restoran sil | ✅ Admin |

### Menu Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/menu/categories` | Kategorileri listele | ✅ |
| POST | `/menu/categories` | Kategori oluştur | ✅ |
| PUT | `/menu/categories/:id` | Kategori güncelle | ✅ |
| DELETE | `/menu/categories/:id` | Kategori sil | ✅ |
| GET | `/menu/products` | Ürünleri listele | ✅ |
| POST | `/menu/products` | Ürün oluştur | ✅ |
| PUT | `/menu/products/:id` | Ürün güncelle | ✅ |
| DELETE | `/menu/products/:id` | Ürün sil | ✅ |

### QR Code Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/qr/:restaurantId` | QR kodları listele | ✅ |
| POST | `/qr/generate/:restaurantId` | QR kod oluştur | ✅ |
| GET | `/qr/scan/:code` | QR kod tara | ❌ |
| DELETE | `/qr/:id` | QR kod sil | ✅ |

### Public Endpoints (Auth Gerektirmez)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/public/menu/:slug` | Restoran menüsü |
| GET | `/public/product/:id` | Ürün detayı |

### Analytics Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/analytics/dashboard` | Dashboard verileri | ✅ |
| GET | `/analytics` | Detaylı analitikler | ✅ |

### Upload Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/upload` | Görsel yükle | ✅ |
| GET | `/upload` | Görselleri listele | ✅ |
| DELETE | `/upload/:id` | Görsel sil | ✅ |

### Demo Request Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/demo-requests` | Demo taleplerini listele | ✅ Admin |
| POST | `/demo-requests` | Yeni demo talebi | ❌ |
| PUT | `/demo-requests/:id` | Demo talebi güncelle | ✅ Admin |
| DELETE | `/demo-requests/:id` | Demo talebi sil | ✅ Admin |

### Membership Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/membership/active` | Aktif üyelikler | ✅ Admin |
| GET | `/membership/inactive` | Pasif üyelikler | ✅ Admin |
| PUT | `/membership/:id/status` | Üyelik durumu güncelle | ✅ Admin |

### Gallery Assets Endpoints

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/gallery-assets` | Galeri görsellerini listele | ✅ |
| POST | `/gallery-assets` | Görsel ekle | ✅ Admin |
| PUT | `/gallery-assets/:id` | Görsel güncelle | ✅ Admin |
| DELETE | `/gallery-assets/:id` | Görsel sil | ✅ Admin |

### Health Check

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/health` | Sistem durumu kontrolü |

---

## ☁️ Deployment

### 🚂 Railway Deployment

1. [Railway](https://railway.app) hesabı oluşturun
2. GitHub reposunu bağlayın
3. Environment variables ekleyin
4. Deploy butonuna tıklayın

```json
// railway.json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### ▲ Vercel Deployment (Frontend)

1. [Vercel](https://vercel.com) hesabı oluşturun
2. Frontend klasörünü import edin
3. Environment variables ekleyin
4. Deploy

```bash
# Vercel CLI ile
cd frontend
vercel
```

### 🐘 Neon Database

1. [Neon](https://neon.tech) hesabı oluşturun
2. Yeni proje oluşturun
3. Connection string'i kopyalayın
4. Backend `.env` dosyasına ekleyin

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

---

## 🐳 Docker

### Docker Compose ile Başlatma

```bash
# Tüm servisleri başlat
docker-compose up -d

# Logları izle
docker-compose logs -f

# Servisleri durdur
docker-compose down

# Volume'lar dahil temizle
docker-compose down -v
```

### Docker Compose Yapısı

```yaml
services:
  postgres:     # PostgreSQL veritabanı
    image: postgres:15-alpine
    ports: "5432:5432"
    
  backend:      # Express.js API
    build: ./backend
    ports: "5000:5000"
    depends_on: postgres
    
  frontend:     # Next.js Frontend
    build: ./frontend
    ports: "3000:3000"
    depends_on: backend
```

### Tek Servis Build

```bash
# Sadece backend
docker build -t qr-menu-backend ./backend

# Sadece frontend
docker build -t qr-menu-frontend ./frontend

# Çalıştır
docker run -p 5000:5000 qr-menu-backend
docker run -p 3000:3000 qr-menu-frontend
```

---

## 🔒 Güvenlik

### Uygulanan Güvenlik Önlemleri

| Özellik | Açıklama |
|---------|----------|
| 🔑 **JWT Authentication** | Stateless token-based kimlik doğrulama |
| 🔐 **Bcrypt Hashing** | Şifrelerin güvenli hash'lenmesi |
| 🛡️ **Helmet.js** | HTTP güvenlik başlıkları |
| 🚫 **Rate Limiting** | API istekleri sınırlama |
| ✅ **Input Validation** | express-validator ile girdi kontrolü |
| 🔄 **CORS** | Cross-origin resource sharing kontrolü |
| 🔒 **RBAC** | Rol bazlı erişim kontrolü |
| 📝 **SQL Injection Protection** | Prisma ORM ile parameterized queries |

### Güvenlik Başlıkları

```javascript
// Helmet tarafından eklenen başlıklar
Content-Security-Policy
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security (HTTPS)
```

### Rate Limiting

```javascript
// API rate limiting
windowMs: 15 * 60 * 1000  // 15 dakika
max: 100                   // Maksimum 100 istek
```

---

## 📈 Performans

### Backend Optimizasyonları

- **Connection Pooling**: Prisma ile veritabanı bağlantı havuzu
- **Query Optimization**: Index'lenmiş sorgular
- **Image Compression**: Sharp ile görsel optimizasyonu
- **Caching**: In-memory cache desteği
- **GZIP Compression**: Response sıkıştırma

### Frontend Optimizasyonları

- **Next.js SSR/SSG**: Server-side rendering ve static generation
- **Image Optimization**: next/image ile otomatik optimizasyon
- **Code Splitting**: Automatic code splitting
- **Lazy Loading**: Component lazy loading
- **CDN**: Cloudinary görsel CDN

### Veritabanı İndeksleri

```prisma
// Performans için önemli indeksler
@@index([restaurantId])
@@index([categoryId])
@@index([slug])
@@index([memberNo])
@@index([createdAt])
@@index([order])
```

---

## 🧪 Test

### Backend Testleri

```bash
cd backend

# Test scripti çalıştır
npm run test

# Login performans testi
node test-login-performance.js

# QR kod performans testi
node test-qr-performance.js

# Demo request testi
node test-demo-request.js
```

### API Test

```bash
# Health check
curl http://localhost:5000/api/health

# Login test
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@benmedya.com","password":"admin123"}'
```

---

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Geliştirme Kuralları

- TypeScript kullanın
- ESLint kurallarına uyun
- Commit mesajlarını anlaşılır yazın
- Test ekleyin

---

## 📜 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 📞 İletişim

**BEN Medya**

- 🌐 Website: [benmedya.com](https://benmedya.com)
- 📧 Email: info@benmedya.com
- 📱 Telefon: +90 XXX XXX XX XX

---

<div align="center">

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

Made with ❤️ by BEN Medya Team

</div>
