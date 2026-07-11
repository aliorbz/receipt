/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Send, RotateCcw, AlertTriangle, FileText, Info } from 'lucide-react';
import { Task } from '../types';

interface ScreenRevisionRequestProps {
  task: Task;
  onSendRevisionRequest: (taskId: string, requestedChanges: string) => void;
  onNavigateBack: () => void;
}

export const ScreenRevisionRequest: React.FC<ScreenRevisionRequestProps> = ({
  task,
  onSendRevisionRequest,
  onNavigateBack,
}) => {
  const [reasonCategory, setReasonCategory] = useState('Format Discrepancy');
  const [requestedChanges, setRequestedChanges] = useState('');

  const remainingRevisions = task.revisionLimit - task.revisionCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedChanges.trim()) return;

    onSendRevisionRequest(
      task.id,
      `[${reasonCategory}] ${requestedChanges.trim()}`
    );
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Back button */}
      <button
        onClick={onNavigateBack}
        className="mb-6 flex items-center gap-1.5 text-xs font-semibold text-[#666666] hover:text-black transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Evaluation
      </button>

      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-black tracking-tight">
          Request Deliverable Revision
        </h1>
        <p className="text-xs text-[#666666] mt-1">
          Provide constructive feedback based on the AI evaluation scorecard.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Previous submission reference */}
        <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200">
          <span className="block text-[9px] font-bold text-[#666666] uppercase tracking-wider font-mono">
            Original Submission Deliverable Reference
          </span>
          <div className="flex items-center gap-2 mt-2 text-xs font-mono text-[#666666] truncate bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 select-all">
            <FileText size={12} className="text-[#666666] flex-shrink-0" />
            <span>https://github.com/satoshilayer/genlayer-wrapper-repo</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Reason selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-black uppercase tracking-wider">
              Discrepancy Focus
            </label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-black focus:outline-none focus:border-black"
            >
              <option value="Format Discrepancy">Format Discrepancy (JSON/Output structure differs)</option>
              <option value="Incomplete Deliverable">Incomplete Deliverable (Missing Checklist Item)</option>
              <option value="Code Quality & Comments">Code Quality & Comments (Unclear explanations)</option>
              <option value="Performance Bug">Performance Bug (Edge cases failed in validation)</option>
            </select>
          </div>

          {/* Requested changes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-black uppercase tracking-wider">
              Specific Modification Actions
            </label>
            <textarea
              value={requestedChanges}
              onChange={(e) => setRequestedChanges(e.target.value)}
              placeholder="Detail exactly what edits the contributor needs to implement. Keep feedback actionable and reference specific lines or guidelines..."
              rows={5}
              required
              className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm text-black placeholder-neutral-400 focus:border-black focus:outline-none resize-none transition-all"
            />
          </div>

          {/* Allotment Warning */}
          <div className="rounded-xl border border-yellow-200 bg-yellow-50/50 p-4 flex gap-3">
            <AlertTriangle size={16} className="text-yellow-700 mt-0.5 flex-shrink-0" />
            <div className="text-[11px] text-yellow-800 leading-normal space-y-1">
              <span className="font-bold uppercase tracking-wider block">Revision Allotment Tracker</span>
              <p>
                Revisions remaining: <strong>{remainingRevisions} out of {task.revisionLimit} maximum</strong> limit.
              </p>
              <p className="mt-1">
                If the next submission still falls below acceptable criteria, either party can initiate a mutual split dispute settlement on GenLayer.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onNavigateBack}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!requestedChanges.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-40 transition-colors"
              id="revision-btn-send"
            >
              <Send size={12} />
              Dispatch Revision Request
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
