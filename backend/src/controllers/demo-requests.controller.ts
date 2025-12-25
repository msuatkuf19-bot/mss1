import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { ApiError } from '../utils/response';
import { DemoRequestStatus } from '@prisma/client';

const normalizeWhatsappPhone = (raw: unknown) => {
  if (typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';

  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');

  if (!digits) return '';

  const normalized = (hasPlus ? '+' : '') + digits;

  // Basic sanity check (WhatsApp-friendly range)
  if (digits.length < 8 || digits.length > 20) {
    throw new ApiError(400, 'Telefon/WhatsApp numarası geçersiz');
  }

  return normalized;
};

export const createDemoRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      fullName,
      restaurantName,
      phone,
      email = null,
      restaurantType = '',
      tableCount,
    } = req.body ?? {};

    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      throw new ApiError(400, 'Ad Soyad zorunlu');
    }

    if (!restaurantName || typeof restaurantName !== 'string' || !restaurantName.trim()) {
      throw new ApiError(400, 'Restoran Adı zorunlu');
    }

    const normalizedPhone = normalizeWhatsappPhone(phone);
    if (!normalizedPhone) {
      throw new ApiError(400, 'Telefon / WhatsApp zorunlu');
    }

    const normalizedEmail =
      email === null || email === undefined || (typeof email === 'string' && !email.trim())
        ? null
        : String(email).trim();

    const parsedTableCount =
      tableCount === null || tableCount === undefined || tableCount === ''
        ? 0
        : Number(tableCount);

    if (!Number.isFinite(parsedTableCount) || parsedTableCount < 0) {
      throw new ApiError(400, 'Masa sayısı geçersiz');
    }

    await prisma.demoRequest.create({
      data: {
        fullName: String(fullName).trim(),
        restaurantName: String(restaurantName).trim(),
        phone: normalizedPhone,
        email: normalizedEmail,
        restaurantType: String(restaurantType ?? '').trim(),
        tableCount: Math.trunc(parsedTableCount),
        status: DemoRequestStatus.PENDING,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Demo talebi başarıyla alındı',
    });
  } catch (error) {
    next(error);
  }
};

export const listDemoRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await prisma.demoRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      message: 'Demo talepleri başarıyla getirildi',
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDemoRequestStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body ?? {};

    if (!id) {
      throw new ApiError(400, 'ID gerekli');
    }

    if (!status || typeof status !== 'string') {
      throw new ApiError(400, 'Durum gerekli');
    }

    const allowed: DemoRequestStatus[] = [
      DemoRequestStatus.PENDING,
      DemoRequestStatus.CONTACTED,
      DemoRequestStatus.DEMO_CREATED,
      DemoRequestStatus.CANCELLED,
    ];

    const nextStatus = status as DemoRequestStatus;
    if (!allowed.includes(nextStatus)) {
      throw new ApiError(400, 'Geçersiz durum');
    }

    const updated = await prisma.demoRequest.update({
      where: { id },
      data: { status: nextStatus },
    });

    return res.json({
      success: true,
      message: 'Durum güncellendi',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
