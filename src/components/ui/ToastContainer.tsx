import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}));

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className="bg-surface border border-white/10 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-full fade-in duration-300 min-w-[300px]"
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
          <span className="text-sm flex-1">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="text-white/40 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
