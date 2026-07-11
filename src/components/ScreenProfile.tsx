/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, Wallet, ShieldCheck, Briefcase, Sparkles, Award, ArrowUpRight, Activity, Layers } from 'lucide-react';
import { UserProfile, Receipt } from '../types';

interface ScreenProfileProps {
  userProfile: UserProfile;
  completedReceipts: Receipt[];
  onNavigateToTask: (taskId: string) => void;
  onRoleSwitch: (role: 'Requester' | 'Contributor') => void;
}

export const ScreenProfile: React.FC<ScreenProfileProps> = ({
  userProfile,
  completedReceipts,
  onNavigateToTask,
  onRoleSwitch,
}) => {
  // Categorized reputation breakdown
  const categoryLevels = [
    { name: 'Builder', score: 88, level: 'Senior Integrator', color: 'border-blue-200 text-blue-700 bg-blue-50/50' },
    { name: 'Designer', score: 76, level: 'Functional Designer', color: 'border-purple-200 text-purple-700 bg-purple-50/50' },
    { name: 'Creator', score: 92, level: 'Technical Editor', color: 'border-green-200 text-green-700 bg-green-50/50' },
    { name: 'Artist', score: 40, level: 'Novice Vectorist', color: 'border-neutral-200 text-neutral-600 bg-neutral-50/50' }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Top Header Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-white text-2xl font-bold font-display shadow-sm">
              {userProfile.username.substring(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-xl text-black">
                  @{userProfile.username}
                </h2>
                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[9px] font-mono font-bold text-[#666666] tracking-wider uppercase">
                  {userProfile.role}
                </span>
              </div>
              <p className="text-xs text-[#666666] max-w-md">
                {userProfile.bio}
              </p>
              
              {/* Wallet key binding */}
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-400 pt-1.5">
                <Wallet size={12} />
                <span>Bound Keypair: {userProfile.address}</span>
              </div>
            </div>
          </div>

          {/* Quick role toggle slider inside Profile view */}
          <div className="flex flex-col items-start sm:items-end gap-2 border-t sm:border-t-0 border-neutral-100 pt-4 sm:pt-0">
            <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider font-mono">
              Toggle Perspective
            </span>
            <div className="flex items-center rounded-full bg-neutral-100 p-1 border border-neutral-200">
              <button
                onClick={() => onRoleSwitch('Contributor')}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  userProfile.role === 'Contributor'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-[#666666]'
                }`}
                id="profile-toggle-contributor"
              >
                Contributor
              </button>
              <button
                onClick={() => onRoleSwitch('Requester')}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  userProfile.role === 'Requester'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-[#666666]'
                }`}
                id="profile-toggle-requester"
              >
                Requester
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Score breakdowns */}
        <div className="space-y-6">
          
          {/* Main reputation indices */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="font-display font-semibold text-sm text-black uppercase tracking-wider mb-4 pb-3 border-b border-neutral-100">
              Reputation Quotient
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between bg-neutral-50 border border-neutral-100 rounded-xl p-4">
                <div>
                  <span className="font-mono text-[10px] text-[#666666] uppercase block">Global Score Index</span>
                  <span className="font-mono text-2xl font-extrabold text-black mt-1 block">
                    {userProfile.globalScore}
                  </span>
                </div>
                <ShieldCheck size={28} className="text-black" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-neutral-200 rounded-xl p-3">
                  <span className="font-mono text-[9px] text-[#666666] uppercase block">Contributor</span>
                  <span className="font-mono text-lg font-bold text-black mt-1 block">
                    {userProfile.contributorScore}
                  </span>
                </div>
                <div className="border border-neutral-200 rounded-xl p-3">
                  <span className="font-mono text-[9px] text-[#666666] uppercase block">Requester</span>
                  <span className="font-mono text-lg font-bold text-black mt-1 block">
                    {userProfile.requesterScore}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interests tags */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="font-display font-semibold text-sm text-black uppercase tracking-wider mb-4 pb-3 border-b border-neutral-100">
              Verified Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {userProfile.interests.map((interest) => (
                <span 
                  key={interest} 
                  className="rounded-full bg-neutral-100 border border-neutral-200 px-3 py-1 text-xs font-semibold text-black"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Columns: Category scores & Receipt timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Sub-category cards */}
          <div>
            <h3 className="font-display font-bold text-sm text-black uppercase tracking-wider mb-4">
              Reputation by Category Domain
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categoryLevels.map((cat) => (
                <div 
                  key={cat.name} 
                  className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-sm text-black">{cat.name}</h4>
                      <span className="text-[10px] text-[#666666] font-mono block mt-0.5">{cat.level}</span>
                    </div>
                    <span className="font-mono text-base font-extrabold text-black">
                      {cat.score}
                    </span>
                  </div>

                  {/* Horizontal gauge */}
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden mt-3">
                    <div 
                      style={{ width: `${cat.score}%` }}
                      className="h-full bg-black"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent signed receipts */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-6">
              <h3 className="font-display font-semibold text-sm text-black uppercase tracking-wider flex items-center gap-2">
                <Layers size={14} className="text-[#666666]" />
                Recent Settlement Receipts
              </h3>
              <span className="font-mono text-[10px] text-[#666666] font-semibold bg-neutral-100 px-2 py-0.5 rounded">
                Verified On-chain
              </span>
            </div>

            <div className="space-y-4">
              {completedReceipts.length === 0 ? (
                <p className="text-xs text-neutral-400 text-center py-6">No completed receipts found in history.</p>
              ) : (
                completedReceipts.map((receipt) => (
                  <div 
                    key={receipt.id}
                    onClick={() => onNavigateToTask(receipt.taskId)}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-neutral-100 hover:border-black p-4 bg-neutral-50/50 cursor-pointer transition-colors duration-200 group"
                  >
                    <div className="space-y-1 flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-white border border-neutral-200 px-1.5 py-0.2 font-mono text-[8px] font-bold text-[#666666]">
                          {receipt.category}
                        </span>
                        <span className="font-mono text-[9px] text-neutral-400">
                          {receipt.id}
                        </span>
                      </div>
                      <h4 className="font-semibold text-xs text-black leading-snug group-hover:underline">
                        {receipt.taskTitle}
                      </h4>
                      <p className="text-[10px] text-neutral-400">
                        Requester: {receipt.requesterName} • Completed {receipt.timestamp}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start border-t sm:border-none border-neutral-200 pt-2 sm:pt-0 mt-2 sm:mt-0 gap-1.5">
                      <span className={`rounded-full px-2 py-0.2 text-[8px] font-bold uppercase ${
                        receipt.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-100' :
                        receipt.status === 'Cancelled' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-neutral-100 text-[#666666]'
                      }`}>
                        {receipt.status}
                      </span>
                      <span className="font-mono text-xs font-bold text-black">
                        {receipt.reward} GEN • Score: {receipt.score}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
