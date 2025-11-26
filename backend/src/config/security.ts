import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Rate limiting yapılandırması
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // Her IP için maksimum 100 deneme (development için artırıldı)
  message: 'Çok fazla giriş denemesi, lütfen 15 dakika sonra tekrar deneyin',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Development'ta localhost'tan gelen istekleri atla
    const isDev = process.env.NODE_ENV !== 'production';
    const isLocalhost = req.ip === '::1' || req.ip === '127.0.0.1' || req.ip === '::ffff:127.0.0.1';
    return isDev && isLocalhost;
  }
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 1000, // Her IP için maksimum 1000 istek (development için artırıldı)
  message: 'Çok fazla istek gönderildi, lütfen 15 dakika sonra tekrar deneyin',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Development'ta localhost'tan gelen istekleri atla
    const isDev = process.env.NODE_ENV !== 'production';
    const isLocalhost = req.ip === '::1' || req.ip === '127.0.0.1' || req.ip === '::ffff:127.0.0.1';
    return isDev && isLocalhost;
  }
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 20, // Her IP için maksimum 20 upload
  message: 'Çok fazla dosya yükleme denemesi, lütfen 1 saat sonra tekrar deneyin',
});

// Helmet yapılandırması
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});
