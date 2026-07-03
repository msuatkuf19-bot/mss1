'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

interface WaiterCall {
  id: string;
  tableNumber: string;
  callType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const CALL_TYPE_LABELS: Record<string, { label: string; icon: string; badgeBg: string; badgeText: string }> = {
  WAITER: { label: 'Garson Çağrısı', icon: '🛎️', badgeBg: 'bg-blue-900/40', badgeText: 'text-blue-300' },
  CHECK: { label: 'Hesap İstendi', icon: '💳', badgeBg: 'bg-emerald-900/40', badgeText: 'text-emerald-300' },
  CLEAN: { label: 'Masa Temizliği', icon: '🧹', badgeBg: 'bg-amber-900/40', badgeText: 'text-amber-300' },
};

export default function WaiterCallsPage() {
  const [calls, setCalls] = useState<WaiterCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('PENDING');
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [completing, setCompleting] = useState<string | null>(null);

  const fetchCalls = useCallback(async (rid: string) => {
    try {
      const status = filter === 'ALL' ? undefined : filter;
      const response = await apiClient.getWaiterCalls(rid, status);
      setCalls(response.data || []);
    } catch (error) {
      console.error('Çağrılar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    const init = async () => {
      try {
        const response = await apiClient.getMyRestaurant();
        const restaurant = response.data?.restaurant || response.data || response;
        if (restaurant?.id) {
          setRestaurantId(restaurant.id);
          fetchCalls(restaurant.id);
        }
      } catch {
        setLoading(false);
      }
    };
    init();
  }, [fetchCalls]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (!restaurantId) return;
    const interval = setInterval(() => fetchCalls(restaurantId), 5000);
    return () => clearInterval(interval);
  }, [restaurantId, fetchCalls]);

  const handleComplete = async (id: string) => {
    try {
      setCompleting(id);
      await apiClient.updateWaiterCallStatus(id, 'COMPLETED');
      setCalls(prev => prev.map(c => c.id === id ? { ...c, status: 'COMPLETED' } : c));
      toast.success('✅ Çağrı tamamlandı');
    } catch {
      toast.error('Hata oluştu');
    } finally {
      setCompleting(null);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const pendingCount = calls.filter(c => c.status === 'PENDING').length;
  const completedCount = calls.filter(c => c.status === 'COMPLETED').length;

  return (
    <ProtectedRoute allowedRoles={['RESTAURANT_ADMIN', 'SUPER_ADMIN']}>
      <DashboardLayout title="🔔 Garson Çağrıları">

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl p-5 border" style={{ background: 'linear-gradient(135deg, #1E1B2E, #2D1F3D)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(249,115,22,0.15)' }}>🔔</div>
              <div>
                <p className="text-2xl font-bold text-white">{pendingCount}</p>
                <p className="text-sm text-gray-400">Bekleyen</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl p-5 border" style={{ background: 'linear-gradient(135deg, #1E1B2E, #1F2D2A)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(16,185,129,0.15)' }}>✅</div>
              <div>
                <p className="text-2xl font-bold text-white">{completedCount}</p>
                <p className="text-sm text-gray-400">Tamamlanan</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl p-5 border" style={{ background: 'linear-gradient(135deg, #1E1B2E, #1B2435)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(59,130,246,0.15)' }}>📊</div>
              <div>
                <p className="text-2xl font-bold text-white">{calls.length}</p>
                <p className="text-sm text-gray-400">Toplam</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters + Live Indicator */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex gap-2">
            {(['PENDING', 'COMPLETED', 'ALL'] as const).map(f => (
              <button
                key={f}
                onClick={() => { setFilter(f); setLoading(true); if (restaurantId) fetchCalls(restaurantId); }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === f
                    ? 'text-white shadow-lg'
                    : 'text-gray-400 hover:text-white border border-white/10 hover:border-white/20'
                }`}
                style={filter === f ? { background: 'linear-gradient(135deg, #F97316, #EC4899)' } : {}}
              >
                {f === 'PENDING' && '⏳ Bekleyenler'}
                {f === 'COMPLETED' && '✅ Tamamlananlar'}
                {f === 'ALL' && '📋 Tümü'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-xs text-gray-400">Canlı • 5sn</span>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent" />
          </div>
        ) : calls.length === 0 ? (
          <div className="rounded-2xl p-12 text-center border" style={{ background: '#1E1B2E', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="text-5xl mb-4">🔕</div>
            <h3 className="text-lg font-semibold text-white mb-2">Çağrı bulunmuyor</h3>
            <p className="text-sm text-gray-500">
              {filter === 'PENDING' ? 'Şu anda bekleyen çağrı yok' : 'Henüz hiç çağrı yapılmamış'}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border" style={{ background: '#1E1B2E', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Masa</th>
                    <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Talep</th>
                    <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Saat</th>
                    <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                    <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {calls.map((call) => {
                    const typeInfo = CALL_TYPE_LABELS[call.callType] || CALL_TYPE_LABELS.WAITER;
                    const isPending = call.status === 'PENDING';

                    return (
                      <tr
                        key={call.id}
                        className="transition-colors hover:bg-white/[0.02]"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      >
                        {/* Masa */}
                        <td className="px-5 py-4">
                          <div className="w-11 h-11 rounded-lg flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #F97316, #EC4899)' }}>
                            <span className="text-[9px] font-medium text-white/70 leading-none">MASA</span>
                            <span className="text-base font-bold text-white leading-none">{call.tableNumber}</span>
                          </div>
                        </td>

                        {/* Talep */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${typeInfo.badgeBg} ${typeInfo.badgeText}`}>
                            {typeInfo.icon} {typeInfo.label}
                          </span>
                        </td>

                        {/* Saat */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-300 font-mono">{formatTime(call.createdAt)}</span>
                        </td>

                        {/* Durum */}
                        <td className="px-5 py-4">
                          {isPending ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                              Bekliyor
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                              Tamamlandı
                            </span>
                          )}
                        </td>

                        {/* İşlem */}
                        <td className="px-5 py-4 text-right">
                          {isPending ? (
                            <button
                              onClick={() => handleComplete(call.id)}
                              disabled={completing === call.id}
                              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
                              style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                            >
                              {completing === call.id ? (
                                <span className="flex items-center gap-2">
                                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                  İşleniyor
                                </span>
                              ) : (
                                '✓ Tamamla'
                              )}
                            </button>
                          ) : (
                            <span className="text-xs text-gray-600">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
