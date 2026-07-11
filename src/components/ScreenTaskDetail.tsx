/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Play, Calendar, DollarSign, Award, ShieldAlert, CheckCircle2, User, Lock, Sparkles } from 'lucide-react';
import { Task } from '../types';

interface ScreenTaskDetailProps {
  task: Task;
  onAcceptTask: (taskId: string) => void;
  onNavigateBack: () => void;
  onNavigateToActiveWork: () => void;
}

export const ScreenTaskDetail: React.FC<ScreenTaskDetailProps> = ({
  task,
  onAcceptTask,
  onNavigateBack,
  onNavigateToActiveWork,
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Back button */}
      <button
        onClick={onNavigateBack}
        className="mb-6 flex items-center gap-1.5 text-xs font-semibold text-[#666666] hover:text-black transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Task Discovery
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left main panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
            
            {/* Metadata Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="rounded bg-neutral-100 px-2.5 py-0.5 font-mono text-[9px] font-bold text-[#666666]">
                {task.category.toUpperCase()}
              </span>
              <span className={`rounded px-2.5 py-0.5 font-mono text-[9px] font-bold ${
                task.difficulty === 'Expert' ? 'bg-red-50 text-red-700' :
                task.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
              }`}>
                {task.difficulty}
              </span>
              <span className="text-neutral-300 font-mono text-xs">•</span>
              <span className="font-mono text-xs text-[#666666]">
                ID: {task.id}
              </span>
            </div>

            {/* Task Title */}
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-black tracking-tight leading-snug mb-6">
              {task.title}
            </h1>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider">
                Objective Specification
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed whitespace-pre-line">
                {task.description}
              </p>
            </div>

            {/* Deliverables checklist */}
            <div className="space-y-3 pt-6 border-t border-neutral-100 mt-6">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider">
                Required Deliverables Checklist
              </h3>
              
              <div className="space-y-2">
                {task.deliverables.map((deliverable, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3"
                  >
                    <CheckCircle2 size={16} className="text-[#666666] mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-[#666666] leading-relaxed">
                      {deliverable}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-neutral-100 mt-6">
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-[#666666] uppercase tracking-wider font-mono">
                  Deadline Milestone
                </span>
                <span className="font-mono text-xs text-black font-semibold flex items-center gap-1.5">
                  <Calendar size={12} />
                  {task.deadline} (Strict Block Resolution)
                </span>
              </div>

              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-[#666666] uppercase tracking-wider font-mono">
                  Revision Allotment
                </span>
                <span className="font-mono text-xs text-black font-semibold">
                  Up to {task.revisionLimit} feedback adjustment cycles
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Right side details / status card */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Action & Reward Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            
            {/* Reward lock state */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
              <div>
                <span className="block text-[9px] font-bold text-[#666666] uppercase tracking-wider font-mono">
                  Escrowed Reward
                </span>
                <span className="font-mono text-2xl font-extrabold text-black block mt-0.5">
                  {task.reward} GEN
                </span>
              </div>
              <div className="flex items-center gap-1 text-green-700 bg-green-50 border border-green-100 rounded-full px-2.5 py-1 text-[10px] font-semibold">
                <Lock size={10} />
                LOCKED
              </div>
            </div>

            {/* Context details */}
            <div className="space-y-4 text-xs text-[#666666] mb-6">
              <div className="flex justify-between">
                <span>Requester:</span>
                <div className="text-right">
                  <span className="font-semibold text-black block">{task.requesterName}</span>
                  <span className="font-mono text-[10px] text-neutral-400 block mt-0.5">{task.requesterAddress}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <span>Requester Reputation:</span>
                <span className="font-mono text-black font-semibold">{task.requesterScore} / 100</span>
              </div>

              <div className="flex justify-between">
                <span>AI Target Compatibility:</span>
                <span className="font-mono text-black font-semibold">{task.taskQuality}%</span>
              </div>
            </div>

            {/* Action CTAs */}
            {task.status === 'Open' ? (
              <button
                onClick={() => onAcceptTask(task.id)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-sm font-bold text-white hover:bg-neutral-800 transition-colors shadow-sm"
                id="task-detail-btn-accept"
              >
                <Play size={12} className="fill-current" />
                Accept Commitment
              </button>
            ) : task.status === 'Active' ? (
              <div className="space-y-3">
                <span className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 py-3.5 text-sm font-bold text-[#666666]">
                  Active Commitment
                </span>
                <button
                  onClick={onNavigateToActiveWork}
                  className="w-full text-center text-xs font-semibold text-black hover:underline"
                >
                  Go to Active Dashboard
                </button>
              </div>
            ) : (
              <span className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-100 py-3.5 text-sm font-bold text-[#666666]">
                Status: {task.status}
              </span>
            )}

            {/* Escrow Disclaimer */}
            <p className="text-[10px] text-[#666666] mt-4 text-center leading-relaxed">
              Accepting this commitment registers your wallet keys as the sole contributor. Completing the deliverables allows consensus payout.
            </p>
          </div>

          {/* Consensus Nodes validation box */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-black uppercase tracking-wider">
              <Sparkles size={12} className="text-black" />
              Contract Verification Agent
            </div>
            <p className="text-[11px] text-[#666666] leading-relaxed">
              When work is submitted, 5 randomized GenNodes are scheduled for parallel parsing of your checklist deliverables. This guarantees 100% mathematical integrity.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
