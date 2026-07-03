'use client';

import RestaurantLogo from '@/components/RestaurantLogo';

interface RestaurantUpdatingProps {
  restaurantName: string;
  logo?: string | null;
}

export default function RestaurantUpdating({ restaurantName, logo }: RestaurantUpdatingProps) {
  const logoUrl = logo
    ? logo.startsWith('http')
      ? logo
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${logo}`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-slate-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/30 via-transparent to-transparent" />
      <div className="relative z-10 max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl bg-white/5 backdrop-blur-sm">
            <RestaurantLogo
              name={restaurantName}
              logoUrl={logoUrl}
              size="lg"
              className="!w-full !h-full !rounded-full"
            />
          </div>
        </div>

        {/* Restaurant Name */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 drop-shadow-lg">
          {restaurantName}
        </h1>

        {/* Message */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-white/90 text-lg sm:text-xl font-medium leading-relaxed">
            Size daha iyi hizmet verebilmek için menümüz güncelleniyor
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-white/30 text-sm">
          Powered by Menü Ben
        </p>
      </div>
    </div>
  );
}
