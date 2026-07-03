# BEN Medya — QR Menü Sistemi

> Çok kiracılı (multi-tenant) restoran / kafe / otel için **dijital QR menü, yönetim paneli ve analitik** platformu. Backend **Node.js + Express + Prisma + PostgreSQL**, frontend **Next.js 14 + Tailwind**, ek olarak statik HTML panelleri (Hostinger) içerir. Railway / Vercel / Supabase üzerinde çalışacak şekilde yapılandırılmıştır.

---

## İçindekiler

1. [Genel Bakış](#1-genel-bakış)
2. [Mimari](#2-mimari)
3. [Klasör Yapısı](#3-klasör-yapısı)
4. [Teknoloji Yığını](#4-teknoloji-yığını)
5. [Roller & Yetkilendirme](#5-roller--yetkilendirme)
6. [Veri Modeli (Prisma)](#6-veri-modeli-prisma)
7. [Plan / Paket Sistemi](#7-plan--paket-sistemi)
8. [Modüller ve Özellikler](#8-modüller-ve-özellikler)
9. [Backend API Yapısı](#9-backend-api-yapısı)
10. [Frontend Yapısı (Next.js)](#10-frontend-yapısı-nextjs)
11. [Statik Paneller (Hostinger)](#11-statik-paneller-hostinger)
12. [Güvenlik](#12-güvenlik)
13. [Performans & Önbellekleme](#13-performans--önbellekleme)
14. [E-posta Sistemi](#14-e-posta-sistemi)
15. [Görsel Yönetimi (Cloudinary + Galeri)](#15-görsel-yönetimi-cloudinary--galeri)
16. [QR Üretimi](#16-qr-üretimi)
17. [Analitik & Raporlama](#17-analitik--raporlama)
18. [Demo Talep & Satış Süreci](#18-demo-talep--satış-süreci)
19. [Garson Çağırma](#19-garson-çağırma)
20. [Kurulum (Local)](#20-kurulum-local)
21. [Ortam Değişkenleri](#21-ortam-değişkenleri)
22. [Dağıtım (Deployment)](#22-dağıtım-deployment)
23. [Yararlı Komutlar](#23-yararlı-komutlar)
24. [Sorun Giderme](#24-sorun-giderme)

---

## 1. Genel Bakış

**BEN Medya QR Menü** sistemi, müşterilerin masa üzerindeki QR kodu okutarak restoranın güncel menüsünü görmesini sağlayan; restoran sahibinin kendi panelinden kategorileri / ürünleri / QR kodları / temayı yönettiği; süper yöneticinin (BEN Medya) ise **tüm restoranları, üyelik durumlarını, demo taleplerini ve global galeri varlıklarını** kontrol ettiği SaaS tarzı bir sistemdir.

**Ana kullanıcı akışları:**

- **Müşteri (anonim)** → QR kodu okutur → `frontend/.../menu/[slug]` üzerinden menüyü görür, garson çağırır.
- **Restoran Yöneticisi (RESTAURANT_ADMIN)** → `/login` → kategori, ürün, QR, tema, garson çağrıları yönetimi.
- **Süper Admin (SUPER_ADMIN)** → `/admin/*` → tüm restoranlar, üyelikler, demo talepleri, galeri, analytics.
- **Potansiyel müşteri** → ana sayfadaki “Demo İste” formu → admin paneline `DemoRequest` olarak düşer.

---

## 2. Mimari

```
┌──────────────────────────┐     ┌──────────────────────────┐
│  Müşteri (QR Okuma)      │     │  Restoran / Süper Admin  │
│  Mobil tarayıcı          │     │  Web paneli              │
└──────────────┬───────────┘     └──────────────┬───────────┘
               │                                │
               ▼                                ▼
        ┌────────────────────────────────────────────┐
        │        Next.js 14 Frontend (Vercel)        │
        │  app/menu/[slug]   app/admin   app/restaurant│
        └──────────────────────┬─────────────────────┘
                               │ axios / fetch (JWT)
                               ▼
        ┌────────────────────────────────────────────┐
        │   Express + TypeScript Backend (Railway)   │
        │  Auth · Restaurant · Menu · QR · Analytics │
        │  Membership · Gallery · WaiterCall · Demo  │
        └──────────────┬─────────────────────────────┘
                       │ Prisma ORM
                       ▼
        ┌────────────────────────────────────────────┐
        │   PostgreSQL (Supabase Pooler)             │
        └────────────────────────────────────────────┘
                       ▲
                       │
        ┌──────────────┴────────────┐
        │  Cloudinary (görseller)   │
        │  Resend / Nodemailer      │
        │  (e-posta)                │
        └───────────────────────────┘
```

---

## 3. Klasör Yapısı

```
ben medya qr menü/
├── backend/                  # Express + TypeScript API
│   ├── src/
│   │   ├── server.ts         # Uygulama girişi (Express, CORS, route'lar)
│   │   ├── config/           # database, prisma, security, cloudinary, env
│   │   ├── controllers/      # HTTP istek işleyicileri (auth, menu, qr, ...)
│   │   ├── routes/           # Express router tanımları
│   │   ├── services/         # İş mantığı (analytics, qr, membership, gallery)
│   │   ├── middlewares/      # auth, error, logger, sanitize, rate-limit
│   │   ├── lib/email/        # E-posta şablonları & gönderim (Resend)
│   │   ├── types/            # TS tipleri
│   │   └── utils/            # Yardımcı fonksiyonlar
│   ├── prisma/
│   │   ├── schema.prisma     # Tüm veri modeli
│   │   ├── seed.ts           # Başlangıç verisi (admin, planlar)
│   │   └── migrations/       # PostgreSQL migration'ları
│   ├── uploads/              # Lokal yüklenen dosyalar (dev)
│   ├── Dockerfile
│   ├── nixpacks.toml         # Railway build config
│   └── vercel.json           # (alternatif) Vercel config
│
├── frontend/                 # Next.js 14 (App Router) + Tailwind
│   └── src/
│       ├── app/
│       │   ├── page.tsx              # Landing
│       │   ├── login/                # Giriş
│       │   ├── register/             # Kayıt
│       │   ├── demo/                 # Demo isteği formu
│       │   ├── menu/[slug]/          # Halka açık QR menü sayfası
│       │   ├── m/                    # Kısa link / yönlendirme
│       │   ├── restaurant/           # Restoran paneli
│       │   │   ├── dashboard/
│       │   │   ├── categories/
│       │   │   ├── menu/  menu-appearance/
│       │   │   ├── qr-codes/
│       │   │   ├── settings/
│       │   │   └── waiter-calls/
│       │   ├── admin/                # Süper Admin paneli
│       │   │   ├── dashboard/
│       │   │   ├── restaurants/  users/
│       │   │   ├── active-memberships/
│       │   │   ├── demo-memberships/
│       │   │   ├── inactive-memberships/
│       │   │   ├── demo-requests/
│       │   │   ├── gallery-assets/
│       │   │   └── analytics/
│       │   ├── ornek-menuler/        # Örnek menüler
│       │   ├── blog/  unauthorized/
│       │   ├── api/                  # Next.js API route'ları (proxy/yardımcı)
│       │   ├── sitemap.ts            # SEO sitemap
│       │   └── layout.tsx · providers.tsx
│       ├── components/  hooks/  store/  lib/  utils/  types/
│       └── data/
│
├── hostinger/  yeni-hostinger/   # Statik HTML paneller (alternatif/lite)
│   ├── index.html  login.html
│   ├── admin/  (dashboard.html, restaurants.html, users.html)
│   ├── restaurant/  (dashboard.html, menu.html, qr-codes.html, ...)
│   └── menu/index.html
│
├── docker-compose.yml          # Lokal Postgres + servisler
├── nixpacks.toml · railway.json # Railway dağıtımı
├── package.json                # Workspace scriptleri (concurrently)
└── git-push.ps1 · setup.ps1    # Yardımcı PowerShell scriptleri
```

---

## 4. Teknoloji Yığını

**Backend**
- Node.js 20.x · Express 4 · TypeScript 5
- Prisma 5 (PostgreSQL)
- JWT (`jsonwebtoken`) · `bcryptjs`
- `helmet`, `cors`, `express-rate-limit`, `express-validator`
- `multer` + `multer-storage-cloudinary` + `sharp` (görsel işleme)
- `qrcode`, `canvas`, `pdf-lib` (QR & PDF üretimi)
- `nodemailer` + `resend` (e-posta)
- `nanoid` (kısa kodlar)

**Frontend**
- Next.js 14 (App Router) · React 18 · TypeScript
- Tailwind CSS 3 + `tailwind-merge` + `clsx`
- TanStack React Query 5
- Zustand (global state) · React Hook Form + Zod
- Framer Motion · Lucide React · Recharts
- `react-qr-code` / `qrcode`
- `react-hot-toast`

**Altyapı**
- PostgreSQL (Supabase Pooler önerilir)
- Cloudinary (görsel CDN)
- Railway (backend) · Vercel (frontend) · Hostinger (statik panel)
- Docker / Nixpacks build

---

## 5. Roller & Yetkilendirme

`UserRole` enum (Prisma):

| Rol | Açıklama | Erişim |
|---|---|---|
| `SUPER_ADMIN` | BEN Medya yöneticisi | `/admin/*`, tüm restoranlar, üyelikler, demo talepleri, global galeri |
| `RESTAURANT_ADMIN` | Restoran sahibi/yöneticisi | `/restaurant/*`, kendi restoranı |
| `CUSTOMER` | Son müşteri (genelde anonim) | `/menu/[slug]`, garson çağırma |

JWT tabanlı auth: `Authorization: Bearer <token>`. Korunan endpoint'ler `auth.middleware` + rol kontrolüyle gate'lenir. Public menü uçları (`/api/public/*`) token gerektirmez.

---

## 6. Veri Modeli (Prisma)

Şema `backend/prisma/schema.prisma` içerisinde. Ana tablolar:

- **User** — Sistem kullanıcıları (`role`: SUPER_ADMIN / RESTAURANT_ADMIN / CUSTOMER), bcrypt parola.
- **Restaurant** — Tek owner'a bağlı işletme. `slug` benzersiz (public URL için), `memberNo`, `businessType` (RESTORAN/KAFE/OTEL/DIGER), tema renkleri, üyelik durumu, plan (`planId`), `isUpdating`, `maintenanceMode`, sosyal medya & adres alanları.
- **Plan** — Paket tanımı (`STARTER / GOLD / PLATIN`), özellik bayrakları (cart, ads, reklam, mobil panel, kampanya, hizmet alanları, detaylı raporlama), `qrMode` (SINGLE / PER_TABLE), `maxProducts`.
- **Category** — Restorana ait kategori, sıralama, aktiflik.
- **Product** — Ürün; fiyat, indirim, etiketler (`isNew`, `isPopular`, `isVegetarian`, `isVegan`, `isGlutenFree`, `isSpicy`), alerjen / içerik, görsel kaynağı (`UPLOAD` / `GALLERY`), galeri varlığı (`galleryAssetId`).
- **QRCode** — Restoran için QR. Tek QR veya masa başına QR (`tableNumber`). `code` benzersiz, `scanCount`, `imageData` (base64), `lastScannedAt`.
- **Image** — Yüklenmiş görsel kaydı (`LOGO / PRODUCT / CATEGORY / OTHER`).
- **GalleryAsset** — Hazır görsel kütüphanesi. `scope` GLOBAL (BEN Medya tarafından) veya RESTAURANT (kendi yüklediği). `type` (FOOD/DRINK/DESSERT/OTHER), kategori, etiket dizisi.
- **Analytics / MenuView / ProductView / RestaurantStatDaily** — Görüntülenme sayaçları (günlük tekil + ham etkinlik logu).
- **WaiterCall** — Garson çağırma (`callType`: WAITER/CHECK/CLEAN, `status`: PENDING/COMPLETED).
- **DemoRequest** — Sitedeki demo formundan gelen potansiyel müşteri kayıtları + satış sürecini izlemek için `potentialStatus`, `followUpMonth`, `notes`, üyelik tarihleri.

İlişkiler kademeli silmeyi (`onDelete: Cascade`) destekler — restoran silinince kategorileri, ürünleri, QR kodları, analytics, menu view'lar otomatik silinir.

---

## 7. Plan / Paket Sistemi

Üç paket: **STARTER**, **GOLD**, **PLATIN**. `Plan` tablosundaki bayraklarla aktif edilen özellikler:

| Özellik | Bayrak |
|---|---|
| Reklam alanları | `adsEnabled` |
| Temel raporlama | `reportingEnabled` |
| Detaylı raporlama | `detailedReportingEnabled` |
| Hizmet alanları (masa/bölge) | `serviceAreasEnabled` |
| Sepet | `cartEnabled` |
| Kampanya kategorisi | `campaignCategoryEnabled` |
| Mobil panel | `mobilePanelEnabled` |
| Maks. ürün sayısı | `maxProducts` (null = sınırsız) |
| QR modu | `qrMode` (`SINGLE` veya `PER_TABLE`) |

Üyelik durumu `MembershipStatus` (ACTIVE / EXPIRED / SUSPENDED) ve `membershipEndDate` ile izlenir. Süre dolanlar admin panelinde **Inactive Memberships** sekmesinde listelenir.

---

## 8. Modüller ve Özellikler

**Restoran Yöneticisi**
- Dashboard (özet istatistikler)
- Kategori CRUD (sıralama, görsel, aktif/pasif)
- Ürün CRUD (galeri/upload görsel, etiketler, indirim, alerjen, vejetaryen vb.)
- Menü görünüm ayarları (`menu-appearance`) — tema rengi, metin rengi, header görseli, çalışma saatleri
- QR kodları (tek QR veya masa başına QR, PDF indir, scanCount görüntüleme)
- Garson çağırma yönetimi (gelen çağrılar listesi, tamamla)
- Restoran ayarları (logo, sosyal medya, adres, çalışma saatleri, açık/kapalı / bakım modu)

**Süper Admin**
- Dashboard (genel KPI'lar)
- Restoran listesi + plan atama + üyelik tarihleri
- Kullanıcı yönetimi
- Üyelikler: aktif / demo / süresi dolmuş
- Demo talepleri (kanban-benzeri satış süreci)
- Global galeri (`gallery-assets`) — tüm restoranlara açık görseller
- Analytics (`/admin/analytics` + `superadmin-analytics` API'si)

**Müşteri (Public Menu)**
- `/menu/[slug]` — kategoriler, ürün kartları, etiketler, fiyat / indirim
- Garson çağırma (masa numarasıyla)
- Tema renkleri restoranın ayarlarına göre uygulanır
- `MenuView` ve `ProductView` ile ziyaret kayıtlanır

---

## 9. Backend API Yapısı

`backend/src/server.ts` aşağıdaki route prefix'lerini bağlar:

| Prefix | Açıklama |
|---|---|
| `/api/health` | Health check (DB ping) |
| `/api/auth` | Login, register, profil, parola değiştirme (rate-limit'li) |
| `/api/restaurants` | Restoran CRUD (RESTAURANT_ADMIN + SUPER_ADMIN) |
| `/api/menu` | Kategori & ürün yönetimi |
| `/api/qr` | QR oluşturma, listeleme, PDF, base64 görsel |
| `/api/public` | Token gerektirmeyen menü / restoran verisi |
| `/api/analytics` | Restoran düzeyi istatistikler |
| `/api/superadmin/analytics` | Tüm sistem istatistikleri |
| `/api/admin/memberships` | Üyelik / plan yönetimi |
| `/api/upload` | Cloudinary'e dosya yükleme |
| `/api/users` | Kullanıcı yönetimi |
| `/api/demo-requests` | Demo formu CRUD + satış süreci |
| `/api/gallery-assets` | Restoranın kendi galerisi + GLOBAL listeleme |
| `/api/admin/gallery-assets` | Süper admin'in global galeri yönetimi |
| `/api/waiter-call` | Garson çağırma (public POST + admin GET/PUT) |

Standart yanıt formatı:

```json
{ "success": true, "data": { ... } }
{ "success": false, "message": "Hata mesajı" }
```

Global `errorHandler`, validation hatalarını ve Prisma hatalarını standardize eder.

---

## 10. Frontend Yapısı (Next.js)

- **App Router** kullanılır (`src/app/...`).
- **Providers** (`providers.tsx`): React Query, Toast, tema sağlayıcısı.
- **State**: Zustand store'ları (auth, ui), React Query ile API cache.
- **Form**: `react-hook-form` + `zod` validation.
- **Stil**: Tailwind, restoran tema rengine göre dinamik CSS değişkenleri.
- **Public menü** (`app/menu/[slug]`): SSR/CSR karışık; `MenuView` event'i tetiklenir.
- **Kısa link** (`app/m/...`): QR'dan gelen kısa kodu uzun URL'e çevirir.
- **SEO**: `sitemap.ts` ve metadata API'si.
- **API proxy**: Bazı uçlar için `app/api/...` ile Next.js handler'ları.

---

## 11. Statik Paneller (Hostinger)

`hostinger/` ve `yeni-hostinger/` altında **vanilla HTML/JS** paneller bulunur. Bunlar Next.js panele alternatif olarak Hostinger'da host edilebilen lite admin/restaurant arayüzleridir. Aynı backend API'sini kullanırlar (`/api/...`) ve JWT'yi `localStorage`'da tutarlar.

İçerik:
- `index.html`, `login.html`
- `admin/dashboard.html`, `admin/restaurants.html`, `admin/users.html`
- `restaurant/dashboard.html`, `menu.html`, `categories.html`, `qr-codes.html`, `settings.html`
- `menu/index.html` (public menü)

---

## 12. Güvenlik

- **Helmet** — HTTP başlıkları
- **CORS** — credentials destekli
- **Rate limit** — `apiLimiter` (genel), `authLimiter` (login/register), yalnızca production
- **`sanitizeInput` middleware** — XSS koruması (girdi temizleme)
- **JWT** — kısa ömür + role tabanlı koruma
- **bcryptjs** — parola hash (10+ round)
- **express-validator** — controller seviyesi input doğrulama
- **Prisma** parametrik sorguları kullanır (SQL injection koruması)
- **Body limit**: 10mb (görsel base64 yükleme için)

> Üretimde her servis kendi `.env` dosyasını kullanmalı, `JWT_SECRET` güçlü olmalı ve `NODE_ENV=production` ayarlanmalıdır.

---

## 13. Performans & Önbellekleme

- **Supabase Pooler** ile PgBouncer üzerinden connection pooling (`backend/SUPABASE_POOLER_SETUP.md`).
- Prisma index'leri yoğun sorgulanan alanlara eklendi (`restaurantId`, `slug`, `createdAt`, `order`...).
- React Query ile client cache + stale-while-revalidate.
- Cloudinary ile transform + CDN.
- `frontend/.../FRONTEND_QR_OPTIMIZATION.ts` — QR sayfası için özel optimizasyon.
- `RestaurantStatDaily` ile günlük rollup → analytics sorguları hızlanır.
- Performans test scriptleri: `backend/test-login-performance.js`, `backend/test-qr-performance.js`.
- Detaylar: `backend/PERFORMANCE_OPTIMIZATION_REPORT.md`.

---

## 14. E-posta Sistemi

- `backend/src/lib/email/` — şablonlar ve gönderici.
- `nodemailer` (SMTP) **veya** `resend` (API) destekler.
- Demo isteği geldiğinde admin'e bildirim, yeni restoran kaydında hoşgeldin maili.
- Yapılandırma: `backend/EMAIL_SETUP.md`, test rehberi: `backend/EMAIL_TEST_GUIDE.md`, demo akışı: `backend/DEMO_REQUEST_EMAIL_SYSTEM.md`.

---

## 15. Görsel Yönetimi (Cloudinary + Galeri)

İki kaynak:
1. **UPLOAD** — Restoran kendi cihazından yükler → `multer-storage-cloudinary` → `Image` kaydı.
2. **GALLERY** — `GalleryAsset` tablosundaki hazır görsellerden seçer.
   - `GLOBAL`: süper admin tüm restoranlara açar.
   - `RESTAURANT`: restoranın kendi galerisi.

`Product.imageSource` enum'u hangisinin kullanıldığını gösterir; `galleryAssetId` ile galeri varlığına bağlanır. `sharp` ile sunucu tarafı resize / optimize yapılır.

---

## 16. QR Üretimi

- `qrcode` paketiyle SVG/PNG üretimi.
- `canvas` ile logo ortalanmış renklendirilmiş QR.
- `pdf-lib` ile yazdırılabilir A4 PDF (masa numaralı).
- `QRCode.imageData` alanı base64 önbelleği — anlık göstermek için.
- Plan `qrMode = PER_TABLE` ise her masa için ayrı kod (`tableNumber` doldurularak `nanoid` ile benzersiz `code`).
- `lastScannedAt` ve `scanCount` her okutmada güncellenir.

---

## 17. Analitik & Raporlama

İki katman:

1. **Ham etkinlik**: `MenuView`, `ProductView` (her ziyaret/tıklama).
2. **Rollup**: `Analytics` (gün × restoran × ürün benzersiz) ve `RestaurantStatDaily` (günlük özet).

Endpoint'ler:
- `/api/analytics` — restoran kendi raporu (görüntülenme, top ürünler, cihaz dağılımı).
- `/api/superadmin/analytics` — tüm sistem (toplam restoran, aktif üye, günlük menü açılışı).

Frontend'de **Recharts** ile çizgi/bar grafikler.

---

## 18. Demo Talep & Satış Süreci

`DemoRequest` tablosu satış pipeline'ı görevi görür:

- `status`: `PENDING → DEMO_CREATED → FOLLOW_UP / NEGATIVE`
- `potentialStatus`: detaylı durum (HIGH_PROBABILITY, EVALUATING, LONG_TERM, NEGATIVE...)
- `followUpMonth`: ileri tarihli takip
- `notes`: serbest metin satış notları
- `membershipStartDate / EndDate`: demo periyodu

Süper admin `/admin/demo-requests` ekranında bu kayıtları yönetir; gerekirse demo restoran (gerçek `Restaurant` kaydı) açar.

---

## 19. Garson Çağırma

- Public menü sayfasında müşteri masa numarası + çağrı türü seçer (`WAITER` / `CHECK` / `CLEAN`).
- `POST /api/waiter-call` — token gerektirmez.
- Restoran panelinde `waiter-calls` ekranı (ideal olarak polling / SSE ile) gelen çağrıları gösterir, "tamamlandı" ile `status = COMPLETED` yapılır.

---

## 20. Kurulum (Local)

### Ön koşullar
- Node.js **20.x**
- npm 10+
- PostgreSQL 14+ (lokal veya Supabase)
- (opsiyonel) Docker & Docker Compose

### 1) Repoyu klonla & bağımlılıklar
```powershell
git clone <repo-url>
cd "ben medya qr menü"
npm install                      # workspace (concurrently)
cd backend; npm install; cd ..
cd frontend; npm install; cd ..
```

### 2) Veritabanı
```powershell
# Lokal Postgres istiyorsan:
docker compose up -d
```
Ya da Supabase'den `DATABASE_URL` ve `DIRECT_URL` al.

### 3) `.env` dosyaları
- `backend/.env` ve `frontend/.env.local` oluştur (bkz. [Bölüm 21](#21-ortam-değişkenleri)).
- `.env.example` referans olarak kullanılabilir.

### 4) Prisma migration & seed
```powershell
cd backend
npm run prisma:generate
npm run prisma:migrate          # mevcut migration'ları uygular
npm run prisma:seed             # admin kullanıcı + planlar
cd ..
```

### 5) Geliştirme sunucusu
Kök dizinden:
```powershell
npm run dev                     # backend + frontend birlikte
```
veya ayrı ayrı:
```powershell
npm run dev:backend             # http://localhost:5000
npm run dev:frontend            # http://localhost:3000
```

Admin girişi varsayılan olarak `prisma/seed.ts` içinde tanımlanır (ör. `admin@benmedya.com` + seed şifresi). Şifre sıfırlama scripti: `backend/reset-admin-password.js`.

---

## 21. Ortam Değişkenleri

### `backend/.env`
```env
# Server
NODE_ENV=development
PORT=5000

# Database (Supabase Pooler önerilir)
DATABASE_URL="postgresql://USER:PASS@HOST:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://USER:PASS@HOST:5432/postgres"

# Auth
JWT_SECRET="çok-uzun-rastgele-bir-secret"
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Email (Resend ya da SMTP)
RESEND_API_KEY="re_..."
EMAIL_FROM="BEN Medya <noreply@benmedya.com>"
ADMIN_EMAIL="info@benmedya.com"

# (opsiyonel) SMTP fallback
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

### `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

---

## 22. Dağıtım (Deployment)

### Backend → Railway
- `railway.json` ve `nixpacks.toml` mevcut.
- Build: `npm run build` (Prisma generate + tsc).
- Start: `npm start` (`node dist/server.js`).
- Health check: `GET /health` (DB ping).
- Ortam değişkenleri Railway dashboard'dan girilir.
- DB için Supabase Pooler URL'leri kullanılır (`SUPABASE_POOLER_SETUP.md`).

### Frontend → Vercel
- `frontend/` kökünden Next.js projesi olarak import edilir.
- `NEXT_PUBLIC_API_URL` Railway URL'iyle ayarlanır.
- App Router otomatik algılanır.

### Hostinger (statik panel)
- `yeni-hostinger/` içindeki HTML dosyaları FTP/Hostinger File Manager ile yüklenir.
- İçindeki JS, `NEXT_PUBLIC_API_URL` benzeri sabitle backend'e bağlanır (dosyaların başındaki `API_BASE` değişkenini güncelleyin).

### Docker
`docker-compose.yml` lokal Postgres + servis ayağa kaldırmak için.
`backend/Dockerfile` ve `frontend/Dockerfile` mevcuttur.

---

## 23. Yararlı Komutlar

Workspace kökü:
```powershell
npm run dev               # backend + frontend
npm run build             # her ikisini build et
npm run start             # her ikisini prod modda başlat
npm run prisma:generate   # prisma client üret
npm run prisma:migrate    # migration uygula
npm run prisma:studio     # Prisma Studio
```

Backend yardımcı scriptleri:
```powershell
node check-db.js                # DB bağlantısı testi
node check-users.js             # Kullanıcı listele
node create-admin.js            # Admin oluştur
node create-restaurant.js       # Test restoranı oluştur
node reset-admin-password.js    # Admin şifresini sıfırla
node test-login-performance.js  # Login perf testi
node test-qr-performance.js     # QR perf testi
node test-demo-request.js       # Demo formu testi
```

PowerShell yardımcıları (kök):
```powershell
.\quick-setup.ps1     # Hızlı kurulum
.\setup.ps1           # Detaylı kurulum
.\test-backend.ps1    # Backend smoke test
.\git-push.ps1        # Otomatik commit + push
```

---

## 24. Sorun Giderme

| Sorun | Çözüm |
|---|---|
| `prisma generate` Linux'ta hata veriyor | `schema.prisma` `binaryTargets` zaten çoklu hedef içeriyor; `npm run prisma:generate` tekrar çalıştırın |
| Railway "no DATABASE_URL" | Railway → Variables sekmesinden `DATABASE_URL` ve `DIRECT_URL` ekleyin |
| Vercel'de CORS hatası | Backend `corsOptions.origin = true` zaten açık; frontend env'deki `NEXT_PUBLIC_API_URL` doğru mu kontrol edin |
| 401 / token süresi | `JWT_EXPIRES_IN` artırın veya frontend'de refresh akışı uygulayın |
| Görsel yüklenmiyor | Cloudinary credential'ları + `body limit` (10mb) yeterli mi |
| `MenuView` çoğalıyor | `ProductView` / `MenuView` ham log; rapor için `RestaurantStatDaily` kullanın |
| QR taranınca sayaç artmıyor | Public menüye gelirken `?code=...` query'sinin geçirildiğinden emin olun |
| Login rate-limit | Production'da `authLimiter` aktiftir; geliştirme için `NODE_ENV=development` kullanın |

---

## Lisans & Telif

© BEN Medya. Tüm hakları saklıdır. Bu proje özel mülkiyettir; izinsiz kopyalanamaz / dağıtılamaz.

---

### Hızlı Başlangıç Özeti

```powershell
git clone <repo>
cd "ben medya qr menü"
npm install ; cd backend ; npm install ; cd ../frontend ; npm install ; cd ..
# .env dosyalarını doldur
cd backend ; npm run prisma:migrate ; npm run prisma:seed ; cd ..
npm run dev
# Frontend: http://localhost:3000   ·   Backend: http://localhost:5000
```
