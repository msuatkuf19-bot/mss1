'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, hydrated } = useAuthStore();

  useEffect(() => {
    // Wait for hydration
    if (!hydrated) return;

    // Redirect to login if auth required but not authenticated
    if (requireAuth && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check role permissions
    if (requireAuth && isAuthenticated && allowedRoles.length > 0) {
      if (!user || !allowedRoles.includes(user.role)) {
        // Redirect unauthorized users
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, user, allowedRoles, requireAuth, router, hydrated]);

  // Show loading while hydrating
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show loading while redirecting
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check role authorization
  if (requireAuth && isAuthenticated && allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
