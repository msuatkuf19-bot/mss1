'use client';

import { useRef, useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CategoryCardsSection from './components/CategoryCardsSection';
import PhonePreviewSection from './components/PhonePreviewSection';
import MenuTemplatesSection from './components/MenuTemplatesSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function OrnekMenulerPage() {
  const templatesRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Scroll to templates section
    if (templatesRef.current) {
      templatesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0B0D] overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Category Cards Section */}
      <CategoryCardsSection onCategoryClick={handleCategoryClick} />

      {/* Phone Preview Section */}
      <PhonePreviewSection />

      {/* Menu Templates Section */}
      <MenuTemplatesSection
        activeCategory={activeCategory}
        sectionRef={templatesRef}
      />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
