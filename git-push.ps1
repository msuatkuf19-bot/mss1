# QR Menü - GitHub Push Script
# VS Code'u kapatıp açtıktan sonra bu scripti çalıştırın

# 1. Git repository başlat (eğer yoksa)
git init

# 2. Tüm dosyaları ekle
git add .

# 3. Commit yap
git commit -m "PostgreSQL migration complete - Full QR Menu System ready for deployment"

# 4. GitHub repository'yi remote olarak ekle (mss-qr)
# Not: GitHub'da repository oluşturduysanız URL'i buraya yazın
# git remote add origin https://github.com/KULLANICI_ADINIZ/mss-qr.git

# 5. Main branch olarak ayarla
git branch -M main

# 6. Push yap
# git push -u origin main

Write-Host "✅ Git hazır! Şimdi:"
Write-Host "1. GitHub'da 'mss-qr' repository'sini oluşturun"
Write-Host "2. git remote add origin https://github.com/KULLANICI_ADINIZ/mss-qr.git"
Write-Host "3. git push -u origin main"
