import { Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { ApiError, sendSuccess } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';
import { hashPassword } from '../utils/bcrypt';
import { sendWelcomeKvkkEmail } from '../lib/email/sendWelcomeKvkk';

// SQLite için UserRole string sabitleri
const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  RESTAURANT_ADMIN: 'RESTAURANT_ADMIN',
  CUSTOMER: 'CUSTOMER'
};

// Tüm kullanıcıları listele (Süper Admin)
export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('[GET /api/users] Fetching all users (simple mode)');
    
    // Basit sorgu - assignedRestaurant olmadan (migration sonrası eklenecek)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        plainPassword: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    console.log('[GET /api/users] Found', users.length, 'users');
    sendSuccess(res, users);
  } catch (error) {
    console.error('[GET /api/users] Error:', error);
    next(error);
  }
};

// Kullanıcı detayı
export const getUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
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

    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

// Yeni kullanıcı oluştur (Süper Admin)
export const createUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('[POST /api/users] Request body:', JSON.stringify(req.body, null, 2));
    
    // Request body'den alanları al
    const { email, name, password, role, isActive } = req.body;
    // Frontend "restaurantId" olarak gönderiyor, backend "assignedRestaurantId" olarak kullanıyor
    let restaurantId = req.body.restaurantId || req.body.assignedRestaurantId;
    
    // restaurantId boş string ise undefined yap
    if (restaurantId === '' || restaurantId === null) {
      restaurantId = undefined;
    }

    // ===== VALIDATION =====
    if (!email || typeof email !== 'string') {
      console.error('[POST /api/users] Validation error: Email gerekli');
      throw new ApiError(400, 'Email adresi gereklidir');
    }
    
    if (!password || typeof password !== 'string' || password.length < 6) {
      console.error('[POST /api/users] Validation error: Şifre gerekli/kısa');
      throw new ApiError(400, 'Şifre en az 6 karakter olmalıdır');
    }
    
    if (!name || typeof name !== 'string') {
      console.error('[POST /api/users] Validation error: İsim gerekli');
      throw new ApiError(400, 'İsim gereklidir');
    }

    // ===== EMAIL UNIQUE KONTROLÜ =====
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      console.error('[POST /api/users] Email already exists:', email);
      throw new ApiError(409, 'Bu email adresi zaten kullanılıyor');
    }

    // ===== RESTORAN KONTROLÜ =====
    const userRole = role || UserRole.CUSTOMER;
    
    // SUPER_ADMIN için restaurantId zorunlu değil
    // Diğer roller için restaurantId gönderildiyse kontrol et
    if (restaurantId && userRole !== UserRole.SUPER_ADMIN) {
      console.log('[POST /api/users] Checking restaurant:', restaurantId);
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { id: true, name: true },
      });
      
      if (!restaurant) {
        console.error('[POST /api/users] Restaurant not found:', restaurantId);
        throw new ApiError(400, 'Seçilen işletme bulunamadı');
      }
      console.log('[POST /api/users] Restaurant found:', restaurant.name);
    }

    // ===== ŞİFRE HASH =====
    const hashedPassword = await hashPassword(password);

    // ===== KULLANICI OLUŞTUR =====
    // Basit versiyon - assignedRestaurantId devre dışı (migration sonrası eklenecek)
    const createData: any = {
      email: email.toLowerCase().trim(),
      name: name.trim(),
      password: hashedPassword,
      plainPassword: password, // Admin görünürlüğü için açık şifre saklanır
      role: userRole as any,
      isActive: isActive !== false, // default true
    };
    
    console.log('[POST /api/users] Creating user with data:', { ...createData, password: '[HIDDEN]' });
    
    const user = await prisma.user.create({
      data: createData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
    
    console.log('[POST /api/users] User created successfully:', user.id);

    // Hoş geldiniz + KVKK maili gönder (async, hata durumunda kullanıcı kaydı yine başarılı)
    let emailSent = false;
    try {
      console.log('[USER] Attempting to send welcome email to:', user.email);
      const appUrl = process.env.APP_URL || 'http://localhost:3000';
      const emailResult = await sendWelcomeKvkkEmail({
        to: user.email,
        name: user.name || '',
        loginEmail: user.email,
        loginUrl: `${appUrl}/login`,
        // tempPassword: password, // Güvenlik için şifreyi göndermiyoruz
        includePassword: false,
      });
      emailSent = emailResult.success;
      
      if (!emailSent) {
        console.warn('⚠️  Welcome email could not be sent:', emailResult.error);
      }
    } catch (emailError: any) {
      console.error('❌ Welcome email error:', emailError.message);
    }

    sendSuccess(
      res, 
      { ...user, emailSent }, 
      emailSent 
        ? 'Kullanıcı başarıyla oluşturuldu ve hoş geldiniz e-postası gönderildi' 
        : 'Kullanıcı başarıyla oluşturuldu (e-posta gönderilemedi)',
      201
    );
  } catch (error) {
    next(error);
  }
};

// Kullanıcı güncelle
export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, email, role, isActive } = req.body;
    
    console.log('[PUT /api/users/:id] Updating user:', id, { name, email, role });

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(404, 'Kullanıcı bulunamadı');
    }

    // Email değişiyorsa kontrol et
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
      if (existingUser) {
        throw new ApiError(409, 'Bu email adresi zaten kullanılıyor');
      }
    }

    // Update data objesi - basit versiyon (assignedRestaurantId migration sonrası eklenecek)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    console.log('[PUT /api/users/:id] User updated:', updatedUser.id);
    sendSuccess(res, updatedUser, 'Kullanıcı başarıyla güncellendi');
  } catch (error) {
    console.error('[PUT /api/users/:id] Error:', error);
    next(error);
  }
};

// Kullanıcı sil (Süper Admin)
export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Kendini silemesin
    if (id === req.user?.userId) {
      throw new ApiError(400, 'Kendi hesabınızı silemezsiniz');
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(404, 'Kullanıcı bulunamadı');
    }

    await prisma.user.delete({ where: { id } });

    sendSuccess(res, null, 'Kullanıcı başarıyla silindi');
  } catch (error) {
    next(error);
  }
};

// Şifre sıfırla (Süper Admin) - hem hash hem plainPassword günceller
export const resetUserPassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || typeof password !== 'string' || password.length < 6) {
      throw new ApiError(400, 'Şifre en az 6 karakter olmalıdır');
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(404, 'Kullanıcı bulunamadı');
    }

    const hashedPassword = await hashPassword(password);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword, plainPassword: password },
    });

    sendSuccess(res, { id }, 'Şifre başarıyla sıfırlandı');
  } catch (error) {
    next(error);
  }
};

// Kullanıcı istatistikleri (Süper Admin)
export const getUserStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const [totalUsers, activeUsers, adminUsers, customerUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: { in: [UserRole.SUPER_ADMIN as any, UserRole.RESTAURANT_ADMIN as any] } } }),
      prisma.user.count({ where: { role: UserRole.CUSTOMER as any } }),
    ]);

    sendSuccess(res, {
      totalUsers,
      activeUsers,
      adminUsers,
      customerUsers,
    });
  } catch (error) {
    next(error);
  }
};
