# ==============================================
# NEON.TECH + RAILWAY DEPLOYMENT GUIDE
# ==============================================

## 1. NEON.TECH HESAP OLUŞTURMA

1. https://neon.tech adresine gidin
2. GitHub ile Sign Up yapın (ücretsiz)
3. "Create a project" butonuna tıklayın
4. Project adı verin (örn: qr-menu-production)
5. Region seçin (AWS - eu-central-1 veya us-east-1)
6. PostgreSQL version: 16 (varsayılan)
7. "Create project" tıklayın

## 2. NEON DATABASE CONNECTION STRING ALMA

Proje oluşturulduktan sonra:

1. Dashboard'da "Connection Details" bölümünü açın
2. "Connection string" seçeneğini seçin
3. Şu formatta bir string göreceksiniz:

```
postgresql://neondb_owner:XXXXXXXXXXXXX@ep-cool-forest-12345678.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

4. Bu string'i kopyalayın ✅

## 3. LOKAL TEST (Opsiyonel)

Backend .env dosyasını düzenleyin:

```bash
DATABASE_URL="your-neon-connection-string-here"
```

Ardından:

```bash
cd backend
npm install
npx prisma migrate deploy  # Migrationları çalıştır
npx prisma db seed        # Örnek data ekle (opsiyonel)
npm run dev               # Test et
```

## 4. RAILWAY DEPLOYMENT

### A) Railway'de PostgreSQL Pluginini Kaldırın (varsa)
- Railway Dashboard → Services → PostgreSQL → Settings → Delete Service

### B) Environment Variables Ayarlayın

Railway Dashboard → Backend Service → Variables:

```env
NODE_ENV=production
PORT=5000

# Neon.tech'ten kopyaladığınız connection string
DATABASE_URL=postgresql://neondb_owner:XXX@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# Güçlü bir JWT secret oluşturun (terminal: openssl rand -base64 32)
JWT_SECRET=your-super-secure-random-jwt-secret-here

# Frontend URL'iniz (Vercel/Netlify deploy sonrası)
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Upload settings
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
JWT_EXPIRES_IN=7d
```

### C) Deploy Ayarları

Railway otomatik olarak:
1. ✅ Kodu çeker
2. ✅ npm install çalıştırır
3. ✅ Prisma generate yapar
4. ✅ Build yapar
5. ✅ Migrationları deploy eder
6. ✅ Sunucuyu başlatır

## 5. NEON.TECH AVANTAJLARI

✅ **Serverless**: Kullanmadığınızda otomatik uyur
✅ **Ücretsiz**: 500 MB storage
✅ **Otoscaling**: Trafik arttıkça ölçeklenir
✅ **Hızlı**: Connection pooling built-in
✅ **Backup**: Otomatik yedekleme (ücretli planda)
✅ **Monitoring**: Dashboard'da query analytics

## 6. İLK KULLANICI OLUŞTURMA

Deploy sonrası:

```bash
# POST https://your-backend-url.railway.app/api/auth/register

{
  "email": "admin@example.com",
  "password": "YourSecurePassword123",
  "name": "Admin User",
  "role": "SUPER_ADMIN"
}
```

veya Postman/Thunder Client ile test edin.

## 7. SORUN GİDERME

### Migration Hatası:
```bash
# Railway logs'ta migration hatası görürseniz:
# Railway Dashboard → Deployments → Son deployment → Logs
```

### Connection Hatası:
- DATABASE_URL'de ?sslmode=require olduğundan emin olun
- Neon'da IP whitelist yoktur, her yerden bağlanabilir

### Build Hatası:
- Railway logs kontrol edin
- TypeScript hatalarını düzeltin
- npm run build komutunu lokalde test edin

## 8. ÜRETİM ÖNCESİ KONTROL LİSTESİ

- [ ] DATABASE_URL Neon.tech'ten alındı
- [ ] JWT_SECRET güçlü ve benzersiz
- [ ] FRONTEND_URL doğru domain
- [ ] NODE_ENV=production
- [ ] Railway'de build başarılı
- [ ] Migration'lar deploy edildi
- [ ] İlk admin kullanıcı oluşturuldu
- [ ] API endpoint'leri test edildi
- [ ] Frontend backend'e bağlanıyor

## 9. MALİYET

**Neon.tech**: $0/ay (500 MB'a kadar)
**Railway**: $5/ay kullanım kredisi (backend deploy)

Toplam: ~$5/ay (sadece Railway backend için)

## 10. GELECEKTEKİ DEPLOYMENT'LAR

Her git push otomatik deploy edilir:

```bash
git add .
git commit -m "feature: yeni özellik"
git push origin main
```

Railway otomatik olarak:
1. Yeni kodu çeker
2. Build yapar
3. Migration varsa çalıştırır
4. Yeni versiyonu deploy eder
5. Zero-downtime deployment yapar

---

**Hazır! 🚀**

Sorularınız için: Railway Logs veya Neon Dashboard'u kontrol edin.
