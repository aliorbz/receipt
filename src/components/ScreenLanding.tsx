/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Search, ShieldAlert, Sparkles, ShieldCheck, CheckCircle, ChevronRight, Activity } from 'lucide-react';
import { Receipt } from '../types';

interface ScreenLandingProps {
  recentReceipts: Receipt[];
  onBrowseTasksClick: () => void;
  onCreateTaskClick: () => void;
  onConnectWalletClick: () => void;
  walletConnected: boolean;
}

export const ScreenLanding: React.FC<ScreenLandingProps> = ({
  recentReceipts,
  onBrowseTasksClick,
  onCreateTaskClick,
  onConnectWalletClick,
  walletConnected,
}) => {
  return (
    <div className="flex flex-col bg-[#FAFAFA] min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Accent Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-black shadow-sm mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 pulse-ripple" />
            <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
              GENLAYER AI REPUTATION CONSENSUS IS ACTIVE
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-black max-w-4xl mx-auto leading-[1.1] mb-6">
            Build Reputation Through <span className="underline decoration-2 underline-offset-4 decoration-neutral-300">Verified Work</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-[#666666] max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Complete high-intelligence tasks. Receive unbiased machine-consensus evaluation. Lock verified credentials directly onto your wallet history.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={walletConnected ? onBrowseTasksClick : onConnectWalletClick}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 font-semibold text-white hover:bg-neutral-800 transition-all duration-200 shadow-sm group"
              id="landing-btn-browse"
            >
              Browse Tasks
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={walletConnected ? onCreateTaskClick : onConnectWalletClick}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3.5 font-semibold text-black hover:border-black hover:bg-neutral-50 transition-all duration-200"
              id="landing-btn-create"
            >
              Create Task
            </button>
          </div>

          {/* System Metrics */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-3xl mx-auto border-t border-neutral-200 pt-10">
            <div>
              <p className="font-display text-2xl font-bold text-black">100%</p>
              <p className="font-mono text-[10px] text-[#666666] uppercase mt-1">AI Evaluated</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-black">4,209</p>
              <p className="font-mono text-[10px] text-[#666666] uppercase mt-1">Receipts Signed</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-black">94.8%</p>
              <p className="font-mono text-[10px] text-[#666666] uppercase mt-1">Avg Resolution</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-black">0%</p>
              <p className="font-mono text-[10px] text-[#666666] uppercase mt-1">Human Bias</p>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white border-y border-neutral-200 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-black">
              An Immutable Ledger of Verified Competence
            </h2>
            <p className="text-sm text-[#666666] mt-3">
              How the GenLayer consensus network guarantees fair evaluations for digital commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
            
            {/* Step 1 */}
            <div className="flex flex-col rounded-2xl border border-neutral-200 p-6 bg-[#FAFAFA]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white font-mono text-sm font-semibold mb-4">
                01
              </div>
              <h3 className="font-semibold text-sm text-black mb-1.5">Publish</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Requesters define criteria, upload templates, lock the GEN bounty, and post the task.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col rounded-2xl border border-neutral-200 p-6 bg-[#FAFAFA]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white font-mono text-sm font-semibold mb-4">
                02
              </div>
              <h3 className="font-semibold text-sm text-black mb-1.5">Accept</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Contributors claim open tasks that match their verified skills. No interview friction.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col rounded-2xl border border-neutral-200 p-6 bg-[#FAFAFA]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white font-mono text-sm font-semibold mb-4">
                03
              </div>
              <h3 className="font-semibold text-sm text-black mb-1.5">Submit</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Deliver materials, code repositories, or documents before the hard block deadline expires.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col rounded-2xl border border-neutral-200 p-6 bg-[#FAFAFA]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white font-mono text-sm font-semibold mb-4">
                04
              </div>
              <h3 className="font-semibold text-sm text-black mb-1.5">Evaluate</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                GenLayer AI consensus audits deliverables objectively against task specs inside a sandbox.
              </p>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col rounded-2xl border border-neutral-200 p-6 bg-[#FAFAFA]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white font-mono text-sm font-semibold mb-4">
                05
              </div>
              <h3 className="font-semibold text-sm text-black mb-1.5">Earn Reputation</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Settle funds, receive cryptographically-signed ratings, and grow your global category score.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Recent Receipts Section */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity size={14} className="text-[#666666]" />
                <span className="font-mono text-[10px] text-[#666666] uppercase tracking-wider font-semibold">
                  Live Network Activity
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-black">
                Recent Signed Receipts
              </h2>
            </div>
            <button
              onClick={walletConnected ? onBrowseTasksClick : onConnectWalletClick}
              className="group hidden sm:flex items-center gap-1 text-xs font-semibold text-black hover:underline"
            >
              Discover all tasks
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Simple Activity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentReceipts.slice(0, 3).map((receipt) => (
              <div 
                key={receipt.id}
                className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div>
                  {/* Top line info */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 font-mono text-[9px] font-bold text-[#666666]">
                      {receipt.category.toUpperCase()}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-400">
                      {receipt.id}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm text-black line-clamp-1 mb-2">
                    {receipt.taskTitle}
                  </h3>

                  <div className="space-y-1.5 text-xs text-[#666666] mb-6">
                    <div className="flex justify-between">
                      <span>Requester:</span>
                      <span className="font-medium text-black">{receipt.requesterName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contributor:</span>
                      <span className="font-medium text-black">{receipt.contributorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span className="font-mono text-[11px] text-neutral-400">{receipt.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Score and Payout */}
                <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                  <div>
                    <span className="block text-[9px] text-[#666666] uppercase font-mono tracking-wider">
                      GenLayer Score
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-base font-bold text-black">{receipt.score}</span>
                      <span className="text-[10px] text-neutral-400">/ 100</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-[9px] text-[#666666] uppercase font-mono tracking-wider">
                      Settled Reward
                    </span>
                    <span className="font-mono text-base font-bold text-black mt-0.5 block">
                      +{receipt.reward} GEN
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          <button
            onClick={walletConnected ? onBrowseTasksClick : onConnectWalletClick}
            className="flex sm:hidden items-center justify-center gap-2 mt-8 w-full rounded-xl border border-neutral-300 bg-white py-3.5 text-sm font-semibold text-black"
          >
            Discover All Tasks
            <ChevronRight size={14} />
          </button>

        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-auto border-t border-neutral-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-black text-white font-display font-bold text-xs">
              R
            </div>
            <span className="font-display font-bold tracking-widest text-sm text-black">
              RECEIPT
            </span>
          </div>

          <p className="text-xs text-neutral-400 text-center md:text-right">
            &copy; 2026 RECEIPT Labs. Powered by GenLayer Consensus Engine. All evaluations are decentralized.
          </p>

          <div className="flex items-center gap-6 text-xs text-[#666666]">
            <a href="#" className="hover:text-black">Whitepaper</a>
            <a href="#" className="hover:text-black">GenNode Docs</a>
            <a href="#" className="hover:text-black">System Status</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
