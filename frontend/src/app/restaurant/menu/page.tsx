'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/constants';
import MenuFilterBar from '@/components/restaurant/MenuFilterBar';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  imageUrl?: string;
  isAvailable: boolean;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function RestaurantMenu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    image: '',
    isAvailable: true,
    ingredients: '',
    allergens: '',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isSpicy: false,
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string>('');

  // Callback for filtered products from MenuFilterBar
  const handleFilteredProducts = useCallback((filtered: Product[], total: number) => {
    setFilteredProducts(filtered);
    setTotalFiltered(total);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const restaurantRes = await apiClient.getMyRestaurant();
      const restaurant = restaurantRes.data?.restaurant || restaurantRes.data || restaurantRes;
      
      console.log('Restaurant data:', restaurant);
      
      if (!restaurant || !restaurant.id) {
        throw new Error('Restaurant ID not found');
      }
      
      setRestaurantId(restaurant.id);
      
      const [productsRes, categoriesRes] = await Promise.all([
        apiClient.getProducts(undefined, restaurant.id),
        apiClient.getCategories(restaurant.id),
      ]);
      
      console.log('Products:', productsRes.data);
      console.log('Categories:', categoriesRes.data);
      
      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Veriler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingProduct) {
        await apiClient.updateProduct(editingProduct.id, formData);
        toast.success('✅ Ürün başarıyla güncellendi!');
      } else {
        await apiClient.createProduct(formData);
        toast.success('✅ Ürün başarıyla oluşturuldu!');
      }
      setShowModal(false);
      resetForm();
      await loadData();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Bir hata oluştu';
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    try {
      await apiClient.deleteProduct(id);
      toast.success('✅ Ürün silindi');
      await loadData();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Silinemedi';
      toast.error(`❌ ${errorMsg}`);
    }
  };

  const toggleAvailability = async (product: Product) => {
    try {
      await apiClient.updateProduct(product.id, {
        isAvailable: !product.isAvailable,
      });
      toast.success(product.isAvailable ? '📦 Ürün tükendi olarak işaretlendi' : '✅ Ürün mevcut olarak işaretlendi');
      await loadData();
    } catch (error: any) {
      toast.error('❌ Durum güncellenemedi');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const response = await apiClient.uploadFile(file, 'product');
      const imageUrl = response.data.url;
      
      setFormData({ ...formData, image: imageUrl });
      setImagePreview(imageUrl);
      toast.success('✅ Görsel yüklendi!');
    } catch (error: any) {
      toast.error('❌ Görsel yüklenemedi');
    } finally {
      setUploadingImage(false);
    }
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      categoryId: product.category.id,
      image: product.image || '',
      isAvailable: product.isAvailable,
      ingredients: product.ingredients || '',
      allergens: product.allergens || '',
      isVegetarian: product.isVegetarian || false,
      isVegan: product.isVegan || false,
      isGlutenFree: product.isGlutenFree || false,
      isSpicy: product.isSpicy || false,
    });
    setImagePreview(product.image || DEFAULT_PRODUCT_IMAGE);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      categoryId: categories[0]?.id || '',
      image: '',
      isAvailable: true,
      ingredients: '',
      allergens: '',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
    });
    setImagePreview('');
  };

  return (
    <ProtectedRoute allowedRoles={['RESTAURANT_ADMIN']}>
      <DashboardLayout title="🍽️ Menü Yönetimi">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-600">Menünüzdeki ürünleri yönetin</p>
          </div>
          <button
            onClick={() => {
              if (categories.length === 0) {
                alert('Önce en az bir kategori oluşturun!');
                return;
              }
              resetForm();
              setShowModal(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <span>➕</span>
            <span>Yeni Ürün</span>
          </button>
        </div>

        {/* Filter Bar */}
        {!loading && products.length > 0 && (
          <MenuFilterBar
            products={products}
            categories={categories}
            onFilteredProducts={handleFilteredProducts}
          />
        )}

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Henüz ürün eklenmemiş</p>
              {categories.length === 0 && (
                <p className="text-orange-500 text-sm mt-2">⚠️ Önce kategori oluşturun!</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Ürün</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Kategori</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-700">Fiyat</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-700">Durum</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-700">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.image || product.imageUrl || DEFAULT_PRODUCT_IMAGE} 
                            alt={product.name}
                            className="w-16 h-16 rounded-lg object-cover border"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            {product.description && (
                              <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {product.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-bold text-green-600 text-lg">
                          {product.price.toFixed(2)} ₺
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => toggleAvailability(product)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.isAvailable
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.isAvailable ? 'Mevcut' : 'Tükendi'}
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ürün Adı *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Örn: Karışık Pizza"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Ürün açıklaması..."
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ürün Görseli
                    </label>
                    
                    {imagePreview && (
                      <div className="mb-3 relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, image: '' });
                            setImagePreview('');
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                    
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">{uploadingImage ? 'Yükleniyor...' : 'Tıklayın veya sürükleyin'}</span>
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori *
                    </label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Kategori Seçin</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fiyat (₺) *
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  {/* İçindekiler */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🥘 İçindekiler
                    </label>
                    <textarea
                      value={formData.ingredients}
                      onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Örn: Dana eti, soğan, domates, biber, baharat..."
                    />
                  </div>

                  {/* Alerjenler */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ⚠️ Alerjen Uyarıları
                    </label>
                    <input
                      type="text"
                      value={formData.allergens}
                      onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Örn: Gluten, süt ürünü, yumurta"
                    />
                  </div>

                  {/* Diyet Etiketleri */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      🍽️ Diyet ve Özellikler
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isVegetarian"
                          checked={formData.isVegetarian}
                          onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                          className="w-4 h-4 text-green-600"
                        />
                        <label htmlFor="isVegetarian" className="text-sm text-gray-700">
                          🥗 Vejetaryen
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isVegan"
                          checked={formData.isVegan}
                          onChange={(e) => setFormData({ ...formData, isVegan: e.target.checked })}
                          className="w-4 h-4 text-green-600"
                        />
                        <label htmlFor="isVegan" className="text-sm text-gray-700">
                          🌱 Vegan
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isGlutenFree"
                          checked={formData.isGlutenFree}
                          onChange={(e) => setFormData({ ...formData, isGlutenFree: e.target.checked })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <label htmlFor="isGlutenFree" className="text-sm text-gray-700">
                          🌾 Glütensiz
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isSpicy"
                          checked={formData.isSpicy}
                          onChange={(e) => setFormData({ ...formData, isSpicy: e.target.checked })}
                          className="w-4 h-4 text-red-600"
                        />
                        <label htmlFor="isSpicy" className="text-sm text-gray-700">
                          🌶️ Acı
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isAvailable"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="w-5 h-5 text-blue-600"
                    />
                    <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
                      Ürün mevcut
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      {editingProduct ? 'Güncelle' : 'Oluştur'}
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
