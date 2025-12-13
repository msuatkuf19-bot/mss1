'use client';

import { motion } from 'framer-motion';

const categories = [
  {
    id: 'kafe',
    title: 'Kafe Menüleri',
    description: 'Kahve, tatlı ve hafif atıştırmalıklar için modern tasarımlar',
    icon: '☕',
    gradient: 'from-amber-500 to-orange-500',
    shadowColor: 'shadow-amber-500/30',
    image: '/images/cafe-menu.jpg',
  },
  {
    id: 'restoran',
    title: 'Restoran Menüleri',
    description: 'Tam kapsamlı yemek menüleri için şık ve profesyonel şablonlar',
    icon: '🍽️',
    gradient: 'from-purple-500 to-pink-500',
    shadowColor: 'shadow-purple-500/30',
    image: '/images/restaurant-menu.jpg',
  },
  {
    id: 'fastfood',
    title: 'Fast Food Menüleri',
    description: 'Hızlı servis restoranları için dinamik ve çekici tasarımlar',
    icon: '🍔',
    gradient: 'from-red-500 to-orange-500',
    shadowColor: 'shadow-red-500/30',
    image: '/images/fastfood-menu.jpg',
  },
];

interface CategoryCardsSectionProps {
  onCategoryClick: (categoryId: string) => void;
}

export default function CategoryCardsSection({ onCategoryClick }: CategoryCardsSectionProps) {
  return (
    <section className="py-20 px-6 relative overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-2 glass-effect rounded-full border border-orange-500/20 mb-4">
            <span className="text-sm text-orange-400 font-medium">Kategoriler</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            İşletmenize Uygun <span className="gradient-text">Şablonu Seçin</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Her işletme türü için özel tasarlanmış menü şablonlarımızı keşfedin
          </p>
        </motion.div>

        {/* Category Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ scale: 1.03, y: -10 }}
              onClick={() => onCategoryClick(category.id)}
              className="cursor-pointer group"
            >
              <div
                className={`relative glass-effect rounded-3xl p-8 border border-white/10 overflow-hidden transition-all duration-500 hover:border-white/20 ${category.shadowColor} hover:shadow-2xl`}
              >
                {/* Background Gradient on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>

                {/* Icon */}
                <motion.div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-4xl">{category.icon}</span>
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-pink-400 transition-all duration-300">
                  {category.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {category.description}
                </p>

                {/* Arrow Icon */}
                <div className="flex items-center text-gray-400 group-hover:text-orange-400 transition-colors">
                  <span className="text-sm font-medium">Şablonları Gör</span>
                  <motion.svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </motion.svg>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
