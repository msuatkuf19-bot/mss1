# 🍽️ Restoran Menü Yönetim & QR Kod Erişim Sistemi

Restoranların menülerini dijital ortamda kolayca yönetmesini ve müşterilerin QR kod okutarak doğrudan ilgili restorana ait menüye ulaşmasını sağlayan modern, full-stack web uygulaması.

## 🎯 Özellikler

### 👑 Süper Admin
- Tüm restoranları görüntüleme ve yönetme
- Restoran ekleme/düzenleme/silme
- Kullanıcı oluşturma ve yetki verme
- Platform geneli raporlar ve istatistikler
- Sistem geneli ayarlar

### 🏪 Restoran Admini
- Kendi restoranına özel admin paneli
- Menü kategorileri ve ürünleri yönetimi (CRUD)
- Ürün görselleri, fiyatlar ve açıklamalar güncelleme
- QR kod oluşturma ve indirme
- Müşteri görüntüleme raporları ve analytics

### 👥 Müşteriler
- QR kod ile direkt menü erişimi
- Mobil responsive menü görüntüleme
- Kategorilere göre ürün filtreleme
- Ürün detayları (fiyat, açıklama, görsel)
- Arama ve favori özellikleri

## 🛠️ Teknoloji Stack

### Backend
- Node.js + Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Multer & Sharp (görsel yönetimi)
- QRCode (QR kod üretimi)

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query
- Zustand (state management)
- Axios

## 📦 Kurulum

### Gereksinimler
- Node.js 18+ 
- PostgreSQL 14+
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repo-url>
cd qr-menu-system
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment değişkenlerini ayarlayın**

Backend için `.env` dosyası oluşturun:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/qr_menu_db"
JWT_SECRET="your-secret-key"
PORT=5000
```

Frontend için `.env.local` dosyası oluşturun:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. **Veritabanını oluşturun**
```bash
npm run prisma:migrate
npm run prisma:generate
```

5. **Geliştirme sunucularını başlatın**
```bash
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## 📚 API Dokümantasyonu

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Giriş yapma
- `POST /api/auth/refresh` - Token yenileme

### Restaurants (Süper Admin)
- `GET /api/restaurants` - Tüm restoranlar
- `POST /api/restaurants` - Yeni restoran oluştur
- `PUT /api/restaurants/:id` - Restoran güncelle
- `DELETE /api/restaurants/:id` - Restoran sil

### Menu Management (Restoran Admin)
- `GET /api/menu/categories` - Kategorileri listele
- `POST /api/menu/categories` - Kategori oluştur
- `GET /api/menu/products` - Ürünleri listele
- `POST /api/menu/products` - Ürün oluştur
- `PUT /api/menu/products/:id` - Ürün güncelle
- `DELETE /api/menu/products/:id` - Ürün sil

### QR Codes
- `GET /api/qr/:restaurantId` - QR kod oluştur
- `GET /api/menu/:restaurantId` - Müşteri menü görüntüleme

### Analytics
- `GET /api/analytics/dashboard` - Dashboard verileri
- `GET /api/analytics/views` - Görüntülenme istatistikleri

## 🗂️ Proje Yapısı

```
qr-menu-system/
├── backend/
│   ├── src/
│   │   ├── config/         # Konfigürasyon dosyaları
│   │   ├── controllers/    # Route controller'ları
│   │   ├── middlewares/    # Express middleware'ler
│   │   ├── models/         # Prisma model tipleri
│   │   ├── routes/         # API route tanımları
│   │   ├── services/       # İş mantığı
│   │   ├── utils/          # Yardımcı fonksiyonlar
│   │   └── server.ts       # Ana sunucu dosyası
│   ├── prisma/
│   │   └── schema.prisma   # Veritabanı şeması
│   ├── uploads/            # Yüklenen dosyalar
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   ├── components/     # React bileşenleri
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility fonksiyonlar
│   │   ├── services/       # API servisleri
│   │   ├── store/          # Zustand store
│   │   └── types/          # TypeScript tipleri
│   └── package.json
└── package.json            # Root workspace

```

## 🚀 Deployment

### Backend (Railway/Render)
1. PostgreSQL database oluşturun
2. Environment değişkenlerini ayarlayın
3. `npm run build` ile build alın
4. `npm start` ile başlatın

### Frontend (Vercel)
1. GitHub repository'ye push edin
2. Vercel'e import edin
3. Environment değişkenlerini ekleyin
4. Deploy edin

## 📄 Lisans

ISC

## 👨‍💻 Geliştirici

Sorularınız için iletişime geçin.
