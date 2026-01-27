import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts, getBlogPost, getAllBlogSlugs } from '@/data/blog-posts';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://menuben.com';

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug);

  if (!post) {
    return {
      title: 'Yazı Bulunamadı',
    };
  }

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  // JSON-LD for Article
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Menü Ben',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/benmedya.png`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

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
                <Link href="/blog" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Blog
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
        <article className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-3xl">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm">
              <ol className="flex items-center gap-2 text-gray-500">
                <li>
                  <Link href="/" className="hover:text-orange-400 transition-colors">
                    Ana Sayfa
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/blog" className="hover:text-orange-400 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>/</li>
                <li className="text-gray-400 truncate max-w-[200px]">{post.title}</li>
              </ol>
            </nav>

            {/* Article Header */}
            <header className="mb-12">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium bg-orange-500/10 text-orange-400 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>
              <p className="text-xl text-gray-400 mb-6">{post.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="font-medium text-gray-400">{post.author}</span>
                <span>•</span>
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </header>

            {/* Article Content */}
            <div
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-ul:text-gray-300 prose-ol:text-gray-300
                prose-li:marker:text-orange-500"
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />

            {/* CTA */}
            <div className="mt-16 p-8 bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 rounded-2xl text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                QR Menünüzü Hemen Oluşturun
              </h2>
              <p className="text-gray-400 mb-6">
                Menü Ben ile profesyonel dijital menünüzü dakikalar içinde hazırlayın
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

            {/* Related Posts */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-white mb-8">İlgili Yazılar</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {blogPosts
                  .filter((p) => p.slug !== post.slug)
                  .slice(0, 2)
                  .map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="group p-6 bg-white/5 border border-white/10 rounded-xl hover:border-orange-500/30 transition-all"
                    >
                      <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors mb-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{relatedPost.description}</p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </article>

        {/* Footer */}
        <footer className="py-8 border-t border-white/5">
          <div className="container mx-auto px-6 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Menü Ben. Tüm hakları saklıdır.</p>
          </div>
        </footer>
      </main>
    </>
  );
}

// Simple markdown-like content formatter
function formatContent(content: string): string {
  return content
    .split('\n')
    .map((line) => {
      // Headers
      if (line.startsWith('### ')) {
        return `<h3>${line.slice(4)}</h3>`;
      }
      if (line.startsWith('## ')) {
        return `<h2>${line.slice(3)}</h2>`;
      }
      // List items
      if (line.startsWith('- ')) {
        return `<li>${line.slice(2)}</li>`;
      }
      if (line.match(/^\d+\. /)) {
        return `<li>${line.replace(/^\d+\. /, '')}</li>`;
      }
      // Links
      line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
      // Bold
      line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      // Paragraphs
      if (line.trim() && !line.startsWith('<')) {
        return `<p>${line}</p>`;
      }
      return line;
    })
    .join('\n');
}
