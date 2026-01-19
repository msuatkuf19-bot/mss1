# 🍽️ BEN Medya - QR Menü Yönetim Sistemi

<div align="center">

![BEN Medya Logo](https://img.shields.io/badge/BEN%20Medya-QR%20Men%C3%BC-blue?style=for-the-badge)

[![Node.js](https://img.shields.io/badge/Node.js-v20.x-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**🚀 Modern, Multi-Tenant Dijital Menü Yönetim Sistemi**

*Restoranlar, kafeler ve oteller için profesyonel QR kodlu dijital menü çözümü*

[🌐 Demo](https://qr-menu-demo.railway.app) • [📖 Dokümantasyon](#-kurulum) • [🐛 Sorun Bildir](https://github.com/benmedya/qr-menu/issues)

</div>

---

## 📋 İçindekiler

- [✨ Özellikler](#-özellikler)
- [🛠️ Teknoloji Stack](#️-teknoloji-stack)
- [📁 Proje Yapısı](#-proje-yapısı)
- [🚀 Hızlı Başlangıç](#-hızlı-başlangıç)
- [⚙️ Konfigürasyon](#️-konfigürasyon)
- [📚 API Dokümantasyonu](#-api-dokümantasyonu)
- [🐳 Docker](#-docker)
- [☁️ Deployment](#️-deployment)
- [🔒 Güvenlik](#-güvenlik)
- [📊 Performans](#-performans)
- [🤝 Katkıda Bulunma](#-katkıda-bulunma)
- [📜 Lisans](#-lisans)

---

## ✨ Özellikler

### 🎯 Ana Özellikler

| Özellik | Açıklama |
|---------|----------|
| 🏢 **Multi-Tenant Mimari** | Her işletme kendi bağımsız veri alanına sahip |
| 📱 **QR Kod Entegrasyonu** | Otomatik QR kod üretimi ve yönetimi |
| ⚡ **Gerçek Zamanlı Güncelleme** | Anlık menü değişiklikleri |
| 🎨 **Responsive Design** | Mobil ve masaüstü uyumlu arayüz |
| 🔐 **Rol Bazlı Erişim** | Süper Admin, Restoran Admin, Müşteri rolleri |
| 📈 **Analytics Dashboard** | Detaylı görüntüleme istatistikleri ve raporlar |
| 🖼️ **Cloudinary Entegrasyonu** | Profesyonel görsel yönetimi |
| 🌍 **Çoklu Dil Desteği** | Türkçe ve İngilizce |

### 👑 Süper Admin Paneli

```
✅ Tüm işletmeleri görüntüleme ve yönetme
✅ Yeni işletme ekleme (otomatik üye numarası, slug, QR kod)
✅ Kullanıcı oluşturma ve yetkilendirme
✅ Platform geneli raporlar ve istatistikler
✅ Üyelik yönetimi (başlangıç/bitiş tarihi)
✅ İşletme tipi seçimi (Restoran/Kafe/Otel/Diğer)
```

### 🏪 İşletme Admin Paneli

```
✅ Kendi işletmesine özel admin paneli
✅ Menü kategorileri ve ürünleri yönetimi
✅ Ürün görselleri, fiyatlar ve açıklamalar
✅ QR kod özelleştirme ve indirme
✅ Müşteri görüntüleme raporları
✅ İşletme bilgileri ve ayarlar
```

### 👥 Müşteri Deneyimi

```
✅ QR kod ile direkt menü erişimi
✅ Mobil responsive menü görüntüleme
✅ Kategorilere göre filtreleme
✅ Ürün arama özelliği
✅ Smooth animasyonlar
✅ Hızlı yükleme süreleri
```

---

## 🛠️ Teknoloji Stack

### Backend

| Teknoloji | Versiyon | Kullanım Alanı |
|-----------|----------|----------------|
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) | 20.x | JavaScript Runtime |
| ![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white) | 4.18 | Web Framework |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | 5.3 | Type Safety |
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) | 15+ | Veritabanı |
| ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white) | 5.22 | ORM |
| ![JWT](https://img.shields.io/badge/-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) | 9.0 | Authentication |

### Frontend

| Teknoloji | Versiyon | Kullanım Alanı |
|-----------|----------|----------------|
| ![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white) | 14.0 | React Framework |
| ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) | 18.2 | UI Library |
| ![Tailwind](https://img.shields.io/badge/-Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | 3.4 | CSS Framework |
| ![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=flat-square&logo=reactquery&logoColor=white) | 5.14 | State Management |
| ![Zustand](https://img.shields.io/badge/-Zustand-brown?style=flat-square) | 4.4 | Client State |
| ![Framer](https://img.shields.io/badge/-Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white) | 12.x | Animations |

### DevOps & Servisler

| Servis | Kullanım |
|--------|----------|
| 🐳 Docker | Container Platform |
| 🚂 Railway | Backend Deployment |
| ▲ Vercel | Frontend Deployment |
| 🐘 Neon | Serverless PostgreSQL |
| ☁️ Cloudinary | Görsel CDN |

---

## 📁 Proje Yapısı

```
ben medya qr menü/
├── 📁 backend/                    # Backend API
│   ├── 📁 src/
│   │   ├── 📁 config/            # Konfigürasyon dosyaları
│   │   ├── 📁 controllers/       # API Controllers
│   │   ├── 📁 middlewares/       # Auth, CORS, Rate Limit
│   │   ├── 📁 routes/            # Express Routes
│   │   ├── 📁 services/          # İş Mantığı
│   │   ├── 📁 types/             # TypeScript Tipleri
│   │   ├── 📁 utils/             # Yardımcı Fonksiyonlar
│   │   └── 📄 server.ts          # Ana Sunucu
│   ├── 📁 prisma/
│   │   ├── 📄 schema.prisma      # Veritabanı Şeması
│   │   └── 📄 seed.ts            # Demo Veriler
│   ├── 📄 Dockerfile
│   └── 📄 package.json
│
├── 📁 frontend/                   # Next.js Frontend
│   ├── 📁 src/
│   │   ├── 📁 app/               # Next.js App Router
│   │   │   ├── 📁 admin/         # Admin Paneli
│   │   │   ├── 📁 auth/          # Giriş/Kayıt
│   │   │   └── 📁 menu/          # Müşteri Menü
│   │   ├── 📁 components/        # React Bileşenleri
│   │   ├── 📁 hooks/             # Custom Hooks
│   │   ├── 📁 lib/               # Kütüphaneler
│   │   ├── 📁 store/             # Zustand Store
│   │   ├── 📁 types/             # TypeScript Tipleri
│   │   └── 📁 utils/             # Yardımcı Fonksiyonlar
│   ├── 📄 Dockerfile
│   └── 📄 package.json
│
├── 📄 docker-compose.yml          # Docker Compose
├── 📄 package.json                # Root Package
└── 📄 README.md                   # Bu Dosya
```

---

## 🚀 Hızlı Başlangıç

### Ön Koşullar

```bash
# Node.js v20.x
node --version

# PostgreSQL 15+
psql --version

# Git
git --version
```

### 1️⃣ Projeyi Klonlayın

```bash
git clone https://github.com/benmedya/qr-menu-system.git
cd qr-menu-system
```

### 2️⃣ Bağımlılıkları Yükleyin

```bash
# Root dependencies
npm install

# Backend dependencies
cd backend && npm install && cd ..

# Frontend dependencies
cd frontend && npm install && cd ..
```

### 3️⃣ Environment Dosyalarını Oluşturun

**Backend `.env`:**
```env
# Database
DATABASE_URL="postgresql://qrmenu:qrmenu123@localhost:5432/qr_menu_db"
DIRECT_URL="postgresql://qrmenu:qrmenu123@localhost:5432/qr_menu_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Cloudinary (Opsiyonel)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME="BEN Medya QR Menü"
```

### 4️⃣ Veritabanını Hazırlayın

```bash
cd backend

# Migration çalıştır
npm run prisma:migrate

# Prisma Client oluştur
npm run prisma:generate

# Demo data yükle
npm run prisma:seed

cd ..
```

### 5️⃣ Geliştirme Sunucusunu Başlatın

```bash
# Her iki servisi aynı anda başlat
npm run dev
```

| Servis | URL |
|--------|-----|
| 🌐 Frontend | http://localhost:3000 |
| 🔧 Backend API | http://localhost:5000 |
| 📊 Prisma Studio | `npm run prisma:studio` |

### 🔑 Demo Hesapları

| Rol | Email | Şifre |
|-----|-------|-------|
| 👑 Süper Admin | admin@qrmenu.com | admin123 |
| 🏪 Restoran Admin | restaurant1@example.com | password123 |

---

## ⚙️ Konfigürasyon

### Backend Environment Variables

| Değişken | Açıklama | Varsayılan |
|----------|----------|------------|
| `DATABASE_URL` | PostgreSQL bağlantı URL'i | - |
| `JWT_SECRET` | JWT imzalama anahtarı (min 32 karakter) | - |
| `PORT` | Sunucu portu | 5000 |
| `NODE_ENV` | Ortam (development/production) | development |
| `CORS_ORIGIN` | İzin verilen origin | http://localhost:3000 |
| `CLOUDINARY_*` | Cloudinary API bilgileri | - |

### Frontend Environment Variables

| Değişken | Açıklama | Varsayılan |
|----------|----------|------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | http://localhost:5000 |
| `NEXT_PUBLIC_APP_NAME` | Uygulama adı | QR Menü |

---

## 📚 API Dokümantasyonu

### Authentication

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@qrmenu.com",
  "password": "admin123"
}
```

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "İşletme Sahibi",
  "email": "owner@restaurant.com",
  "password": "password123"
}
```

### Restoranlar

```http
# Tüm restoranları listele (Admin)
GET /api/restaurants
Authorization: Bearer <token>

# Yeni restoran oluştur (Super Admin)
POST /api/admin/restaurants
Authorization: Bearer <token>
Content-Type: application/json

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

### Menü Yönetimi

```http
# Kategorileri listele
GET /api/menu/categories?restaurantId=<uuid>

# Yeni kategori oluştur
POST /api/menu/categories
{
  "name": "Ana Yemekler",
  "description": "Nefis ana yemek seçenekleri",
  "order": 1
}

# Yeni ürün oluştur
POST /api/menu/products
{
  "name": "Izgara Köfte",
  "description": "Özel baharatlarla hazırlanmış köfte",
  "price": 89.90,
  "categoryId": "<category-uuid>"
}
```

### QR Kod

```http
# QR kod oluştur/getir
GET /api/qr/:restaurantId

# QR kod tara (redirect)
GET /api/qr/scan/:code

# Public menü (üyelik kontrolü ile)
GET /api/public/menu/:slug
```

---

## 🐳 Docker

### Development

```bash
# Tüm servisleri başlat
docker-compose up -d

# Logları izle
docker-compose logs -f

# Servisleri durdur
docker-compose down
```

### Docker Compose Yapısı

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: qr_menu_db
      POSTGRES_USER: qrmenu
      POSTGRES_PASSWORD: qrmenu123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## ☁️ Deployment

### 🚂 Railway (Backend)

```bash
# Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up
```

**Detaylı Rehber:** [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)

### ▲ Vercel (Frontend)

```bash
# Vercel CLI
npm install -g vercel
cd frontend
vercel --prod
```

**Detaylı Rehber:** [FRONTEND_DEPLOY_GUIDE.md](FRONTEND_DEPLOY_GUIDE.md)

### 🐘 Neon (Database)

1. [neon.tech](https://neon.tech) hesabı oluşturun
2. Yeni veritabanı oluşturun
3. Connection string'i `DATABASE_URL`'e ekleyin

**Detaylı Rehber:** [NEON_DEPLOYMENT_GUIDE.md](NEON_DEPLOYMENT_GUIDE.md)

---

## 🔒 Güvenlik

| Özellik | Uygulama |
|---------|----------|
| 🔐 **Authentication** | JWT Tokens (7 gün geçerlilik) |
| 👤 **Authorization** | Role-based Access Control (RBAC) |
| 🔑 **Password** | bcrypt (12 rounds) |
| 🛡️ **Rate Limiting** | 100 istek/dakika per IP |
| 🌐 **CORS** | Whitelist origin yapılandırması |
| 💉 **SQL Injection** | Prisma ORM koruması |
| ⚔️ **XSS** | Content Security Policy |
| 📁 **File Upload** | Tip ve boyut validasyonu |

---

## 📊 Performans

### Backend Metrikleri

| Metrik | Hedef |
|--------|-------|
| Response Time | < 200ms |
| Throughput | 1000 req/s |
| Database Queries | Optimized with Prisma |
| File Upload | Sharp compression |

### Frontend Metrikleri

| Metrik | Hedef |
|--------|-------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3s |
| Bundle Size | < 500KB (gzipped) |

---

## 🔧 Troubleshooting

### Sık Karşılaşılan Sorunlar

**🔴 Database bağlantı hatası:**
```bash
# PostgreSQL servisini kontrol et
pg_ctl status

# Bağlantı string'ini doğrula
echo $DATABASE_URL
```

**🔴 Port kullanımda:**
```powershell
# Windows'ta portu kapat
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**🔴 Prisma migration hatası:**
```bash
cd backend
npx prisma migrate reset
npm run prisma:migrate
npm run prisma:seed
```

---

## 🤝 Katkıda Bulunma

1. 🍴 Fork yapın
2. 🌿 Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. 💾 Commit yapın (`git commit -m 'feat: add amazing feature'`)
4. 📤 Push yapın (`git push origin feature/amazing-feature`)
5. 🔄 Pull Request açın

### Commit Kuralları

```
feat: yeni özellik
fix: hata düzeltme
docs: dokümantasyon
style: kod formatı
refactor: kod yeniden yapılandırma
test: test ekleme
chore: genel bakım
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
copies of the Software...
```

---

## 📞 İletişim

<div align="center">

| Platform | Link |
|----------|------|
| 🌐 Website | [benmedya.com](https://benmedya.com) |
| 📧 Email | info@benmedya.com |
| 🐙 GitHub | [github.com/benmedya](https://github.com/benmedya) |

---

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın! ⭐**

<sub>Made with ❤️ by BEN Medya Team</sub>

</div>
