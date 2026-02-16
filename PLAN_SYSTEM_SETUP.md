# Plan/Paket Sistemi Kurulum Rehberi

## 📋 Yapılan Değişiklikler

### 1. Veritabanı (Prisma Schema)
- `PlanCode` enum eklendi (STARTER, GOLD, PLATIN)
- `QrMode` enum eklendi (SINGLE, PER_TABLE)
- `Plan` modeli eklendi (paket özellikleri)
- `Restaurant` modeline `planId` alanı eklendi

### 2. Backend Controllers
- **restaurant.controller.ts**: 
  - `createRestaurant` - planCode zorunlu alan
  - `updateRestaurant` - planCode opsiyonel (paket değiştirme)
  - Liste ve detaylarda plan bilgisi dahil edildi
  
- **menu.controller.ts**: 
  - Ürün oluşturmada `checkProductLimit()` kontrolü
  
- **qr.controller.ts**: 
  - QR oluşturmada `checkQrMode()` kontrolü (SINGLE modda masa QR engelli)

### 3. Plan Middleware (`plan.middleware.ts`)
- `checkProductLimit()` - Ürün limit kontrolü
- `checkFeature()` - Özellik flag kontrolü
- `checkQrMode()` - QR mode kontrolü
- `getRestaurantPlan()` - Plan bilgisi getir
- `getPlanByCode()` - PlanCode'dan ID getir

### 4. Frontend (TypeScript Types & Forms)
- `restaurant.ts` - Plan tiipleri eklendi
- `restaurant.ts` (validations) - planCode zorunlu alan
- Yeni restoran formunda paket seçici dropdown

---

## 🚀 Migration Komutları

```bash
# 1. Backend klasörüne git
cd backend

# 2. Prisma migration oluştur
npx prisma migrate dev --name add_plan_system

# 3. Seed çalıştır (STARTER, GOLD, PLATIN paketlerini oluşturur)
npx prisma db seed

# 4. Prisma Client'ı yeniden oluştur
npx prisma generate
```

---

## 📦 Paket Özellikleri

| Özellik | STARTER | GOLD | PLATIN |
|---------|---------|------|--------|
| Maksimum Ürün | 30 | Sınırsız | Sınırsız |
| QR Modu | Tek QR | Masa Bazlı | Tek QR |
| Reklamlar | ✓ | ✓ | ✗ |
| Raporlama | ✗ | ✓ | ✓ |
| Detaylı Raporlama | ✗ | ✓ | ✗ |
| Servis Bölgeleri | ✗ | ✓ | ✗ |
| Sepet | ✗ | ✓ | ✗ |
| Kampanya Kategorisi | ✗ | ✓ | ✗ |
| Mobil Panel | ✗ | ✓ | ✗ |

---

## 🔐 Backend Enforced Kuralları

### Ürün Limiti (STARTER: 30)
```
POST /api/menu/products
→ 403 PLAN_LIMIT_PRODUCTS: "Paket ürün limitine ulaşıldı"
```

### QR Mode (SINGLE modda masa QR engelli)
```
POST /api/qr/generate?tableNumber=5
→ 403 PLAN_QR_SINGLE_ONLY: "Başlangıç paketinde masa bazlı QR kod oluşturulamaz"
```

### Feature Guards (örn: reportingEnabled)
```typescript
// Controller'da kullanım
await checkFeature(restaurantId, 'reportingEnabled');
// → 403 PLAN_FEATURE_DISABLED: "Raporlama özelliği mevcut paketinizde bulunmuyor"
```

---

## 🎯 API Kullanımı

### Restoran Oluşturma
```json
POST /api/restaurants
{
  "name": "Test Restoran",
  "planCode": "STARTER",  // ZORUNLU
  "ownerName": "...",
  "ownerEmail": "...",
  "ownerPassword": "...",
  "membershipStartDate": "2025-01-01",
  "membershipEndDate": "2026-01-01"
}
```

### Paket Değiştirme
```json
PUT /api/restaurants/:id
{
  "planCode": "GOLD"  // Opsiyonel
}
```

---

## ⚠️ Önemli Notlar

1. **Mevcut Restoranlar**: Migration sonrası `planId` null olacak. 
   - Manuel olarak plan ataması yapın veya
   - Bir script ile toplu güncelleme yapın

2. **UI Bypass Engeli**: Tüm limitler backend'de enforce edilir.
   - Frontend sadece görsel uyarı gösterir
   - Gerçek engel backend'den gelir

3. **Plan Değişikliği**: Paket downgrade durumunda mevcut ürünler silinmez,
   sadece yeni ürün ekleme engellenir.
