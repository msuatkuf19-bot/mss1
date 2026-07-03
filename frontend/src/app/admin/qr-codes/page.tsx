'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api-client';
import {
  QrCode,
  Search,
  Download,
  Copy,
  ExternalLink,
  Store,
  RefreshCw,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface RestaurantSummary {
  id: string;
  name: string;
  slug: string;
  memberNo?: string;
  plan?: { code: 'STARTER' | 'GOLD' | 'PLATIN'; name: string } | null;
  _count: { categories: number; qrCodes: number };
}

interface QRCodeItem {
  id: string;
  code: string;
  tableNumber?: string | null;
  imageData?: string | null;
  imageUrl?: string;
  url?: string;
  scanCount: number;
  isActive: boolean;
  type?: 'TABLE' | 'RESTAURANT';
  lastScannedAt?: string | null;
  createdAt: string;
}

const planBadge = (code?: 'STARTER' | 'GOLD' | 'PLATIN' | null) => {
  if (code === 'GOLD')    return { label: 'Gold',      cls: 'bg-amber-50 text-amber-700 ring-amber-200' };
  if (code === 'PLATIN')  return { label: 'Platin',    cls: 'bg-violet-50 text-violet-700 ring-violet-200' };
  if (code === 'STARTER') return { label: 'Başlangıç', cls: 'bg-sky-50 text-sky-700 ring-sky-200' };
  return                         { label: 'Paket Yok', cls: 'bg-slate-50 text-slate-500 ring-slate-200' };
};

export default function AdminQRCodesPage() {
  const [restaurants, setRestaurants] = useState<RestaurantSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<'ALL' | 'STARTER' | 'GOLD' | 'PLATIN'>('ALL');
  const [qrCache, setQrCache] = useState<Record<string, QRCodeItem[]>>({});
  const [loadingQR, setLoadingQR] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getRestaurants();
      setRestaurants(res.data || []);
    } catch (e) {
      console.error('Restoranlar yüklenemedi', e);
    } finally {
      setLoading(false);
    }
  };

  const loadQRCodes = async (restaurantId: string, force = false) => {
    if (!force && qrCache[restaurantId]) return;
    try {
      setLoadingQR(prev => ({ ...prev, [restaurantId]: true }));
      const res = await apiClient.getQRCodes(restaurantId);
      setQrCache(prev => ({ ...prev, [restaurantId]: res.data || [] }));
    } catch (e) {
      console.error('QR kodları yüklenemedi', e);
      setQrCache(prev => ({ ...prev, [restaurantId]: [] }));
    } finally {
      setLoadingQR(prev => ({ ...prev, [restaurantId]: false }));
    }
  };

  const toggleExpand = (id: string) => {
    const isOpen = !!expanded[id];
    setExpanded(prev => ({ ...prev, [id]: !isOpen }));
    if (!isOpen) loadQRCodes(id);
  };

  const filtered = useMemo(() => {
    let list = restaurants;
    if (planFilter !== 'ALL') list = list.filter(r => r.plan?.code === planFilter);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        (r.memberNo || '').toLowerCase().includes(q),
      );
    }
    return list;
  }, [restaurants, planFilter, search]);

  const handleDownload = async (qr: QRCodeItem, restaurantSlug: string) => {
    try {
      // Prefer base64 from DB; fall back to backend download endpoint
      if (qr.imageData) {
        const link = document.createElement('a');
        link.href = qr.imageData.startsWith('data:') ? qr.imageData : `data:image/png;base64,${qr.imageData}`;
        link.download = `qr-${restaurantSlug}${qr.tableNumber ? `-masa-${qr.tableNumber}` : ''}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      const blob = await apiClient.downloadQRCode(qr.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-${restaurantSlug}${qr.tableNumber ? `-masa-${qr.tableNumber}` : ''}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e?.response?.data?.message || 'QR indirilemedi');
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => alert('Link kopyalandı!')).catch(() => {});
  };

  const totalQRCount = restaurants.reduce((s, r) => s + (r._count?.qrCodes || 0), 0);

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <DashboardLayout>
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 ring-1 ring-inset ring-violet-300/70 shadow-sm">
                <QrCode className="h-6 w-6" strokeWidth={1.9} />
              </span>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                  QR Kodlar
                </h1>
                <p className="mt-1 text-[13px] sm:text-[15px] text-slate-600">
                  Tüm restoranların QR kodlarını görüntüleyin ve indirin
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white border border-slate-200 px-4 py-2.5 shadow-sm">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Toplam QR</div>
                <div className="text-2xl font-bold text-slate-900">{totalQRCount}</div>
              </div>
              <button
                onClick={loadRestaurants}
                className="h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 inline-flex items-center gap-2 text-sm font-semibold"
              >
                <RefreshCw className="h-4 w-4" /> Yenile
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Restoran ara (ad, slug veya üye no)..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {([
              { key: 'ALL',     label: 'Tümü',      activeCls: 'bg-slate-800 text-white border-slate-800' },
              { key: 'STARTER', label: 'Başlangıç', activeCls: 'bg-sky-600 text-white border-sky-600' },
              { key: 'GOLD',    label: 'Gold',      activeCls: 'bg-amber-500 text-white border-amber-500' },
              { key: 'PLATIN',  label: 'Platin',    activeCls: 'bg-violet-600 text-white border-violet-600' },
            ] as const).map(opt => {
              const active = planFilter === opt.key;
              const cls = active ? opt.activeCls : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50';
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setPlanFilter(opt.key as any)}
                  className={`h-11 px-4 rounded-xl border text-sm font-semibold transition-all ${cls}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/70 p-12 text-center">
            <QrCode className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="text-slate-600 text-base">Restoran bulunamadı</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => {
              const pb = planBadge(r.plan?.code);
              const isOpen = !!expanded[r.id];
              const qrs = qrCache[r.id];
              return (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden"
                >
                  {/* Restaurant Header */}
                  <button
                    onClick={() => toggleExpand(r.id)}
                    className="w-full px-5 py-4 flex items-center gap-4 hover:bg-slate-50/60 transition-colors text-left"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Store className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 truncate">{r.name}</h3>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ring-inset ${pb.cls}`}>
                          {pb.label}
                        </span>
                        {r.memberNo && (
                          <span className="text-[11px] text-blue-600 font-mono">#{r.memberNo}</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">/{r.slug}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200">
                        {r._count?.qrCodes ?? 0} QR
                      </span>
                    </div>
                    <span className="text-slate-400">
                      {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </span>
                  </button>

                  {/* Expanded QR list */}
                  {isOpen && (
                    <div className="border-t border-slate-200/70 bg-slate-50/40 p-5">
                      {loadingQR[r.id] ? (
                        <div className="flex items-center justify-center py-10">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                        </div>
                      ) : !qrs || qrs.length === 0 ? (
                        <div className="text-center py-10">
                          <QrCode className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                          <p className="text-sm text-slate-500">Bu restorana ait QR kodu bulunmuyor</p>
                          <Link
                            href={`/admin/restaurants`}
                            className="mt-3 inline-flex text-xs font-semibold text-blue-600 hover:text-blue-700"
                          >
                            Restoran sayfasına git →
                          </Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {qrs.map((qr) => (
                            <div
                              key={qr.id}
                              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="min-w-0">
                                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    {qr.tableNumber ? `Masa ${qr.tableNumber}` : 'Tek QR'}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-mono truncate">{qr.code}</div>
                                </div>
                                <span className="text-[11px] inline-flex items-center rounded-full px-2 py-0.5 font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                  {qr.scanCount} okutma
                                </span>
                              </div>

                              {/* QR image */}
                              <div className="rounded-lg border border-slate-200 bg-white p-3 flex items-center justify-center mb-3">
                                {qr.imageData ? (
                                  <img
                                    src={qr.imageData.startsWith('data:') ? qr.imageData : `data:image/png;base64,${qr.imageData}`}
                                    alt={`QR ${qr.code}`}
                                    className="w-40 h-40 object-contain"
                                  />
                                ) : qr.imageUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={qr.imageUrl}
                                    alt={`QR ${qr.code}`}
                                    className="w-40 h-40 object-contain"
                                  />
                                ) : (
                                  <div className="w-40 h-40 flex items-center justify-center text-slate-300">
                                    <QrCode className="h-12 w-12" />
                                  </div>
                                )}
                              </div>

                              {/* Menu URL */}
                              {qr.url && (
                                <div className="flex items-center gap-1 mb-3">
                                  <code className="flex-1 px-2 py-1.5 bg-slate-50 rounded text-[11px] text-slate-700 font-mono truncate">
                                    {qr.url}
                                  </code>
                                  <button
                                    onClick={() => copy(qr.url!)}
                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Linki kopyala"
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                  </button>
                                  <a
                                    href={qr.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                    title="Yeni sekmede aç"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                </div>
                              )}

                              {/* Download */}
                              <button
                                onClick={() => handleDownload(qr, r.slug)}
                                className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
                              >
                                <Download className="h-4 w-4" /> QR İndir
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
