'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isRestaurantAdmin = user?.role === 'RESTAURANT_ADMIN';

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b fixed w-full top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {sidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              
              <Link href={isSuperAdmin ? '/admin/dashboard' : '/restaurant/dashboard'} className="flex items-center">
                <img src="/benmedya.png" alt="Menü Ben" className="h-8 sm:h-10 w-auto mr-2 sm:mr-3" />
                <span className="text-base sm:text-xl font-bold text-gray-900 hidden xs:inline">
                  Menü Ben
                </span>
                <span className="text-xs sm:text-sm text-gray-500 hidden md:inline ml-1">
                  {isSuperAdmin ? '| Super Admin' : '| Restoran'}
                </span>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">{user?.name}</div>
                <div className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-none">{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Çıkış</span>
                <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`
        fixed top-14 sm:top-16 left-0 z-50 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]
        w-64 bg-white shadow-lg lg:shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <nav className="p-4 space-y-1 overflow-y-auto h-full">
          {isSuperAdmin && (
            <>
              <Link
                href="/admin/dashboard"
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <span className="text-xl">📊</span>
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                href="/admin/restaurants"
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <span className="text-xl">🏪</span>
                <span className="font-medium">Restoranlar</span>
              </Link>
              <Link
                href="/admin/users"
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <span className="text-xl">👥</span>
                <span className="font-medium">Kullanıcılar</span>
              </Link>
              <Link
                href="/admin/analytics"
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <span className="text-xl">📈</span>
                <span className="font-medium">Analitik</span>
              </Link>
            </>
          )}

          {isRestaurantAdmin && (
            <>
              <Link
                href="/restaurant/dashboard"
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <span className="text-xl">📊</span>
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                href="/restaurant/menu"
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <span className="text-xl">📋</span>
                <span className="font-medium">Menü Yönetimi</span>
              </Link>
              <Link
                href="/restaurant/categories"
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <span className="text-xl">📁</span>
                <span className="font-medium">Kategoriler</span>
              </Link>
              <Link
                href="/restaurant/qr-codes"
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <span className="text-xl">🎯</span>
                <span className="font-medium">QR Kodlar</span>
              </Link>
              <Link
                href="/restaurant/settings"
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <span className="text-xl">⚙️</span>
                <span className="font-medium">Restoran Ayarları</span>
              </Link>
              <Link
                href="/restaurant/menu-appearance"
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <span className="text-xl">🎨</span>
                <span className="font-medium">Menü Görünümü</span>
              </Link>
              <Link
                href="/restaurant/analytics"
                onClick={closeSidebar}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <span className="text-xl">📈</span>
                <span className="font-medium">İstatistikler</span>
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-14 sm:pt-16 lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">
          {title && (
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
