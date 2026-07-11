/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, ShieldAlert, RotateCcw, AlertTriangle, FileText, Check, Award } from 'lucide-react';
import { Task, Submission } from '../types';

interface ScreenEvaluationResultProps {
  task: Task;
  submission: Submission | null;
  role: 'Requester' | 'Contributor';
  onAcceptEvaluation: (taskId: string) => void;
  onNavigateToRevision: (task: Task) => void;
  onNavigateToCancellation: (task: Task) => void;
  onNavigateBack: () => void;
}

export const ScreenEvaluationResult: React.FC<ScreenEvaluationResultProps> = ({
  task,
  submission,
  role,
  onAcceptEvaluation,
  onNavigateToRevision,
  onNavigateToCancellation,
  onNavigateBack,
}) => {
  // Use realistic values if submission is null
  const workUrl = submission?.workUrl || 'https://github.com/satoshilayer/genlayer-wrapper-repo';
  const notes = submission?.notes || 'Implemented deterministic LLM smart contract wrapper with prompt scanner, fallback prompts, and fallback node selection. Verified output correctness locally on simulated GenNode.';
  const aiScore = submission?.aiScore || 92;
  const aiConfidence = submission?.aiConfidence || 96;
  const missingItems = submission?.missingItems || [
    'JSON Schema verification unit tests can be expanded with 2 more edge cases',
    'Improve code commenting in the node fallback trigger'
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 border-green-200 bg-green-50/50';
    if (score >= 70) return 'text-amber-600 border-amber-200 bg-amber-50/50';
    return 'text-red-600 border-red-200 bg-red-50/50';
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center">
      
      {/* Back to Work */}
      <button
        onClick={onNavigateBack}
        className="self-start mb-8 flex items-center gap-1.5 text-xs font-semibold text-[#666666] hover:text-black transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </button>

      {/* Main Card */}
      <div className="w-full rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10 shadow-sm text-center max-w-2xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 inset-x-0 h-1 bg-black" />

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[10px] font-mono font-bold text-black uppercase mb-6">
          <Sparkles size={11} className="text-black" />
          GenLayer consensus result
        </div>

        {/* Large Score */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-black bg-[#FAFAFA] shadow-sm">
            <span className="font-display text-5xl font-extrabold text-black">
              {aiScore}
            </span>
            <span className="absolute bottom-2 font-mono text-[10px] font-bold text-[#666666]">
              / 100
            </span>
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#666666] font-mono mt-4 block">
            Requirement Match Index
          </span>
          <span className="text-sm font-semibold text-black mt-1">
            {aiScore >= 90 ? 'High-Integrity Deliverable' : aiScore >= 70 ? 'Satisfactory Deliverable' : 'Substandard Deliverable'}
          </span>
        </div>

        {/* Horizontal metrics card */}
        <div className="grid grid-cols-3 gap-4 border border-neutral-100 bg-[#FAFAFA] rounded-xl p-4 mb-8">
          <div>
            <span className="block text-[9px] font-bold text-[#666666] uppercase tracking-wider font-mono">
              Confidence
            </span>
            <span className="font-mono text-base font-bold text-black block mt-0.5">
              {aiConfidence}%
            </span>
          </div>

          <div className="border-x border-neutral-200">
            <span className="block text-[9px] font-bold text-[#666666] uppercase tracking-wider font-mono">
              Bounty locked
            </span>
            <span className="font-mono text-base font-bold text-black block mt-0.5">
              {task.reward} GEN
            </span>
          </div>

          <div>
            <span className="block text-[9px] font-bold text-[#666666] uppercase tracking-wider font-mono">
              Revisions Used
            </span>
            <span className="font-mono text-base font-bold text-black block mt-0.5">
              {task.revisionCount} / {task.revisionLimit}
            </span>
          </div>
        </div>

        {/* Evaluation criteria details */}
        <div className="text-left space-y-6 mb-8">
          
          {/* Submission Details */}
          <div className="border-b border-neutral-100 pb-5">
            <h4 className="text-xs font-bold text-black uppercase tracking-wider font-mono mb-2">
              Deliverable References
            </h4>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 select-all">
              <FileText size={12} className="text-blue-600" />
              <a href={workUrl} target="_blank" rel="noreferrer" className="hover:underline flex-1 truncate">
                {workUrl}
              </a>
            </div>
            <p className="text-[11px] text-[#666666] mt-2 leading-relaxed">
              <strong>Contributor Notes:</strong> {notes}
            </p>
          </div>

          {/* Missing/Actionable Items */}
          <div>
            <h4 className="text-xs font-bold text-black uppercase tracking-wider font-mono mb-3">
              Actionable AI Feedback Insights
            </h4>
            <div className="space-y-2">
              {missingItems.map((item, idx) => (
                <div key={idx} className="flex gap-2.5 items-start text-xs text-[#666666]">
                  <span className="text-amber-500 font-mono font-bold mt-0.5">⚠️</span>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Actions based on Roles */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-neutral-100">
          {role === 'Requester' ? (
            <>
              <button
                onClick={() => onAcceptEvaluation(task.id)}
                className="flex flex-1 w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
                id="eval-btn-approve"
              >
                <Check size={14} />
                Release Escrowed Bounty
              </button>
              <button
                onClick={() => onNavigateToRevision(task)}
                className="flex flex-1 w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white py-3 text-xs font-semibold text-black hover:border-black transition-all"
                id="eval-btn-request-revision"
              >
                <RotateCcw size={12} />
                Request Code Revision
              </button>
            </>
          ) : (
            <>
              {task.status !== 'Completed' ? (
                <>
                  <button
                    onClick={() => onAcceptEvaluation(task.id)}
                    className="flex flex-1 w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
                    id="eval-btn-contributor-accept"
                  >
                    <Award size={14} />
                    Settle and Claims Bounty
                  </button>
                  <button
                    onClick={() => onNavigateToCancellation(task)}
                    className="flex flex-1 w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white py-3 text-xs font-semibold text-red-600 hover:border-red-600 hover:bg-red-50/50 transition-all"
                  >
                    <AlertTriangle size={12} />
                    Initiate Dispute Resolution
                  </button>
                </>
              ) : (
                <div className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-50 border border-green-200 py-3 text-sm font-semibold text-green-800">
                  <CheckCircle2 size={16} />
                  Bounty Disbursed & Signed Receipt Saved to Wallet
                </div>
              )}
            </>
          )}
        </div>

      </div>

    </div>
  );
};
