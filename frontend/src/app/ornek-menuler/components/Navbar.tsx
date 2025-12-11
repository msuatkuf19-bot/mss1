'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

interface NavbarProps {
  onMobileMenuToggle?: (isOpen: boolean) => void;
}

export default function Navbar({ onMobileMenuToggle }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);
    onMobileMenuToggle?.(newState);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    onMobileMenuToggle?.(false);
  };

  const navLinks = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Özellikler', href: '/#ozellikler' },
    { name: 'Nasıl Çalışır?', href: '/#nasil-calisir' },
    { name: 'Fiyatlandırma', href: '/#fiyatlandirma' },
    { name: 'İletişim', href: '/#iletisim' },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 glass-effect border-b border-white/5">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4">
            <img
              src="/benmedya.png"
              alt="Menü Ben"
              className="h-16 md:h-20 w-auto brightness-0 invert"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold gradient-text">Menü Ben</h1>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-[10px] md:text-xs text-gray-400">Dijital QR Menü SaaS</p>
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-orange-400 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2 border border-orange-400/50 text-orange-400 rounded-lg font-medium hover:bg-orange-400/10 transition-all duration-300"
            >
              Giriş Yap
            </Link>
            <Link href="/demo">
              <motion.button
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Demo Talep Et
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-gray-300 hover:text-white p-2"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="lg:hidden mt-4 pb-4 space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="block text-gray-300 hover:text-orange-400 py-2 font-medium"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                className="pt-3 space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="block w-full px-5 py-2 border border-orange-400/50 text-orange-400 rounded-lg font-medium text-center"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/demo"
                  onClick={closeMobileMenu}
                  className="block w-full px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold text-center"
                >
                  Demo Talep Et
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
