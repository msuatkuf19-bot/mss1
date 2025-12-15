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
export default function RestaurantLogo({ name, logoUrl, size = 'md', className = '' }: Props) {
  // Logo varsa göster
  if (logoUrl && logoUrl.trim()) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
        onError={(e) => {
          // Hata durumunda da ilk harf göster
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling?.classList.remove('hidden');
        }}
      />
    );
  }

  // Logo yoksa ilk harf avatarı
  const initial = name?.charAt(0).toUpperCase() || '?';
  
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

  const bgGradient = getColorFromName(name || 'A');

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${bgGradient} flex items-center justify-center text-white font-bold shadow-lg ${className}`}
      title={name}
    >
      {initial}
    </div>
  );
}
