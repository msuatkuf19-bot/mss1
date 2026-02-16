import prisma from '../config/prisma';

// Type definitions matching Prisma schema
type GalleryAssetType = 'FOOD' | 'DRINK' | 'DESSERT' | 'OTHER';
type GalleryAssetScope = 'GLOBAL' | 'RESTAURANT';

interface ListGalleryAssetsParams {
  q?: string;
  type?: GalleryAssetType;
  category?: string;
  tags?: string[];
  scope?: GalleryAssetScope;
  restaurantId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sort?: 'order' | 'createdAt' | '-order' | '-createdAt';
}

interface CreateGalleryAssetData {
  title: string;
  type: GalleryAssetType;
  category?: string;
  tags?: string[];
  imageUrl: string;
  thumbUrl?: string;
  width?: number;
  height?: number;
  isActive?: boolean;
  order?: number;
  scope: GalleryAssetScope;
  restaurantId?: string;
}

interface UpdateGalleryAssetData {
  title?: string;
  type?: GalleryAssetType;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  thumbUrl?: string;
  width?: number;
  height?: number;
  isActive?: boolean;
  order?: number;
  scope?: GalleryAssetScope;
  restaurantId?: string;
}

export class GalleryAssetsService {
  /**
   * List gallery assets with filters and pagination
   */
  async list(params: ListGalleryAssetsParams) {
    const {
      q,
      type,
      category,
      tags,
      scope,
      restaurantId,
      isActive = true,
      page = 1,
      limit = 20,
      sort = 'order',
    } = params;

    const where: any = {};

    // Filter by active status
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Filter by type
    if (type) {
      where.type = type;
    }

    // Filter by category
    if (category) {
      where.category = {
        contains: category,
        mode: 'insensitive',
      };
    }

    // Filter by tags (any match)
    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags,
      };
    }

    // Filter by scope
    if (scope) {
      where.scope = scope;
    }

    // Filter by restaurantId (for RESTAURANT scope)
    if (restaurantId) {
      where.OR = [
        { scope: 'GLOBAL' },
        { scope: 'RESTAURANT', restaurantId },
      ];
    }

    // Search query
    if (q) {
      where.AND = [
        {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { category: { contains: q, mode: 'insensitive' } },
            { tags: { hasSome: [q.toLowerCase()] } },
          ],
        },
      ];
    }

    // Sorting
    let orderBy: any = { order: 'asc' };
    if (sort === '-order') {
      orderBy = { order: 'desc' };
    } else if (sort === 'createdAt') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === '-createdAt') {
      orderBy = { createdAt: 'desc' };
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.galleryAsset.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.galleryAsset.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get a single gallery asset by ID
   */
  async getById(id: string) {
    return prisma.galleryAsset.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new gallery asset
   */
  async create(data: CreateGalleryAssetData) {
    return prisma.galleryAsset.create({
      data: {
        title: data.title,
        type: data.type,
        category: data.category,
        tags: data.tags || [],
        imageUrl: data.imageUrl,
        thumbUrl: data.thumbUrl,
        width: data.width,
        height: data.height,
        isActive: data.isActive ?? true,
        order: data.order ?? 0,
        scope: data.scope,
        restaurantId: data.scope === 'RESTAURANT' ? data.restaurantId : null,
      },
    });
  }

  /**
   * Update a gallery asset
   */
  async update(id: string, data: UpdateGalleryAssetData) {
    return prisma.galleryAsset.update({
      where: { id },
      data: {
        title: data.title,
        type: data.type,
        category: data.category,
        tags: data.tags,
        imageUrl: data.imageUrl,
        thumbUrl: data.thumbUrl,
        width: data.width,
        height: data.height,
        isActive: data.isActive,
        order: data.order,
        scope: data.scope,
        restaurantId: data.scope === 'RESTAURANT' ? data.restaurantId : null,
      },
    });
  }

  /**
   * Delete a gallery asset
   */
  async delete(id: string) {
    return prisma.galleryAsset.delete({
      where: { id },
    });
  }

  /**
   * Toggle active status
   */
  async toggleActive(id: string) {
    const asset = await prisma.galleryAsset.findUnique({ where: { id } });
    if (!asset) return null;

    return prisma.galleryAsset.update({
      where: { id },
      data: { isActive: !asset.isActive },
    });
  }

  /**
   * Get unique categories for filter dropdown
   */
  async getCategories() {
    const assets = await prisma.galleryAsset.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    });
    return assets
      .map((a) => a.category)
      .filter((c): c is string => c !== null);
  }

  /**
   * Get unique tags for filter dropdown
   */
  async getTags() {
    const assets = await prisma.galleryAsset.findMany({
      where: { isActive: true },
      select: { tags: true },
    });
    const allTags = assets.flatMap((a) => a.tags);
    return [...new Set(allTags)];
  }

  /**
   * Reorder gallery assets
   */
  async reorder(assetIds: string[]) {
    const updates = assetIds.map((id, index) =>
      prisma.galleryAsset.update({
        where: { id },
        data: { order: index * 10 },
      })
    );
    return prisma.$transaction(updates);
  }
}

export const galleryAssetsService = new GalleryAssetsService();
