import { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/data/blog-posts';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuben.com';

export const metadata: Metadata = {
  title: 'Blog - QR Menü Rehberi ve Restoran İpuçları',
  description: 'QR menü, dijital menü ve restoran yönetimi hakkında bilgilendirici yazılar. Restoranınızı dijital çağa taşıyacak ipuçları.',
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: 'Blog - QR Menü Rehberi ve Restoran İpuçları',
    description: 'QR menü, dijital menü ve restoran yönetimi hakkında bilgilendirici yazılar.',
    url: `${siteUrl}/blog`,
    type: 'website',
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#0a0a0f]">
      {/* Header */}
      <nav className="fixed w-full top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4">
              <img src="/benmedya.png" alt="Menü Ben" className="h-12 w-auto brightness-0 invert" />
              <span className="text-xl font-bold text-white">Menü Ben</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-300 hover:text-orange-400 transition-colors">
                Ana Sayfa
              </Link>
              <Link 
                href="/demo"
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-medium"
              >
                Demo Talep Et
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              QR Menü <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Blog</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Dijital menü, QR kod teknolojisi ve restoran yönetimi hakkında güncel bilgiler
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs font-medium bg-orange-500/10 text-orange-400 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-400 mb-4 line-clamp-2">
                        {post.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{post.author}</span>
                        <span>•</span>
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                    </div>
                    {/* Arrow */}
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-orange-400 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center p-8 bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              Restoranınız için QR Menü Oluşturun
            </h2>
            <p className="text-gray-400 mb-6">
              5 dakikada profesyonel dijital menünüzü hazırlayın
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              Ücretsiz Demo Talep Et
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="container mx-auto px-6 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Menü Ben. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </main>
  );
}
