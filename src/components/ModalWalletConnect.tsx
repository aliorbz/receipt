/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Shield, ArrowRight, User, Hash, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface ModalWalletConnectProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnected: (profile: UserProfile) => void;
}

export const ModalWalletConnect: React.FC<ModalWalletConnectProps> = ({
  isOpen,
  onClose,
  onWalletConnected,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  if (!isOpen) return null;

  const walletOptions = [
    {
      id: 'gennode',
      name: 'GenLayer Node Auth',
      description: 'Sign via secure local consensus keypair',
      icon: '⚡',
      popular: true,
    },
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Connect to your MetaMask web browser extension',
      icon: '🦊',
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      description: 'Scan QR code with your mobile wallet app',
      icon: '🔗',
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      description: 'Connect using Coinbase secure cloud keys',
      icon: '🛡️',
    }
  ];

  const interestOptions = ['Builder', 'Creator', 'Designer', 'Artist', 'Researcher', 'Reviewer'];

  const handleWalletSelect = (walletId: string) => {
    setSelectedWallet(walletId);
    // Transition to step 2: Profile creation
    setStep(2);
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    // Generate a simulated secure wallet address
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase();
    const mockAddress = `0x${randomHex.padStart(6, '0')}...77E1`;

    onWalletConnected({
      connected: true,
      address: mockAddress,
      username: username.trim(),
      bio: bio.trim() || 'Active GenLayer contributor building verified reputation.',
      interests: selectedInterests.length > 0 ? selectedInterests : ['Builder'],
      globalScore: 85, // Standard starting score for verified wallet accounts
      requesterScore: 80,
      contributorScore: 85,
      role: 'Contributor', // Defaults to contributor view
    });
    
    // Reset state
    setStep(1);
    setSelectedWallet(null);
    setUsername('');
    setBio('');
    setSelectedInterests([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div>
            <h3 className="font-display font-semibold text-lg text-black">
              {step === 1 ? 'Connect Wallet' : 'Setup Profile'}
            </h3>
            <p className="text-xs text-[#666666] mt-0.5">
              {step === 1 ? 'Select a provider to access GenLayer' : 'Create your reputation identity'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-black transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Step 1: Wallet Options */}
        {step === 1 && (
          <div className="p-6">
            <div className="space-y-3">
              {walletOptions.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletSelect(wallet.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 text-left transition-all duration-200 hover:border-black hover:bg-neutral-50 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{wallet.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-black">{wallet.name}</span>
                        {wallet.popular && (
                          <span className="rounded bg-black px-1.5 py-0.5 text-[8px] font-bold text-white uppercase tracking-wider">
                            Fastest
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#666666] mt-0.5">{wallet.description}</p>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-neutral-400 group-hover:text-black transition-colors group-hover:translate-x-1 duration-200" />
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-neutral-50 px-3 py-2.5 border border-neutral-100">
              <Shield size={12} className="text-[#666666]" />
              <span className="font-mono text-[10px] text-[#666666]">
                Reputation scores are cryptographically locked to keys.
              </span>
            </div>
          </div>
        )}

        {/* Step 2: Create Profile Flow */}
        {step === 2 && (
          <form onSubmit={handleProfileSubmit} className="p-6 space-y-5">
            
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-black uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#666666] font-mono text-sm">
                  @
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                  placeholder="satoshi_layer"
                  className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-8 pr-4 text-sm text-black placeholder-neutral-400 focus:border-black focus:outline-none transition-colors"
                />
              </div>
              <p className="text-[10px] text-[#666666]">
                Only alphanumeric and underscores allowed.
              </p>
            </div>

            {/* Bio Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-black uppercase tracking-wider">
                Short Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What type of intelligence tasks are you here to solve?"
                rows={3}
                className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm text-black placeholder-neutral-400 focus:border-black focus:outline-none resize-none transition-colors"
              />
            </div>

            {/* Selection of Interests */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-black uppercase tracking-wider">
                Select Core Interests
              </label>
              <div className="flex flex-wrap gap-1.5">
                {interestOptions.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ${
                        isSelected
                          ? 'border-black bg-black text-white'
                          : 'border-neutral-200 bg-white text-[#666666] hover:border-black hover:text-black'
                      }`}
                    >
                      {isSelected && <Check size={10} />}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!username.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-40 transition-colors"
            >
              Continue and Verify
              <ArrowRight size={14} />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
