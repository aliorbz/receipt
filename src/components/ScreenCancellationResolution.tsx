/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, CheckCircle2, ShieldAlert, Award, FileText, Calendar, GitFork, X } from 'lucide-react';
import { Task } from '../types';

interface ScreenCancellationResolutionProps {
  task: Task;
  onConfirmCancellation: (taskId: string) => void;
  onNavigateBack: () => void;
}

export const ScreenCancellationResolution: React.FC<ScreenCancellationResolutionProps> = ({
  task,
  onConfirmCancellation,
  onNavigateBack,
}) => {
  // Simulated timeline items
  const timelineEvents = [
    {
      title: 'Task Collateral Escrowed',
      description: `Bounty of ${task.reward} GEN locked on GenLayer smart contract.`,
      date: 'June 18, 2026',
      status: 'success'
    },
    {
      title: 'Deliverables Dispatched',
      description: 'First draft submitted by SatoshiN.',
      date: 'June 20, 2026',
      status: 'success'
    },
    {
      title: 'Consensus Quality Deficit',
      description: 'AI Evaluation score of 35/100 did not satisfy criteria thresholds.',
      date: 'June 21, 2026',
      status: 'warning'
    },
    {
      title: 'Dispute Arbitration Triggered',
      description: 'Contract entered Dispute Phase because revision limit expired.',
      date: 'June 22, 2026',
      status: 'info'
    },
    {
      title: 'GenNode Consensus Verdict',
      description: 'Nodes ruled for a split settlement based on partial code completeness.',
      date: 'June 23, 2026',
      status: 'neutral'
    }
  ];

  // Simulated Split calculation
  const contributorSharePct = 30;
  const requesterSharePct = 70;
  const contributorPayout = (task.reward * (contributorSharePct / 100)).toFixed(2);
  const requesterRefund = (task.reward * (requesterSharePct / 100)).toFixed(2);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Back button */}
      <button
        onClick={onNavigateBack}
        className="mb-6 flex items-center gap-1.5 text-xs font-semibold text-[#666666] hover:text-black transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </button>

      <div className="mb-8">
        <span className="rounded bg-red-50 border border-red-100 px-2 py-0.5 font-mono text-[9px] font-bold text-red-700 uppercase">
          DISPUTE SETTLEMENT STATUS
        </span>
        <h1 className="font-display text-2xl font-bold text-black tracking-tight mt-1">
          Arbitration Resolution: {task.title}
        </h1>
        <p className="text-xs text-[#666666] mt-1">
          Review the binding GenLayer node split consensus for this disputed contract.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Timeline (Left Panel) */}
        <div className="lg:col-span-7 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="font-display font-semibold text-sm text-black mb-6 uppercase tracking-wider pb-3 border-b border-neutral-100">
            Dispute Audit Log
          </h3>

          <div className="relative border-l border-neutral-200 pl-6 ml-2 space-y-6">
            {timelineEvents.map((event, index) => (
              <div key={index} className="relative">
                {/* Timeline Dot */}
                <span className={`absolute -left-[31px] top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border bg-white ${
                  event.status === 'success' ? 'border-green-600 text-green-600' :
                  event.status === 'warning' ? 'border-amber-600 text-amber-600' :
                  event.status === 'info' ? 'border-blue-600 text-blue-600' : 'border-black text-black'
                }`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                </span>

                {/* Event text */}
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-black">{event.title}</h4>
                    <span className="font-mono text-[9px] text-neutral-400">{event.date}</span>
                  </div>
                  <p className="text-[11px] text-[#666666] mt-1 leading-normal">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verdict Details (Right Panel) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Split result card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="font-display font-semibold text-sm text-black mb-4 pb-3 border-b border-neutral-100 uppercase tracking-wider">
              Binding Verdict Split
            </h3>

            {/* Split visuals */}
            <div className="flex h-5 w-full overflow-hidden rounded-full bg-neutral-100 mb-6">
              <div 
                style={{ width: `${contributorSharePct}%` }}
                className="bg-black flex items-center justify-center text-[9px] font-bold text-white font-mono"
              >
                {contributorSharePct}%
              </div>
              <div 
                style={{ width: `${requesterSharePct}%` }}
                className="bg-neutral-300 flex items-center justify-center text-[9px] font-bold text-neutral-800 font-mono"
              >
                {requesterSharePct}%
              </div>
            </div>

            {/* Values breakdown */}
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-black">Contributor Payout</span>
                  <span className="text-[10px] text-[#666666] block">Partial delivery compensation</span>
                </div>
                <span className="font-mono font-bold text-black text-sm">
                  {contributorPayout} GEN
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-black">Requester Refund</span>
                  <span className="text-[10px] text-[#666666] block">Escrow refund balance</span>
                </div>
                <span className="font-mono font-bold text-black text-sm">
                  {requesterRefund} GEN
                </span>
              </div>

              {/* Score adjustments */}
              <div className="border-t border-neutral-100 pt-4 space-y-2">
                <span className="block text-[9px] font-bold text-[#666666] uppercase tracking-wider font-mono">
                  Wallet Reputation Impact
                </span>

                <div className="flex justify-between items-center">
                  <span className="text-[#666666]">Contributor Score Adjustment:</span>
                  <span className="font-mono font-bold text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.2 rounded text-[10px]">
                    -5 Points
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#666666]">Requester Score Adjustment:</span>
                  <span className="font-mono font-bold text-[#666666] bg-neutral-100 px-1.5 py-0.2 rounded text-[10px]">
                    0 Points (Neutral)
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm Settlement Button */}
            <div className="mt-8">
              {task.status !== 'Cancelled' ? (
                <button
                  onClick={() => onConfirmCancellation(task.id)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors shadow-sm"
                  id="dispute-btn-accept"
                >
                  <CheckCircle2 size={14} />
                  Accept Split Settlement
                </button>
              ) : (
                <div className="w-full text-center py-2.5 rounded-xl bg-neutral-100 text-[#666666] font-semibold text-xs border border-neutral-200">
                  Split Settlement Executed
                </div>
              )}
            </div>

            <p className="text-[10px] text-neutral-400 text-center mt-3 leading-relaxed">
              Accepting split settlements claims your ratio immediately, logs the resolution receipt, and terminates the active contract.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
