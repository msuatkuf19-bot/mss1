/**
 * Uygulama Konfigürasyonu
 * 
 * Tüm environment variables bu dosyada merkezi olarak yönetilir.
 * Railway, Vercel gibi platformlarda otomatik olarak env değişkenleri algılanır.
 * 
 * Kullanım: import { config } from './config';
 */

import dotenv from 'dotenv';

// .env dosyasını yükle (varsa)
dotenv.config();

/**
 * Ana Konfigürasyon Objesi
 */
export const config = {
  /**
   * Server Port
   * Railway otomatik olarak PORT değişkenini sağlar
   */
  port: parseInt(process.env.PORT || '5000'),
  
  /**
   * Çalışma Ortamı
   * Değerler: development, production, test
   */
  nodeEnv: process.env.NODE_ENV || 'development',
  
  /**
   * Frontend URL - CORS için gerekli
   * Development: http://localhost:3000
   * Production: Vercel/Netlify URL'iniz
   */
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  /**
   * Veritabanı URL
   * Railway PostgreSQL plugin'i otomatik olarak DATABASE_URL sağlar
   */
  databaseUrl: process.env.DATABASE_URL,
  
  /**
   * JWT (JSON Web Token) Ayarları
   */
  jwt: {
    // Production'da mutlaka güçlü bir secret kullanın!
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    // Token geçerlilik süresi (7 gün varsayılan)
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  /**
   * Dosya Yükleme Ayarları
   */
  upload: {
    // Yüklenen dosyaların dizini
    dir: process.env.UPLOAD_DIR || './uploads',
    // Maksimum dosya boyutu (5MB)
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
    // İzin verilen dosya tipleri
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
  },
  
  /**
   * CORS Ayarları
   * Production'da frontend URL'inizi ekleyin
   */
  cors: {
    // İzin verilen origin'ler - environment bazlı
    origin: process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL || 'https://your-frontend.vercel.app']
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  },
  
  /**
   * Rate Limiting Ayarları
   * DDoS ve spam saldırılarına karşı koruma
   */
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 dakika
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // IP başına limit
  },
};

/**
 * Konfigürasyon Validasyonu
 * Kritik değişkenlerin varlığını kontrol eder
 */
export const validateConfig = () => {
  const requiredVars = ['DATABASE_URL'];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Eksik environment variables:', missing.join(', '));
    console.error('📝 Lütfen .env dosyasını kontrol edin veya Railway Variables sekmesinden ekleyin');
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Eksik environment variables: ${missing.join(', ')}`);
    }
  }
  
  // Production'da JWT secret kontrolü
  if (process.env.NODE_ENV === 'production' && 
      config.jwt.secret === 'your-secret-key-change-in-production') {
    console.warn('⚠️  UYARI: Production ortamında varsayılan JWT secret kullanılıyor!');
    console.warn('⚠️  Güvenlik için mutlaka güçlü bir JWT_SECRET değeri ayarlayın.');
  }
};
