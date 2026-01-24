'use client';

import QRCode from 'react-qr-code';

type QrBoxProps =
  | {
      slug: string;
      url?: never;
      size?: number;
    }
  | {
      slug?: never;
      url: string;
      size?: number;
    };

/**
 * Get the public menu base URL
 * Priority: NEXT_PUBLIC_PUBLIC_MENU_BASE_URL > NEXT_PUBLIC_APP_URL > window.location.origin
 */
function getPublicMenuBaseUrl(): string {
  // First try PUBLIC_MENU_BASE_URL (dedicated env for QR links)
  const publicMenuBase = process.env.NEXT_PUBLIC_PUBLIC_MENU_BASE_URL;
  if (publicMenuBase && publicMenuBase.trim()) {
    return publicMenuBase.trim().replace(/\/$/, '');
  }
  
  // Fallback to APP_URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl && appUrl.trim()) {
    return appUrl.trim().replace(/\/$/, '');
  }
  
  // Final fallback to BASE_URL or window.location.origin
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (baseUrl && baseUrl.trim()) {
    return baseUrl.trim().replace(/\/$/, '');
  }
  
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  return '';
}

export default function QrBox(props: QrBoxProps) {
  const size = props.size ?? 240;
  const base = getPublicMenuBaseUrl();
  let fullUrl = '';
  
  if ('url' in props && typeof props.url === 'string') {
    fullUrl = props.url;
  } else if ('slug' in props && typeof props.slug === 'string') {
    // Correct format: base + /menu/ + slug
    fullUrl = `${base}/menu/${props.slug}`;
  } else {
    fullUrl = base;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <QRCode 
        value={fullUrl} 
        size={size} 
        level="M"
        style={{ 
          maxWidth: '100%', 
          height: 'auto',
          display: 'block'
        }}
      />
    </div>
  );
}
