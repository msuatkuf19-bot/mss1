export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'RESTAURANT_ADMIN' | 'CUSTOMER';
  restaurantId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  workingHours?: any;
  themeColor?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner?: User;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
}

// Product type is now defined in ./product.ts - import for local use and re-export
import type { Product, ProductCategory, ProductWithCategory } from './product';
export type { Product, ProductCategory, ProductWithCategory };
export { normalizeProduct, normalizeProducts } from './product';

export interface QRCode {
  id: string;
  code: string;
  tableNumber?: string;
  scanCount: number;
  lastScannedAt?: string;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  id: string;
  date: string;
  viewCount: number;
  restaurantId: string;
  productId?: string;
  product?: Product;
}

export interface DashboardData {
  summary: {
    totalViews: number;
    todayViews: number;
    categoryCount: number;
    productCount: number;
    qrCodeCount: number;
    totalScans: number;
  };
  popularProducts: Array<{
    id: string;
    name: string;
    image?: string;
    price: number;
    category: { name: string };
    viewCount: number;
  }>;
  dailyViews: Array<{
    date: string;
    viewCount: number;
  }>;
}
