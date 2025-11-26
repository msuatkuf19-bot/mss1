# Backend API Test - PowerShell Komutları
# Railway URL'inizi BACKEND_URL değişkenine yazın

# 1. Backend URL'inizi buraya yazın
$BACKEND_URL = "https://backend-production-f340d.up.railway.app"


# 2. Health Check
Write-Host "`n=== Health Check ===" -ForegroundColor Green
Invoke-RestMethod -Uri "$BACKEND_URL/health" -Method Get | ConvertTo-Json

# 3. Admin Kullanıcı Oluştur
Write-Host "`n=== Creating Admin User ===" -ForegroundColor Green
$registerBody = @{
    email = "admin@qrmenu.com"
    password = "Admin123!@#"
    name = "Super Admin"
    role = "SUPER_ADMIN"
} | ConvertTo-Json

$registerResponse = Invoke-RestMethod -Uri "$BACKEND_URL/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
Write-Host "User created: $($registerResponse.data.user.email)" -ForegroundColor Yellow

# 4. Login
Write-Host "`n=== Login ===" -ForegroundColor Green
$loginBody = @{
    email = "admin@qrmenu.com"
    password = "Admin123!@#"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$BACKEND_URL/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.data.token
Write-Host "Token alındı!" -ForegroundColor Yellow
Write-Host "Token: $token`n" -ForegroundColor Gray

# 5. Token ile Kullanıcı Bilgisi Al
Write-Host "`n=== Get Current User ===" -ForegroundColor Green
$headers = @{
    "Authorization" = "Bearer $token"
}
$userResponse = Invoke-RestMethod -Uri "$BACKEND_URL/api/users/me" -Method Get -Headers $headers
$userResponse | ConvertTo-Json

Write-Host "`n✅ Backend API çalışıyor!" -ForegroundColor Green
Write-Host "Frontend'i deploy etmeye hazırsınız!" -ForegroundColor Cyan
