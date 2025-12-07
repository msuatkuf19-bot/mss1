import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import CustomCursor from '@/components/CustomCursor';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Menü Ben - Dijital QR Menü Sistemi',
  description: 'Menü Ben - Restoran menü yönetimi ve QR kod erişim sistemi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <CustomCursor />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
