import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateToken, verifyToken } from '../utils/jwt';
import { ApiError, sendSuccess } from '../utils/response';

// PostgreSQL UserRole enum values
const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN' as const,
  RESTAURANT_ADMIN: 'RESTAURANT_ADMIN' as const,
  CUSTOMER: 'CUSTOMER' as const
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, role } = req.body;

    // Email kontrolü
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ApiError(400, 'Bu email zaten kullanılıyor');
    }

    // Şifreyi hashle
    const hashedPassword = await hashPassword(password);

    // Kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || UserRole.CUSTOMER,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // Access token oluştur
    const accessToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Refresh token oluştur (uzun ömürlü)
    const refreshToken = generateToken(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      '7d'
    );

    sendSuccess(
      res,
      {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      'Kayıt başarılı',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  // Login isteği detaylarını logluyoruz
  console.log('🔐 Login request:', {
    method: req.method,
    path: req.path,
    body: { email: req.body.email, password: '***' },
    origin: req.headers.origin,
  });
  try {
    const { email, password } = req.body;

    // Kullanıcı kontrolü
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError(401, 'Email veya şifre hatalı');
    }

    // Şifre kontrolü
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Email veya şifre hatalı');
    }

    // Aktif kullanıcı kontrolü
    if (!user.isActive) {
      throw new ApiError(403, 'Hesabınız devre dışı bırakılmış');
    }

    // Restoran admin ise restaurant id'sini al
    let restaurantId;
    if (user.role === UserRole.RESTAURANT_ADMIN) {
      const restaurant = await prisma.restaurant.findFirst({
        where: { ownerId: user.id },
        select: { id: true },
      });
      restaurantId = restaurant?.id;
    }

    // Access token oluştur (kısa ömürlü)
    const accessToken = generateToken(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        restaurantId,
      },
      '15m'
    );

    // Refresh token oluştur (uzun ömürlü)
    const refreshToken = generateToken(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        restaurantId,
      },
      '7d'
    );

    sendSuccess(
      res,
      {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          restaurantId,
        },
      },
      'Giriş başarılı'
    );
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'Kullanıcı bulunamadı');
    }

    // Restoran admin ise restaurant id'sini al
    let restaurantId;
    if (user.role === UserRole.RESTAURANT_ADMIN) {
      const restaurant = await prisma.restaurant.findFirst({
        where: { ownerId: user.id },
        select: { id: true },
      });
      restaurantId = restaurant?.id;
    }

    sendSuccess(res, { ...user, restaurantId });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      throw new ApiError(400, 'Refresh token gerekli');
    }

    // Token'ı doğrula
    const decoded = verifyToken(token);

    // Kullanıcıyı kontrol et
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new ApiError(401, 'Geçersiz token');
    }

    // Yeni access token oluştur
    const accessToken = generateToken(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        restaurantId: decoded.restaurantId,
      },
      '15m'
    );

    sendSuccess(res, { accessToken }, 'Token yenilendi');
  } catch (error) {
    next(new ApiError(401, 'Geçersiz veya süresi dolmuş refresh token'));
  }
};
