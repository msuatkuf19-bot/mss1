# Cloudinary Kurulum Rehberi

## Cloudinary Nedir?
Cloudinary, görselleri ve videoları bulutta saklayan, optimize eden ve dağıtan bir cloud storage servisidir. Render.com gibi platformlarda dosya sistemi geçici olduğu için (ephemeral), görseller için Cloudinary gibi bir servis şarttır.

## Adımlar

### 1. Cloudinary Hesabı Oluşturma
1. [Cloudinary](https://cloudinary.com/) sitesine gidin
2. "Sign Up for Free" butonuna tıklayın
3. Email ile ücretsiz hesap oluşturun
4. Email'inizi doğrulayın

### 2. API Credential'larını Alma
1. Cloudinary Dashboard'a gidin: https://cloudinary.com/console
2. Ana sayfada şunları göreceksiniz:
   - **Cloud Name**: sizin-cloud-adiniz
   - **API Key**: 123456789012345
   - **API Secret**: abcdefghijklmnopqrstuv
3. Bu bilgileri not alın

### 3. Backend Environment Variables
Render.com Dashboard'da backend servisinize gidin:

**Environment Variables** bölümüne şunları ekleyin:
```
CLOUDINARY_CLOUD_NAME=sizin-cloud-adiniz
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuv
```

### 4. Lokal Geliştirme (.env)
Backend klasöründeki `.env` dosyasına ekleyin:
```env
CLOUDINARY_CLOUD_NAME=sizin-cloud-adiniz
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuv
```

### 5. Paketleri Yükleyin
```bash
cd backend
npm install
```

### 6. Deploy
```bash
git add .
git commit -m "Add Cloudinary integration for image storage"
git push origin main
```

## Önemli Notlar

### Ücretsiz Plan Limitleri
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/ay
- **Transformations**: 25,000/ay

Bu limitler küçük-orta ölçekli restoranlar için yeterlidir.

### Varolan Görseller
Cloudinary entegrasyonundan önce yüklenen görseller (local `/uploads` klasöründe) artık çalışmayacaktır. Bu görsellerin tekrar yüklenmesi gerekir.

**Çözüm**:
1. Admin panelinden ürünleri düzenleyin
2. Görselleri yeniden yükleyin
3. Yeni yüklenen görseller Cloudinary'de saklanacak

### Görsel URL Formatı
- **Eski (Local)**: `/uploads/optimized-file-123.jpg`
- **Yeni (Cloudinary)**: `https://res.cloudinary.com/your-cloud/image/upload/v123/qr-menu/restaurant-id/optimized-file-123.jpg`

## Test Etme

1. Render.com'da backend deploy tamamlandıktan sonra
2. Admin panelinden bir ürün oluşturun
3. Görsel yükleyin
4. Cloudinary Dashboard'da görselin geldiğini kontrol edin: https://cloudinary.com/console/media_library
5. QR menüden ürünü görüntüleyin, görselin yüklendiğini doğrulayın

## Sorun Giderme

### Görsel Yüklenmiyor
- Cloudinary credential'larını kontrol edin
- Render.com environment variables'ları doğru girilmiş mi?
- Backend loglarını kontrol edin: Render Dashboard → Logs

### 404 Hatası
- Cloudinary URL'i doğru mu?
- Görseller Cloudinary'e yüklenmiş mi? (Media Library'de kontrol edin)

### Eski Görseller Görünmüyor
- Normal, eski görseller local `/uploads` klasöründeydi
- Ephemeral storage nedeniyle silinmiş olabilir
- Çözüm: Görselleri yeniden yükleyin

## Destek
Sorun yaşarsanız: info@menuben.com
