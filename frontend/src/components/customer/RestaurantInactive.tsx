'use client';

import RestaurantLogo from '@/components/RestaurantLogo';

interface RestaurantInactiveProps {
  restaurantName: string;
  logo?: string | null;
}

export default function RestaurantInactive({ restaurantName, logo }: RestaurantInactiveProps) {
  const logoUrl = logo
    ? logo.startsWith('http')
      ? logo
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${logo}`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-transparent to-transparent" />
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <p className="text-white/90 text-lg sm:text-xl font-medium leading-relaxed">
            Bu restoran şu anda hizmet vermemektedir
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
