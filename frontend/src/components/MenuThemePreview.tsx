'use client';

import { CompleteTheme, getCardRadiusClass, getHeaderBackgroundStyle } from '@/lib/theme-utils';

interface MenuThemePreviewProps {
  theme: CompleteTheme;
  restaurantName?: string;
  restaurantLogo?: string;
}

export default function MenuThemePreview({ theme, restaurantName = 'Örnek Restoran', restaurantLogo }: MenuThemePreviewProps) {
  const cardRadiusClass = getCardRadiusClass(theme.cardRadius);
  const headerStyle = getHeaderBackgroundStyle(theme);

  // Örnek kategoriler ve ürünler
  const sampleCategories = ['Ana Yemekler', 'İçecekler', 'Tatlılar'];
  const sampleProducts = [
    {
      name: 'Izgara Köfte',
      description: 'Özel baharatlarla hazırlanmış izgara köfte',
      price: '185₺',
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=200&h=150&fit=crop'
    },
    {
      name: 'Mercimek Çorbası',
      description: 'Geleneksel Türk mutfağından',
      price: '45₺',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&h=150&fit=crop'
    },
  ];

  return (
    <div className="relative">
      {/* Phone Frame */}
      <div className="mx-auto" style={{ width: '320px' }}>
        {/* Phone mockup border */}
        <div 
          className="relative rounded-[2.5rem] border-[14px] border-gray-800 shadow-2xl overflow-hidden"
          style={{ height: '640px' }}
        >
          {/* Phone notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-gray-800 rounded-b-3xl z-10"></div>

          {/* Menu Content - Scrollable */}
          <div 
            className="h-full overflow-y-auto"
            style={{ 
              backgroundColor: theme.backgroundColor,
              scrollbarWidth: 'thin',
              scrollbarColor: `${theme.primaryColor}30 transparent`
            }}
          >
            {/* Header */}
            <div 
              className="relative h-48 flex flex-col items-center justify-center p-4"
              style={headerStyle}
            >
              {theme.showHeaderOverlay && (
                <div className="absolute inset-0 bg-black/30"></div>
              )}
              
              <div className="relative z-10 text-center">
                {restaurantLogo ? (
                  <img 
                    src={restaurantLogo} 
                    alt={restaurantName}
                    className="w-16 h-16 rounded-full mx-auto mb-2 object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full mx-auto mb-2 bg-white/20 backdrop-blur-sm border-4 border-white shadow-lg flex items-center justify-center text-3xl">
                    🍽️
                  </div>
                )}
                <h1 
                  className="text-xl font-bold drop-shadow-lg"
                  style={{ 
                    color: theme.headerBackgroundType === 'gradient' || theme.showHeaderOverlay ? '#ffffff' : theme.primaryColor 
                  }}
                >
                  {restaurantName}
                </h1>
              </div>
            </div>

            {/* Categories */}
            <div className="sticky top-0 z-20 px-4 py-3" style={{ backgroundColor: theme.backgroundColor }}>
              <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                {sampleCategories.map((cat, idx) => (
                  <button
                    key={idx}
                    className="px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition shadow-sm"
                    style={{
                      backgroundColor: idx === 0 ? theme.primaryColor : 'transparent',
                      color: idx === 0 ? '#ffffff' : theme.primaryColor,
                      border: `2px solid ${theme.primaryColor}`,
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products */}
            <div className="px-4 pb-4 space-y-3">
              {sampleProducts.map((product, idx) => (
                <div
                  key={idx}
                  className={`${cardRadiusClass} overflow-hidden shadow-md border transition hover:shadow-lg`}
                  style={{ 
                    backgroundColor: '#ffffff',
                    borderColor: `${theme.primaryColor}20`,
                  }}
                >
                  <div className="flex gap-3 p-3">
                    {theme.showProductImages && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-20 h-20 object-cover flex-shrink-0 ${cardRadiusClass}`}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="font-semibold text-sm mb-1"
                        style={{ color: theme.primaryColor }}
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div 
                        className="text-sm font-bold"
                        style={{ color: theme.secondaryColor }}
                      >
                        {product.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Preview Badge */}
            <div className="sticky bottom-4 left-0 right-0 flex justify-center pointer-events-none">
              <div className="bg-gray-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg">
                📱 Canlı Önizleme
              </div>
            </div>
          </div>
        </div>

        {/* Phone buttons */}
        <div className="absolute right-0 top-24 w-1 h-12 bg-gray-800 rounded-l"></div>
        <div className="absolute right-0 top-40 w-1 h-16 bg-gray-800 rounded-l"></div>
        <div className="absolute left-0 top-28 w-1 h-8 bg-gray-800 rounded-r"></div>
      </div>
    </div>
  );
}
