'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface DashboardStats {
  restaurants: number;
  users: number;
  qrScans: number;
  activeRestaurants: number;
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  owner: { name: string; email: string };
  _count: { categories: number; qrCodes: number };
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    restaurants: 0,
    users: 0,
    qrScans: 0,
    activeRestaurants: 0,
  });
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Tüm restoranları getir
      const restaurantsRes = await apiClient.getRestaurants();
      const restaurantsData = restaurantsRes.data || [];
      setRestaurants(restaurantsData);

      // Kullanıcı istatistikleri - custom endpoint
      let usersData = { totalUsers: 0 };
      try {
        const result = await apiClient.getUserStats();
        usersData = result.data || usersData;
      } catch (err) {
        console.log('Kullanıcı stats alınamadı:', err);
      }

      // QR scan istatistikleri (analytics'ten)
      let totalScans = 0;
      try {
        const analyticsRes = await apiClient.getAnalytics();
        const analyticsData = analyticsRes.data || [];
        totalScans = analyticsData.length;
      } catch (err) {
        console.log('Analytics verisi alınamadı:', err);
      }

      setStats({
        restaurants: restaurantsData.length,
        users: usersData.totalUsers || 0,
        qrScans: totalScans,
        activeRestaurants: restaurantsData.filter((r: Restaurant) => r._count.categories > 0).length,
      });
    } catch (error) {
      console.error('Dashboard verileri yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <DashboardLayout title="👑 Süper Admin Dashboard">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Yükleniyor...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-600">Toplam Restoran</h3>
                  <span className="text-xl sm:text-3xl">🏪</span>
                </div>
                <p className="text-xl sm:text-3xl font-bold text-blue-600">{stats.restaurants}</p>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">{stats.activeRestaurants} aktif</p>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-600">Toplam Kullanıcı</h3>
                  <span className="text-xl sm:text-3xl">👥</span>
                </div>
                <p className="text-xl sm:text-3xl font-bold text-green-600">{stats.users}</p>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">Tüm roller</p>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-600">QR Tarama</h3>
                  <span className="text-xl sm:text-3xl">📊</span>
                </div>
                <p className="text-xl sm:text-3xl font-bold text-purple-600">{stats.qrScans}</p>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">Toplam görüntülenme</p>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-600">Aktif Oran</h3>
                  <span className="text-xl sm:text-3xl">📈</span>
                </div>
                <p className="text-xl sm:text-3xl font-bold text-orange-600">
                  {stats.restaurants > 0 ? Math.round((stats.activeRestaurants / stats.restaurants) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">Menüsü olan</p>
              </div>
            </div>

            {/* Recent Restaurants */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Son Eklenen Restoranlar</h2>
                <a href="/admin/restaurants" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Tümünü Gör →
                </a>
              </div>

              {restaurants.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Henüz restoran eklenmemiş</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Restoran</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Sahip</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Kategori</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">QR Kod</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Oluşturulma</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restaurants.slice(0, 5).map((restaurant) => (
                        <tr key={restaurant.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{restaurant.name}</div>
                              <div className="text-sm text-gray-500">/{restaurant.slug}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-sm text-gray-900">{restaurant.owner.name}</div>
                              <div className="text-xs text-gray-500">{restaurant.owner.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              {restaurant._count.categories}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                              {restaurant._count.qrCodes}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(restaurant.createdAt).toLocaleDateString('tr-TR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
