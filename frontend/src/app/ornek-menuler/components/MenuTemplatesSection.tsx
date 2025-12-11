'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const menuTemplates = [
  {
    id: 1,
    name: 'Modern Minimal',
    category: 'kafe',
    categoryLabel: 'Kafe',
    description: 'Sade ve şık tasarım, kahve dükkanları için ideal',
    gradient: 'from-amber-500 to-orange-500',
    icon: '☕',
    features: ['Karanlık Tema', 'Minimal İkonlar', 'Smooth Animasyonlar'],
  },
  {
    id: 2,
    name: 'Premium Elegance',
    category: 'restoran',
    categoryLabel: 'Restoran',
    description: 'Lüks restoranlar için sofistike tasarım',
    gradient: 'from-purple-500 to-pink-500',
    icon: '🍷',
    features: ['Gold Aksan', 'Serif Font', 'Galeri Görünümü'],
  },
  {
    id: 3,
    name: 'Fast & Bold',
    category: 'fastfood',
    categoryLabel: 'Fast Food',
    description: 'Enerjik ve dikkat çekici tasarım',
    gradient: 'from-red-500 to-orange-500',
    icon: '🍔',
    features: ['Parlak Renkler', 'Büyük Görseller', 'Hızlı Navigasyon'],
  },
  {
    id: 4,
    name: 'Tropical Vibes',
    category: 'kafe',
    categoryLabel: 'Kafe',
    description: 'Yaz konseptli kafeler için tropikal tema',
    gradient: 'from-green-500 to-teal-500',
    icon: '🥤',
    features: ['Canlı Renkler', 'Tropik İkonlar', 'Fresh Look'],
  },
  {
    id: 5,
    name: 'Classic Italian',
    category: 'restoran',
    categoryLabel: 'Restoran',
    description: 'Otantik İtalyan restoranları için klasik tasarım',
    gradient: 'from-red-600 to-green-600',
    icon: '🍝',
    features: ['Vintage Stil', 'El Yazısı Font', 'Rustik Görünüm'],
  },
  {
    id: 6,
    name: 'Neon Street',
    category: 'fastfood',
    categoryLabel: 'Fast Food',
    description: 'Sokak yemekleri için neon stil tasarım',
    gradient: 'from-cyan-500 to-blue-500',
    icon: '🌭',
    features: ['Neon Efektler', 'Cyberpunk Vibe', 'Gece Modu'],
  },
  {
    id: 7,
    name: 'Artisan Bakery',
    category: 'kafe',
    categoryLabel: 'Kafe',
    description: 'Butik fırınlar ve pastaneler için sıcak tasarım',
    gradient: 'from-yellow-500 to-amber-500',
    icon: '🥐',
    features: ['Sıcak Tonlar', 'Organik Şekiller', 'Cozy Atmosfer'],
  },
  {
    id: 8,
    name: 'Sushi Master',
    category: 'restoran',
    categoryLabel: 'Restoran',
    description: 'Japon restoranları için minimalist zen tasarım',
    gradient: 'from-slate-500 to-zinc-600',
    icon: '🍣',
    features: ['Zen Minimalizm', 'Japon Esintisi', 'Beyaz Alan'],
  },
  {
    id: 9,
    name: 'BBQ House',
    category: 'fastfood',
    categoryLabel: 'Fast Food',
    description: 'Mangal ve barbekü restoranları için güçlü tasarım',
    gradient: 'from-orange-600 to-red-700',
    icon: '🥩',
    features: ['Ateş Teması', 'Bold Typography', 'Smoky Efekt'],
  },
];

interface MenuTemplatesSectionProps {
  activeCategory: string | null;
  sectionRef: React.RefObject<HTMLDivElement>;
}

export default function MenuTemplatesSection({
  activeCategory,
  sectionRef,
}: MenuTemplatesSectionProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<number | null>(null);

  const filteredTemplates = activeCategory
    ? menuTemplates.filter((t) => t.category === activeCategory)
    : menuTemplates;

  return (
    <section ref={sectionRef} className="py-20 px-6 relative" id="menu-templates">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[200px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[200px]"></div>
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
          <div className="inline-block px-4 py-2 glass-effect rounded-full border border-green-500/20 mb-4">
            <span className="text-sm text-green-400 font-medium">Şablonlar</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Örnek Menü <span className="gradient-text">Şablonları</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {activeCategory
              ? `${
                  activeCategory === 'kafe'
                    ? 'Kafe'
                    : activeCategory === 'restoran'
                    ? 'Restoran'
                    : 'Fast Food'
                } kategorisindeki şablonlar`
              : 'Profesyonel tasarımcılar tarafından hazırlanmış menü şablonları'}
          </p>
        </motion.div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(template.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group"
            >
              <div
                className={`relative glass-effect rounded-3xl overflow-hidden border border-white/10 transition-all duration-500 ${
                  hoveredCard === template.id
                    ? 'border-white/20 shadow-2xl shadow-orange-500/10'
                    : ''
                }`}
              >
                {/* Preview Image Area */}
                <div className={`relative h-48 bg-gradient-to-br ${template.gradient} p-6`}>
                  {/* Pattern Overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern
                          id={`grid-${template.id}`}
                          width="20"
                          height="20"
                          patternUnits="userSpaceOnUse"
                        >
                          <circle cx="1" cy="1" r="1" fill="white" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#grid-${template.id})`} />
                    </svg>
                  </div>

                  {/* Icon */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={
                      hoveredCard === template.id
                        ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-7xl drop-shadow-lg">{template.icon}</span>
                  </motion.div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                      {template.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {template.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {template.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white/5 rounded-lg text-gray-400 text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium text-sm transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPreviewTemplate(template.id)}
                    >
                      Canlı Önizle
                    </motion.button>
                    <motion.button
                      className={`flex-1 py-3 bg-gradient-to-r ${template.gradient} rounded-xl text-white font-medium text-sm hover:shadow-lg transition-all`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Bu Şablonu Kullan
                    </motion.button>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-transparent to-transparent pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredCard === template.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {!activeCategory && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="px-8 py-4 glass-effect rounded-xl text-gray-300 font-medium hover:bg-white/10 transition-all border border-white/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Daha Fazla Şablon Görüntüle
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setPreviewTemplate(null)}
        >
          <motion.div
            className="relative bg-gradient-to-br from-[#0B0B0D] to-[#1a1a2e] rounded-3xl p-8 max-w-lg w-full border border-white/10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              ✕
            </button>
            <div className="text-center">
              <span className="text-6xl mb-4 inline-block">
                {menuTemplates.find((t) => t.id === previewTemplate)?.icon}
              </span>
              <h3 className="text-2xl font-bold text-white mb-2">
                {menuTemplates.find((t) => t.id === previewTemplate)?.name}
              </h3>
              <p className="text-gray-400 mb-6">
                Bu şablonun canlı önizlemesi yakında aktif olacak!
              </p>
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl text-white font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPreviewTemplate(null)}
              >
                Tamam
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
