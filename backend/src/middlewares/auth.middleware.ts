import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';
import { ApiError } from '../utils/response';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// AuthRequest - authenticated request with user info
export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Token bulunamadı');
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, 'Geçersiz veya süresi dolmuş token'));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Yetkilendirme gerekli'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Bu işlem için yetkiniz yok'));
    }

    next();
  };
};

// Restaurant ownership kontrolü - sadece kendi restoranına erişim
export const requireRestaurantOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new ApiError(401, 'Yetkilendirme gerekli'));
    }

    // Super admin her şeye erişebilir
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    // Restaurant admin sadece kendi restoranına erişebilir
    if (req.user.role === 'RESTAURANT_ADMIN') {
      const restaurantId = req.params.restaurantId || req.body.restaurantId;
      
      if (!restaurantId) {
        return next(new ApiError(400, 'Restaurant ID gerekli'));
      }

      // Kullanıcının restaurant ID'sini kontrol et
      if (req.user.restaurantId !== restaurantId) {
        return next(new ApiError(403, 'Bu restorana erişim yetkiniz yok'));
      }
    }

    next();
  } catch (error) {
    next(new ApiError(500, 'Yetki kontrolü başarısız'));
  }
};
