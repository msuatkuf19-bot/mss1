'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/constants';

// Types
interface GalleryAsset {
  id: string;
  title: string;
  type: 'FOOD' | 'DRINK' | 'DESSERT' | 'OTHER';
  category: string | null;
  tags: string[];
  imageUrl: string;
  thumbUrl: string | null;
  isActive: boolean;
  order: number;
  scope: 'GLOBAL' | 'RESTAURANT';
}

interface ImagePickerProps {
  value?: string;
  imageSource?: 'UPLOAD' | 'GALLERY';
  galleryAssetId?: string | null;
  onChange: (data: {
    imageUrl: string;
    imageSource: 'UPLOAD' | 'GALLERY';
    galleryAssetId: string | null;
  }) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}

type TabType = 'upload' | 'gallery';

const TYPE_OPTIONS = [
  { value: '', label: 'Tümü' },
  { value: 'FOOD', label: '🍔 Yemek' },
  { value: 'DRINK', label: '🥤 İçecek' },
  { value: 'DESSERT', label: '🍰 Tatlı' },
  { value: 'OTHER', label: '📦 Diğer' },
];

const TYPE_BADGES: Record<string, { label: string; color: string }> = {
  FOOD: { label: 'Yemek', color: 'bg-orange-100 text-orange-700' },
  DRINK: { label: 'İçecek', color: 'bg-blue-100 text-blue-700' },
  DESSERT: { label: 'Tatlı', color: 'bg-pink-100 text-pink-700' },
  OTHER: { label: 'Diğer', color: 'bg-gray-100 text-gray-700' },
};

