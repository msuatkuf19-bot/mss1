import { Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { ApiError, sendSuccess } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';
import { checkProductLimit } from '../middlewares/plan.middleware';

// PostgreSQL UserRole enum values
const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN' as const,
  RESTAURANT_ADMIN: 'RESTAURANT_ADMIN' as const,
  CUSTOMER: 'CUSTOMER' as const
};

// Kategorileri listele
export const getCategories = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const restaurantId = req.query.restaurantId as string || req.user?.restaurantId;

    if (!restaurantId) {
      throw new ApiError(400, 'Restoran ID gerekli');
    }

    const categories = await prisma.category.findMany({
      where: { restaurantId },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { order: 'asc' },
    });

    sendSuccess(res, categories);
  } catch (error) {
    next(error);
  }
};

// Kategori oluştur
export const createCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, image, order } = req.body;
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new ApiError(400, 'Restoran ID gerekli');
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        image,
        order: order || 0,
        restaurantId,
      },
    });

    sendSuccess(res, category, 'Kategori başarıyla oluşturuldu', 201);
  } catch (error) {
    next(error);
  }
};

// Kategori güncelle
export const updateCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, description, image, order, isActive } = req.body;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new ApiError(404, 'Kategori bulunamadı');
    }

    // Yetki kontrolü
    if (req.user?.role === UserRole.RESTAURANT_ADMIN && category.restaurantId !== req.user.restaurantId) {
      throw new ApiError(403, 'Bu kategoriyi güncelleme yetkiniz yok');
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, description, image, order, isActive },
    });

    sendSuccess(res, updatedCategory, 'Kategori başarıyla güncellendi');
  } catch (error) {
    next(error);
  }
};

// Kategori sil
export const deleteCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new ApiError(404, 'Kategori bulunamadı');
    }

    // Yetki kontrolü
    if (req.user?.role === UserRole.RESTAURANT_ADMIN && category.restaurantId !== req.user.restaurantId) {
      throw new ApiError(403, 'Bu kategoriyi silme yetkiniz yok');
    }

    await prisma.category.delete({ where: { id } });

    sendSuccess(res, null, 'Kategori başarıyla silindi');
  } catch (error) {
    next(error);
  }
};

// Kategorileri yeniden sırala
export const reorderCategories = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryIdsInOrder } = req.body;
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new ApiError(400, 'Restoran ID gerekli');
    }

    if (!Array.isArray(categoryIdsInOrder) || categoryIdsInOrder.length === 0) {
      throw new ApiError(400, 'Kategori sırası gerekli');
    }

    // Tüm kategorilerin bu restorana ait olduğunu doğrula
    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIdsInOrder },
        restaurantId,
      },
    });

    if (categories.length !== categoryIdsInOrder.length) {
      throw new ApiError(403, 'Bazı kategoriler bu restorana ait değil');
    }

    // Transaction ile tüm kategorileri güncelle
    await prisma.$transaction(
      categoryIdsInOrder.map((categoryId, index) =>
        prisma.category.update({
          where: { id: categoryId },
          data: { order: index * 10 }, // 0, 10, 20, 30... (araya ekleme için boşluk)
        })
      )
    );

    sendSuccess(res, null, 'Kategori sıralaması güncellendi');
  } catch (error) {
    next(error);
  }
};

// Ürünleri listele
export const getProducts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = req.query.categoryId as string;
    const restaurantId = req.query.restaurantId as string || req.user?.restaurantId;

    if (!restaurantId && !categoryId) {
      throw new ApiError(400, 'Restoran ID veya Kategori ID gerekli');
    }

    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId;
    } else {
      const categories = await prisma.category.findMany({
        where: { restaurantId },
        select: { id: true },
      });
      where.categoryId = { in: categories.map((c: { id: string }) => c.id) };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            restaurantId: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    sendSuccess(res, products);
  } catch (error) {
    next(error);
  }
};

// Ürün oluştur
export const createProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      description,
      price,
      image,
      imageUrl,
      imageSource,
      galleryAssetId,
      categoryId,
      isNew,
      isPopular,
      isDiscount,
      discountPrice,
      ingredients,
      allergens,
      isVegetarian,
      isVegan,
      isGlutenFree,
      isSpicy,
      order,
    } = req.body;

    // Kategori kontrolü
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      throw new ApiError(404, 'Kategori bulunamadı');
    }

    // Yetki kontrolü
    if (req.user?.role === UserRole.RESTAURANT_ADMIN && category.restaurantId !== req.user.restaurantId) {
      throw new ApiError(403, 'Bu kategoriye ürün ekleme yetkiniz yok');
    }

    // Plan ürün limit kontrolü - limit aşıldıysa hata fırlatır
    await checkProductLimit(category.restaurantId);

    // Görsel kaynağına göre işlem yap
    let finalImageUrl = imageUrl?.trim() || image?.trim() || null;
    let finalImageSource = 'UPLOAD';
    let finalGalleryAssetId = null;

    // Eğer galeriden seçildiyse
    if (imageSource === 'GALLERY' && galleryAssetId) {
      const galleryAsset = await prisma.galleryAsset.findUnique({
        where: { id: galleryAssetId },
      });
      if (galleryAsset) {
        finalImageUrl = galleryAsset.imageUrl;
        finalImageSource = 'GALLERY';
        finalGalleryAssetId = galleryAssetId;
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        image: finalImageUrl,
        imageUrl: finalImageUrl,
        imageSource: finalImageSource as any,
        galleryAssetId: finalGalleryAssetId,
        categoryId,
        isNew,
        isPopular,
        isDiscount,
        discountPrice,
        ingredients,
        allergens,
        isVegetarian: isVegetarian || false,
        isVegan: isVegan || false,
        isGlutenFree: isGlutenFree || false,
        isSpicy: isSpicy || false,
        order: order || 0,
      },
      include: {
        category: true,
        galleryAsset: true,
      },
    });

    sendSuccess(res, product, 'Ürün başarıyla oluşturuldu', 201);
  } catch (error) {
    next(error);
  }
};

