'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth.store';

export default function RestaurantSettingsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    logo: '',
    headerImage: '',
    instagramUrl: '',
    facebookUrl: '',
    workingHours: '',
  });

  const [logoPreview, setLogoPreview] = useState<string>('');
  const [headerPreview, setHeaderPreview] = useState<string>('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHeader, setUploadingHeader] = useState(false);

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getMyRestaurant();
      const restaurant = response.data?.restaurant || response.data || response;

      if (!restaurant || !restaurant.id) {
        throw new Error('Restaurant data not found');
      }

      setRestaurantId(restaurant.id);
      setFormData({
        name: restaurant.name || '',
        description: restaurant.description || '',
        address: restaurant.address || '',
        phone: restaurant.phone || '',
        email: restaurant.email || '',
        logo: restaurant.logo || '',
        headerImage: restaurant.headerImage || '',
        instagramUrl: restaurant.instagramUrl || '',
        facebookUrl: restaurant.facebookUrl || '',
        workingHours: restaurant.workingHours || '',
      });

      // Backend URL'i ekle
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      setLogoPreview(restaurant.logo ? `${backendUrl}${restaurant.logo}` : '');
      setHeaderPreview(restaurant.headerImage ? `${backendUrl}${restaurant.headerImage}` : '');
    } catch (error: any) {
      console.error('Failed to fetch restaurant:', error);
      setMessage({ type: 'error', text: 'Restoran bilgileri yüklenemedi' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const response = await apiClient.uploadFile(file, 'logo');
      const imageUrl = response.data.url;
      
      setFormData({ ...formData, logo: imageUrl });
      // Backend URL'i ekle
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      setLogoPreview(`${backendUrl}${imageUrl}`);
      setMessage({ type: 'success', text: '✅ Logo yüklendi!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Logo yüklenemedi' });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleHeaderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingHeader(true);
      const response = await apiClient.uploadFile(file, 'logo');
      const imageUrl = response.data.url;
      
      setFormData({ ...formData, headerImage: imageUrl });
      // Backend URL'i ekle
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      setHeaderPreview(`${backendUrl}${imageUrl}`);
      setMessage({ type: 'success', text: '✅ Header görseli yüklendi!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Header görseli yüklenemedi' });
    } finally {
      setUploadingHeader(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      await apiClient.updateRestaurant(restaurantId, formData);

      setMessage({ type: 'success', text: '✅ Restoran bilgileri kaydedildi!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Kaydetme başarısız';
      setMessage({ type: 'error', text: `❌ ${errorMessage}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['RESTAURANT_ADMIN']}>
        <DashboardLayout title="⚙️ Restoran Ayarları">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['RESTAURANT_ADMIN']}>
      <DashboardLayout title="⚙️ Restoran Ayarları">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Logo Upload */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏪</span>
              <h2 className="text-xl font-bold text-gray-900">Restoran Logosu</h2>
            </div>

            <div className="space-y-4">
              {logoPreview && (
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <img src={logoPreview} alt="Logo" className="max-w-full max-h-full object-contain" />
                </div>
              )}

              <div className="flex gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-medium">
                    {uploadingLogo ? 'Yükleniyor...' : '📤 Logo Yükle'}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="hidden"
                  />
                </label>

                {logoPreview && (
                  <button
                    onClick={() => {
                      setFormData({ ...formData, logo: '' });
                      setLogoPreview('');
                    }}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    🗑️
                  </button>
                )}
              </div>

              <p className="text-sm text-gray-500">
                Logo, QR menüde restoran adının yanında gösterilir. (Önerilen: 500x500px, max 2MB)
              </p>
            </div>
          </div>

          {/* Header Image Upload */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🖼️</span>
              <h2 className="text-xl font-bold text-gray-900">Header Görseli</h2>
            </div>

            <div className="space-y-4">
              {headerPreview && (
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={headerPreview} alt="Header" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center font-medium">
                    {uploadingHeader ? 'Yükleniyor...' : '📤 Header Yükle'}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeaderUpload}
                    disabled={uploadingHeader}
                    className="hidden"
                  />
                </label>

                {headerPreview && (
                  <button
                    onClick={() => {
                      setFormData({ ...formData, headerImage: '' });
                      setHeaderPreview('');
                    }}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    🗑️
                  </button>
                )}
              </div>

              <p className="text-sm text-gray-500">
                Header, QR menü sayfasının en üstünde gösterilir. (Önerilen: 1200x400px, max 5MB)
              </p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📝</span>
              <h2 className="text-xl font-bold text-gray-900">Temel Bilgiler</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Restoran Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="05XX XXX XX XX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📱</span>
              <h2 className="text-xl font-bold text-gray-900">Sosyal Medya</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center gap-2">
                    📸 Instagram URL
                  </span>
                </label>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://instagram.com/restoraniniz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center gap-2">
                    📘 Facebook URL
                  </span>
                </label>
                <input
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://facebook.com/restoraniniz"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>İpucu:</strong> Sosyal medya butonları QR menüdeki alt barda görünecek ve müşterileriniz tek tıkla hesaplarınıza ulaşabilecek.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? '💾 Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
          </button>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
