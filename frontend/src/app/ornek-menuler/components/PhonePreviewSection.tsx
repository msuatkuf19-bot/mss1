'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const desktopMenuItems = [
  { name: 'Akdeniz Salatası', price: '85₺', img: '🥗' },
  { name: 'Izgara Somon', price: '245₺', img: '🐟' },
  { name: 'Biftek', price: '320₺', img: '🥩' },
  { name: 'Makarna', price: '125₺', img: '🍝' },
  { name: 'Cheesecake', price: '75₺', img: '🍰' },
  { name: 'Espresso', price: '45₺', img: '☕' },
];

const mobileMenuItems = [
  { name: 'Mantarlı Risotto', category: 'Ana Yemek', price: '165₺' },
  { name: 'Caesar Salata', category: 'Salata', price: '95₺' },
  { name: 'Kuzu Pirzola', category: 'Ana Yemek', price: '285₺' },
  { name: 'Tiramisù', category: 'Tatlı', price: '85₺' },
  { name: 'Limonata', category: 'İçecek', price: '35₺' },
];

export default function PhonePreviewSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const phoneY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="py-20 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-2 glass-effect rounded-full border border-purple-500/20 mb-4">
            <span className="text-sm text-purple-400 font-medium">Önizleme</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Mobil ve Masaüstü <span className="gradient-text">Uyumlu Tasarım</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tüm cihazlarda mükemmel görünen responsive menü tasarımları
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Phone Mockup */}
          <motion.div
            className="flex justify-center lg:justify-end order-2 lg:order-1"
            style={{ y: phoneY }}
          >
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-[60px]"></div>

              {/* Phone Frame */}
              <motion.div
                className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-[#0B0B0D] rounded-[2.5rem] overflow-hidden w-[260px] h-[520px]">
                  {/* Status Bar */}
                  <div className="h-7 flex items-center justify-center">
                    <div className="w-24 h-5 bg-black rounded-full"></div>
                  </div>

                  {/* Content */}
                  <div className="px-4 py-3">
                    {/* Restaurant Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-xl">🍷</span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-sm">La Dolce Vita</h3>
                        <p className="text-gray-500 text-xs">İtalyan Mutfağı</p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-2">
                      {mobileMenuItems.map((item, i) => (
                        <motion.div
                          key={i}
                          className="bg-white/5 rounded-lg p-3 border border-white/5"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-white text-xs font-medium">{item.name}</h4>
                              <p className="text-gray-500 text-[10px]">{item.category}</p>
                            </div>
                            <span className="text-orange-400 font-bold text-xs">{item.price}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Bottom Nav */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 flex justify-around">
                        {['🏠', '📖', '🛒', '👤'].map((icon, i) => (
                          <motion.div
                            key={i}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              i === 1 ? 'bg-gradient-to-br from-orange-500 to-pink-500' : ''
                            }`}
                            whileHover={{ scale: 1.1 }}
                          >
                            <span className="text-lg">{icon}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Desktop Preview */}
          <motion.div
            className="order-1 lg:order-2"
            style={{ opacity: contentOpacity }}
          >
            <div className="relative">
              {/* Desktop Frame */}
              <motion.div
                className="glass-effect rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Browser Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="bg-white/5 rounded-lg px-4 py-1.5 text-gray-500 text-xs">
                      menu.restoraniniz.com
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-gradient-to-br from-[#0B0B0D] to-[#1a1a2e] rounded-xl p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                        <span className="text-lg">🍷</span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-sm">La Dolce Vita</h3>
                        <p className="text-gray-500 text-xs">Premium İtalyan Mutfağı</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {['Ana Yemek', 'Tatlılar', 'İçecekler'].map((cat, i) => (
                        <button
                          key={i}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            i === 0
                              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Menu Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {desktopMenuItems.map((item, i) => (
                      <motion.div
                        key={i}
                        className="bg-white/5 rounded-xl p-3 border border-white/5 hover:border-orange-500/30 transition-all"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center mb-2">
                          <span className="text-3xl">{item.img}</span>
                        </div>
                        <h4 className="text-white text-xs font-medium truncate">{item.name}</h4>
                        <p className="text-orange-400 font-bold text-xs">{item.price}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
