'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';

// ========== TYPES ==========
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  imageUrl?: string;
  isAvailable: boolean;
  isActive?: boolean;
  createdAt?: string;
  category: {
    id: string;
    name: string;
  };
}

export interface Category {
  id: string;
  name: string;
}

export interface FilterState {
  search: string;
  categoryId: string;
  status: 'all' | 'available' | 'unavailable';
  missingFilters: {
    noImage: boolean;
    noPrice: boolean;
    noDescription: boolean;
    noCategory: boolean;
  };
  missingAny: boolean;
  minPrice: string;
  maxPrice: string;
  sortBy: 'newest' | 'oldest' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc';
  pageSize: number;
  page: number;
}

const defaultFilters: FilterState = {
  search: '',
  categoryId: '',
  status: 'all',
  missingFilters: {
    noImage: false,
    noPrice: false,
    noDescription: false,
    noCategory: false,
  },
  missingAny: false,
  minPrice: '',
  maxPrice: '',
  sortBy: 'newest',
  pageSize: 25,
  page: 1,
};

// ========== HELPER FUNCTIONS ==========
const hasImage = (p: Product): boolean => Boolean(p.image || p.imageUrl);
const hasPrice = (p: Product): boolean => Number(p.price) > 0;
const hasDescription = (p: Product): boolean => (p.description || '').trim().length > 0;
const hasCategory = (p: Product): boolean => Boolean(p.category?.id);
const hasMissingInfo = (p: Product): boolean => !hasImage(p) || !hasPrice(p) || !hasDescription(p) || !hasCategory(p);

// ========== DEBOUNCE HOOK ==========
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ========== FILTER BAR COMPONENT ==========
interface MenuFilterBarProps {
  products: Product[];
  categories: Category[];
  onFilteredProducts: (filtered: Product[], total: number) => void;
}

