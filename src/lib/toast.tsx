import { useState, useCallback, createContext, useContext, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import type { Toast } from './types';

interface ToastContextValue {
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastStyles: Record<Toast['type'], { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' },
  error: { icon: AlertCircle, className: 'border-rose-500/30 bg-rose-500/10 text-rose-400' },
  info: { icon: Info, className: 'border-sky-500/30 bg-sky-500/10 text-sky-400' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-2.5">
        {toasts.map((toast) => {
          const { icon: Icon, className } = toastStyles[toast.type];
          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${className}`}
              style={{ animation: 'toast-in 0.3s ease-out' }}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium text-white whitespace-nowrap">{toast.message}</p>
              <button
                onClick={() => dismissToast(toast.id)}
                className="shrink-0 rounded p-0.5 text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
