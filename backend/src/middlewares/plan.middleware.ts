/**
 * Plan Middleware & Helpers
 * Paket kısıtlamalarını backend'de enforce eder
 * UI'dan kaçış olmasın - tüm kontroller burada yapılır
 */

import { Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { ApiError } from '../utils/response';
import { AuthRequest } from './auth.middleware';

// Plan feature bayrak tipleri
export type PlanFeature =
  | 'reportingEnabled'
  | 'detailedReportingEnabled'
  | 'serviceAreasEnabled'
  | 'cartEnabled'
  | 'campaignCategoryEnabled'
  | 'mobilePanelEnabled';

// Plan bilgisi interface
export interface PlanInfo {
  id: string;
  code: string;
  name: string;
  maxProducts: number | null;
  qrMode: 'SINGLE' | 'PER_TABLE';
  adsEnabled: boolean;
  reportingEnabled: boolean;
  detailedReportingEnabled: boolean;
  serviceAreasEnabled: boolean;
  cartEnabled: boolean;
  campaignCategoryEnabled: boolean;
  mobilePanelEnabled: boolean;
}

// Plan error kodları
export const PlanErrorCodes = {
  PLAN_NOT_FOUND: 'PLAN_NOT_FOUND',
  PLAN_LIMIT_PRODUCTS: 'PLAN_LIMIT_PRODUCTS',
  PLAN_FEATURE_DISABLED: 'PLAN_FEATURE_DISABLED',
  PLAN_QR_SINGLE_ONLY: 'PLAN_QR_SINGLE_ONLY',
  PLAN_QR_TABLE_REQUIRED: 'PLAN_QR_TABLE_REQUIRED',
  RESTAURANT_NO_PLAN: 'RESTAURANT_NO_PLAN',
} as const;

/**
 * Restoranın plan bilgisini getir
 */
export async function getRestaurantPlan(restaurantId: string): Promise<PlanInfo | null> {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: {
      plan: true,
    },
  });

  if (!restaurant || !restaurant.plan) {
    return null;
  }

  return {
    id: restaurant.plan.id,
    code: restaurant.plan.code,
    name: restaurant.plan.name,
    maxProducts: restaurant.plan.maxProducts,
    qrMode: restaurant.plan.qrMode,
    adsEnabled: restaurant.plan.adsEnabled,
    reportingEnabled: restaurant.plan.reportingEnabled,
    detailedReportingEnabled: restaurant.plan.detailedReportingEnabled,
    serviceAreasEnabled: restaurant.plan.serviceAreasEnabled,
    cartEnabled: restaurant.plan.cartEnabled,
    campaignCategoryEnabled: restaurant.plan.campaignCategoryEnabled,
    mobilePanelEnabled: restaurant.plan.mobilePanelEnabled,
  };
}

/**
 * Restoranın toplam ürün sayısını getir
 * NOT: Aktif/pasif fark etmez, toplam sayılır (sınırı bypass etmeyi engeller)
 */
export async function getRestaurantProductCount(restaurantId: string): Promise<number> {
  // Restoranın tüm kategorilerindeki ürünleri say
  const count = await prisma.product.count({
    where: {
      category: {
        restaurantId,
      },
    },
  });
  
  return count;
}

/**
 * Ürün limit kontrolü
 * Eğer limit aşılıyorsa hata fırlat
 */
export async function checkProductLimit(restaurantId: string): Promise<void> {
  const plan = await getRestaurantPlan(restaurantId);
  
  if (!plan) {
    throw new ApiError(403, 'Restoran paket bilgisi bulunamadı', true, PlanErrorCodes.RESTAURANT_NO_PLAN);
  }

  // Sınırsız ürün (null = unlimited)
  if (plan.maxProducts === null) {
    return;
  }

  const currentCount = await getRestaurantProductCount(restaurantId);
  
  if (currentCount >= plan.maxProducts) {
    throw new ApiError(
      403,
      `Paket ürün limitine ulaşıldı (${plan.maxProducts}). Daha fazla ürün eklemek için paket yükseltmeniz gerekiyor.`,
      true,
      PlanErrorCodes.PLAN_LIMIT_PRODUCTS
    );
  }
}

