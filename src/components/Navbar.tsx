/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Wallet, Sparkles, User, Briefcase, Menu } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  userProfile: UserProfile | null;
  onConnectWalletClick: () => void;
  onNavigate: (screen: string) => void;
  currentScreen: string;
  onRoleSwitch: (role: 'Requester' | 'Contributor') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userProfile,
  onConnectWalletClick,
  onNavigate,
  currentScreen,
  onRoleSwitch,
}) => {
  const getTabClass = (screens: string[]) => {
    const isActive = screens.includes(currentScreen);
    return `relative py-5 px-1 font-medium text-sm transition-colors duration-200 cursor-pointer ${
      isActive
        ? 'text-black border-b-2 border-black font-semibold'
        : 'text-[#666666] hover:text-black'
    }`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo & Tag */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => onNavigate('landing')} 
            className="group flex cursor-pointer items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-black text-white font-display font-bold tracking-tight text-lg shadow-sm transition-transform duration-300 group-hover:scale-105">
              R
            </div>
            <span className="font-display font-bold tracking-widest text-xl text-black">
              RECEIPT
            </span>
            <span className="hidden rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-[9px] font-medium text-[#666666] tracking-wider md:inline-block">
              GENLAYER v0.1
            </span>
          </div>

          {/* Desktop Nav Tabs */}
          {userProfile?.connected && (
            <nav className="hidden md:flex items-center gap-6 ml-6 h-16">
              <button 
                onClick={() => onNavigate('home-feed')} 
                className={getTabClass(['home-feed', 'task-detail'])}
                id="nav-btn-tasks"
              >
                Tasks
              </button>
              <button 
                onClick={() => onNavigate('active-work')} 
                className={getTabClass(['active-work', 'submission', 'evaluation-result', 'revision-request', 'cancellation-resolution'])}
                id="nav-btn-work"
              >
                My Work
              </button>
              <button 
                onClick={() => onNavigate('profile')} 
                className={getTabClass(['profile'])}
                id="nav-btn-profile"
              >
                Profile
              </button>
            </nav>
          )}
        </div>

        {/* Right: Wallet, Profile & Role Switcher */}
        <div className="flex items-center gap-4">
          {userProfile?.connected ? (
            <div className="flex items-center gap-3">
              
              {/* Role Switcher Sliding Pill */}
              <div className="hidden lg:flex items-center rounded-full bg-neutral-100 p-1 border border-neutral-200">
                <button
                  onClick={() => onRoleSwitch('Contributor')}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ${
                    userProfile.role === 'Contributor'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-[#666666] hover:text-black'
                  }`}
                  id="role-switch-contributor"
                >
                  <Briefcase size={12} />
                  Contributor
                </button>
                <button
                  onClick={() => onRoleSwitch('Requester')}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ${
                    userProfile.role === 'Requester'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-[#666666] hover:text-black'
                  }`}
                  id="role-switch-requester"
                >
                  <Sparkles size={12} />
                  Requester
                </button>
              </div>

              {/* Connected Wallet Info */}
              <div 
                onClick={() => onNavigate('profile')}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-2 pr-3.5 hover:border-black transition-colors duration-200"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <User size={12} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-mono text-[10px] font-bold text-black leading-none">
                    {userProfile.address}
                  </span>
                  <span className="text-[9px] font-medium text-[#666666] leading-none mt-0.5">
                    {userProfile.role} • {userProfile.globalScore} Score
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={onConnectWalletClick}
              className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-all duration-200 shadow-sm"
              id="btn-connect-wallet-nav"
            >
              <Wallet size={14} />
              Connect Wallet
            </button>
          )}

          {/* Mobile indicator when connected and screen small */}
          {userProfile?.connected && (
            <button 
              onClick={() => onNavigate('profile')}
              className="block md:hidden text-[#666666] hover:text-black p-1"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
