# QR Menü Sistemi - Hızlı Kurulum

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 QR Menü Sistemi - Hızlı Kurulum" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Root paketleri
Write-Host "📦 Root paketleri yükleniyor..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) { 
    Write-Host "❌ Hata!" -ForegroundColor Red
    exit 1 
}
Write-Host "✅ Root paketleri yüklendi" -ForegroundColor Green

# 2. Backend paketleri
Write-Host ""
Write-Host "📦 Backend paketleri yükleniyor..." -ForegroundColor Yellow
cd backend
npm install
if ($LASTEXITCODE -ne 0) { 
    Write-Host "❌ Hata!" -ForegroundColor Red
    exit 1 
}
Write-Host "✅ Backend paketleri yüklendi" -ForegroundColor Green

# 3. Frontend paketleri
Write-Host ""
Write-Host "📦 Frontend paketleri yükleniyor..." -ForegroundColor Yellow
cd ../frontend
npm install
if ($LASTEXITCODE -ne 0) { 
    Write-Host "❌ Hata!" -ForegroundColor Red
    exit 1 
}
Write-Host "✅ Frontend paketleri yüklendi" -ForegroundColor Green

cd ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ KURULUM TAMAMLANDI!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Sonraki Adımlar:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. PostgreSQL veritabanı oluştur:" -ForegroundColor White
Write-Host '   psql -U postgres -c "CREATE DATABASE qr_menu_db;"' -ForegroundColor Gray
Write-Host ""
Write-Host "2. Backend .env dosyasını düzenle:" -ForegroundColor White
Write-Host "   backend\.env" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Prisma migration çalıştır:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npx prisma migrate dev --name init" -ForegroundColor Gray
Write-Host "   npx prisma generate" -ForegroundColor Gray
Write-Host "   npm run prisma:seed" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Projeyi başlat:" -ForegroundColor White
Write-Host "   cd .." -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 URL'ler:" -ForegroundColor Cyan
Write-Host "   Frontend:    http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:5000" -ForegroundColor White
Write-Host ""
