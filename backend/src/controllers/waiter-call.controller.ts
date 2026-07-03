import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { ApiError, sendSuccess } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';

/**
 * Create a waiter call (public - no auth required)
 */
export const createWaiterCall = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { restaurantId, tableNumber, callType } = req.body;

    if (!restaurantId || !tableNumber) {
      throw new ApiError(400, 'restaurantId ve tableNumber zorunludur');
    }

    const validCallTypes = ['WAITER', 'CHECK', 'CLEAN'];
    const type = validCallTypes.includes(callType) ? callType : 'WAITER';

    // Check restaurant exists and is active
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { id: true, isActive: true },
    });

    if (!restaurant || !restaurant.isActive) {
      throw new ApiError(404, 'Restoran bulunamadı veya aktif değil');
    }

    // Prevent spam: check if there's already a pending call from same table with same type in last 60 seconds
    const recentCall = await prisma.waiterCall.findFirst({
      where: {
        restaurantId,
        tableNumber: String(tableNumber),
        callType: type,
        status: 'PENDING',
        createdAt: { gte: new Date(Date.now() - 10000) },
      },
    });

    if (recentCall) {
      return sendSuccess(res, recentCall, 'Çağrınız zaten iletildi, lütfen bekleyin');
    }

    const waiterCall = await prisma.waiterCall.create({
      data: {
        restaurantId,
        tableNumber: String(tableNumber),
        callType: type,
        status: 'PENDING',
      },
    });

    sendSuccess(res, waiterCall, 'Garson çağrısı oluşturuldu');
  } catch (error) {
    next(error);
  }
};

/**
 * Get waiter calls for a restaurant (auth required - restaurant admin or super admin)
 */
export const getWaiterCalls = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { restaurantId } = req.params;
    const { status } = req.query;

    // Authorization: super admin can access any, restaurant admin only their own
    if (req.user?.role === 'RESTAURANT_ADMIN') {
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { ownerId: true },
      });
      if (!restaurant || restaurant.ownerId !== req.user.userId) {
        throw new ApiError(403, 'Bu restoranın çağrılarına erişim yetkiniz yok');
      }
    }

    const where: any = { restaurantId };
    if (status === 'PENDING' || status === 'COMPLETED') {
      where.status = status;
    }

    const waiterCalls = await prisma.waiterCall.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    sendSuccess(res, waiterCalls);
  } catch (error) {
    next(error);
  }
};

/**
 * Update waiter call status (auth required)
 */
export const updateWaiterCallStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['PENDING', 'COMPLETED'].includes(status)) {
      throw new ApiError(400, 'Geçersiz durum. PENDING veya COMPLETED olmalı');
    }

    const waiterCall = await prisma.waiterCall.findUnique({
      where: { id },
      select: { id: true, restaurantId: true },
    });

    if (!waiterCall) {
      throw new ApiError(404, 'Garson çağrısı bulunamadı');
    }

    // Authorization check for restaurant admin
    if (req.user?.role === 'RESTAURANT_ADMIN') {
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: waiterCall.restaurantId },
        select: { ownerId: true },
      });
      if (!restaurant || restaurant.ownerId !== req.user.userId) {
        throw new ApiError(403, 'Bu çağrıyı güncelleme yetkiniz yok');
      }
    }

    const updated = await prisma.waiterCall.update({
      where: { id },
      data: { status },
    });

    sendSuccess(res, updated, 'Garson çağrısı güncellendi');
  } catch (error) {
    next(error);
  }
};