/**
 * Feature flag kontrolü
 * Özellik devre dışıysa hata fırlat
 */
export async function checkFeature(restaurantId: string, feature: PlanFeature): Promise<void> {
  const plan = await getRestaurantPlan(restaurantId);
  
  if (!plan) {
    throw new ApiError(403, 'Restoran paket bilgisi bulunamadı', true, PlanErrorCodes.RESTAURANT_NO_PLAN);
  }

  if (!plan[feature]) {
    const featureNames: Record<PlanFeature, string> = {
      reportingEnabled: 'Raporlama',
      detailedReportingEnabled: 'Detaylı Raporlama',
      serviceAreasEnabled: 'Servis Bölgeleri',
      cartEnabled: 'Sepet',
      campaignCategoryEnabled: 'Kampanya Kategorisi',
      mobilePanelEnabled: 'Mobil Panel',
    };
    
    throw new ApiError(
      403,
      `${featureNames[feature]} özelliği mevcut paketinizde bulunmuyor. Lütfen paket yükseltmesi yapın.`,
      true,
      PlanErrorCodes.PLAN_FEATURE_DISABLED
    );
  }
}

/**
 * QR mode kontrolü - SINGLE modda masa QR üretilemez
 */
export async function checkQrMode(
  restaurantId: string,
  tableNumber: string | null | undefined
): Promise<void> {
  const plan = await getRestaurantPlan(restaurantId);
  
  if (!plan) {
    throw new ApiError(403, 'Restoran paket bilgisi bulunamadı', true, PlanErrorCodes.RESTAURANT_NO_PLAN);
  }

  if (plan.qrMode === 'SINGLE' && tableNumber) {
    throw new ApiError(
      403,
      'Başlangıç paketinde masa bazlı QR kod oluşturulamaz. Sadece işletme geneli QR kullanabilirsiniz.',
      true,
      PlanErrorCodes.PLAN_QR_SINGLE_ONLY
    );
  }

  if (plan.qrMode === 'PER_TABLE' && !tableNumber) {
    // PER_TABLE modunda tableNumber opsiyonel olabilir (genel QR de olabilir)
    // İsteğe bağlı: Zorunlu yapmak için aşağıdaki satırı aktif edin
    // throw new ApiError(400, 'Gold pakette QR kod için masa numarası zorunludur', true, PlanErrorCodes.PLAN_QR_TABLE_REQUIRED);
  }
}

/**
 * Plan planCode'dan ID getir
 */
export async function getPlanByCode(planCode: string): Promise<{ id: string } | null> {
  const plan = await prisma.plan.findUnique({
    where: { code: planCode as any },
    select: { id: true, isActive: true },
  });

  if (!plan || !plan.isActive) {
    return null;
  }

  return { id: plan.id };
}

/**
 * Tüm aktif planları listele
 */
export async function getActivePlans() {
  return prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { code: 'asc' },
  });
}

// =====================================================
// EXPRESS MIDDLEWARE'LERİ
// =====================================================

/**
 * Ürün ekleme öncesi limit kontrolü middleware'i
 */
export function requireProductLimit() {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      
      if (!restaurantId) {
        throw new ApiError(400, 'Restoran ID bulunamadı');
      }

      await checkProductLimit(restaurantId);
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Feature kontrolü middleware'i
 */
export function requireFeature(feature: PlanFeature) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.user?.restaurantId;
      
      if (!restaurantId) {
        throw new ApiError(400, 'Restoran ID bulunamadı');
      }

      await checkFeature(restaurantId, feature);
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * QR mode kontrolü middleware'i
 */
export function requireQrMode() {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const restaurantId = req.body.restaurantId || req.params.restaurantId || req.user?.restaurantId;
      const tableNumber = req.body.tableNumber || req.query.tableNumber;
      
      if (!restaurantId) {
        throw new ApiError(400, 'Restoran ID bulunamadı');
      }

      await checkQrMode(restaurantId, tableNumber as string);
      next();
    } catch (error) {
      next(error);
    }
  };
}