export default function ImagePicker({
  value,
  imageSource = 'UPLOAD',
  galleryAssetId,
  onChange,
  onUploadStart,
  onUploadEnd,
}: ImagePickerProps) {
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>(imageSource === 'GALLERY' ? 'gallery' : 'upload');

  // Upload state
  const [uploadPreview, setUploadPreview] = useState<string>(imageSource === 'UPLOAD' ? value || '' : '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gallery state
  const [galleryAssets, setGalleryAssets] = useState<GalleryAsset[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<GalleryAsset | null>(null);
  const [galleryPage, setGalleryPage] = useState(1);
  const [galleryTotal, setGalleryTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  // Debounce search
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load gallery when tab changes to gallery
  useEffect(() => {
    if (activeTab === 'gallery') {
      loadGalleryAssets(1, true);
    }
  }, [activeTab]);

  // Reload gallery when filters change
  useEffect(() => {
    if (activeTab === 'gallery') {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        loadGalleryAssets(1, true);
      }, 300);
    }
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, filterType, filterCategory]);

  // Set initial selected asset if galleryAssetId is provided
  useEffect(() => {
    if (galleryAssetId && imageSource === 'GALLERY') {
      loadSelectedAsset(galleryAssetId);
    }
  }, [galleryAssetId, imageSource]);

  const loadCategories = async () => {
    try {
      const response = await apiClient.getGalleryCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadSelectedAsset = async (assetId: string) => {
    try {
      const response = await apiClient.getGalleryAsset(assetId);
      if (response.data) {
        setSelectedAsset(response.data);
      }
    } catch (error) {
      console.error('Failed to load selected asset:', error);
    }
  };

  const loadGalleryAssets = async (page: number, reset: boolean = false) => {
    setGalleryLoading(true);
    try {
      const response = await apiClient.getGalleryAssets({
        q: searchQuery || undefined,
        type: filterType as any || undefined,
        category: filterCategory || undefined,
        page,
        limit: 12,
        isActive: 'true',
      });

      const { items, total, totalPages } = response.data;
      
      if (reset) {
        setGalleryAssets(items);
      } else {
        setGalleryAssets((prev) => [...prev, ...items]);
      }
      
      setGalleryTotal(total);
      setGalleryPage(page);
      setHasMore(page < totalPages);
    } catch (error) {
      console.error('Failed to load gallery assets:', error);
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      alert('Sadece JPG, JPEG ve PNG dosyaları yüklenebilir');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\'dan büyük olamaz');
      return;
    }

    try {
      setUploading(true);
      onUploadStart?.();

      const response = await apiClient.uploadFile(file, 'product');
      const imageUrl = response.data.url;

      setUploadPreview(imageUrl);
      setSelectedAsset(null);
      
      onChange({
        imageUrl,
        imageSource: 'UPLOAD',
        galleryAssetId: null,
      });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Görsel yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setUploading(false);
      onUploadEnd?.();
    }
  };

  const handleSelectFromGallery = (asset: GalleryAsset) => {
    setSelectedAsset(asset);
    setUploadPreview('');
    
    onChange({
      imageUrl: asset.imageUrl,
      imageSource: 'GALLERY',
      galleryAssetId: asset.id,
    });
  };

  const handleClearImage = () => {
    setUploadPreview('');
    setSelectedAsset(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    onChange({
      imageUrl: '',
      imageSource: 'UPLOAD',
      galleryAssetId: null,
    });
  };

  const handleLoadMore = () => {
    if (!galleryLoading && hasMore) {
      loadGalleryAssets(galleryPage + 1, false);
    }
  };

  const currentPreview = activeTab === 'gallery' && selectedAsset
    ? selectedAsset.imageUrl
    : uploadPreview;

  return (
    <div className="space-y-4">
      {/* Current Preview */}
      {currentPreview && (
        <div className="relative">
          <img
            src={currentPreview}
            alt="Seçili görsel"
            className="w-full h-48 object-cover rounded-lg border-2 border-blue-500"
          />
          <button
            type="button"
            onClick={handleClearImage}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {selectedAsset && (
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
              📁 Galeriden: {selectedAsset.title}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 transition-colors ${
            activeTab === 'upload'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Bilgisayardan Yükle
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 transition-colors ${
            activeTab === 'gallery'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Galeriden Seç
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                    <p className="text-sm text-gray-500">Yükleniyor...</p>
                  </>
                ) : (
                  <>
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Tıklayın veya sürükleyin</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Görsel ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Gallery Grid */}
            {galleryLoading && galleryAssets.length === 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg"></div>
                    <div className="h-3 bg-gray-200 rounded mt-2"></div>
                  </div>
                ))}
              </div>
            ) : galleryAssets.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Görsel bulunamadı</p>
                <p className="text-sm mt-1">Farklı filtreler deneyin</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {galleryAssets.map((asset) => {
                    const isSelected = selectedAsset?.id === asset.id;
                    const badge = TYPE_BADGES[asset.type];
                    
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => handleSelectFromGallery(asset)}
                        className={`group relative text-left rounded-lg overflow-hidden border-2 transition-all ${
                          isSelected
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {/* Image */}
                        <div className="aspect-square relative overflow-hidden bg-gray-100">
                          <img
                            src={asset.thumbUrl || asset.imageUrl}
                            alt={asset.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                          
                          {/* Hover Overlay */}
                          <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                            isSelected ? 'opacity-100 bg-blue-500/30' : 'opacity-0 group-hover:opacity-100 bg-black/40'
                          }`}>
                            {isSelected ? (
                              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            ) : (
                              <span className="px-3 py-1.5 bg-white text-gray-800 text-sm font-medium rounded-full">
                                Seç
                              </span>
                            )}
                          </div>

                          {/* Type Badge */}
                          <span className={`absolute top-2 left-2 px-1.5 py-0.5 text-xs font-medium rounded ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="p-2">
                          <p className="text-sm font-medium text-gray-900 truncate">{asset.title}</p>
                          {asset.category && (
                            <p className="text-xs text-gray-500 truncate">{asset.category}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="text-center pt-4">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={galleryLoading}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      {galleryLoading ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          Yükleniyor...
                        </span>
                      ) : (
                        `Daha Fazla Yükle (${galleryAssets.length}/${galleryTotal})`
                      )}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Gallery Stats */}
            {galleryTotal > 0 && (
              <p className="text-center text-xs text-gray-500">
                {galleryTotal} görsel bulundu
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
