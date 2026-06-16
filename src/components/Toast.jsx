import { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function Toast({
  message,
  type = 'success', // 'success', 'error', 'warning', 'info'
  onClose,
  duration = 4000,
}) {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const configs = {
    success: {
      bg: 'bg-porcelain-50',
      border: 'border-[#011c32]',
      text: 'text-ink-black-900',
      icon: <CheckCircle className="w-5 h-5 text-porcelain-700 shrink-0" />,
      accent: 'bg-porcelain-500',
    },
    error: {
      bg: 'bg-punch-red-50',
      border: 'border-[#011c32]',
      text: 'text-ink-black-900',
      icon: <AlertTriangle className="w-5 h-5 text-punch-red-500 shrink-0" />,
      accent: 'bg-punch-red-500',
    },
    warning: {
      bg: 'bg-amber-glow-50',
      border: 'border-[#011c32]',
      text: 'text-ink-black-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-glow-600 shrink-0" />,
      accent: 'bg-amber-glow-500',
    },
    info: {
      bg: 'bg-ink-black-50',
      border: 'border-[#011c32]',
      text: 'text-ink-black-900',
      icon: <Info className="w-5 h-5 text-ink-black-600 shrink-0" />,
      accent: 'bg-ink-black-500',
    },
  };

  const config = configs[type] || configs.success;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-stretch neobrutal-border neobrutal-shadow rounded-[4px] overflow-hidden max-w-sm w-full animate-[slideIn_0.2s_ease-out] ${config.bg}`}>
      {/* Left accent color bar */}
      <div className={`w-3 ${config.accent} border-r-2 border-ink-black-900`} />
      
      <div className="flex-1 p-4 flex items-start gap-3">
        {config.icon}
        <div className="flex-1">
          <p className="font-bold text-sm leading-tight tracking-wide uppercase">
            {type === 'error' ? 'Peringatan!' : type === 'success' ? 'Berhasil!' : 'Info'}
          </p>
          <p className="text-sm font-medium mt-1 leading-snug text-ink-black-800">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-ink-black-100 transition-colors border border-transparent hover:border-ink-black-900 cursor-pointer"
        >
          <X className="w-4 h-4 text-ink-black-900" />
        </button>
      </div>
    </div>
  );
}
