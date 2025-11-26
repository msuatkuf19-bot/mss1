# Backend API Test Komutları

## 1. Health Check (Backend çalışıyor mu?)
GET https://your-railway-url.railway.app/health

Beklenen cevap:
{
  "status": "ok",
  "timestamp": "..."
}

## 2. İlk Admin Kullanıcı Oluştur
POST https://your-railway-url.railway.app/api/auth/register

Headers:
Content-Type: application/json

Body:
{
  "email": "admin@example.com",
  "password": "Admin123!@#",
  "name": "Admin User",
  "role": "SUPER_ADMIN"
}

## 3. Login Test
POST https://your-railway-url.railway.app/api/auth/login

Body:
{
  "email": "admin@example.com",
  "password": "Admin123!@#"
}

Response'da token alacaksınız:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}

## 4. Token ile Protected Endpoint Test
GET https://your-railway-url.railway.app/api/users/me

Headers:
Authorization: Bearer YOUR_TOKEN_HERE
