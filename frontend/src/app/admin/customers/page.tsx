'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  Users,
  Search,
  Eye,
  EyeOff,
  Copy,
  Mail,
  Phone,
  Store,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  X,
  Check,
  Crown,
  Sparkles,
  Star,
  RefreshCw,
} from 'lucide-react';

interface CustomerOwner {
  id: string;
  name: string;
  email: string;
  plainPassword?: string | null;
}

interface CustomerPlan {
  code: 'STARTER' | 'GOLD' | 'PLATIN';
  name: string;
}

interface Customer {
  id: string;
  name: string;
  slug: string;
  memberNo?: string;
  phone?: string | null;
  email?: string | null;
  city?: string | null;
  district?: string | null;
  isActive: boolean;
  membershipStatus?: string;
  membershipStartDate?: string | null;
  membershipEndDate?: string | null;
  createdAt: string;
  owner?: CustomerOwner | null;
  plan?: CustomerPlan | null;
}

const PLAN_BADGES: Record<string, { label: string; cls: string; icon: any }> = {
  STARTER: { label: 'Başlangıç', cls: 'bg-sky-50 text-sky-700 border-sky-200', icon: Star },
  GOLD: { label: 'Gold', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: Crown },
  PLATIN: { label: 'Platin', cls: 'bg-violet-50 text-violet-700 border-violet-200', icon: Sparkles },
};

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<'ALL' | 'STARTER' | 'GOLD' | 'PLATIN'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  // Reset password modal
  const [resetTarget, setResetTarget] = useState<Customer | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getRestaurants();
      const list: Customer[] = result?.data || result || [];
      setCustomers(list);
    } catch (e) {
      console.error('[customers] load error', e);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const copyToClipboard = (text: string, label = 'Kopyalandı') => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(
      () => showToast(`${label} ✓`),
      () => showToast('Kopyalanamadı'),
    );
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter((c) => {
      if (planFilter !== 'ALL' && c.plan?.code !== planFilter) return false;
      if (statusFilter === 'ACTIVE' && !c.isActive) return false;
      if (statusFilter === 'INACTIVE' && c.isActive) return false;
      if (!q) return true;
      return (
        c.name?.toLowerCase().includes(q) ||
        c.slug?.toLowerCase().includes(q) ||
        c.memberNo?.toLowerCase().includes(q) ||
        c.owner?.name?.toLowerCase().includes(q) ||
        c.owner?.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q)
      );
    });
  }, [customers, search, planFilter, statusFilter]);

  const counts = useMemo(() => {
    const c = { ALL: customers.length, STARTER: 0, GOLD: 0, PLATIN: 0 };
    customers.forEach((r) => {
      const code = r.plan?.code;
      if (code && code in c) (c as any)[code]++;
    });
    return c;
  }, [customers]);

  const openResetModal = (c: Customer) => {
    setResetTarget(c);
    setNewPassword('');
    setResetError(null);
  };

  const submitReset = async () => {
    if (!resetTarget?.owner?.id) return;
    if (newPassword.length < 6) {
      setResetError('Şifre en az 6 karakter olmalıdır');
      return;
    }
    try {
      setResetting(true);
      await apiClient.resetUserPassword(resetTarget.owner.id, newPassword);
      showToast('Şifre güncellendi ✓');
      // Update local state
      setCustomers((prev) =>
        prev.map((r) =>
          r.id === resetTarget.id && r.owner
            ? { ...r, owner: { ...r.owner, plainPassword: newPassword } }
            : r,
        ),
      );
      setResetTarget(null);
    } catch (e: any) {
      setResetError(e?.response?.data?.message || 'Şifre güncellenemedi');
    } finally {
      setResetting(false);
    }
  };

  const formatDate = (d?: string | null) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return '—';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <DashboardLayout title="Müşteriler">
        <div className="space-y-6">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur p-3 rounded-xl">
                  <Users className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Müşteri Yönetimi</h1>
                  <p className="text-white/80 text-sm">
                    Tüm restoran müşterilerinin bilgilerini görüntüleyin, şifrelerini yönetin
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-lg">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm font-medium">Süper Admin Paneli</span>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { key: 'ALL', label: 'Toplam', count: counts.ALL, color: 'from-slate-500 to-slate-700' },
              { key: 'STARTER', label: 'Başlangıç', count: counts.STARTER, color: 'from-sky-500 to-sky-700' },
              { key: 'PLATIN', label: 'Platin', count: counts.PLATIN, color: 'from-violet-500 to-violet-700' },
              { key: 'GOLD', label: 'Gold', count: counts.GOLD, color: 'from-amber-500 to-amber-700' },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setPlanFilter(s.key as any)}
                className={`relative overflow-hidden text-left rounded-xl p-4 border transition shadow-sm hover:shadow-md ${
                  planFilter === s.key ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 bg-white'
                }`}
              >
                <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${s.color} opacity-10`} />
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.label}</div>
                <div className="text-3xl font-bold text-gray-900 mt-1">{s.count}</div>
              </button>
            ))}
          </div>

          {/* FILTERS */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="İsim, e-posta, üye no, telefon ile ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="flex gap-2">
                {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition border ${
                      statusFilter === s
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {s === 'ALL' ? 'Tümü' : s === 'ACTIVE' ? 'Aktif' : 'Pasif'}
                  </button>
                ))}
              </div>
              <button
                onClick={loadCustomers}
                className="px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" /> Yenile
              </button>
            </div>
          </div>

          {/* LIST */}
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-3 text-blue-500" />
              Müşteriler yükleniyor...
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Filtrelere uyan müşteri bulunamadı</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((c) => {
                const plan = c.plan?.code ? PLAN_BADGES[c.plan.code] : null;
                const PlanIcon = plan?.icon || Star;
                const password = c.owner?.plainPassword || '';
                const isRevealed = !!revealed[c.id];

                return (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden"
                  >
                    <div className="grid lg:grid-cols-[1.4fr_1fr_1fr] gap-0">
                      {/* Sol — İşletme & Sahip */}
                      <div className="p-5 border-b lg:border-b-0 lg:border-r border-gray-100">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                              {plan && (
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${plan.cls}`}
                                >
                                  <PlanIcon className="h-3 w-3" />
                                  {plan.label}
                                </span>
                              )}
                              {c.isActive ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                                  <ShieldCheck className="h-3 w-3" /> Aktif
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                                  <ShieldAlert className="h-3 w-3" /> Pasif
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              /{c.slug}
                              {c.memberNo ? ` • Üye No: ${c.memberNo}` : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                          <Store className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{c.owner?.name || '—'}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          <button
                            onClick={() => copyToClipboard(c.owner?.email || '', 'E-posta kopyalandı')}
                            className="group flex items-center gap-2 text-sm text-gray-700 bg-blue-50/60 hover:bg-blue-100 px-3 py-2 rounded-lg transition border border-blue-100"
                          >
                            <Mail className="h-4 w-4 text-blue-500" />
                            <span className="font-mono text-xs flex-1 text-left truncate">
                              {c.owner?.email || '—'}
                            </span>
                            <Copy className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-600" />
                          </button>
                          {c.phone && (
                            <button
                              onClick={() => copyToClipboard(c.phone || '', 'Telefon kopyalandı')}
                              className="group flex items-center gap-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition border border-gray-100"
                            >
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span className="font-mono text-xs flex-1 text-left">{c.phone}</span>
                              <Copy className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-700" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Orta — Şifre */}
                      <div className="p-5 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gradient-to-br from-amber-50/40 to-white">
                        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
                          <KeyRound className="h-3.5 w-3.5" />
                          Müşteri Şifresi
                        </div>
                        {password ? (
                          <>
                            <div className="flex items-center gap-2 bg-white border border-amber-200 rounded-lg px-3 py-2">
                              <code className="flex-1 font-mono text-sm text-gray-900 truncate">
                                {isRevealed ? password : '•'.repeat(Math.min(password.length, 12))}
                              </code>
                              <button
                                onClick={() => setRevealed((r) => ({ ...r, [c.id]: !r[c.id] }))}
                                className="text-gray-500 hover:text-amber-700 p-1"
                                title={isRevealed ? 'Gizle' : 'Göster'}
                              >
                                {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => copyToClipboard(password, 'Şifre kopyalandı')}
                                className="text-gray-500 hover:text-amber-700 p-1"
                                title="Kopyala"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-[11px] text-amber-700/80 mt-2 flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3" /> Müşteri değiştirse bile burada güncel kalır
                            </p>
                          </>
                        ) : (
                          <div className="bg-white border border-dashed border-gray-300 rounded-lg px-3 py-3 text-xs text-gray-500">
                            Eski hesap — açık şifre kayıtlı değil. Aşağıdaki butonla yeni şifre belirleyin.
                          </div>
                        )}
                        <button
                          onClick={() => openResetModal(c)}
                          disabled={!c.owner?.id}
                          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-semibold transition"
                        >
                          <KeyRound className="h-3.5 w-3.5" /> Şifre Sıfırla
                        </button>
                      </div>

                      {/* Sağ — Üyelik */}
                      <div className="p-5 bg-gradient-to-br from-blue-50/40 to-white">
                        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
                          <Calendar className="h-3.5 w-3.5" />
                          Üyelik Bilgileri
                        </div>
                        <dl className="space-y-1.5 text-xs">
                          <div className="flex justify-between gap-2">
                            <dt className="text-gray-500">Başlangıç</dt>
                            <dd className="font-medium text-gray-900">
                              {formatDate(c.membershipStartDate)}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-2">
                            <dt className="text-gray-500">Bitiş</dt>
                            <dd className="font-medium text-gray-900">{formatDate(c.membershipEndDate)}</dd>
                          </div>
                          <div className="flex justify-between gap-2">
                            <dt className="text-gray-500">Kayıt</dt>
                            <dd className="font-medium text-gray-900">{formatDate(c.createdAt)}</dd>
                          </div>
                          {(c.city || c.district) && (
                            <div className="flex justify-between gap-2">
                              <dt className="text-gray-500">Konum</dt>
                              <dd className="font-medium text-gray-900 text-right">
                                {[c.district, c.city].filter(Boolean).join(', ')}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RESET PASSWORD MODAL */}
        {resetTarget && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold">Şifre Sıfırla</h2>
                    <p className="text-xs text-white/85">{resetTarget.name}</p>
                  </div>
                </div>
                <button onClick={() => setResetTarget(null)} className="text-white/80 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                  Yeni şifre hem müşterinin hesabına yazılacak hem admin panelinde görünür olacak.
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
                      let pw = '';
                      for (let i = 0; i < 10; i++) pw += chars[Math.floor(Math.random() * chars.length)];
                      setNewPassword(pw);
                    }}
                    className="mt-2 text-xs text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" /> Rastgele güçlü şifre oluştur
                  </button>
                </div>
                {resetError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                    {resetError}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-5 py-3 flex justify-end gap-2 border-t">
                <button
                  onClick={() => setResetTarget(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg"
                >
                  İptal
                </button>
                <button
                  onClick={submitReset}
                  disabled={resetting}
                  className="px-4 py-2 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 rounded-lg flex items-center gap-2"
                >
                  {resetting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" /> Şifreyi Güncelle
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOAST */}
        {toast && (
          <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm">
            {toast}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
