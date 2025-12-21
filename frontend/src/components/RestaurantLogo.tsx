'use client';

interface Props {
  name: string;
  logoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-12 h-12 text-lg',
  md: 'w-16 h-16 text-2xl',
  lg: 'w-24 h-24 text-4xl',
  xl: 'w-32 h-32 text-5xl',
};

/**
 * RestaurantLogo Component
 * Logo yoksa restoran adının ilk harfini avatar olarak gösterir
 */
// İsimden renk üret (stabil - her zaman aynı isim için aynı renk)
const getColorFromName = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Premium renkler (pastel tonlar)
  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600', 
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-teal-500 to-teal-600',
    'from-orange-500 to-orange-600',
    'from-green-500 to-green-600',
    'from-red-500 to-red-600',
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

export default function RestaurantLogo({ name, logoUrl, size = 'md', className = '' }: Props) {
  console.log('RestaurantLogo render:', { 
    name, 
    logoUrl, 
    hasLogo: !!logoUrl, 
    logoTrimmed: logoUrl?.trim(),
    logoLength: logoUrl?.length 
  });

  // Logo varsa ve geçerli URL ise göster
  if (logoUrl && logoUrl.trim() && logoUrl !== 'null' && logoUrl !== 'undefined') {
    const cleanLogoUrl = logoUrl.trim();
    console.log('RestaurantLogo - Using logo URL:', cleanLogoUrl);
    
    return (
      <div className="relative">
        <img
          src={cleanLogoUrl}
          alt={`${name} Logo`}
          className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
          onError={(e) => {
            console.error('❌ Logo load FAILED:', {
              url: cleanLogoUrl,
              name,
              eventType: e.type,
              currentSrc: e.currentTarget.currentSrc
            });
            
            // Hata durumunda avatar'a düş
            const target = e.currentTarget;
            const parent = target.parentElement;
            if (parent) {
              const initial = (name?.charAt(0).toUpperCase() || '?');
              const gradient = getColorFromName(name || 'A');
              parent.innerHTML = `
                <div class="${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold shadow-lg ${className}" title="${name} - Logo Yüklenemedi">
                  ${initial}
                </div>
              `;
            }
          }}
          onLoad={() => {
            console.log('✅ Logo loaded SUCCESSFULLY:', {
              url: cleanLogoUrl,
              name
            });
          }}
        />
      </div>
    );
  }

  // Logo yoksa veya geçersizse ilk harf avatarı
  console.log('RestaurantLogo - Using avatar for:', name);
  const initial = name?.charAt(0).toUpperCase() || '?';
  const bgGradient = getColorFromName(name || 'A');

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${bgGradient} flex items-center justify-center text-white font-bold shadow-lg ${className}`}
      title={`${name} - Logo Yok`}
    >
      {initial}
    </div>
  );
}
