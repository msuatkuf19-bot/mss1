'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api-client';

interface WaiterCallButtonProps {
  restaurantId: string;
  tableNumber?: string;
}

const CALL_TYPES = [
  { key: 'WAITER', label: 'Garson Çağır', icon: '🛎️' },
  { key: 'CHECK', label: 'Hesap İste', icon: '💳' },
  { key: 'CLEAN', label: 'Masa Temizliği', icon: '🧹' },
];

export default function WaiterCallButton({ restaurantId, tableNumber }: WaiterCallButtonProps) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [manualTable, setManualTable] = useState('');

  const activeTable = tableNumber || manualTable;

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCall = async (callType: string) => {
    if (!activeTable) {
      showToast('Lütfen masa numaranızı girin', 'error');
      return;
    }
    try {
      setSending(callType);
      await apiClient.createWaiterCall({ restaurantId, tableNumber: activeTable, callType });
      showToast('Garsonunuza bilgi verildi ✓');
      setOpen(false);
    } catch {
      showToast('Lütfen biraz bekleyip tekrar deneyin', 'error');
    } finally {
      setSending(null);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[70]"
          >
            <div className={`px-6 py-3 rounded-2xl shadow-2xl text-white text-sm font-semibold backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gradient-to-r from-red-500 to-rose-600'
            }`}>
              {toast.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[51] bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* FAB Container */}
      <div className="fixed bottom-[72px] right-4 z-[52]">
        {/* Dropdown Panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="absolute bottom-[68px] right-0 mb-2"
              style={{ width: 220 }}
            >
              <div
                className="rounded-xl overflow-hidden shadow-2xl"
                style={{
                  background: 'rgba(10, 10, 20, 0.92)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {/* Header */}
                <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {tableNumber ? (
                    <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Masa {tableNumber}</p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Masa:</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={manualTable}
                        onChange={(e) => setManualTable(e.target.value)}
                        placeholder="No"
                        className="w-16 px-2 py-1 rounded-lg text-sm font-bold text-white text-center outline-none"
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
                        autoFocus
                      />
                    </div>
                  )}
                  <p className="text-sm font-bold text-white mt-1">Ne yapmak istersiniz?</p>
                </div>

                {/* Items */}
                {CALL_TYPES.map((type, i) => (
                  <motion.button
                    key={type.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => handleCall(type.key)}
                    disabled={sending !== null}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-200 disabled:opacity-40 group"
                    style={{ borderBottom: i < CALL_TYPES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(249,115,22,0.25), rgba(236,72,153,0.25))';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span className="text-2xl flex-shrink-0">{type.icon}</span>
                    <span className="text-sm font-semibold text-white/90 group-hover:text-white">{type.label}</span>
                    {sending === type.key && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin ml-auto flex-shrink-0" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setOpen(!open)}
          className="w-[60px] h-[60px] rounded-full flex items-center justify-center text-white text-2xl relative"
          style={{
            background: 'linear-gradient(135deg, #F97316, #EC4899)',
            boxShadow: '0 8px 32px rgba(249,115,22,0.45), 0 2px 8px rgba(236,72,153,0.3)',
          }}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-bold"
              >
                ✕
              </motion.span>
            ) : (
              <motion.span
                key="bell"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                🛎️
              </motion.span>
            )}
          </AnimatePresence>

          {/* Pulse ring */}
          {!open && (
            <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-gradient-to-r from-orange-500 to-pink-500" />
          )}
        </motion.button>
      </div>
    </>
  );
}