// Ürün güncelle
export const updateProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      image,
      imageUrl,
      imageSource,
      galleryAssetId,
      categoryId,
      isNew,
      isPopular,
      isDiscount,
      discountPrice,
      isAvailable,
      isActive,  // Admin aktif/pasif kontrolü
      ingredients,
      allergens,
      isVegetarian,
      isVegan,
      isGlutenFree,
      isSpicy,
      order,
    } = req.body;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new ApiError(404, 'Ürün bulunamadı');
    }

    // Yetki kontrolü
    if (req.user?.role === UserRole.RESTAURANT_ADMIN && product.category.restaurantId !== req.user.restaurantId) {
      throw new ApiError(403, 'Bu ürünü güncelleme yetkiniz yok');
    }

    // Eğer categoryId değişiyorsa, yeni kategori kontrolü
    if (categoryId && categoryId !== product.categoryId) {
      const newCategory = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!newCategory) {
        throw new ApiError(404, 'Kategori bulunamadı');
      }
      if (req.user?.role === UserRole.RESTAURANT_ADMIN && newCategory.restaurantId !== req.user.restaurantId) {
        throw new ApiError(403, 'Bu kategoriye ürün taşıma yetkiniz yok');
      }
    }

    // Görsel kaynağına göre işlem yap
    let finalImageUrl: string | null | undefined = undefined;
    let finalImageSource: string | undefined = undefined;
    let finalGalleryAssetId: string | null | undefined = undefined;

    // Eğer galeriden seçildiyse
    if (imageSource === 'GALLERY' && galleryAssetId) {
      const galleryAsset = await prisma.galleryAsset.findUnique({
        where: { id: galleryAssetId },
      });
      if (galleryAsset) {
        finalImageUrl = galleryAsset.imageUrl;
        finalImageSource = 'GALLERY';
        finalGalleryAssetId = galleryAssetId;
      }
    } else if (imageSource === 'UPLOAD') {
      // Upload modunda
      finalImageUrl = imageUrl !== undefined 
        ? (imageUrl?.trim() || null)
        : (image !== undefined ? (image?.trim() || null) : undefined);
      finalImageSource = 'UPLOAD';
      finalGalleryAssetId = null;
    } else if (imageUrl !== undefined || image !== undefined) {
      // Eski uyumluluk: sadece imageUrl veya image gönderilmişse
      finalImageUrl = imageUrl !== undefined 
        ? (imageUrl?.trim() || null)
        : (image !== undefined ? (image?.trim() || null) : undefined);
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        ...(finalImageUrl !== undefined && { image: finalImageUrl }),
        ...(finalImageUrl !== undefined && { imageUrl: finalImageUrl }),
        ...(finalImageSource !== undefined && { imageSource: finalImageSource as any }),
        ...(finalGalleryAssetId !== undefined && { galleryAssetId: finalGalleryAssetId }),
        ...(categoryId && { categoryId }),
        isNew,
        isPopular,
        isDiscount,
        discountPrice,
        isAvailable,
        isActive,  // Admin aktif/pasif kontrolü
        ingredients,
        allergens,
        isVegetarian,
        isVegan,
        isGlutenFree,
        isSpicy,
        order,
      },
      include: {
        category: true,
        galleryAsset: true,
      },
    });

    sendSuccess(res, updatedProduct, 'Ürün başarıyla güncellendi');
  } catch (error) {
    next(error);
  }
};

// Ürün sil
export const deleteProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new ApiError(404, 'Ürün bulunamadı');
    }

    // Yetki kontrolü
    if (req.user?.role === UserRole.RESTAURANT_ADMIN && product.category.restaurantId !== req.user.restaurantId) {
      throw new ApiError(403, 'Bu ürünü silme yetkiniz yok');
    }

    await prisma.product.delete({ where: { id } });

    sendSuccess(res, null, 'Ürün başarıyla silindi');
  } catch (error) {
    next(error);
  }
};
