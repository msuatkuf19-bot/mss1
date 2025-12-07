'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
    isActive: true,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.accessToken : ''}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        setUsers(result.data || []);
      }
    } catch (error) {
      console.error('Kullanıcılar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.accessToken : '';
      
      if (editingUser) {
        await fetch(`http://localhost:5000/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }
      
      setShowModal(false);
      resetForm();
      loadUsers();
    } catch (error: any) {
      alert('Bir hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;
    try {
      const token = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.accessToken : '';
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      loadUsers();
    } catch (error: any) {
      alert('Silinemedi');
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'CUSTOMER',
      isActive: true,
    });
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      SUPER_ADMIN: 'bg-purple-100 text-purple-700',
      RESTAURANT_ADMIN: 'bg-blue-100 text-blue-700',
      CUSTOMER: 'bg-gray-100 text-gray-700',
    };
    return styles[role as keyof typeof styles] || styles.CUSTOMER;
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      SUPER_ADMIN: 'Süper Admin',
      RESTAURANT_ADMIN: 'Restoran Admin',
      CUSTOMER: 'Müşteri',
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <DashboardLayout title="👥 Kullanıcı Yönetimi">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <p className="text-gray-600 text-sm sm:text-base">Tüm kullanıcıları yönetin</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <span>➕</span>
            <span>Yeni Kullanıcı</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Henüz kullanıcı eklenmemiş</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block md:hidden">
                <div className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <div key={user.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {user.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Kullanıcı</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-700">Rol</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-700">Durum</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Kayıt Tarihi</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-700">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {user.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
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
            </>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">İsim *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {!editingUser && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Şifre *</label>
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rol *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="CUSTOMER">Müşteri</option>
                      <option value="RESTAURANT_ADMIN">Restoran Admin</option>
                      <option value="SUPER_ADMIN">Süper Admin</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 text-blue-600"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Aktif kullanıcı
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      {editingUser ? 'Güncelle' : 'Oluştur'}
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
