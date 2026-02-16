'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

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
  restaurantId: string | null;
  createdAt: string;
}

const TYPE_OPTIONS = [
  { value: 'FOOD', label: '🍔 Yemek', color: 'bg-orange-100 text-orange-700' },
  { value: 'DRINK', label: '🥤 İçecek', color: 'bg-blue-100 text-blue-700' },
  { value: 'DESSERT', label: '🍰 Tatlı', color: 'bg-pink-100 text-pink-700' },
  { value: 'OTHER', label: '📦 Diğer', color: 'bg-gray-100 text-gray-700' },
];

const SCOPE_OPTIONS = [
  { value: 'GLOBAL', label: '🌍 Global' },
  { value: 'RESTAURANT', label: '🏪 Restoran' },
];

export default function GalleryAssetsPage() {
  // Data state
  const [assets, setAssets] = useState<GalleryAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterScope, setFilterScope] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<GalleryAsset | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: 'FOOD' as 'FOOD' | 'DRINK' | 'DESSERT' | 'OTHER',
    category: '',
    tags: '',
    imageUrl: '',
    thumbUrl: '',
    isActive: true,
    order: 0,
    scope: 'GLOBAL' as 'GLOBAL' | 'RESTAURANT',
    restaurantId: '',
  });

  // Debounce search
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadCategories();
    loadAssets(1, true);
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      loadAssets(1, true);
    }, 300);
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, filterType, filterCategory, filterScope, filterActive]);

  const loadCategories = async () => {
    try {
      const response = await apiClient.getGalleryCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadAssets = async (pageNum: number, reset: boolean = false) => {
    setLoading(true);
    try {
      const response = await apiClient.getGalleryAssets({
        q: searchQuery || undefined,
        type: filterType as any || undefined,
        category: filterCategory || undefined,
        scope: filterScope as any || undefined,
        isActive: filterActive,
        page: pageNum,
        limit: 20,
      });

      const { items, total, totalPages } = response.data;

      if (reset) {
        setAssets(items);
      } else {
        setAssets((prev) => [...prev, ...items]);
      }

      setTotal(total);
      setPage(pageNum);
      setHasMore(pageNum < totalPages);
    } catch (error) {
      console.error('Failed to load assets:', error);
      toast.error('Görseller yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'FOOD',
      category: '',
      tags: '',
      imageUrl: '',
      thumbUrl: '',
      isActive: true,
      order: 0,
      scope: 'GLOBAL',
      restaurantId: '',
    });
    setEditingAsset(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (asset: GalleryAsset) => {
    setEditingAsset(asset);
    setFormData({
      title: asset.title,
      type: asset.type,
      category: asset.category || '',
      tags: asset.tags.join(', '),
      imageUrl: asset.imageUrl,
      thumbUrl: asset.thumbUrl || '',
      isActive: asset.isActive,
      order: asset.order,
      scope: asset.scope,
      restaurantId: asset.restaurantId || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        type: formData.type,
        category: formData.category.trim() || undefined,
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
          : [],
        imageUrl: formData.imageUrl.trim(),
        thumbUrl: formData.thumbUrl.trim() || undefined,
        isActive: formData.isActive,
        order: formData.order,
        scope: formData.scope,
        restaurantId: formData.scope === 'RESTAURANT' ? formData.restaurantId : undefined,
      };

      if (editingAsset) {
        await apiClient.updateGalleryAsset(editingAsset.id, payload);
        toast.success('✅ Görsel güncellendi');
      } else {
        await apiClient.createGalleryAsset(payload as any);
        toast.success('✅ Görsel eklendi');
      }

      setShowModal(false);
      resetForm();
      loadAssets(1, true);
      loadCategories();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Bir hata oluştu';
      toast.error(`❌ ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return;

    try {
      await apiClient.deleteGalleryAsset(id);
      toast.success('✅ Görsel silindi');
      loadAssets(1, true);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Silinemedi';
      toast.error(`❌ ${msg}`);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await apiClient.toggleGalleryAsset(id);
      toast.success('✅ Durum güncellendi');
      loadAssets(page, false);
      // Update local state
      setAssets((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
      );
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Güncellenemedi';
      toast.error(`❌ ${msg}`);
    }
  };

  const getTypeBadge = (type: string) => {
    const opt = TYPE_OPTIONS.find((o) => o.value === type);
    return opt || { value: type, label: type, color: 'bg-gray-100 text-gray-700' };
  };

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <DashboardLayout title="📸 Galeri Yönetimi">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <p className="text-gray-600">
              Hazır görsel galerisi yönetimi. Restoranlar bu görselleri ürünlerine atayabilir.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Toplam {total} görsel
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 whitespace-nowrap"
          >
            <span>➕</span>
            <span>Yeni Görsel Ekle</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Görsel ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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

            {/* Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tüm Türler</option>
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Category */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Scope */}
            <select
              value={filterScope}
              onChange={(e) => setFilterScope(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tüm Kapsamlar</option>
              {SCOPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Active */}
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="true">✅ Aktif</option>
              <option value="false">❌ Pasif</option>
            </select>
          </div>
        </div>

        {/* Assets Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {loading && assets.length === 0 ? (
            <div className="p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded mt-2"></div>
                    <div className="h-3 bg-gray-200 rounded mt-1 w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : assets.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg">Görsel bulunamadı</p>
              <p className="text-gray-400 text-sm mt-1">Yeni görsel eklemek için yukarıdaki butonu kullanın</p>
            </div>
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {assets.map((asset) => {
                  const badge = getTypeBadge(asset.type);
                  return (
                    <div
                      key={asset.id}
                      className={`group relative rounded-lg overflow-hidden border ${
                        asset.isActive ? 'border-gray-200' : 'border-red-200 opacity-60'
                      }`}
                    >
                      {/* Image */}
                      <div className="aspect-square relative overflow-hidden bg-gray-100">
                        <img
                          src={asset.thumbUrl || asset.imageUrl}
                          alt={asset.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />

                        {/* Type Badge */}
                        <span className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded ${badge.color}`}>
                          {badge.label}
                        </span>

                        {/* Scope Badge */}
                        {asset.scope === 'RESTAURANT' && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700">
                            🏪
                          </span>
                        )}

                        {/* Inactive Overlay */}
                        {!asset.isActive && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                              Pasif
                            </span>
                          </div>
                        )}

                        {/* Actions Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(asset)}
                            className="p-2 bg-white rounded-lg hover:bg-blue-100 transition-colors"
                            title="Düzenle"
                          >
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleToggle(asset.id)}
                            className="p-2 bg-white rounded-lg hover:bg-yellow-100 transition-colors"
                            title={asset.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                          >
                            {asset.isActive ? (
                              <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(asset.id)}
                            className="p-2 bg-white rounded-lg hover:bg-red-100 transition-colors"
                            title="Sil"
                          >
                            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <p className="font-medium text-gray-900 truncate">{asset.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {asset.category && (
                            <span className="text-xs text-gray-500">{asset.category}</span>
                          )}
                          <span className="text-xs text-gray-400">#{asset.order}</span>
                        </div>
                        {asset.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {asset.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                            {asset.tags.length > 3 && (
                              <span className="text-xs text-gray-400">+{asset.tags.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center pt-6">
                  <button
                    onClick={() => loadAssets(page + 1, false)}
                    disabled={loading}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Yükleniyor...' : `Daha Fazla Yükle (${assets.length}/${total})`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingAsset ? 'Görsel Düzenle' : 'Yeni Görsel Ekle'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlık *
                    </label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Örn: Karışık Pizza"
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Görsel URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Görsel+Yüklenemedi';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Thumb URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Küçük Resim URL (Opsiyonel)
                    </label>
                    <input
                      type="url"
                      value={formData.thumbUrl}
                      onChange={(e) => setFormData({ ...formData, thumbUrl: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/thumb.jpg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tür *
                      </label>
                      <select
                        required
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Örn: Pizza, Burger"
                        list="category-suggestions"
                      />
                      <datalist id="category-suggestions">
                        {categories.map((cat) => (
                          <option key={cat} value={cat} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Etiketler (virgülle ayırın)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="italyan, peynir, sıcak"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Scope */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kapsam *
                      </label>
                      <select
                        required
                        value={formData.scope}
                        onChange={(e) => setFormData({ ...formData, scope: e.target.value as any })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {SCOPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Order */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sıra
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Active */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 text-blue-600"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Görsel aktif (Restoranlara gösterilsin)
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                    >
                      {submitting ? 'Kaydediliyor...' : editingAsset ? 'Güncelle' : 'Oluştur'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
