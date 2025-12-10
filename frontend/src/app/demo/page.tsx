'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Animated Phone Mockup Component
function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative"
      style={{ perspective: '1000px' }}
    >
      {/* Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-pink-500/30 to-purple-500/30 blur-[80px] animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/20 via-transparent to-pink-500/20 blur-[60px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Phone Frame */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl border border-white/10"
        style={{ transform: 'rotateY(-5deg) rotateX(5deg)' }}
      >
        {/* Screen */}
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e] rounded-[2.5rem] overflow-hidden w-[260px] h-[520px]">
          {/* Status Bar */}
          <div className="h-7 flex items-center justify-center bg-black/50">
            <div className="w-24 h-5 bg-black rounded-full" />
          </div>

          {/* Content */}
          <div className="px-4 py-4 space-y-4">
            {/* Logo & Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center space-y-2"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-white font-bold text-base">Demo Restoran</h3>
              <p className="text-gray-400 text-xs">Masa #5</p>
            </motion.div>

            {/* Categories */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Ana Yemekler', icon: '🍽️', color: 'from-orange-500 to-red-500' },
                { name: 'İçecekler', icon: '🥤', color: 'from-blue-500 to-cyan-500' },
                { name: 'Tatlılar', icon: '🍰', color: 'from-pink-500 to-purple-500' },
                { name: 'Kahvaltı', icon: '☕', color: 'from-yellow-500 to-orange-500' },
              ].map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className={`relative h-16 rounded-xl overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color}`} />
                  <div className="relative h-full flex flex-col items-center justify-center">
                    <span className="text-xl">{cat.icon}</span>
                    <p className="text-white text-[9px] font-bold mt-0.5">{cat.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Menu Items */}
            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Popüler</p>
              {[
                { name: 'Izgara Köfte', price: '₺180', icon: '🍖' },
                { name: 'Caesar Salata', price: '₺95', icon: '🥗' },
                { name: 'Karışık Pizza', price: '₺220', icon: '🍕' },
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + i * 0.1 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white/5"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-lg">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold text-white">{item.name}</p>
                    <p className="text-xs font-bold text-orange-400">{item.price}</p>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                    <span className="text-[10px] text-white">+</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Nav */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/60 backdrop-blur-sm flex items-center justify-around px-4">
            {['🏠', '📋', '🛒', '👤'].map((icon, i) => (
              <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center ${i === 0 ? 'bg-orange-500' : 'bg-white/10'}`}>
                <span className="text-sm">{icon}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-4 -right-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/50"
      >
        <span className="text-2xl">🎉</span>
      </motion.div>
      <motion.div
        animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -bottom-4 -left-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/50"
      >
        <span className="text-2xl">✨</span>
      </motion.div>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/3 -right-8 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/50"
      >
        <span className="text-lg">🍔</span>
      </motion.div>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-1/3 -left-8 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50"
      >
        <span className="text-lg">🍕</span>
      </motion.div>
    </motion.div>
  );
}

// Particles Component
function Particles() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Demo CTA Form Component
function DemoCTA() {
  const [formData, setFormData] = useState({ name: '', restaurant: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', restaurant: '', phone: '' });
    }, 3000);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <div className="relative backdrop-blur-xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 border-t border-white/20">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
            <div className="text-center lg:text-left">
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                Sana özel{' '}
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                  QR Menü demo paneli
                </span>{' '}
                oluşturalım
              </h3>
              <p className="text-gray-400 text-sm">
                1 dakikada formu doldur, demo panelin otomatik oluşsun.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ad Soyad"
                required
                className="w-full md:w-36 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-all text-sm"
              />
              <input
                type="text"
                value={formData.restaurant}
                onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
                placeholder="Restoran Adı"
                required
                className="w-full md:w-40 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-all text-sm"
              />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Telefon / WhatsApp"
                required
                className="w-full md:w-40 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-all text-sm"
              />

              <motion.button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative w-full md:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition-all overflow-hidden group
                  ${isSubmitted ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-black hover:shadow-xl hover:shadow-amber-500/40'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Oluşturuluyor...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Talebiniz Alındı!
                    </>
                  ) : (
                    <>
                      Demo Panelimi Oluştur
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </span>
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DemoPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#0D0D0F] overflow-hidden">
      <style jsx global>{`
        ::-webkit-scrollbar { display: none; }
        body { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px]" />
      </div>

      {mounted && <Particles />}

      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-xl bg-[#0D0D0F]/80 border-b border-white/5"
      >
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Ana Sayfa</span>
          </Link>

          <div className="flex items-center gap-3">
            <img src="/benmedya.png" alt="Menü Ben" className="h-10 w-auto brightness-0 invert" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Menü Ben</h1>
              <p className="text-xs text-gray-500">Demo Deneyimi</p>
            </div>
          </div>

          <a href="https://wa.me/905050806880" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 hover:bg-green-500/30 transition-all">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="hidden sm:inline text-sm font-medium">WhatsApp</span>
          </a>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen pt-24 pb-36 flex flex-col items-center justify-center px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full border border-orange-500/30 mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-orange-400 font-medium">Canlı Demo</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              QR Menü
            </span>{' '}
            Deneyimi
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            Telefonunuzda QR menünün nasıl görüneceğini deneyimleyin
          </p>
        </motion.div>

        {/* Phone Mockup */}
        <div className="relative flex items-center justify-center">
          <PhoneMockup />

          {/* Side Info Cards - Left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full mr-8 hidden xl:block space-y-3"
          >
            {[
              { icon: '🎨', label: 'Özel Tasarım', desc: 'Markanıza uygun' },
              { icon: '⚡', label: 'Anında Güncelleme', desc: 'Gerçek zamanlı' },
              { icon: '📱', label: 'Mobil Uyumlu', desc: 'Her cihazda çalışır' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.15 }}
                className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl mr-8"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Side Info Cards - Right */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full ml-8 hidden xl:block space-y-3"
          >
            {[
              { icon: '🔒', label: 'Güvenli Altyapı', desc: 'SSL korumalı' },
              { icon: '📊', label: 'Detaylı Analiz', desc: 'Görüntüleme takibi' },
              { icon: '🎯', label: 'QR Kod Yönetimi', desc: 'Kolay masa takibi' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.15 }}
                className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl ml-8"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <DemoCTA />

      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-purple-500/30 to-transparent" />
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-orange-500/30 to-transparent" />
    </main>
  );
}
