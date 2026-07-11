import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  loadingAction: string | null;
  validationStep: number;
}

export function LoadingOverlay({ loadingAction, validationStep }: LoadingOverlayProps) {
  if (!loadingAction) return null;

  return (
    <div className="fixed inset-0 bg-[#FAFAFA]/95 backdrop-blur-xs z-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-xs text-center space-y-6">
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
        </div>

        <div className="space-y-2">
          <h3 className="text-md font-semibold text-[#111827]">{loadingAction}</h3>
          <p className="text-xs text-[#6B7280]">GenLayer Decentralized Consensus Network v0.1</p>
        </div>

        {validationStep > 0 && (
          <div className="border-t border-[#E5E7EB] pt-4 space-y-3 text-left">
            <div className="flex items-center gap-3 text-xs">
              <span className={`w-2 h-2 rounded-full ${validationStep >= 1 ? 'bg-[#22C55E]' : 'bg-gray-200'}`} />
              <span className={validationStep >= 1 ? 'text-[#111827] font-medium' : 'text-gray-400'}>
                Broadcasting submission parameters to Consensus Group
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className={`w-2 h-2 rounded-full ${validationStep >= 2 ? 'bg-[#22C55E]' : 'bg-gray-200'}`} />
              <span className={validationStep >= 2 ? 'text-[#111827] font-medium' : 'text-gray-400'}>
                Running decentralized verification on LLM-powered GenNodes
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className={`w-2 h-2 rounded-full ${validationStep >= 3 ? 'bg-[#22C55E]' : 'bg-gray-200'}`} />
              <span className={validationStep >= 3 ? 'text-[#111827] font-medium' : 'text-gray-400'}>
                Escrow state verified & cryptographically pinned
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
