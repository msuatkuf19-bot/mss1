'use client';

import { useState } from 'react';

interface StatusToggleProps {
  enabled: boolean;
  loading?: boolean;
  onToggle: (value: boolean) => void;
  label: string;
  activeColor?: string;
}

export default function StatusToggle({
  enabled,
  loading = false,
  onToggle,
  label,
  activeColor = 'bg-emerald-500',
}: StatusToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        disabled={loading}
        onClick={() => onToggle(!enabled)}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${enabled ? activeColor : 'bg-gray-300'}
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
            transition duration-200 ease-in-out
            ${enabled ? 'translate-x-5' : 'translate-x-0'}
          `}
        >
          {loading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
            </span>
          )}
        </span>
      </button>
      <span className="text-xs font-medium text-slate-600 whitespace-nowrap">{label}</span>
    </div>
  );
}
