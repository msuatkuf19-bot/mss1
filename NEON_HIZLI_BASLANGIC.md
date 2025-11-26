# 🚀 Neon.tech ile Canlıya Alma - Hızlı Başlangıç

## Adım 1: Neon.tech'te Database Oluştur

1. **https://neon.tech** → GitHub ile giriş yap
2. **"Create a project"** tıkla
3. İsim ver: `qr-menu-production`
4. **Region seç**: AWS eu-central-1 (Avrupa) veya us-east-1 (Amerika)
5. **Create** tıkla

## Adım 2: Connection String'i Kopyala

Proje açıldıktan sonra:
- **Connection Details** → **Connection string** kopyala
- Şöyle görünecek:
```
postgresql://neondb_owner:XXXXX@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

## Adım 3: Railway'de Environment Variables Ekle

Railway Dashboard → Backend Service → **Variables**:

```env
DATABASE_URL=buraya-neon-connection-string-yapıştır
JWT_SECRET=rastgele-güçlü-şifre-buraya
FRONTEND_URL=https://frontend-url.vercel.app
NODE_ENV=production
PORT=5000
```

**JWT_SECRET oluşturmak için** (PowerShell):
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Adım 4: Deploy Et

```bash
git add .
git commit -m "Add Neon.tech database"
git push origin main
```

Railway otomatik deploy edecek! ✅

## Test Et

Railway deploy linkine git (örn: `https://xxx.railway.app`):
```
https://your-backend.railway.app/api/auth/health
```

✅ Çalışıyorsa hazırsın!

---

**Detaylı dokümantasyon**: `NEON_DEPLOYMENT_GUIDE.md`
