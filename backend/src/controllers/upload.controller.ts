import { Response, NextFunction } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendSuccess, ApiError } from '../utils/response';
import prisma from '../config/database';

// PostgreSQL ImageType enum values
const ImageType = {
  LOGO: 'LOGO' as const,
  PRODUCT: 'PRODUCT' as const,
  CATEGORY: 'CATEGORY' as const,
  OTHER: 'OTHER' as const
};

export const uploadImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'Dosya yüklenmedi');
    }

    const restaurantId = req.user?.restaurantId;
    if (!restaurantId) {
      throw new ApiError(400, 'Restoran ID gerekli');
    }

    // Orijinal dosya
    const originalPath = req.file.path;
    const filename = req.file.filename;
    const mimetype = req.file.mimetype;
    const size = req.file.size;

    // Optimize edilmiş dosya adı
    const optimizedFilename = `optimized-${filename}`;
    const optimizedPath = path.join(path.dirname(originalPath), optimizedFilename);

    // Sharp ile görsel optimizasyonu
    await sharp(originalPath)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toFile(optimizedPath);

    // Orijinal dosyayı sil
    fs.unlinkSync(originalPath);

    // Database'e kaydet
    const imageType = (req.body.type && Object.values(ImageType).includes(req.body.type)) 
      ? req.body.type 
      : ImageType.OTHER;
      
    const image = await prisma.image.create({
      data: {
        url: `/uploads/${optimizedFilename}`,
        filename: optimizedFilename,
        mimetype,
        size,
        type: imageType as any,
        restaurantId,
      },
    });

    sendSuccess(res, image, 'Görsel başarıyla yüklendi', 201);
  } catch (error) {
    // Hata durumunda dosyayı temizle
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error('File cleanup error:', e);
      }
    }
    next(error);
  }
};

export const deleteImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const image = await prisma.image.findUnique({ where: { id } });
    if (!image) {
      throw new ApiError(404, 'Görsel bulunamadı');
    }

    // Dosyayı sil
    const filePath = path.join(__dirname, '../../uploads', image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Database'den sil
    await prisma.image.delete({ where: { id } });

    sendSuccess(res, null, 'Görsel başarıyla silindi');
  } catch (error) {
    next(error);
  }
};

export const getImages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const restaurantId = req.user?.restaurantId;
    if (!restaurantId) {
      throw new ApiError(400, 'Restoran ID gerekli');
    }

    const images = await prisma.image.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' },
    });

    sendSuccess(res, images);
  } catch (error) {
    next(error);
  }
};
