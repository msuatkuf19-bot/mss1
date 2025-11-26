# Frontend Vercel Deploy Rehberi

## 1. Vercel Hesabı Oluştur
https://vercel.com/signup
GitHub ile giriş yap

## 2. GitHub Repository'yi Import Et
- Vercel Dashboard → Add New → Project
- Import Git Repository → `msuatkuf19-bot/qr-men-g-ncel` seçin

## 3. Framework Preset
- **Framework Preset**: Next.js
- **Root Directory**: `frontend` (ÖNEMLİ!)
- **Build Command**: `npm run build` (otomatik)
- **Output Directory**: `.next` (otomatik)

## 4. Environment Variables Ekle
**Name**: NEXT_PUBLIC_API_URL
**Value**: https://your-railway-url.railway.app (Railway'den aldığınız URL)

## 5. Deploy
- Deploy butonuna tıkla
- 2-3 dakika bekle
- Vercel size URL verecek: https://qr-men-g-ncel.vercel.app

## 6. Railway'de FRONTEND_URL Güncelle
- Railway Dashboard → Variables
- `FRONTEND_URL` değerini Vercel URL'iniz ile değiştirin
- Örnek: https://qr-men-g-ncel.vercel.app

## 7. Railway'i Redeploy Et
Variables değiştiğinde otomatik redeploy olacak

## VEYA: Netlify İle Deploy

### Netlify Kurulum:
```powershell
# Frontend klasörüne git
cd frontend

# Build yap
npm run build

# Netlify'a deploy (CLI kurulu değilse: npm install -g netlify-cli)
netlify deploy --prod
```

Netlify Dashboard'da:
- Build Command: `npm run build`
- Publish Directory: `.next`
- Environment Variables: `NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app`

---

## ✅ Deployment Tamamlandığında:

1. Frontend URL: `https://qr-men-g-ncel.vercel.app`
2. Backend URL: `https://qr-men-g-ncel-production.railway.app`
3. Database: Neon.tech PostgreSQL

## 🎯 Test Akışı:

1. Frontend'e git: `https://qr-men-g-ncel.vercel.app/register`
2. Admin hesabı oluştur
3. Login ol
4. Restaurant oluştur
5. QR kod oluştur
6. Menü ekle

Tamamdır! 🚀