export default function MenuFilterBar({ products, categories, onFilteredProducts }: MenuFilterBarProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const debouncedSearch = useDebounce(filters.search, 300);

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search filter
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        (p.description || '').toLowerCase().includes(query) ||
        (p.category?.name || '').toLowerCase().includes(query)
      );
    }

    // 2. Category filter
    if (filters.categoryId) {
      result = result.filter(p => p.category?.id === filters.categoryId);
    }

    // 3. Status filter
    if (filters.status === 'available') {
      result = result.filter(p => p.isAvailable);
    } else if (filters.status === 'unavailable') {
      result = result.filter(p => !p.isAvailable);
    }

    // 4. Missing info filters
    if (filters.missingAny) {
      result = result.filter(p => hasMissingInfo(p));
    } else {
      if (filters.missingFilters.noImage) {
        result = result.filter(p => !hasImage(p));
      }
      if (filters.missingFilters.noPrice) {
        result = result.filter(p => !hasPrice(p));
      }
      if (filters.missingFilters.noDescription) {
        result = result.filter(p => !hasDescription(p));
      }
      if (filters.missingFilters.noCategory) {
        result = result.filter(p => !hasCategory(p));
      }
    }

    // 5. Price range filter
    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice);
      if (!isNaN(min)) {
        result = result.filter(p => p.price >= min);
      }
    }
    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice);
      if (!isNaN(max)) {
        result = result.filter(p => p.price <= max);
      }
    }

    // 6. Sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'nameAsc':
          return a.name.localeCompare(b.name, 'tr');
        case 'nameDesc':
          return b.name.localeCompare(a.name, 'tr');
        default:
          return 0;
      }
    });

    return result;
  }, [products, debouncedSearch, filters]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const start = (filters.page - 1) * filters.pageSize;
    const end = start + filters.pageSize;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, filters.page, filters.pageSize]);

  // Send filtered products to parent
  useEffect(() => {
    onFilteredProducts(paginatedProducts, filteredProducts.length);
  }, [paginatedProducts, filteredProducts.length, onFilteredProducts]);

  // Reset page when filters change
  useEffect(() => {
    setFilters(prev => ({ ...prev, page: 1 }));
  }, [debouncedSearch, filters.categoryId, filters.status, filters.missingAny, filters.minPrice, filters.maxPrice, filters.sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / filters.pageSize);

  // Get active filter chips
  const activeFilters = useMemo(() => {
    const chips: { label: string; key: string }[] = [];
    
    if (debouncedSearch) chips.push({ label: `Arama: "${debouncedSearch}"`, key: 'search' });
    if (filters.categoryId) {
      const cat = categories.find(c => c.id === filters.categoryId);
      chips.push({ label: `Kategori: ${cat?.name || 'Seçili'}`, key: 'categoryId' });
    }
    if (filters.status !== 'all') {
      chips.push({ label: filters.status === 'available' ? 'Mevcut' : 'Tükendi', key: 'status' });
    }
    if (filters.missingAny) chips.push({ label: 'Sadece Eksikler', key: 'missingAny' });
    if (filters.missingFilters.noImage) chips.push({ label: 'Fotoğrafsızlar', key: 'noImage' });
    if (filters.missingFilters.noPrice) chips.push({ label: 'Fiyatsızlar', key: 'noPrice' });
    if (filters.missingFilters.noDescription) chips.push({ label: 'Açıklamasızlar', key: 'noDescription' });
    if (filters.minPrice) chips.push({ label: `Min: ${filters.minPrice}₺`, key: 'minPrice' });
    if (filters.maxPrice) chips.push({ label: `Max: ${filters.maxPrice}₺`, key: 'maxPrice' });
    
    return chips;
  }, [debouncedSearch, filters, categories]);

  const removeFilter = (key: string) => {
    switch (key) {
      case 'search':
        setFilters(prev => ({ ...prev, search: '' }));
        break;
      case 'categoryId':
        setFilters(prev => ({ ...prev, categoryId: '' }));
        break;
      case 'status':
        setFilters(prev => ({ ...prev, status: 'all' }));
        break;
      case 'missingAny':
        setFilters(prev => ({ ...prev, missingAny: false }));
        break;
      case 'noImage':
        setFilters(prev => ({ ...prev, missingFilters: { ...prev.missingFilters, noImage: false } }));
        break;
      case 'noPrice':
        setFilters(prev => ({ ...prev, missingFilters: { ...prev.missingFilters, noPrice: false } }));
        break;
      case 'noDescription':
        setFilters(prev => ({ ...prev, missingFilters: { ...prev.missingFilters, noDescription: false } }));
        break;
      case 'minPrice':
        setFilters(prev => ({ ...prev, minPrice: '' }));
        break;
      case 'maxPrice':
        setFilters(prev => ({ ...prev, maxPrice: '' }));
        break;
    }
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters = activeFilters.length > 0 || filters.sortBy !== 'newest';

  // Stats for missing info
  const stats = useMemo(() => ({
    total: products.length,
    noImage: products.filter(p => !hasImage(p)).length,
    noPrice: products.filter(p => !hasPrice(p)).length,
    noDescription: products.filter(p => !hasDescription(p)).length,
    missingAny: products.filter(p => hasMissingInfo(p)).length,
  }), [products]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 space-y-4">
      {/* Row 1: Search + Category + Status */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Ürün ara..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Category Filter */}
        <select
          value={filters.categoryId}
          onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm min-w-[140px]"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as FilterState['status'] }))}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm min-w-[120px]"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="available">Mevcut</option>
          <option value="unavailable">Tükendi</option>
        </select>

        {/* Sort */}
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm min-w-[140px]"
        >
          <option value="newest">En Yeni</option>
          <option value="oldest">En Eski</option>
          <option value="priceAsc">Fiyat ↑</option>
          <option value="priceDesc">Fiyat ↓</option>
          <option value="nameAsc">A-Z</option>
          <option value="nameDesc">Z-A</option>
        </select>
      </div>

      {/* Row 2: Missing Info Filters + Price Range */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
        {/* Quick Toggles */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 font-medium">Eksikler:</span>
          
          <button
            onClick={() => setFilters(prev => ({ ...prev, missingAny: !prev.missingAny, missingFilters: { noImage: false, noPrice: false, noDescription: false, noCategory: false } }))}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filters.missingAny 
                ? 'bg-orange-500 text-white' 
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
            }`}
          >
            🚨 Tümü ({stats.missingAny})
          </button>

          <button
            onClick={() => setFilters(prev => ({ ...prev, missingFilters: { ...prev.missingFilters, noImage: !prev.missingFilters.noImage }, missingAny: false }))}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filters.missingFilters.noImage 
                ? 'bg-purple-500 text-white' 
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            📷 Fotoğrafsız ({stats.noImage})
          </button>

          <button
            onClick={() => setFilters(prev => ({ ...prev, missingFilters: { ...prev.missingFilters, noDescription: !prev.missingFilters.noDescription }, missingAny: false }))}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filters.missingFilters.noDescription 
                ? 'bg-indigo-500 text-white' 
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            📝 Açıklamasız ({stats.noDescription})
          </button>
        </div>

        <div className="h-6 w-px bg-gray-200 hidden sm:block" />

        {/* Price Range */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 font-medium">Fiyat:</span>
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
            className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
            className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-400">₺</span>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <>
            <div className="h-6 w-px bg-gray-200 hidden sm:block" />
            <button
              onClick={clearAllFilters}
              className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium transition-all flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Temizle
            </button>
          </>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {activeFilters.map(chip => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
            >
              {chip.label}
              <button
                onClick={() => removeFilter(chip.key)}
                className="ml-1 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Pagination + Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
        {/* Results Info */}
        <div className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">{filteredProducts.length}</span> ürün bulundu
          {filteredProducts.length !== products.length && (
            <span className="text-gray-400"> (toplam {products.length})</span>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-3">
          {/* Page Size */}
          <select
            value={filters.pageSize}
            onChange={(e) => setFilters(prev => ({ ...prev, pageSize: parseInt(e.target.value), page: 1 }))}
            className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>

          {/* Page Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={filters.page === 1}
                className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <span className="px-3 py-1.5 text-sm text-gray-600">
                {filters.page} / {totalPages}
              </span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
                disabled={filters.page === totalPages}
                className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
