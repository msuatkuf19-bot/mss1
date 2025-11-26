# QR Menü Sistemi - Kurulum Script'i

Write-Host "🚀 QR Menü Sistemi Kurulumu Başlıyor..." -ForegroundColor Cyan
Write-Host ""

# 1. Root paketleri yükle
Write-Host "📦 Root bağımlılıkları yükleniyor..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Root paket kurulumu başarısız!" -ForegroundColor Red
    exit 1
}

# 2. Backend paketleri yükle
Write-Host ""
Write-Host "📦 Backend bağımlılıkları yükleniyor..." -ForegroundColor Yellow
cd backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend paket kurulumu başarısız!" -ForegroundColor Red
    exit 1
}

# 3. Frontend paketleri yükle
Write-Host ""
Write-Host "📦 Frontend bağımlılıkları yükleniyor..." -ForegroundColor Yellow
cd ../frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend paket kurulumu başarısız!" -ForegroundColor Red
    exit 1
}

cd ..

# 4. Environment dosyalarını kontrol et
Write-Host ""
Write-Host "🔍 Environment dosyaları kontrol ediliyor..." -ForegroundColor Yellow

if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  backend\.env dosyası bulunamadı, oluşturuluyor..." -ForegroundColor Yellow
    Copy-Item ".env.example" -Destination "backend\.env"
    Write-Host "✅ backend\.env oluşturuldu (lütfen düzenleyin)" -ForegroundColor Green
}

if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "⚠️  frontend\.env.local dosyası bulunamadı" -ForegroundColor Yellow
    Write-Host "   (Zaten oluşturulmuş olmalı)" -ForegroundColor Gray
}

# 5. PostgreSQL kontrolü
Write-Host ""
Write-Host "🗄️  PostgreSQL kontrolü..." -ForegroundColor Yellow
$pgVersion = psql --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ PostgreSQL kurulu: $pgVersion" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "📊 Veritabanı oluşturmak ister misiniz? (E/H)" -ForegroundColor Cyan
    $createDb = Read-Host
    
    if ($createDb -eq "E" -or $createDb -eq "e") {
        Write-Host "Veritabanı adı (varsayılan: qr_menu_db): " -NoNewline
        $dbName = Read-Host
        if ([string]::IsNullOrEmpty($dbName)) {
            $dbName = "qr_menu_db"
        }
        
        Write-Host "PostgreSQL kullanıcı adı (varsayılan: postgres): " -NoNewline
        $dbUser = Read-Host
        if ([string]::IsNullOrEmpty($dbUser)) {
            $dbUser = "postgres"
        }
        
        $createDbCommand = "CREATE DATABASE $dbName;"
        Write-Host "Çalıştırılacak komut: $createDbCommand" -ForegroundColor Gray
        
        # SQL komutunu çalıştır
        $createDbCommand | psql -U $dbUser 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Veritabanı oluşturuldu: $dbName" -ForegroundColor Green
            
            # .env dosyasını güncelle
            $envContent = Get-Content "backend\.env" -Raw
            $newDbUrl = "DATABASE_URL=`"postgresql://${dbUser}:${dbUser}@localhost:5432/${dbName}`""
            $envContent = $envContent -replace 'DATABASE_URL=".*"', $newDbUrl
            Set-Content "backend\.env" -Value $envContent
            
            Write-Host "✅ backend\.env dosyası güncellendi" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Veritabanı zaten var veya oluşturulamadı" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "⚠️  PostgreSQL bulunamadı!" -ForegroundColor Yellow
    Write-Host "   PostgreSQL'i şuradan indirebilirsiniz: https://www.postgresql.org/download/" -ForegroundColor Gray
}

# 6. Prisma migration
Write-Host ""
Write-Host "🔄 Prisma migration çalıştırılıyor..." -ForegroundColor Yellow
cd backend

$runMigration = Read-Host "Prisma migration çalıştırılsın mı? (E/H)"
if ($runMigration -eq "E" -or $runMigration -eq "e") {
    npx prisma migrate dev --name init
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migration tamamlandı" -ForegroundColor Green
        
        # 7. Prisma generate
        Write-Host ""
        Write-Host "⚙️  Prisma client oluşturuluyor..." -ForegroundColor Yellow
        npx prisma generate
        
        # 8. Seed data
        Write-Host ""
        $runSeed = Read-Host "Demo data yüklensin mi? (E/H)"
        if ($runSeed -eq "E" -or $runSeed -eq "e") {
            npm run prisma:seed
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Demo data yüklendi" -ForegroundColor Green
                Write-Host ""
                Write-Host "📝 Demo Hesaplar:" -ForegroundColor Cyan
                Write-Host "   Süper Admin:" -ForegroundColor White
                Write-Host "     Email: admin@qrmenu.com" -ForegroundColor Gray
                Write-Host "     Şifre: admin123" -ForegroundColor Gray
                Write-Host ""
                Write-Host "   Restoran Admin:" -ForegroundColor White
                Write-Host "     Email: restaurant1@example.com" -ForegroundColor Gray
                Write-Host "     Şifre: password123" -ForegroundColor Gray
            }
        }
    } else {
        Write-Host "❌ Migration başarısız!" -ForegroundColor Red
        Write-Host "   Lütfen backend\.env dosyasındaki DATABASE_URL'i kontrol edin" -ForegroundColor Yellow
    }
}

cd ..

# 9. Özet
Write-Host ""
Write-Host "="*70 -ForegroundColor Cyan
Write-Host "✅ KURULUM TAMAMLANDI!" -ForegroundColor Green
Write-Host "="*70 -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Başlatma Komutları:" -ForegroundColor Cyan
Write-Host "   npm run dev              # Hem backend hem frontend başlat" -ForegroundColor White
Write-Host "   npm run dev:backend      # Sadece backend başlat" -ForegroundColor White
Write-Host "   npm run dev:frontend     # Sadece frontend başlat" -ForegroundColor White
Write-Host ""
Write-Host "🌐 URL'ler:" -ForegroundColor Cyan
Write-Host "   Frontend:    http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "📚 Daha fazla bilgi için:" -ForegroundColor Cyan
Write-Host "   KURULUM.md" -ForegroundColor White
Write-Host "   HIZLI_BASLANGIC.md" -ForegroundColor White
Write-Host ""
