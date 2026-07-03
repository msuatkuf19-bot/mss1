'use client';

import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { buildTheme, getCardRadiusClass, getHeaderBackgroundStyle } from '@/lib/theme-utils';
import { getTodayWorkingHours, getWeeklyWorkingHours, isRestaurantOpen } from '@/lib/working-hours-utils';
import { DEFAULT_PRODUCT_IMAGE } from '@/lib/constants';
import RestaurantLogo from '@/components/RestaurantLogo';
import WaiterCallButton from '@/components/customer/WaiterCallButton';
import MembershipExpired from '@/components/customer/MembershipExpired';
import RestaurantInactive from '@/components/customer/RestaurantInactive';
import RestaurantUpdating from '@/components/customer/RestaurantUpdating';
import type { Product } from '@/types/product';

/**
 * Normalize phone number to E.164 format for WhatsApp
 * Input: +90 532 123 4567, 0532 123 4567, (532) 123-4567, etc.
 * Output: 905321234567 (only digits, starting with country code)
 */
function normalizePhoneForWhatsApp(phone: string | undefined): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  let digits = phone.replace(/[^0-9]/g, '');
  
  // Handle Turkish numbers
  if (digits.startsWith('0')) {
    // Remove leading 0 and add Turkey code
    digits = '90' + digits.substring(1);
  } else if (digits.startsWith('90')) {
    // Already has country code
  } else if (digits.length === 10) {
    // Assume Turkish number without leading 0
    digits = '90' + digits;
  }
  
  return digits;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  products: Product[];
}

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  headerImage?: string;
  phone?: string;
  address?: string;
  googleMapsUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  textColor?: string;
  themeColor?: string;
  themeSettings?: string;
  workingHours?: string;
  openingHoursText?: string;
  plan?: {
    code: string;
    cartEnabled: boolean;
  };
}

