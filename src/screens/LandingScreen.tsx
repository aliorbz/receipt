import { ChevronRight } from 'lucide-react';

interface LandingScreenProps {
  walletConnected: boolean;
  isConnecting: boolean;
  onConnectWallet: () => void;
  onExploreTasks: () => void;
}

export function LandingScreen({ walletConnected, isConnecting, onConnectWallet, onExploreTasks }: LandingScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-xl w-full text-center space-y-10 animate-fade-in">
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-2xl tracking-tight text-[#111827]">
              Receipt
            </span>
            <span className="text-xs font-mono font-semibold text-[#4F46E5] bg-[#4F46E5]/10 px-2.5 py-0.5 rounded-full">
              GenLayer Beta
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#111827] tracking-tight leading-none">
            Complete tasks.<br />
            Build a trusted work history.
          </h1>
          <p className="text-sm sm:text-base text-[#6B7280] max-w-lg mx-auto leading-relaxed">
            Publish tasks, complete work, receive AI-assisted verification, and build your reputation on GenLayer.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={walletConnected ? onExploreTasks : onConnectWallet}
            disabled={isConnecting}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black hover:bg-black/90 text-white font-semibold rounded-xl text-xs tracking-wide uppercase transition-all shadow-md active:scale-98 cursor-pointer"
          >
            {walletConnected ? 'Explore Taskboard' : isConnecting ? 'Connecting...' : 'Get Started'}
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
