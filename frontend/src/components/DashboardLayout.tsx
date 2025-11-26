'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isRestaurantAdmin = user?.role === 'RESTAURANT_ADMIN';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href={isSuperAdmin ? '/admin/dashboard' : '/restaurant/dashboard'} className="flex items-center">
                <span className="text-2xl mr-2">🍽️</span>
                <span className="text-xl font-bold text-gray-900">
                  QR Menü {isSuperAdmin ? '| Super Admin' : '| Restoran'}
                </span>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {isSuperAdmin && (
              <>
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <span>📊</span>
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                  href="/admin/restaurants"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <span>🏪</span>
                  <span className="font-medium">Restoranlar</span>
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <span>👥</span>
                  <span className="font-medium">Kullanıcılar</span>
                </Link>
                <Link
                  href="/admin/analytics"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <span>📈</span>
                  <span className="font-medium">Analitik</span>
                </Link>
              </>
            )}

            {isRestaurantAdmin && (
              <>
                <Link
                  href="/restaurant/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <span>📊</span>
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                  href="/restaurant/menu"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <span>📋</span>
                  <span className="font-medium">Menü Yönetimi</span>
                </Link>
                <Link
                  href="/restaurant/categories"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <span>📁</span>
                  <span className="font-medium">Kategoriler</span>
                </Link>
                <Link
                  href="/restaurant/qr-codes"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <span>🎯</span>
                  <span className="font-medium">QR Kodlar</span>
                </Link>
                <Link
                  href="/restaurant/settings"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <span>⚙️</span>
                  <span className="font-medium">Restoran Ayarları</span>
                </Link>
                <Link
                  href="/restaurant/menu-appearance"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <span>🎨</span>
                  <span className="font-medium">Menü Görünümü</span>
                </Link>
                <Link
                  href="/restaurant/analytics"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <span>📈</span>
                  <span className="font-medium">İstatistikler</span>
                </Link>
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {title && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
