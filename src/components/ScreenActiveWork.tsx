/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, CheckCircle, Clock, AlertTriangle, FileText, ChevronRight, UploadCloud, ShieldCheck, Sparkles } from 'lucide-react';
import { Task } from '../types';

interface ScreenActiveWorkProps {
  tasks: Task[];
  onNavigateToSubmission: (task: Task) => void;
  onNavigateToEvaluation: (task: Task) => void;
  onNavigateToCancellation: (task: Task) => void;
}

export type ActiveTabType = 'Active' | 'Submitted' | 'Completed' | 'Cancelled';

export const ScreenActiveWork: React.FC<ScreenActiveWorkProps> = ({
  tasks,
  onNavigateToSubmission,
  onNavigateToEvaluation,
  onNavigateToCancellation,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('Active');

  // Filter tasks based on tabs
  const getTasksByTab = (): Task[] => {
    return tasks.filter((task) => {
      if (activeTab === 'Active') {
        return task.status === 'Active' || task.status === 'RevisionRequested';
      }
      if (activeTab === 'Submitted') {
        return task.status === 'Submitted' || task.status === 'UnderReview';
      }
      if (activeTab === 'Completed') {
        return task.status === 'Completed';
      }
      if (activeTab === 'Cancelled') {
        return task.status === 'Cancelled';
      }
      return false;
    });
  };

  const currentList = getTasksByTab();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="rounded bg-blue-50 border border-blue-100 px-2.5 py-0.5 font-mono text-[9px] font-bold text-blue-700 uppercase">In Progress</span>;
      case 'RevisionRequested':
        return <span className="rounded bg-yellow-50 border border-yellow-100 px-2.5 py-0.5 font-mono text-[9px] font-bold text-yellow-700 uppercase">Revision Requested</span>;
      case 'Submitted':
        return <span className="rounded bg-purple-50 border border-purple-100 px-2.5 py-0.5 font-mono text-[9px] font-bold text-purple-700 uppercase">Awaiting Consensus</span>;
      case 'UnderReview':
        return <span className="rounded bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 font-mono text-[9px] font-bold text-indigo-700 uppercase">AI Scoring</span>;
      case 'Completed':
        return <span className="rounded bg-green-50 border border-green-100 px-2.5 py-0.5 font-mono text-[9px] font-bold text-green-700 uppercase">Completed & Signed</span>;
      case 'Cancelled':
        return <span className="rounded bg-red-50 border border-red-100 px-2.5 py-0.5 font-mono text-[9px] font-bold text-red-700 uppercase">Cancelled / Settled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-black tracking-tight">
          Contributor Dashboard
        </h1>
        <p className="text-xs text-[#666666] mt-1">
          Manage your accepted smart contracts, deliver submissions, and monitor automated AI evaluations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 mb-6 overflow-x-auto">
        {(['Active', 'Submitted', 'Completed', 'Cancelled'] as ActiveTabType[]).map((tab) => {
          const isActive = activeTab === tab;
          const count = tasks.filter((t) => {
            if (tab === 'Active') return t.status === 'Active' || t.status === 'RevisionRequested';
            if (tab === 'Submitted') return t.status === 'Submitted' || t.status === 'UnderReview';
            if (tab === 'Completed') return t.status === 'Completed';
            if (tab === 'Cancelled') return t.status === 'Cancelled';
            return false;
          }).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative py-3 px-4 font-semibold text-xs uppercase tracking-wider transition-colors whitespace-nowrap ${
                isActive
                  ? 'text-black border-b-2 border-black'
                  : 'text-[#666666] hover:text-black'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{tab}</span>
                <span className={`rounded-full px-1.5 py-0.2 text-[9px] font-mono font-bold ${
                  isActive ? 'bg-black text-white' : 'bg-neutral-100 text-[#666666]'
                }`}>
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Grid Content */}
      {currentList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white p-16 text-center">
          <span className="text-3xl mb-3">📁</span>
          <h3 className="font-semibold text-base text-black">No contracts in this tab</h3>
          <p className="text-xs text-[#666666] mt-1 max-w-sm">
            Active and pending GenLayer receipts assigned to your keypair will populate here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentList.map((task) => (
            <div
              key={task.id}
              className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:border-black transition-colors duration-300"
            >
              <div>
                {/* Card Header metadata */}
                <div className="flex items-center justify-between mb-4">
                  {getStatusBadge(task.status)}
                  <span className="font-mono text-[10px] text-neutral-400">
                    ID: {task.id}
                  </span>
                </div>

                {/* Task Title */}
                <h3 className="font-display font-semibold text-base text-black mb-2">
                  {task.title}
                </h3>

                <p className="text-xs text-[#666666] line-clamp-2 mb-4 leading-relaxed">
                  {task.description}
                </p>

                {/* Progress Gauges or Info blocks */}
                <div className="space-y-2 text-xs border-t border-neutral-100 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Requester:</span>
                    <span className="font-semibold text-black">{task.requesterName}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#666666]">Bounty Lock:</span>
                    <span className="font-mono font-bold text-black">{task.reward} GEN</span>
                  </div>

                  {activeTab === 'Active' && (
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[#666666] flex items-center gap-1">
                        <Clock size={12} />
                        Deadline:
                      </span>
                      <span className="font-mono font-semibold text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.2 rounded text-[10px]">
                        {task.deadline}
                      </span>
                    </div>
                  )}

                  {task.status === 'RevisionRequested' && (
                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 mt-3 space-y-1">
                      <span className="font-mono text-[9px] text-yellow-800 font-bold uppercase block">Revision Requested</span>
                      <p className="text-[10px] text-yellow-700 leading-normal">
                        Your previous submission required adjustments. Click Submit to upload revisions.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action area */}
              <div className="border-t border-neutral-100 pt-4 flex items-center justify-between">
                
                <span className="font-mono text-[10px] text-neutral-400">
                  {task.category} • Revision {task.revisionCount}/{task.revisionLimit}
                </span>

                <div className="flex items-center gap-2">
                  {/* Active -> Submission Screen */}
                  {(task.status === 'Active' || task.status === 'RevisionRequested') && (
                    <button
                      onClick={() => onNavigateToSubmission(task)}
                      className="flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
                      id={`btn-submit-${task.id}`}
                    >
                      <UploadCloud size={12} />
                      Submit Work
                    </button>
                  )}

                  {/* Submitted -> Evaluation View */}
                  {task.status === 'Submitted' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#666666] italic flex items-center gap-1 animate-pulse">
                        <Sparkles size={11} />
                        GenNodes scoring...
                      </span>
                      <button
                        onClick={() => onNavigateToEvaluation(task)}
                        className="rounded-lg border border-neutral-200 hover:border-black bg-white px-3 py-1.5 text-xs font-semibold text-black transition-colors"
                        id={`btn-eval-${task.id}`}
                      >
                        Details
                      </button>
                    </div>
                  )}

                  {/* UnderReview / Completed -> Evaluation Result */}
                  {(task.status === 'Completed' || task.status === 'UnderReview') && (
                    <button
                      onClick={() => onNavigateToEvaluation(task)}
                      className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-black hover:border-black transition-colors"
                    >
                      <FileText size={12} />
                      View Receipt
                    </button>
                  )}

                  {/* Cancelled -> Dispute timeline */}
                  {task.status === 'Cancelled' && (
                    <button
                      onClick={() => onNavigateToCancellation(task)}
                      className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:border-red-600 hover:bg-red-50/50 transition-colors"
                    >
                      <AlertTriangle size={12} />
                      Dispute Receipt
                    </button>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