export default function PublicMenu() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const tableNumber = searchParams.get('table');

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [membershipExpired, setMembershipExpired] = useState(false);
  const [membershipData, setMembershipData] = useState<any>(null);
  const [restaurantStatus, setRestaurantStatus] = useState<'ACTIVE' | 'INACTIVE' | 'UPDATING'>('ACTIVE');
  const [statusData, setStatusData] = useState<{ name: string; logo?: string | null } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showHoursPanel, setShowHoursPanel] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCart, setShowCart] = useState(false);

  // Memoized theme - restaurant değişmedikçe yeniden hesaplanmaz
  const theme = useMemo(() => 
    restaurant ? buildTheme(restaurant.themeSettings) : null
  , [restaurant?.themeSettings]);

  // Memoized card radius class
  const cardRadiusClass = useMemo(() => 
    theme ? getCardRadiusClass(theme.cardRadius) : ''
  , [theme?.cardRadius]);

  // Memoized working hours
  const todayHours = useMemo(() => 
    restaurant?.workingHours ? getTodayWorkingHours(restaurant.workingHours) : null
  , [restaurant?.workingHours]);

  const weeklyHours = useMemo(() => 
    restaurant?.workingHours ? getWeeklyWorkingHours(restaurant.workingHours) : []
  , [restaurant?.workingHours]);

  const isOpen = useMemo(() => 
    restaurant?.workingHours ? isRestaurantOpen(restaurant.workingHours) : null
  , [restaurant?.workingHours]);

  // Memoized filtered categories - selectedCategory veya categories değişmedikçe yeniden hesaplanmaz
  // NOT: "Kampanya" kategorisi QR menüde gizleniyor (veri silinmiyor, sadece render edilmiyor)
  const filteredCategories = useMemo(() => {
    const visibleCategories = categories.filter(cat => cat.name.toLowerCase() !== 'kampanya');
    return selectedCategory === 'all' 
      ? visibleCategories 
      : visibleCategories.filter(cat => cat.id === selectedCategory);
  }, [selectedCategory, categories]);

  // Memoized logo URL
  const logoUrl = useMemo(() => {
    if (!restaurant?.logo) return null;
    return restaurant.logo.startsWith('http') 
      ? restaurant.logo 
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${restaurant.logo}`;
  }, [restaurant?.logo]);

  // Category select handler - useCallback ile stabilize
  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  // Cart handlers
  const addToCart = useCallback((productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
    setShowCart(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId] -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  }, []);

  // Cart totals
  const cartItemCount = useMemo(() => 
    Object.values(cart).reduce((sum, qty) => sum + qty, 0)
  , [cart]);

  const cartTotal = useMemo(() => {
    let total = 0;
    categories.forEach(cat => {
      cat.products?.forEach(product => {
        if (cart[product.id]) {
          total += product.price * cart[product.id];
        }
      });
    });
    return total;
  }, [cart, categories]);

  // Product click handler - analytics tracking
  const handleProductClick = useCallback((productId: string, restaurantId: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(apiUrl + '/api/analytics/product-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, restaurantId }),
    }).catch(() => {});
  }, []);

  useEffect(() => {
    loadMenu();
  }, [slug, tableNumber]);

  // Auto close welcome popup after 3 seconds
  useEffect(() => {
    if (showWelcome && restaurant && buildTheme(restaurant.themeSettings).showWelcomePopup !== false) {
      const autoCloseTimer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
      return () => clearTimeout(autoCloseTimer);
    }
  }, [showWelcome, restaurant]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getPublicMenu(slug, tableNumber || undefined);
      
      // Handle inactive/updating status from API
      if (response.data?.status === 'INACTIVE') {
        setRestaurantStatus('INACTIVE');
        setStatusData(response.data.restaurant);
        return;
      }
      if (response.data?.status === 'UPDATING') {
        setRestaurantStatus('UPDATING');
        setStatusData(response.data.restaurant);
        return;
      }
      
      const restaurantData = response.data.restaurant;
      setRestaurant(restaurantData);
      setCategories(response.data.categories || []);
      setRestaurantStatus('ACTIVE');
      
      // Track menu view analytics
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/analytics/menu-view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            restaurantId: restaurantData.id,
            tableId: tableNumber || null,
            currentPath: window.location.pathname,
            referrer: document.referrer || null,
          }),
        });
      } catch {
        // Analytics hatası sessizce geçilir
      }
    } catch (error: any) {
      // Check if membership expired
      if (error?.response?.data?.error === 'MEMBERSHIP_EXPIRED') {
        setMembershipExpired(true);
        setMembershipData(error.response.data.data);
      } else if (process.env.NODE_ENV === 'development') {
        console.error('Menü yüklenemedi:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-10 py-8 text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-[5px] border-gray-200 border-t-orange-500 mx-auto mb-5"></div>
          <p className="text-gray-700 font-semibold text-lg">Menü Hazırlanıyor...</p>
          <p className="text-gray-400 text-sm mt-1">Lütfen bekleyin</p>
        </div>
      </div>
    );
  }

  // Show membership expired screen
  if (membershipExpired && membershipData) {
    return (
      <MembershipExpired
        restaurantName={membershipData.restaurantName}
        membershipEndDate={membershipData.membershipEndDate}
      />
    );
  }

  // Show inactive screen
  if (restaurantStatus === 'INACTIVE' && statusData) {
    return (
      <RestaurantInactive
        restaurantName={statusData.name}
        logo={statusData.logo}
      />
    );
  }

  // Show updating screen
  if (restaurantStatus === 'UPDATING' && statusData) {
    return (
      <RestaurantUpdating
        restaurantName={statusData.name}
        logo={statusData.logo}
      />
    );
  }

  if (!restaurant || !theme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Restoran Bulunamadı</h1>
          <p className="text-gray-600">Bu QR kod geçersiz veya restoran mevcut değil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: theme.backgroundColor }}>
      {/* Welcome Popup */}
      {showWelcome && theme.showWelcomePopup !== false && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
          {/* Outer glow frame */}
          <div 
            className="rounded-[28px] p-[3px] animate-scaleIn"
            style={{ 
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
              boxShadow: `0 0 30px ${theme.primaryColor}40, 0 0 60px ${theme.secondaryColor}30`
            }}
          >
            <div 
              className="rounded-3xl shadow-2xl max-w-md w-full p-6 relative"
              style={{ backgroundColor: theme.welcomeBackgroundColor || '#FFFFFF' }}
            >
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <RestaurantLogo 
                  name={restaurant.name}
                  logoUrl={logoUrl}
                  size="xl"
                  className="shadow-lg"
                />
              </div>
              <h3 className="text-xl font-bold mb-1" style={{ color: theme.welcomeTitleColor || '#1F2937' }}>
                {restaurant.name}
              </h3>
              <h2 
                className="text-lg font-semibold mb-2"
                style={{ color: theme.welcomeTitleColor || '#1F2937' }}
              >
                {(theme.welcomeTitle || 'Hoşgeldiniz!').slice(0, 30)}
              </h2>
              <p 
                className="text-base"
                style={{ color: theme.welcomeMessageColor || '#6B7280' }}
              >
                {(theme.welcomeMessage || 'Afiyet olsun.').slice(0, 50)}
              </p>
              {tableNumber && (
                <div className="mt-4 inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">
                  Masa {tableNumber}
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      )}

      {/* ===== HEADER - Centered Logo & Name ===== */}
      <div 
        className="relative overflow-hidden"
        style={
          restaurant.headerImage
            ? {
                backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${restaurant.headerImage})`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }
            : getHeaderBackgroundStyle(theme)
        }
      >
        {/* Overlay  */}
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 flex flex-col items-center justify-center py-5 px-4">
          {/* Logo */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white/40 shadow-xl mb-2">
            <RestaurantLogo 
              name={restaurant.name}
              logoUrl={logoUrl}
              size="lg"
              className="!w-full !h-full !rounded-full"
            />
          </div>

          {/* Restaurant Name */}
          <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg text-center leading-tight">
            {restaurant.name}
          </h1>

          {restaurant.description && (
            <p className="text-white/80 text-sm mt-1 text-center max-w-xs line-clamp-1">
              {restaurant.description}
            </p>
          )}

          {tableNumber && (
            <div 
              className="mt-2 px-3 py-1 rounded-full text-xs font-semibold shadow"
              style={{ backgroundColor: theme.primaryColor, color: '#fff' }}
            >
              Masa {tableNumber}
            </div>
          )}
        </div>
      </div>

      {/* ===== MESAİ SAATLERİ (Working Hours) ===== */}
      {(restaurant.workingHours || restaurant.openingHoursText) && (
        <div 
          className="border-b"
          style={{ 
            backgroundColor: theme.preset === 'dark' ? '#1E293B' : '#FFFFFF',
            borderColor: theme.preset === 'dark' ? '#334155' : '#F3F4F6'
          }}
        >
          <div className="max-w-4xl mx-auto px-4">
            {/* Today's hours - clickable to expand */}
            <button
              onClick={() => setShowHoursPanel(!showHoursPanel)}
              className="w-full flex items-center justify-between py-2 group"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.primaryColor + '18' }}
                >
                  <svg className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="text-left">
                  <span 
                    className="text-xs font-semibold"
                    style={{ color: theme.preset === 'dark' ? '#F1F5F9' : '#1F2937' }}
                  >
                    Mesai Saatleri
                  </span>
                  <div>
                    <span 
                      className="text-xs"
                      style={{ color: theme.preset === 'dark' ? '#94A3B8' : '#6B7280' }}
                    >
                      {restaurant.openingHoursText || todayHours || ''}
                    </span>
                  </div>
                </div>
              </div>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${showHoursPanel ? 'rotate-180' : ''}`}
                style={{ color: theme.preset === 'dark' ? '#94A3B8' : '#9CA3AF' }}
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {/* Expanded weekly hours */}
            {showHoursPanel && weeklyHours.length > 0 && (
              <div className="pb-3 pt-1">
                <div 
                  className="rounded-xl p-3 space-y-1.5"
                  style={{ 
                    backgroundColor: theme.preset === 'dark' ? '#0F172A' : '#F9FAFB',
                    border: `1px solid ${theme.preset === 'dark' ? '#1E293B' : '#F3F4F6'}`
                  }}
                >
                  {weeklyHours.map((wh, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-sm ${
                        wh.isToday ? 'font-semibold' : ''
                      }`}
                      style={{
                        backgroundColor: wh.isToday ? theme.primaryColor + '12' : 'transparent',
                        color: theme.preset === 'dark' ? '#E2E8F0' : '#374151'
                      }}
                    >
                      <span className="flex items-center gap-2">
                        {wh.isToday && (
                          <span 
                            className="w-1.5 h-1.5 rounded-full inline-block"
                            style={{ backgroundColor: theme.primaryColor }}
                          ></span>
                        )}
                        {wh.day}
                      </span>
                      <span className={wh.hours === 'Kapalı' ? 'text-red-500' : ''}>
                        {wh.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== CATEGORY FILTER TABS ===== */}
      <div 
        className="sticky top-0 z-40 shadow-sm border-b"
        style={{ 
          backgroundColor: theme.backgroundColor,
          borderColor: theme.preset === 'dark' ? '#1E293B' : '#F3F4F6'
        }}
      >
        <div className="max-w-4xl mx-auto px-2 py-2.5 flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => handleCategorySelect('all')}
            className="px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm flex-shrink-0"
            style={{
              background: selectedCategory === 'all' 
                ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` 
                : 'transparent',
              color: selectedCategory === 'all' ? '#ffffff' : theme.primaryColor,
              border: selectedCategory === 'all' ? 'none' : `2px solid ${theme.primaryColor}`,
            }}
          >
            Tümü
          </button>
          {categories
            .filter((category) => category.name.toLowerCase() !== 'kampanya')
            .map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className="px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm flex-shrink-0"
              style={{
                background: selectedCategory === category.id 
                  ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` 
                  : 'transparent',
                color: selectedCategory === category.id ? '#ffffff' : theme.primaryColor,
                border: selectedCategory === category.id ? 'none' : `2px solid ${theme.primaryColor}`,
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* ===== MENU CONTENT - Product Cards ===== */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Henüz menü eklenmemiş</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.id} className="mb-6">
              {/* Category Header */}
              <div className="mb-3 flex items-center gap-2">
                <div 
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: theme.primaryColor }}
                ></div>
                <h2 
                  className="text-lg font-bold"
                  style={{ color: restaurant.textColor || (theme.preset === 'dark' ? '#F1F5F9' : '#1F2937') }}
                >
                  {category.name}
                </h2>
                {category.description && (
                  <span 
                    className="text-xs ml-1"
                    style={{ color: theme.preset === 'dark' ? '#94A3B8' : '#9CA3AF' }}
                  >
                    — {category.description}
                  </span>
                )}
              </div>

              {/* Product Cards */}
              <div className="space-y-3">
                {category.products?.filter(p => p.isAvailable).map((product) => {
                  const imageUrl = product.imageUrl || product.image;
                  const imageSrc = imageUrl
                    ? imageUrl.startsWith('http')
                      ? imageUrl
                      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${imageUrl}`
                    : DEFAULT_PRODUCT_IMAGE;

                  return (
                    <div
                      key={product.id}
                      className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                      style={{ 
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #1E293B'
                      }}
                      onClick={() => handleProductClick(product.id, restaurant.id)}
                    >
                      <div className="flex gap-0">
                        {/* Product Image */}
                        {theme.showProductImages && (
                          <div 
                            className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 relative overflow-hidden m-2 rounded-xl"
                            style={{
                              border: `2px solid ${theme.primaryColor}30`,
                              boxShadow: `0 4px 12px ${theme.primaryColor}15, inset 0 0 20px ${theme.primaryColor}08`
                            }}
                          >
                            <img
                              src={imageSrc}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                              }}
                            />
                          </div>
                        )}

                        {/* Product Info */}
                        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h3 
                                className="text-base font-bold leading-tight line-clamp-1"
                                style={{ color: restaurant.textColor || theme.primaryColor }}
                              >
                                {product.name}
                              </h3>
                              <div className="flex gap-1 flex-shrink-0">
                                {product.isNew && (
                                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-semibold">YENİ</span>
                                )}
                                {product.isPopular && (
                                  <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-semibold">🔥</span>
                                )}
                              </div>
                            </div>
                            {product.description && (
                              <p 
                                className="text-xs mt-1 line-clamp-2 leading-relaxed"
                                style={{ color: '#6B7280' }}
                              >
                                {product.description}
                              </p>
                            )}
                            
                            {/* Ingredients / İçindekiler */}
                            {product.ingredients && (
                              <p 
                                className="text-[10px] mt-1.5 leading-relaxed"
                                style={{ color: '#6B7280' }}
                              >
                                <span className="font-semibold text-gray-600">İçindekiler:</span> {product.ingredients}
                              </p>
                            )}

                            {/* Diet Badges */}
                            {(product.isVegetarian || product.isVegan || product.isGlutenFree || product.isSpicy) && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {product.isVegetarian && (
                                  <span className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-medium">🥗 Vejetaryen</span>
                                )}
                                {product.isVegan && (
                                  <span className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-medium">🌱 Vegan</span>
                                )}
                                {product.isGlutenFree && (
                                  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium">🌾 Glütensiz</span>
                                )}
                                {product.isSpicy && (
                                  <span className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-medium">🌶️ Acı</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Price & Cart Controls */}
                          <div className="mt-2 flex items-center justify-between">
                            <span 
                              className="text-lg font-extrabold"
                              style={{ color: theme.secondaryColor }}
                            >
                              {product.price.toFixed(2)} ₺
                            </span>
                            
                            {/* Cart +/- Buttons - Only for Gold/Platin plans */}
                            {restaurant.plan?.cartEnabled && (
                              <div className="flex items-center gap-1">
                                {cart[product.id] ? (
                                  <>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); removeFromCart(product.id); }}
                                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold transition-all hover:scale-110 active:scale-95"
                                      style={{ backgroundColor: theme.secondaryColor }}
                                    >
                                      −
                                    </button>
                                    <span 
                                      className="w-8 text-center font-bold text-sm"
                                      style={{ color: theme.primaryColor }}
                                    >
                                      {cart[product.id]}
                                    </span>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}
                                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold transition-all hover:scale-110 active:scale-95"
                                      style={{ backgroundColor: theme.primaryColor }}
                                    >
                                      +
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold transition-all hover:scale-110 active:scale-95 shadow-md"
                                    style={{ 
                                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                                      boxShadow: `0 2px 8px ${theme.primaryColor}40`
                                    }}
                                  >
                                    +
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {!product.isAvailable && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-medium mt-1 inline-block">
                              Tükendi
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===== CART PANEL ===== */}
      {restaurant.plan?.cartEnabled && showCart && cartItemCount > 0 && (
        <div 
          className="fixed bottom-16 left-0 right-0 z-40 transition-all duration-300 animate-slideUp"
          style={{ 
            backgroundColor: '#0F172A',
            borderTop: `2px solid ${theme.primaryColor}`,
            boxShadow: `0 -8px 30px rgba(0,0,0,0.4), 0 -2px 20px ${theme.primaryColor}30`
          }}
        >
          <div className="max-w-4xl mx-auto px-4 py-4">
            {/* Cart Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                <span className="text-white font-semibold">Sepetim</span>
                <span 
                  className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: theme.secondaryColor }}
                >
                  {cartItemCount} ürün
                </span>
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>

            {/* Cart Items Preview */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.flatMap(cat => cat.products || []).filter(p => cart[p.id]).map(product => (
                <div 
                  key={product.id}
                  className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <span className="text-white text-sm font-medium truncate max-w-[100px]">{product.name}</span>
                  <span className="text-gray-400 text-xs">x{cart[product.id]}</span>
                </div>
              ))}
            </div>

            {/* Cart Total & Action */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <div>
                <span className="text-gray-400 text-sm">Toplam</span>
                <p 
                  className="text-xl font-extrabold"
                  style={{ color: theme.primaryColor }}
                >
                  {cartTotal.toFixed(2)} ₺
                </p>
              </div>
              <button
                className="px-6 py-2.5 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                  boxShadow: `0 4px 15px ${theme.primaryColor}40`
                }}
              >
                Sipariş Ver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button (when cart is closed but has items) */}
      {!showCart && cartItemCount > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-110 active:scale-95 animate-bounce"
          style={{ 
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
            boxShadow: `0 4px 20px ${theme.primaryColor}50`
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span 
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            {cartItemCount}
          </span>
        </button>
      )}

      {/* ===== WAITER CALL BUTTON (şimdilik gizli) ===== */}
      {false && (
        <WaiterCallButton 
          restaurantId={restaurant.id} 
          tableNumber={tableNumber || undefined}
        />
      )}

      {/* ===== BOTTOM BAR - Social & Contact ===== */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{ 
          backgroundColor: '#0F172A',
          borderTop: '1px solid #1E293B',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.3)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-2.5">
          <div className="flex items-center justify-center gap-6 sm:gap-8">
            {/* WhatsApp */}
            {restaurant.phone && (
              <a 
                href={`https://wa.me/${normalizePhoneForWhatsApp(restaurant.phone)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex items-center justify-center w-11 h-11 rounded-xl transition-all hover:scale-110 active:scale-95"
                style={{ 
                  backgroundColor: 'rgba(37, 211, 102, 0.15)',
                  boxShadow: '0 0 12px rgba(37, 211, 102, 0.25), inset 0 0 8px rgba(37, 211, 102, 0.1)',
                  border: '1px solid rgba(37, 211, 102, 0.3)'
                }}
              >
                <svg className="w-5 h-5" fill="#25D366" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            )}

            {/* Phone */}
            {restaurant.phone && (
              <a 
                href={`tel:${restaurant.phone}`}
                aria-label="Telefon"
                className="flex items-center justify-center w-11 h-11 rounded-xl transition-all hover:scale-110 active:scale-95"
                style={{ 
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  boxShadow: '0 0 12px rgba(59, 130, 246, 0.25), inset 0 0 8px rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </a>
            )}

            {/* Location */}
            {restaurant.googleMapsUrl && (
              <a 
                href={restaurant.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Konum"
                className="flex items-center justify-center w-11 h-11 rounded-xl transition-all hover:scale-110 active:scale-95"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  boxShadow: '0 0 12px rgba(239, 68, 68, 0.25), inset 0 0 8px rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </a>
            )}

            {/* Instagram */}
            {restaurant.instagramUrl && (
              <a 
                href={restaurant.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center justify-center w-11 h-11 rounded-xl transition-all hover:scale-110 active:scale-95"
                style={{ 
                  backgroundColor: 'rgba(225, 48, 108, 0.15)',
                  boxShadow: '0 0 12px rgba(225, 48, 108, 0.25), inset 0 0 8px rgba(225, 48, 108, 0.1)',
                  border: '1px solid rgba(225, 48, 108, 0.3)'
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            )}

            {/* Facebook */}
            {restaurant.facebookUrl && (
              <a 
                href={restaurant.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex items-center justify-center w-11 h-11 rounded-xl transition-all hover:scale-110 active:scale-95"
                style={{ 
                  backgroundColor: 'rgba(24, 119, 242, 0.15)',
                  boxShadow: '0 0 12px rgba(24, 119, 242, 0.25), inset 0 0 8px rgba(24, 119, 242, 0.1)',
                  border: '1px solid rgba(24, 119, 242, 0.3)'
                }}
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
