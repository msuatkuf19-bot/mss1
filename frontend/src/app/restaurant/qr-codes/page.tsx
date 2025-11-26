'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface QRCode {
  id: string;
  code?: string;
  type: 'RESTAURANT' | 'TABLE';
  tableNumber?: number;
  url: string;
  imageUrl: string; // QR image endpoint URL
  isActive: boolean;
  createdAt: string;
}

export default function RestaurantQRCodes() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'RESTAURANT' as 'RESTAURANT' | 'TABLE',
    tableNumber: 1,
  });
  const [restaurantSlug, setRestaurantSlug] = useState('');

  useEffect(() => {
    loadQRCodes();
  }, []);

  const loadQRCodes = async () => {
    try {
      setLoading(true);
      const restaurantRes = await apiClient.getMyRestaurant();
      const restaurant = restaurantRes.data;
      setRestaurantSlug(restaurant.slug);
      
      const qrRes = await apiClient.getQRCodes(restaurant.id);
      console.log('📊 QR Codes loaded:', qrRes.data?.length || 0);
      setQrCodes(qrRes.data || []);
    } catch (error) {
      console.error('QR kodlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const restaurantRes = await apiClient.getMyRestaurant();
      const restaurantId = restaurantRes.data.id;

      await apiClient.createQRCode({
        restaurantId,
        type: formData.type,
        tableNumber: formData.type === 'TABLE' ? formData.tableNumber : undefined,
      });
      
      setShowModal(false);
      resetForm();
      loadQRCodes();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Bir hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu QR kodu silmek istediğinizden emin misiniz?')) return;
    try {
      await apiClient.deleteQRCode(id);
      loadQRCodes();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Silinemedi');
    }
  };

  const toggleActive = async (qr: QRCode) => {
    try {
      await apiClient.updateQRCode(qr.id, {
        isActive: !qr.isActive,
      });
      loadQRCodes();
    } catch (error: any) {
      alert('Durum güncellenemedi');
    }
  };

  const downloadQR = async (qr: QRCode) => {
    if (!qr.imageUrl) {
      alert('QR görsel bulunamadı');
      return;
    }
    
    try {
      // QR görselini fetch et
      const response = await fetch(qr.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR-${qr.type === 'TABLE' ? `Masa-${qr.tableNumber}` : 'Genel'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('QR indirme hatası:', error);
      alert('QR kodu indirilemedi');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'RESTAURANT',
      tableNumber: 1,
    });
  };

  const getQRDisplayUrl = (qr: QRCode) => {
    if (qr.type === 'RESTAURANT') {
      return `${window.location.origin}/menu/${restaurantSlug}`;
    }
    return `${window.location.origin}/menu/${restaurantSlug}?table=${qr.tableNumber}`;
  };

  return (
    <ProtectedRoute allowedRoles={['RESTAURANT_ADMIN']}>
      <DashboardLayout title="🎯 QR Kod Yönetimi">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-600">QR kodlarınızı oluşturun ve yönetin</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <span>➕</span>
            <span>Yeni QR Kod</span>
          </button>
        </div>

        {/* QR Codes Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : qrCodes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 text-center py-12">
            <p className="text-gray-500 text-lg">Henüz QR kod oluşturulmamış</p>
            <p className="text-gray-400 text-sm mt-2">Başlamak için "Yeni QR Kod" butonuna tıklayın</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qrCodes.map((qr) => (
              <div
                key={qr.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {qr.type === 'TABLE' ? `Masa ${qr.tableNumber}` : 'Genel Menü'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(qr.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      qr.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {qr.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>

                {/* QR Code Preview */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4 flex justify-center">
                  {qr.imageUrl ? (
                    <img 
                      src={qr.imageUrl} 
                      alt={`${qr.type === 'TABLE' ? `Masa ${qr.tableNumber}` : 'Genel Menü'} QR Kodu`}
                      className="w-40 h-40 object-contain" 
                    />
                  ) : (
                    <div className="w-40 h-40 bg-gray-200 rounded flex items-center justify-center">
                      <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* URL */}
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-600 font-mono break-all">
                    {getQRDisplayUrl(qr)}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadQR(qr)}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium"
                    >
                      İndir
                    </button>
                    <button
                      onClick={() => toggleActive(qr)}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                    >
                      {qr.isActive ? 'Pasifleştir' : 'Aktifleştir'}
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(qr.id)}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Yeni QR Kod Oluştur</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">QR Tipi *</label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value as 'RESTAURANT' | 'TABLE' })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="RESTAURANT">Genel Menü</option>
                      <option value="TABLE">Masa QR</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.type === 'RESTAURANT'
                        ? 'Tüm menü için genel QR kod'
                        : 'Belirli bir masa için QR kod'}
                    </p>
                  </div>

                  {formData.type === 'TABLE' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Masa Numarası *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.tableNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, tableNumber: parseInt(e.target.value) })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="1"
                      />
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Bilgi:</strong> QR kod oluşturulduktan sonra indirip yazdırabilirsiniz.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Oluştur
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
