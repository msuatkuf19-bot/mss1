import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { ApiError, sendSuccess } from '../utils/response';

// Müşteri menü görüntüleme
export const getPublicMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;
    const { table } = req.query;

    // Restoran kontrolü
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug, isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        headerImage: true,
        address: true,
        phone: true,
        workingHours: true,
        instagramUrl: true,
        facebookUrl: true,
        themeColor: true,
        themeSettings: true,
      },
    });

    if (!restaurant) {
      throw new ApiError(404, 'Restoran bulunamadı');
    }

    // Kategoriler ve ürünler
    const categories = await prisma.category.findMany({
      where: {
        restaurantId: restaurant.id,
        isActive: true,
      },
      include: {
        products: {
          where: {
            isAvailable: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    // Analytics kaydı
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.analytics.upsert({
      where: {
        restaurantId_date: {
          restaurantId: restaurant.id,
          date: today,
        },
      },
      create: {
        restaurantId: restaurant.id,
        date: today,
        viewCount: 1,
      },
      update: {
        viewCount: { increment: 1 },
      },
    });

    sendSuccess(res, {
      restaurant,
      categories,
      tableNumber: table,
    });
  } catch (error) {
    next(error);
  }
};

// Ürün detayı görüntüleme
export const getProductDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            restaurantId: true,
          },
        },
      },
    });

    if (!product) {
      throw new ApiError(404, 'Ürün bulunamadı');
    }

    // Ürün görüntülenme analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.analytics.upsert({
      where: {
        restaurantId_productId_date: {
          restaurantId: product.category.restaurantId,
          productId: product.id,
          date: today,
        },
      },
      create: {
        restaurantId: product.category.restaurantId,
        productId: product.id,
        date: today,
        viewCount: 1,
      },
      update: {
        viewCount: { increment: 1 },
      },
    });

    sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
};
