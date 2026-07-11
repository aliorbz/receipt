import { Wallet, User, X } from 'lucide-react';
import type { AppPage, UserProfile } from '../../types';

interface NavbarProps {
  currentPage: AppPage;
  selectedTaskId: string | null;
  walletConnected: boolean;
  isProfileMenuOpen: boolean;
  userProfile: UserProfile;
  onNavigate: (page: AppPage) => void;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  onToggleProfileMenu: () => void;
  onCloseProfileMenu: () => void;
}

export function Navbar({
  currentPage,
  selectedTaskId,
  walletConnected,
  isProfileMenuOpen,
  userProfile,
  onNavigate,
  onConnectWallet,
  onDisconnectWallet,
  onToggleProfileMenu,
  onCloseProfileMenu,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-[#E5E7EB] px-4 sm:px-6 h-14 flex items-center justify-between">
      <button
        onClick={() => onNavigate('landing')}
        className="flex items-center gap-1.5 group cursor-pointer"
      >
        <span className="font-display font-bold text-[15px] sm:text-base tracking-tight text-[#111827]">
          Receipt
        </span>
        <span className="text-[9px] font-mono font-semibold text-[#4F46E5] bg-[#4F46E5]/10 px-1.5 py-0.5 rounded-full">
          v0.1
        </span>
      </button>

      <nav className="flex items-center gap-4.5 sm:gap-6 text-[13px] sm:text-xs font-semibold text-[#6B7280]">
        <button
          onClick={() => {
            if (!walletConnected) {
              onConnectWallet();
            } else {
              onNavigate('board');
            }
          }}
          className={`hover:text-[#111827] transition-colors cursor-pointer pb-0.5 ${
            currentPage === 'board' || (currentPage === 'detail' && selectedTaskId)
              ? 'text-[#111827] font-bold border-b-2 border-black'
              : ''
          }`}
        >
          Taskboard
        </button>
        <button
          onClick={() => {
            if (!walletConnected) {
              onConnectWallet();
            } else {
              onNavigate('profile');
            }
          }}
          className={`hover:text-[#111827] transition-colors cursor-pointer pb-0.5 ${
            currentPage === 'profile'
              ? 'text-[#111827] font-bold border-b-2 border-black'
              : ''
          }`}
        >
          Profile
        </button>
      </nav>

      <div className="flex items-center gap-2.5 sm:gap-4 relative">
        {!walletConnected ? (
          <button
            onClick={onConnectWallet}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 bg-black hover:bg-black/95 text-white text-[12px] sm:text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Connect Wallet</span>
            <span className="sm:hidden">Wallet</span>
          </button>
        ) : (
          <button
            onClick={onToggleProfileMenu}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-[#111827] group-hover:text-[#4F46E5] transition-colors">
                {userProfile.username}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full border border-[#E5E7EB] bg-gray-100 flex items-center justify-center font-bold text-xs text-[#4F46E5] group-hover:border-[#4F46E5] transition-colors overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </button>
        )}

        {isProfileMenuOpen && walletConnected && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-5 z-40 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] mb-3">
              <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider">Account Workspace</span>
              <button
                onClick={onCloseProfileMenu}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3 pb-4 border-b border-[#E5E7EB]">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E5E7EB] bg-gray-50 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#111827] truncate">
                  {userProfile.username}
                </p>
              </div>
            </div>

            <div className="pt-3 space-y-1">
              <button
                onClick={() => onNavigate('profile')}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-[#111827] hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-[#6B7280]" />
                Profile Workspace
              </button>
              <button
                onClick={() => {
                  onDisconnectWallet();
                  onCloseProfileMenu();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-[#EF4444] hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-[#EF4444]" />
                Disconnect Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
