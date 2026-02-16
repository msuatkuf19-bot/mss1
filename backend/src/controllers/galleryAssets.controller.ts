import { Response, NextFunction } from 'express';
import { galleryAssetsService } from '../services/galleryAssets.service';
import { ApiError, sendSuccess } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';

// Type definitions matching Prisma schema
type GalleryAssetType = 'FOOD' | 'DRINK' | 'DESSERT' | 'OTHER';
type GalleryAssetScope = 'GLOBAL' | 'RESTAURANT';

// =====================================================
// PUBLIC / READ ENDPOINTS (Restaurant Admin erişebilir)
// =====================================================

/**
 * GET /api/gallery-assets
 * List gallery assets with filters
 */
export const listGalleryAssets = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      q,
      type,
      category,
      tags,
      scope,
      restaurantId,
      isActive,
      page,
      limit,
      sort,
    } = req.query;

    // Restaurant admin ise sadece GLOBAL ve kendi restaurant scope'unu görsün
    let filterRestaurantId = restaurantId as string | undefined;
    if (req.user?.role === 'RESTAURANT_ADMIN') {
      filterRestaurantId = req.user.restaurantId;
    }

    const result = await galleryAssetsService.list({
      q: q as string,
      type: type as GalleryAssetType,
      category: category as string,
      tags: tags ? (tags as string).split(',').map((t) => t.trim()) : undefined,
      scope: scope as GalleryAssetScope,
      restaurantId: filterRestaurantId,
      isActive: isActive === 'false' ? false : isActive === 'all' ? undefined : true,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
      sort: sort as 'order' | 'createdAt' | '-order' | '-createdAt',
    });

    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/gallery-assets/categories
 * Get unique categories for filter
 */
export const getGalleryCategories = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await galleryAssetsService.getCategories();
    sendSuccess(res, categories);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/gallery-assets/tags
 * Get unique tags for filter
 */
export const getGalleryTags = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tags = await galleryAssetsService.getTags();
    sendSuccess(res, tags);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/gallery-assets/:id
 * Get a single gallery asset
 */
export const getGalleryAsset = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const asset = await galleryAssetsService.getById(id);

    if (!asset) {
      throw new ApiError(404, 'Galeri görseli bulunamadı');
    }

    sendSuccess(res, asset);
  } catch (error) {
    next(error);
  }
};

// =====================================================
// ADMIN ENDPOINTS (Super Admin only, or Restaurant Admin for own scope)
// =====================================================

/**
 * POST /api/admin/gallery-assets
 * Create a new gallery asset
 */
export const createGalleryAsset = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      type,
      category,
      tags,
      imageUrl,
      thumbUrl,
      width,
      height,
      isActive,
      order,
      scope,
      restaurantId,
    } = req.body;

    // Validation
    if (!title || !imageUrl) {
      throw new ApiError(400, 'Başlık ve görsel URL zorunludur');
    }

    // Restaurant admin sadece kendi restaurant scope'unda asset oluşturabilir
    if (req.user?.role === 'RESTAURANT_ADMIN') {
      if (scope === 'GLOBAL') {
        throw new ApiError(403, 'Global galeri görseli oluşturma yetkiniz yok');
      }
      if (scope === 'RESTAURANT' && restaurantId !== req.user.restaurantId) {
        throw new ApiError(403, 'Sadece kendi restoranınız için görsel oluşturabilirsiniz');
      }
    }

    const asset = await galleryAssetsService.create({
      title,
      type: type || 'FOOD',
      category,
      tags: Array.isArray(tags) ? tags : tags?.split(',').map((t: string) => t.trim()),
      imageUrl,
      thumbUrl,
      width,
      height,
      isActive: isActive ?? true,
      order: order ?? 0,
      scope: scope || 'GLOBAL',
      restaurantId: scope === 'RESTAURANT' ? (restaurantId || req.user?.restaurantId) : undefined,
    });

    sendSuccess(res, asset, 'Galeri görseli oluşturuldu', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/gallery-assets/:id
 * Update a gallery asset
 */
export const updateGalleryAsset = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      title,
      type,
      category,
      tags,
      imageUrl,
      thumbUrl,
      width,
      height,
      isActive,
      order,
      scope,
      restaurantId,
    } = req.body;

    // Check if asset exists
    const existingAsset = await galleryAssetsService.getById(id);
    if (!existingAsset) {
      throw new ApiError(404, 'Galeri görseli bulunamadı');
    }

    // Restaurant admin yetki kontrolü
    if (req.user?.role === 'RESTAURANT_ADMIN') {
      if (existingAsset.scope === 'GLOBAL') {
        throw new ApiError(403, 'Global galeri görselini düzenleme yetkiniz yok');
      }
      if (existingAsset.restaurantId !== req.user.restaurantId) {
        throw new ApiError(403, 'Bu görseli düzenleme yetkiniz yok');
      }
    }

    const asset = await galleryAssetsService.update(id, {
      title,
      type,
      category,
      tags: Array.isArray(tags) ? tags : tags?.split(',').map((t: string) => t.trim()),
      imageUrl,
      thumbUrl,
      width,
      height,
      isActive,
      order,
      scope,
      restaurantId,
    });

    sendSuccess(res, asset, 'Galeri görseli güncellendi');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/gallery-assets/:id
 * Delete a gallery asset
 */
export const deleteGalleryAsset = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if asset exists
    const existingAsset = await galleryAssetsService.getById(id);
    if (!existingAsset) {
      throw new ApiError(404, 'Galeri görseli bulunamadı');
    }

    // Restaurant admin yetki kontrolü
    if (req.user?.role === 'RESTAURANT_ADMIN') {
      if (existingAsset.scope === 'GLOBAL') {
        throw new ApiError(403, 'Global galeri görselini silme yetkiniz yok');
      }
      if (existingAsset.restaurantId !== req.user.restaurantId) {
        throw new ApiError(403, 'Bu görseli silme yetkiniz yok');
      }
    }

    await galleryAssetsService.delete(id);
    sendSuccess(res, null, 'Galeri görseli silindi');
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/gallery-assets/:id/toggle
 * Toggle active status
 */
export const toggleGalleryAsset = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if asset exists
    const existingAsset = await galleryAssetsService.getById(id);
    if (!existingAsset) {
      throw new ApiError(404, 'Galeri görseli bulunamadı');
    }

    // Restaurant admin yetki kontrolü
    if (req.user?.role === 'RESTAURANT_ADMIN') {
      if (existingAsset.scope === 'GLOBAL') {
        throw new ApiError(403, 'Global galeri görselini değiştirme yetkiniz yok');
      }
      if (existingAsset.restaurantId !== req.user.restaurantId) {
        throw new ApiError(403, 'Bu görseli değiştirme yetkiniz yok');
      }
    }

    const asset = await galleryAssetsService.toggleActive(id);
    sendSuccess(res, asset, `Galeri görseli ${asset?.isActive ? 'aktifleştirildi' : 'pasifleştirildi'}`);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/gallery-assets/reorder
 * Reorder gallery assets
 */
export const reorderGalleryAssets = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { assetIds } = req.body;

    if (!Array.isArray(assetIds) || assetIds.length === 0) {
      throw new ApiError(400, 'Görsel ID listesi gerekli');
    }

    await galleryAssetsService.reorder(assetIds);
    sendSuccess(res, null, 'Sıralama güncellendi');
  } catch (error) {
    next(error);
  }
};
