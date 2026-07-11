import type { ToastState } from '../../types';

interface ToastProps {
  toast: ToastState | null;
}

export function Toast({ toast }: ToastProps) {
  if (!toast) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-sm max-w-md ${
        toast.type === 'success' ? 'bg-white border-[#E5E7EB] text-[#22C55E]' :
        toast.type === 'warning' ? 'bg-white border-[#E5E7EB] text-[#EF4444]' :
        'bg-white border-[#E5E7EB] text-[#4F46E5]'
      }`}>
        <span className={`w-2 h-2 rounded-full ${
          toast.type === 'success' ? 'bg-[#22C55E]' :
          toast.type === 'warning' ? 'bg-[#EF4444]' :
          'bg-[#4F46E5]'
        }`} />
        <p className="text-sm font-medium text-[#111827]">{toast.text}</p>
      </div>
    </div>
  );
}
