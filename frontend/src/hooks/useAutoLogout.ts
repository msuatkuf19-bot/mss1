'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

// Otomatik çıkış süresi (dakika cinsinden) - değiştirilebilir constant
export const AUTO_LOGOUT_MINUTES = 15;

// Kontrol aralığı (milisaniye)
const CHECK_INTERVAL_MS = 30 * 1000; // 30 saniye

// localStorage key
const LAST_ACTIVITY_KEY = 'lastActivityTime';

// Auto-logout gerektirmeyen sayfalar
const PUBLIC_PATHS = ['/login', '/register', '/menu', '/m/', '/demo', '/ornek-menuler', '/unauthorized'];

/**
 * Kullanıcı inaktif kaldığında otomatik logout yapan hook.
 * 
 * - Kullanıcı her etkileşiminde (click, mousemove, keydown, scroll) son aktif zamanı günceller
 * - Her 30 saniyede süre kontrolü yapar
 * - Süre aşıldıysa logout fonksiyonunu çalıştırır ve login sayfasına yönlendirir
 * - Memory leak olmaması için event listener ve interval temizliği yapılır
 */
export function useAutoLogout() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout, hydrated } = useAuthStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isLoggingOutRef = useRef(false);

  // Son aktif zamanı güncelle
  const updateLastActivity = useCallback(() => {
    if (typeof window !== 'undefined' && isAuthenticated) {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    }
  }, [isAuthenticated]);

  // Oturumu sonlandır
  const performLogout = useCallback(() => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    // LocalStorage'dan activity temizle
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LAST_ACTIVITY_KEY);
    }

    // Logout yap
    logout();

    // Kullanıcıya bilgi ver
    toast.error('Oturumunuz uzun süre işlem yapılmadığı için sonlandırıldı.', {
      duration: 5000,
      icon: '⏰',
    });

    // Login sayfasına yönlendir
    router.push('/login');

    // Kısa bir süre sonra flag'i sıfırla
    setTimeout(() => {
      isLoggingOutRef.current = false;
    }, 1000);
  }, [logout, router]);

  // Süre kontrolü
  const checkInactivity = useCallback(() => {
    if (typeof window === 'undefined' || !isAuthenticated) return;

    const lastActivityStr = localStorage.getItem(LAST_ACTIVITY_KEY);
    
    // Eğer hiç activity kaydedilmemişse, şimdi kaydet
    if (!lastActivityStr) {
      updateLastActivity();
      return;
    }

    const lastActivity = parseInt(lastActivityStr, 10);
    const now = Date.now();
    const inactiveMs = now - lastActivity;
    const maxInactiveMs = AUTO_LOGOUT_MINUTES * 60 * 1000;

    if (inactiveMs >= maxInactiveMs) {
      performLogout();
    }
  }, [isAuthenticated, updateLastActivity, performLogout]);

  // Public sayfa mı kontrol et
  const isPublicPath = useCallback((path: string) => {
    return PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath)) || path === '/';
  }, []);

  useEffect(() => {
    // SSR kontrolü
    if (typeof window === 'undefined') return;

    // Hydration tamamlanmadan işlem yapma
    if (!hydrated) return;

    // Public sayfalarda auto-logout çalışmasın
    if (isPublicPath(pathname)) return;

    // Kullanıcı giriş yapmamışsa çalışmasın
    if (!isAuthenticated) return;

    // İlk activity kaydı
    updateLastActivity();

    // Event listener'ları ekle
    const events: (keyof WindowEventMap)[] = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    // Throttle ile activity güncelleme (her event'te değil, 1 saniyede max 1 kez)
    let lastUpdateTime = 0;
    const throttledUpdate = () => {
      const now = Date.now();
      if (now - lastUpdateTime >= 1000) {
        lastUpdateTime = now;
        updateLastActivity();
      }
    };

    events.forEach(event => {
      window.addEventListener(event, throttledUpdate, { passive: true });
    });

    // Periyodik kontrol başlat
    intervalRef.current = setInterval(checkInactivity, CHECK_INTERVAL_MS);

    // Sayfa görünürlüğü değiştiğinde kontrol et (tab'a geri dönüldüğünde)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkInactivity();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, throttledUpdate);
      });

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hydrated, isAuthenticated, pathname, isPublicPath, updateLastActivity, checkInactivity]);

  // Hook dışından kullanılabilecek fonksiyonlar
  return {
    updateLastActivity,
    performLogout,
  };
}
