import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';
import CustomCursor from '@/components/CustomCursor';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuben.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Menü Ben | QR Menü Sistemi',
    template: '%s | Menü Ben',
  },
  description: 'Menü Ben ile restoranınız için hızlı, mobil uyumlu ve yönetilebilir QR Menü oluşturun. Ücretsiz demo, kolay panel, profesyonel tasarım.',
  keywords: ['QR menü', 'dijital menü', 'restoran menü', 'QR kod menü', 'Menü Ben', 'online menü', 'temassız menü'],
  authors: [{ name: 'Menü Ben' }],
  creator: 'Menü Ben',
  publisher: 'Menü Ben',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/benmedya.png', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/benmedya.png',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: siteUrl,
    siteName: 'Menü Ben',
    title: 'Menü Ben | QR Menü Sistemi',
    description: 'Menü Ben ile restoranınız için hızlı, mobil uyumlu ve yönetilebilir QR Menü oluşturun. Ücretsiz demo, kolay panel, profesyonel tasarım.',
    images: [
      {
        url: '/benmedya.png',
        width: 512,
        height: 512,
        alt: 'Menü Ben QR Menü Sistemi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Menü Ben | QR Menü Sistemi',
    description: 'Menü Ben ile restoranınız için hızlı, mobil uyumlu ve yönetilebilir QR Menü oluşturun.',
    images: ['/benmedya.png'],
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Google Search Console doğrulaması eklenebilir
    // google: 'your-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" data-theme="dark">
      <head>
        {/* Google tag (gtag.js) - Google Ads */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17852172573"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17852172573');
          `}
        </Script>

        {/* Google tag (gtag.js) - Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HCZBXKJ43L"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HCZBXKJ43L');
          `}
        </Script>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': `${siteUrl}/#organization`,
                  name: 'Menü Ben',
                  url: siteUrl,
                  logo: {
                    '@type': 'ImageObject',
                    url: `${siteUrl}/benmedya.png`,
                  },
                  sameAs: [],
                  description: 'Menü Ben - Restoranlar için profesyonel QR Menü sistemi',
                },
                {
                  '@type': 'WebSite',
                  '@id': `${siteUrl}/#website`,
                  url: siteUrl,
                  name: 'Menü Ben',
                  publisher: {
                    '@id': `${siteUrl}/#organization`,
                  },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: `${siteUrl}/blog?q={search_term_string}`,
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'SoftwareApplication',
                  name: 'Menü Ben QR Menü',
                  operatingSystem: 'Web',
                  applicationCategory: 'BusinessApplication',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'TRY',
                    description: 'Ücretsiz demo ile başlayın',
                  },
                  description: 'Restoranlar için dijital QR menü oluşturma ve yönetim sistemi',
                  provider: {
                    '@id': `${siteUrl}/#organization`,
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){
  try {
    var stored = localStorage.getItem('theme');
    var mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    var systemTheme = (mql && mql.matches) ? 'dark' : 'light';
    var theme = (stored === 'dark' || stored === 'light') ? stored : systemTheme;

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    if (!stored && mql) {
      var onChange = function(e){
        var next = e && e.matches ? 'dark' : 'light';
        document.documentElement.dataset.theme = next;
        document.documentElement.style.colorScheme = next;
      };
      if (typeof mql.addEventListener === 'function') mql.addEventListener('change', onChange);
      else if (typeof mql.addListener === 'function') mql.addListener(onChange);
    }
  } catch (e) {}
})();`}
        </Script>
        <CustomCursor />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
