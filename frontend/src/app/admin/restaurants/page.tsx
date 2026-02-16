'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useEffect, useState, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import QrBox from '@/components/QrBox';
import { slugifyTR } from '@/utils/slugify';
import { Store, Plus, Pencil, Trash2, User, Phone, Mail, MapPin, Eye, EyeOff, Copy, RefreshCw, Download, CheckCircle, X, QrCode, ChevronDown } from 'lucide-react';
import { getCities, getDistrictsByCity } from '@/data/turkey-cities';

interface Restaurant {
  id: string;
  memberNo?: string;
  businessType?: string;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  city?: string;
  district?: string;
  neighborhood?: string;
  fullAddress?: string;
  phone?: string;
  email?: string;
  googleMapsUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  workingHours?: string;
  openingHoursText?: string;
  internalNote?: string;
  membershipStartDate?: string | null;
  membershipEndDate?: string | null;
  owner: {
    name: string;
    email: string;
  };
  plan?: {
    id: string;
    code: 'STARTER' | 'GOLD' | 'PLATIN';
    name: string;
    maxProducts: number | null;
    qrMode: 'SINGLE' | 'PER_TABLE';
  } | null;
  _count: {
    categories: number;
    qrCodes: number;
  };
  createdAt: string;
}

interface FormData {
  businessType: string;
  memberNo: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  district: string;
  neighborhood: string;
  fullAddress: string;
  phone: string;
  email: string;
  googleMapsUrl: string;
  workingHours: string;
  openingHoursText: string;
  instagramUrl: string;
  facebookUrl: string;
  membershipStartDate: string;
  membershipEndDate: string;
  internalNote: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
  planCode: 'STARTER' | 'GOLD' | 'PLATIN';
}

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugPreview, setSlugPreview] = useState('');
  const [slugCheck, setSlugCheck] = useState<
    | null
    | {
        loading: boolean;
        normalized: string;
        available?: boolean;
        suggestion?: string | null;
        error?: string;
      }
  >(null);
  
  // Success state for showing QR after creation
  const [createdRestaurant, setCreatedRestaurant] = useState<{
    id: string;
    name: string;
    slug: string;
    memberNo: string;
    qrCode: {
      imageData: string;
      menuUrl: string;
    };
    owner: {
      email: string;
      name: string;
    };
  } | null>(null);
  
  const qrDownloadRef = useRef<HTMLAnchorElement>(null);
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const [formData, setFormData] = useState<FormData>({
    businessType: 'RESTORAN',
    memberNo: '',
    name: '',
    slug: '',
    description: '',
    city: '',
    district: '',
    neighborhood: '',
    fullAddress: '',
    phone: '',
    email: '',
    googleMapsUrl: '',
    workingHours: '',
    openingHoursText: '',
    instagramUrl: '',
    facebookUrl: '',
    membershipStartDate: new Date().toISOString().split('T')[0],
    membershipEndDate: '',
    internalNote: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    planCode: 'STARTER',
  });

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (!showModal) return;
    const normalized = slugifyTR(formData.slug);
    setSlugPreview(normalized);

    if (!normalized) {
      setSlugCheck(null);
      return;
    }

    let cancelled = false;
    setSlugCheck({ loading: true, normalized });

    const t = setTimeout(async () => {
      try {
        const url = new URL('/api/slug-check', window.location.origin);
        url.searchParams.set('slug', normalized);
        if (editingRestaurant?.id) url.searchParams.set('excludeId', editingRestaurant.id);
        const res = await fetch(url.toString(), { cache: 'no-store' });
        const json = await res.json().catch(() => null);

        if (cancelled) return;

        if (!json?.success) {
          setSlugCheck({ loading: false, normalized, error: json?.message || 'Kontrol edilemedi' });
          return;
        }

        setSlugCheck({
          loading: false,
          normalized: json.data?.slug || normalized,
          available: Boolean(json.data?.available),
          suggestion: json.data?.suggestion ?? null,
        });
      } catch (e) {
        if (cancelled) return;
        setSlugCheck({ loading: false, normalized, error: 'Kontrol edilemedi' });
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [formData.slug, showModal, editingRestaurant?.id]);

  // Generate member number when modal opens for new restaurant
  useEffect(() => {
    if (showModal && !editingRestaurant && !formData.memberNo) {
      const memberNo = String(Math.floor(100000 + Math.random() * 900000));
      setFormData(prev => ({ ...prev, memberNo }));
    }
  }, [showModal, editingRestaurant]);

  const getClientBaseUrl = () => {
    const envBase = process.env.NEXT_PUBLIC_BASE_URL;
    if (envBase && envBase.trim()) return envBase.trim().replace(/\/$/, '');
    return window.location.origin;
  };

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getRestaurants();
      setRestaurants(response.data || []);
    } catch (error) {
      console.error('Restoranlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    const isEditMode = !!editingRestaurant;

    // İşletme Bilgileri Validasyonları
    if (!formData.businessType) newErrors.businessType = 'İşletme tipi zorunludur';
    if (!formData.name || formData.name.length < 2) newErrors.name = 'Restoran adı en az 2 karakter olmalıdır';
    if (!formData.slug) newErrors.slug = 'Slug zorunludur';
    if (!formData.phone || formData.phone.length < 10) newErrors.phone = 'Geçerli bir telefon numarası giriniz';
    
    // Email validasyonu - opsiyonel yapabiliriz veya zorunlu
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir email adresi giriniz';
    }

    // URL validasyonları - sadece doluysa kontrol et
    if (formData.googleMapsUrl && !/^https?:\/\/.+/.test(formData.googleMapsUrl)) {
      newErrors.googleMapsUrl = 'Geçerli bir URL giriniz (http:// veya https://)';
    }
    if (formData.instagramUrl && !/^https?:\/\/.+/.test(formData.instagramUrl)) {
      newErrors.instagramUrl = 'Geçerli bir URL giriniz';
    }
    if (formData.facebookUrl && !/^https?:\/\/.+/.test(formData.facebookUrl)) {
      newErrors.facebookUrl = 'Geçerli bir URL giriniz';
    }

    // Üyelik tarihleri
    if (!formData.membershipStartDate) newErrors.membershipStartDate = 'Başlangıç tarihi zorunludur';
    if (!formData.membershipEndDate) newErrors.membershipEndDate = 'Bitiş tarihi zorunludur';
    if (formData.membershipStartDate && formData.membershipEndDate) {
      if (new Date(formData.membershipEndDate) < new Date(formData.membershipStartDate)) {
        newErrors.membershipEndDate = 'Bitiş tarihi başlangıçtan önce olamaz';
      }
    }

    // Adres bilgileri - edit modunda opsiyonel yapabiliriz
    if (!isEditMode && !formData.fullAddress) {
      newErrors.fullAddress = 'Açık adres zorunludur';
    }
    
    // İl ve İlçe validasyonları
    if (!formData.city) {
      newErrors.city = 'Lütfen il seçiniz';
    }
    if (!formData.district) {
      newErrors.district = 'Lütfen ilçe seçiniz';
    }

    // Sahip Bilgileri - sadece yeni restoran oluştururken zorunlu
    if (!isEditMode) {
      if (!formData.ownerName || formData.ownerName.length < 2) {
        newErrors.ownerName = 'Sahip adı en az 2 karakter olmalıdır';
      }
      if (!formData.ownerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail)) {
        newErrors.ownerEmail = 'Geçerli bir email adresi giriniz';
      }
      if (!formData.ownerPassword || formData.ownerPassword.length < 8) {
        newErrors.ownerPassword = 'Şifre en az 8 karakter olmalıdır';
      } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.ownerPassword)) {
        newErrors.ownerPassword = 'Şifre en az 1 harf ve 1 rakam içermelidir';
      }
    } else {
      // Edit modunda şifre opsiyonel - ama doluysa validasyondan geçmeli
      if (formData.ownerPassword && formData.ownerPassword.length > 0) {
        if (formData.ownerPassword.length < 8) {
          newErrors.ownerPassword = 'Şifre en az 8 karakter olmalıdır';
        } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.ownerPassword)) {
          newErrors.ownerPassword = 'Şifre en az 1 harf ve 1 rakam içermelidir';
        }
      }
    }

    setErrors(newErrors);
    
    // Hata varsa ilk hatalı alanı göster
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      console.log('Validation errors:', newErrors);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Hataları kullanıcıya göster
      const errorMessages = Object.entries(errors)
        .filter(([_, msg]) => msg)
        .map(([field, msg]) => `• ${msg}`)
        .join('\n');
      
      if (errorMessages) {
        alert(`Lütfen aşağıdaki hataları düzeltin:\n\n${errorMessages}`);
      } else {
        alert('Lütfen tüm zorunlu alanları doldurun');
      }
      return;
    }

    const normalizedSlug = slugifyTR(formData.slug);
    if (!normalizedSlug) {
      alert('Slug geçersiz');
      return;
    }

    if (slugCheck && slugCheck.normalized === normalizedSlug && slugCheck.available === false) {
      alert('Bu slug zaten kullanılıyor. Lütfen farklı bir slug seçin.');
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingRestaurant) {
        // Update modunda şifre boşsa gönderme
        const updateData = { ...formData, slug: normalizedSlug };
        if (!updateData.ownerPassword) {
          delete (updateData as any).ownerPassword;
        }
        await apiClient.updateRestaurant(editingRestaurant.id, updateData);
        setShowModal(false);
        resetForm();
        loadRestaurants();
        alert('Restoran başarıyla güncellendi!');
      } else {
        const response = await apiClient.createRestaurant({ ...formData, slug: normalizedSlug });
        
        // Set created restaurant data for QR preview
        if (response.data) {
          const { restaurant, qrCode, menuUrl } = response.data;
          setCreatedRestaurant({
            id: restaurant.id,
            name: restaurant.name,
            slug: restaurant.slug,
            memberNo: restaurant.memberNo || formData.memberNo,
            qrCode: {
              imageData: qrCode?.imageData || '',
              menuUrl: menuUrl || `${window.location.origin}/menu/${restaurant.slug}`,
            },
            owner: {
              email: restaurant.owner?.email || formData.ownerEmail,
              name: restaurant.owner?.name || formData.ownerName,
            },
          });
        }
        
        loadRestaurants();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Bir hata oluştu';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu restoranı silmek istediğinizden emin misiniz?')) return;
    try {
      await apiClient.deleteRestaurant(id);
      loadRestaurants();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Silinemedi');
    }
  };

  const openEditModal = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setSlugTouched(true);
    setSlugPreview(restaurant.slug);
    setFormData({
      businessType: restaurant.businessType || 'RESTORAN',
      memberNo: restaurant.memberNo || '',
      name: restaurant.name,
      slug: restaurant.slug,
      description: restaurant.description || '',
      city: restaurant.city || '',
      district: restaurant.district || '',
      neighborhood: restaurant.neighborhood || '',
      fullAddress: restaurant.fullAddress || restaurant.address || '',
      phone: restaurant.phone || '',
      email: restaurant.email || '',
      googleMapsUrl: restaurant.googleMapsUrl || '',
      workingHours: restaurant.workingHours || '',
      openingHoursText: restaurant.openingHoursText || '',
      instagramUrl: restaurant.instagramUrl || '',
      facebookUrl: restaurant.facebookUrl || '',
      membershipStartDate: restaurant.membershipStartDate?.split('T')[0] || '',
      membershipEndDate: restaurant.membershipEndDate?.split('T')[0] || '',
      internalNote: restaurant.internalNote || '',
      ownerEmail: restaurant.owner.email,
      ownerName: restaurant.owner.name,
      ownerPassword: '',
      planCode: restaurant.plan?.code || 'STARTER',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingRestaurant(null);
    setSlugTouched(false);
    setSlugPreview('');
    setSlugCheck(null);
    setErrors({});
    setCreatedRestaurant(null);
    setFormData({
      businessType: 'RESTORAN',
      memberNo: '',
      name: '',
      slug: '',
      description: '',
      city: '',
      district: '',
      neighborhood: '',
      fullAddress: '',
      phone: '',
      email: '',
      googleMapsUrl: '',
      workingHours: '',
      openingHoursText: '',
      instagramUrl: '',
      facebookUrl: '',
      membershipStartDate: new Date().toISOString().split('T')[0],
      membershipEndDate: '',
      internalNote: '',
      ownerName: '',
      ownerEmail: '',
      ownerPassword: '',
      planCode: 'STARTER',
    });
  };

  /**
   * Generate a secure password that always meets the requirements:
   * - Minimum 8 characters (we use 12 for better security)
   * - At least 1 letter
   * - At least 1 digit
   */
  const generatePassword = () => {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const specialChars = '!@#$%^&*';
    const allChars = letters + digits + specialChars;
    const length = 12;
    
    // Start with guaranteed requirements: 1 letter + 1 digit
    let password = '';
    
    // Add at least 2 letters (one lowercase, one uppercase)
    password += letters.charAt(Math.floor(Math.random() * 26)); // lowercase
    password += letters.charAt(26 + Math.floor(Math.random() * 26)); // uppercase
    
    // Add at least 2 digits
    password += digits.charAt(Math.floor(Math.random() * digits.length));
    password += digits.charAt(Math.floor(Math.random() * digits.length));
    
    // Fill the rest with random characters from all sets
    for (let i = password.length; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // Shuffle the password to randomize positions
    const shuffled = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setFormData(prev => ({ ...prev, ownerPassword: shuffled }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Kopyalandı!');
  };

  const downloadQRCode = () => {
    if (!createdRestaurant?.qrCode?.imageData) return;
    
    const link = document.createElement('a');
    link.href = createdRestaurant.qrCode.imageData;
    link.download = `qr-${createdRestaurant.slug}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeModalAndReset = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <DashboardLayout>
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-300/70 shadow-sm">
                  <Store className="h-6 w-6" strokeWidth={1.9} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                    Restoran Yönetimi
                  </h1>
                  <p className="mt-1 text-[13px] sm:text-[15px] text-slate-600">
                    Tüm restoranları yönetin, iletişim bilgilerini ve istatistikleri görüntüleyin
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="w-full sm:w-auto h-12 px-5 sm:px-6 rounded-xl bg-primary-600 text-white hover:bg-primary-700 ring-1 ring-inset ring-primary-500/20 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Plus className="h-4.5 w-4.5" strokeWidth={2} aria-hidden="true" />
              <span>Yeni Restoran</span>
            </button>
          </div>
        </div>

        {/* Restaurants - Mobile Cards / Desktop Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 text-base sm:text-lg">Henüz restoran eklenmemiş</p>
            </div>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-slate-200/70">
                {restaurants.map((restaurant) => (
                  <div key={restaurant.id} className="p-4 sm:p-5 space-y-3 hover:bg-slate-50/70 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-[14px] font-semibold text-slate-900">{restaurant.name}</h3>
                        <p className="mt-0.5 text-[12px] text-slate-500">/{restaurant.slug}</p>
                        {restaurant.memberNo && (
                          <p className="mt-0.5 text-[12px] text-blue-600 font-mono">#{restaurant.memberNo}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200/80">
                          {restaurant._count.categories} Kat
                        </span>
                        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200/80">
                          {restaurant._count.qrCodes} QR
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[13px] text-slate-700">
                        <User className="h-4 w-4 text-slate-400" strokeWidth={2} aria-hidden="true" />
                        <span className="truncate">{restaurant.owner.name}</span>
                      </div>
                      {restaurant.phone && (
                        <div className="flex items-center gap-2 text-[13px] text-slate-600">
                          <Phone className="h-4 w-4 text-slate-400" strokeWidth={2} aria-hidden="true" />
                          <span className="truncate">{restaurant.phone}</span>
                        </div>
                      )}
                      {restaurant.email && (
                        <div className="flex items-center gap-2 text-[13px] text-slate-600">
                          <Mail className="h-4 w-4 text-slate-400" strokeWidth={2} aria-hidden="true" />
                          <span className="truncate">{restaurant.email}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => openEditModal(restaurant)}
                        className="flex-1 h-9 px-3 rounded-lg border border-blue-200 text-blue-700 bg-blue-50/40 hover:bg-blue-50 text-sm font-medium"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(restaurant.id)}
                        className="flex-1 h-9 px-3 rounded-lg border border-red-200 text-red-700 bg-red-50/40 hover:bg-red-50 text-sm font-medium"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200/70">
                  <thead className="bg-slate-50/70">
                    <tr>
                      <th className="py-3 px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Restoran
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Sahip
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        İletişim
                      </th>
                      <th className="py-3 px-6 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        İstatistik
                      </th>
                      <th className="py-3 px-6 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200/70">
                    {restaurants.map((restaurant) => (
                      <tr key={restaurant.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-semibold text-slate-900">{restaurant.name}</div>
                            <div className="text-sm text-slate-500">/{restaurant.slug}</div>
                            {restaurant.memberNo && (
                              <div className="text-xs text-blue-600 font-mono mt-0.5">#{restaurant.memberNo}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{restaurant.owner.name}</div>
                            <div className="text-sm text-slate-500">{restaurant.owner.email}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            {restaurant.phone && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone className="h-3.5 w-3.5 text-slate-400" />
                                {restaurant.phone}
                              </div>
                            )}
                            {restaurant.email && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Mail className="h-3.5 w-3.5 text-slate-400" />
                                {restaurant.email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200/80">
                              {restaurant._count.categories} Kategori
                            </span>
                            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200/80">
                              {restaurant._count.qrCodes} QR
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(restaurant)}
                              className="h-9 px-3.5 rounded-xl border border-primary-200 text-primary-700 bg-primary-50/40 hover:bg-primary-50 hover:shadow-sm transition-all duration-200 text-sm font-semibold inline-flex items-center gap-2"
                            >
                              <Pencil className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                              Düzenle
                            </button>
                            <button
                              onClick={() => handleDelete(restaurant.id)}
                              className="h-9 px-3.5 rounded-xl border border-rose-200 text-rose-700 bg-rose-50/40 hover:bg-rose-50 hover:shadow-sm transition-all duration-200 text-sm font-semibold inline-flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Professional Registration Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-0 sm:p-4 overflow-y-auto">
            <div className="bg-white sm:rounded-2xl shadow-2xl w-full max-w-5xl min-h-screen sm:min-h-0 sm:my-8 sm:max-h-[90vh] flex flex-col">
              {/* Modal Header - Fixed */}
              <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10 sm:rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {createdRestaurant ? '✅ Restoran Oluşturuldu!' : editingRestaurant ? 'Restoran Düzenle' : 'Yeni Restoran Ekle'}
                    </h2>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {createdRestaurant
                        ? 'Restoran başarıyla oluşturuldu. QR kodunu indirebilirsiniz.'
                        : editingRestaurant
                        ? 'Restoran bilgilerini güncelleyin'
                        : 'Yeni restoran kaydı oluşturmak için bilgileri doldurun'}
                    </p>
                  </div>
                  <button
                    onClick={closeModalAndReset}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Kapat"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {/* Success State - QR Preview */}
                {createdRestaurant ? (
                  <div className="space-y-6">
                    {/* Success Banner */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-green-900">Restoran başarıyla oluşturuldu!</h3>
                        <p className="text-sm text-green-700 mt-1">
                          <strong>{createdRestaurant.name}</strong> (#{createdRestaurant.memberNo}) sisteme eklendi.
                        </p>
                      </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <QrCode className="h-5 w-5 text-blue-600" />
                        QR Kod
                      </h3>
                      
                      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        {/* QR Image */}
                        <div className="flex-shrink-0 p-4 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                          {createdRestaurant.qrCode.imageData ? (
                            <img
                              src={createdRestaurant.qrCode.imageData}
                              alt={`${createdRestaurant.name} QR Kod`}
                              className="w-48 h-48 object-contain"
                            />
                          ) : (
                            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                              <QrCode className="h-16 w-16 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* QR Info & Actions */}
                        <div className="flex-1 space-y-4 text-center md:text-left">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Menü Linki:</p>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <code className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono text-blue-600 break-all">
                                {createdRestaurant.qrCode.menuUrl}
                              </code>
                              <button
                                onClick={() => copyToClipboard(createdRestaurant.qrCode.menuUrl)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                              >
                                <Copy className="h-4 w-4" />
                                Kopyala
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Üye No</p>
                              <p className="text-sm font-mono text-gray-900">#{createdRestaurant.memberNo}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Slug</p>
                              <p className="text-sm font-mono text-gray-900">/{createdRestaurant.slug}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Sahip</p>
                              <p className="text-sm text-gray-900">{createdRestaurant.owner.name}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Sahip Email</p>
                              <p className="text-sm text-gray-900">{createdRestaurant.owner.email}</p>
                            </div>
                          </div>

                          {/* Download Button */}
                          <button
                            onClick={downloadQRCode}
                            disabled={!createdRestaurant.qrCode.imageData}
                            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Download className="h-5 w-5" />
                            QR Kodu İndir
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Owner Info Reminder */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">📧 Giriş Bilgileri</h4>
                      <p className="text-sm text-blue-800">
                        İşletme sahibi <strong>{createdRestaurant.owner.email}</strong> adresine giriş bilgilerini içeren bir e-posta gönderildi.
                      </p>
                    </div>
                  </div>
                ) : (

                <form id="restaurant-form" onSubmit={handleSubmit} className="space-y-8">
                  {/* İŞLETME BİLGİLERİ */}
                  <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Store className="h-5 w-5 text-blue-600" />
                      İŞLETME BİLGİLERİ
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* İşletme Tipi */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          İşletme Tipi <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.businessType}
                          onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Seçiniz</option>
                          <option value="RESTORAN">Restoran</option>
                          <option value="KAFE">Kafe</option>
                          <option value="OTEL">Otel</option>
                          <option value="DIGER">Diğer</option>
                        </select>
                        {errors.businessType && (
                          <p className="mt-1 text-sm text-red-600">{errors.businessType}</p>
                        )}
                      </div>

                      {/* Paket Seçimi */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Paket <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.planCode}
                          onChange={(e) => setFormData({ ...formData, planCode: e.target.value as 'STARTER' | 'GOLD' | 'PLATIN' })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="STARTER">Başlangıç Paketi (30 Ürün, Tek QR)</option>
                          <option value="GOLD">Gold Paket (Sınırsız, Masa QR, Tüm Özellikler)</option>
                          <option value="PLATIN">Platin Paket (Sınırsız, Tek QR)</option>
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                          Seçilen paket ürün limiti ve özellikleri belirler
                        </p>
                      </div>

                      {/* Üye Numarası */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Üye Numarası <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.memberNo}
                            readOnly
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newMemberNo = String(Math.floor(100000 + Math.random() * 900000));
                              setFormData({ ...formData, memberNo: newMemberNo });
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700"
                            title="Yeni numara üret"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Otomatik oluşturuldu</p>
                      </div>

                      {/* Restoran Adı */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Restoran Adı <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            setFormData((prev) => {
                              const next = { ...prev, name };
                              if (!slugTouched) {
                                next.slug = slugifyTR(name);
                              }
                              return next;
                            });
                          }}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Örn: Güler Kebap Lahmacun"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                      </div>

                      {/* Slug (URL) - Restoran Adı'nın hemen altında */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Slug (URL) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.slug}
                          onChange={(e) => {
                            setSlugTouched(true);
                            const normalized = slugifyTR(e.target.value);
                            setSlugPreview(normalized);
                            setFormData({ ...formData, slug: normalized });
                          }}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                          placeholder="guler-kebap-lahmacun"
                        />
                        <div className="mt-1.5 text-xs space-y-1">
                          <div className="text-gray-600">
                            Menü linki:{' '}
                            <span className="font-mono text-blue-600">/menu/{slugPreview || '...'}</span>
                          </div>
                          {slugCheck?.loading ? (
                            <div className="text-gray-500">Kontrol ediliyor...</div>
                          ) : slugCheck?.error ? (
                            <div className="text-red-600">{slugCheck.error}</div>
                          ) : slugCheck?.available === true ? (
                            <div className="text-green-700 font-medium">✓ Slug uygun</div>
                          ) : slugCheck?.available === false ? (
                            <div className="text-red-700">
                              ✗ Slug kullanımda
                              {slugCheck.suggestion && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, slug: slugCheck.suggestion || formData.slug });
                                    setSlugPreview(slugCheck.suggestion || slugPreview);
                                  }}
                                  className="ml-2 underline text-blue-600 hover:text-blue-800"
                                >
                                  Öneri: {slugCheck.suggestion}
                                </button>
                              )}
                            </div>
                          ) : null}
                        </div>
                        {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                      </div>

                      {/* QR Preview Card - Ayrı satırda */}
                      <div className="w-full">
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 w-full sm:w-72 mx-auto sm:mx-0">
                          <h4 className="text-sm font-medium text-gray-700 text-center mb-3">
                            QR Kod Önizleme
                          </h4>
                            
                            <div className="flex flex-col items-center justify-center">
                              {slugPreview ? (
                                <>
                                  {/* QR Code Container - Centered */}
                                  <div className="w-full flex justify-center">
                                    <div className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] rounded-xl bg-white p-3 shadow-sm border border-gray-200 flex items-center justify-center">
                                      <QrBox 
                                        slug={slugPreview}
                                        size={180}
                                      />
                                    </div>
                                  </div>
                                  
                                  {/* Full URL Display with Copy */}
                                  <div className="w-full mt-4 space-y-2">
                                    {/* URL Pill - Full visible, wrappable */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                                      <div className="flex items-start gap-2">
                                        <p 
                                          className="flex-1 text-[11px] sm:text-xs text-gray-600 font-mono leading-relaxed"
                                          style={{ 
                                            overflowWrap: 'anywhere', 
                                            wordBreak: 'break-word' 
                                          }}
                                        >
                                          {(() => {
                                            const base = process.env.NEXT_PUBLIC_PUBLIC_MENU_BASE_URL 
                                              || process.env.NEXT_PUBLIC_APP_URL 
                                              || process.env.NEXT_PUBLIC_BASE_URL 
                                              || (typeof window !== 'undefined' ? window.location.origin : '');
                                            return `${base.replace(/\/$/, '')}/menu/${slugPreview}`;
                                          })()}
                                        </p>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-1 flex-shrink-0">
                                          {/* Copy Button */}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const base = process.env.NEXT_PUBLIC_PUBLIC_MENU_BASE_URL 
                                                || process.env.NEXT_PUBLIC_APP_URL 
                                                || process.env.NEXT_PUBLIC_BASE_URL 
                                                || (typeof window !== 'undefined' ? window.location.origin : '');
                                              const fullUrl = `${base.replace(/\/$/, '')}/menu/${slugPreview}`;
                                              
                                              if (navigator.clipboard && navigator.clipboard.writeText) {
                                                navigator.clipboard.writeText(fullUrl).then(() => {
                                                  alert('Link kopyalandı!');
                                                }).catch(() => {
                                                  // Fallback
                                                  const input = document.createElement('input');
                                                  input.value = fullUrl;
                                                  document.body.appendChild(input);
                                                  input.select();
                                                  document.execCommand('copy');
                                                  document.body.removeChild(input);
                                                  alert('Link kopyalandı!');
                                                });
                                              } else {
                                                // Fallback for older browsers
                                                const input = document.createElement('input');
                                                input.value = fullUrl;
                                                document.body.appendChild(input);
                                                input.select();
                                                document.execCommand('copy');
                                                document.body.removeChild(input);
                                                alert('Link kopyalandı!');
                                              }
                                            }}
                                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Linki Kopyala"
                                          >
                                            <Copy className="w-3.5 h-3.5" />
                                          </button>
                                          
                                          {/* Open in New Tab Button */}
                                          <a
                                            href={(() => {
                                              const base = process.env.NEXT_PUBLIC_PUBLIC_MENU_BASE_URL 
                                                || process.env.NEXT_PUBLIC_APP_URL 
                                                || process.env.NEXT_PUBLIC_BASE_URL 
                                                || (typeof window !== 'undefined' ? window.location.origin : '');
                                              return `${base.replace(/\/$/, '')}/menu/${slugPreview}`;
                                            })()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                            title="Yeni Sekmede Aç"
                                          >
                                            <Eye className="w-3.5 h-3.5" />
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <p className="text-[10px] text-gray-400 text-center">
                                      Kayıt sonrası QR indirilecek
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <div className="w-full rounded-xl border border-dashed border-gray-300 bg-gray-100/50 p-6 text-center">
                                  <QrCode className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                                  <p className="text-xs text-gray-400">
                                    Slug girdikten sonra<br />QR önizleme görünecek
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                    </div>

                    {/* Açıklama */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        maxLength={500}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Restoranınız hakkında kısa bir açıklama..."
                      />
                      <p className="mt-1 text-xs text-gray-500 text-right">
                        {formData.description.length}/500
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      {/* Telefon */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefon <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+90 555 123 4567"
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="info@restoran.com"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                      </div>

                      {/* Google Maps URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Google Maps Linki
                        </label>
                        <input
                          type="url"
                          value={formData.googleMapsUrl}
                          onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://maps.google.com/..."
                        />
                        {errors.googleMapsUrl && (
                          <p className="mt-1 text-sm text-red-600">{errors.googleMapsUrl}</p>
                        )}
                      </div>

                      {/* Çalışma Saatleri */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Çalışma Saatleri
                        </label>
                        <input
                          type="text"
                          value={formData.openingHoursText}
                          onChange={(e) => setFormData({ ...formData, openingHoursText: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="07:00 - 21:00"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Örn: "07:00 - 21:00" veya "Hafta içi 08:00-22:00 / Pazar Kapalı"
                        </p>
                        {errors.openingHoursText && (
                          <p className="mt-1 text-sm text-red-600">{errors.openingHoursText}</p>
                        )}
                      </div>

                      {/* Instagram URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                        <input
                          type="url"
                          value={formData.instagramUrl}
                          onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://instagram.com/..."
                        />
                        {errors.instagramUrl && (
                          <p className="mt-1 text-sm text-red-600">{errors.instagramUrl}</p>
                        )}
                      </div>

                      {/* Facebook URL */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                        <input
                          type="url"
                          value={formData.facebookUrl}
                          onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://facebook.com/..."
                        />
                        {errors.facebookUrl && (
                          <p className="mt-1 text-sm text-red-600">{errors.facebookUrl}</p>
                        )}
                      </div>
                    </div>

                    {/* Üyelik Tarihleri */}
                    {!editingRestaurant && (
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Üyelik Başlangıç Tarihi <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            required
                            value={formData.membershipStartDate}
                            onChange={(e) =>
                              setFormData({ ...formData, membershipStartDate: e.target.value })
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {errors.membershipStartDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.membershipStartDate}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Üyelik Bitiş Tarihi <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            required
                            value={formData.membershipEndDate}
                            onChange={(e) =>
                              setFormData({ ...formData, membershipEndDate: e.target.value })
                            }
                            min={formData.membershipStartDate || undefined}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {errors.membershipEndDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.membershipEndDate}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Adres Bilgileri */}
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        Adres Bilgileri <span className="text-red-500">*</span>
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            İl <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={formData.city}
                              onChange={(e) => {
                                const newCity = e.target.value;
                                setFormData({ 
                                  ...formData, 
                                  city: newCity,
                                  district: '' // İl değişince ilçeyi sıfırla
                                });
                              }}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900 cursor-pointer"
                              style={{ colorScheme: 'light' }}
                            >
                              <option value="" className="text-gray-500">İl seçiniz</option>
                              {getCities().map((city) => (
                                <option key={city} value={city} className="text-gray-900 bg-white">{city}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                          </div>
                          {errors.city && (
                            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            İlçe <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={formData.district}
                              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                              disabled={!formData.city}
                              className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-900 cursor-pointer ${!formData.city ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                              style={{ colorScheme: 'light' }}
                            >
                              <option value="" className="text-gray-500">İlçe seçiniz</option>
                              {formData.city && getDistrictsByCity(formData.city).map((district) => (
                                <option key={district} value={district} className="text-gray-900 bg-white">{district}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                          </div>
                          {errors.district && (
                            <p className="mt-1 text-sm text-red-600">{errors.district}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mahalle/Semt
                          </label>
                          <input
                            type="text"
                            value={formData.neighborhood}
                            onChange={(e) =>
                              setFormData({ ...formData, neighborhood: e.target.value })
                            }
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Kızılay"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Açık Adres <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          value={formData.fullAddress}
                          onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          placeholder="Sokak, cadde, bina no, kat, daire bilgileri..."
                        />
                        {errors.fullAddress && (
                          <p className="mt-1 text-sm text-red-600">{errors.fullAddress}</p>
                        )}
                      </div>
                    </div>

                    {/* İç Not */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Not / İç Açıklama (Sadece admin görür)
                      </label>
                      <textarea
                        value={formData.internalNote}
                        onChange={(e) => setFormData({ ...formData, internalNote: e.target.value })}
                        maxLength={1000}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Dahili notlar, özel bilgiler..."
                      />
                      <p className="mt-1 text-xs text-gray-500 text-right">
                        {formData.internalNote.length}/1000
                      </p>
                    </div>
                  </div>

                  {/* SAHİP BİLGİLERİ */}
                  {!editingRestaurant && (
                    <div className="border border-gray-200 rounded-xl p-6 bg-blue-50/30">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        SAHİP BİLGİLERİ
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Sahip Adı */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sahip Adı <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.ownerName}
                            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ahmet Yılmaz"
                          />
                          {errors.ownerName && (
                            <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>
                          )}
                        </div>

                        {/* Sahip Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sahip Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.ownerEmail}
                            onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="ahmet@restoran.com"
                          />
                          {errors.ownerEmail && (
                            <p className="mt-1 text-sm text-red-600">{errors.ownerEmail}</p>
                          )}
                        </div>
                      </div>

                      {/* Sahip Şifresi */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sahip Şifresi <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <input
                              type={showOwnerPassword ? 'text' : 'password'}
                              required
                              value={formData.ownerPassword}
                              onChange={(e) =>
                                setFormData({ ...formData, ownerPassword: e.target.value })
                              }
                              className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="En az 8 karakter, 1 harf ve 1 rakam"
                            />
                            <button
                              type="button"
                              onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showOwnerPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={generatePassword}
                            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Şifre Üret
                          </button>
                          {formData.ownerPassword && (
                            <button
                              type="button"
                              onClick={() => copyToClipboard(formData.ownerPassword)}
                              className="px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                              title="Şifreyi kopyala"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-600">
                          Min 8 karakter, en az 1 harf ve 1 rakam içermelidir
                        </p>
                        {errors.ownerPassword && (
                          <p className="mt-1 text-sm text-red-600">{errors.ownerPassword}</p>
                        )}
                      </div>
                    </div>
                  )}
                </form>
                )}
              </div>

              {/* Modal Footer - Fixed */}
              <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 sm:rounded-b-2xl">
                {createdRestaurant ? (
                  /* Success State Footer */
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        resetForm();
                        // Keep modal open for new entry
                      }}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      Yeni Restoran Ekle
                    </button>
                    <button
                      onClick={closeModalAndReset}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold transition-all"
                    >
                      Kapat
                    </button>
                  </div>
                ) : (
                  /* Form Footer */
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      form="restaurant-form"
                      disabled={submitting}
                      className="flex-1 px-6 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-base shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>İşleniyor...</span>
                        </>
                      ) : (
                        <span>{editingRestaurant ? 'Güncelle' : 'Restoran Oluştur'}</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          !editingRestaurant &&
                          Object.values(formData).some((val) => val !== '' && val !== 'Restoran')
                        ) {
                          if (
                            !confirm('Kaydedilmemiş değişiklikler var. Çıkmak istediğinizden emin misiniz?')
                          ) {
                            return;
                          }
                        }
                        closeModalAndReset();
                      }}
                      disabled={submitting}
                      className="flex-1 px-6 py-3.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold text-base transition-all disabled:opacity-50"
                    >
                      İptal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
