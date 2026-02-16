/**
 * Product type - Single source of truth for menu products
 * Bu dosya projedeki tüm Product tiplerinin merkezi kaynağıdır.
 * Başka dosyalarda Product interface/type tanımlamayın!
 */

export interface ProductCategory {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  imageUrl?: string;
  imageSource?: 'UPLOAD' | 'GALLERY';
  galleryAssetId?: string | null;
  isAvailable: boolean;
  isActive: boolean;  // Admin kontrolü - pasifse QR menüde görünmez
  isNew?: boolean;
  isPopular?: boolean;
  isDiscount?: boolean;
  discountPrice?: number;
  // İçerik ve Alerjen bilgileri
  ingredients?: string;
  allergens?: string;
  // Diyet etiketleri
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  // Kategori - API'den ürün geldiğinde dolu, nested category içinde boş olabilir
  categoryId?: string;
  category?: ProductCategory;
  // Meta
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Menu page için Product tipi - category zorunlu
 */
export interface ProductWithCategory extends Omit<Product, 'category'> {
  category: ProductCategory;
}

/**
 * API'den gelen veriyi normalize eder ve isActive garantisi sağlar
 * @param product API'den gelen product verisi
 * @returns normalize edilmiş Product
 */
export function normalizeProduct<T extends Partial<Product>>(product: T): T & { isActive: boolean } {
  return {
    ...product,
    isActive: product.isActive ?? true,  // undefined ise default true
  };
}

/**
 * Product array'ini normalize eder
 * @param products API'den gelen product listesi
 * @returns normalize edilmiş Product[]
 */
export function normalizeProducts<T extends Partial<Product>>(products: T[]): (T & { isActive: boolean })[] {
  return products.map(normalizeProduct);
}
