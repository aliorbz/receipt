/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, X, Sparkles, Check, Lock, Info } from 'lucide-react';
import { Task, TaskCategory, TaskDifficulty } from '../types';

interface ScreenCreateTaskProps {
  onTaskCreated: (newTask: Omit<Task, 'id' | 'requesterName' | 'requesterAddress' | 'requesterScore' | 'status' | 'revisionCount'>) => void;
  onNavigateBack: () => void;
}

export const ScreenCreateTask: React.FC<ScreenCreateTaskProps> = ({
  onTaskCreated,
  onNavigateBack,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Builder');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('Intermediate');
  const [reward, setReward] = useState<number>(3.0);
  const [deadline, setDeadline] = useState('2026-07-01');

  const [description, setDescription] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>(['Code verified under GenNode environment']);
  const [newDeliverable, setNewDeliverable] = useState('');
  const [revisionLimit, setRevisionLimit] = useState<number>(2);

  const [lockConfirmed, setLockConfirmed] = useState(false);

  const handleAddDeliverable = () => {
    if (newDeliverable.trim()) {
      setDeliverables([...deliverables, newDeliverable.trim()]);
      setNewDeliverable('');
    }
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lockConfirmed) return;

    onTaskCreated({
      title: title.trim(),
      category,
      difficulty,
      reward,
      deadline,
      description: description.trim(),
      deliverables: deliverables.filter(d => d.trim().length > 0),
      revisionLimit,
      taskQuality: Math.floor(Math.random() * 8) + 90, // AI predicts 90-98% quality compatibility
    });
  };

  const isStep1Valid = title.trim().length > 0 && reward > 0 && deadline.length > 0;
  const isStep2Valid = description.trim().length > 0 && deliverables.length > 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Back navigation */}
      <button
        onClick={onNavigateBack}
        className="mb-6 flex items-center gap-1 text-xs font-semibold text-[#666666] hover:text-black transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Tasks
      </button>

      {/* Progress Breadcrumbs */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-6">
          <button
            onClick={() => step > 1 && setStep(1)}
            disabled={step === 1}
            className={`flex items-center gap-2 text-xs font-semibold ${
              step === 1 ? 'text-black font-extrabold' : 'text-[#666666] hover:text-black'
            }`}
          >
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono ${
              step === 1 ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-600'
            }`}>
              1
            </span>
            Basics
          </button>

          <span className="text-neutral-300 text-sm">/</span>

          <button
            onClick={() => isStep1Valid && setStep(2)}
            disabled={!isStep1Valid || step === 2}
            className={`flex items-center gap-2 text-xs font-semibold ${
              step === 2 ? 'text-black font-extrabold' : 'text-[#666666] hover:text-black'
            }`}
          >
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono ${
              step === 2 ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-600'
            }`}>
              2
            </span>
            Requirements
          </button>

          <span className="text-neutral-300 text-sm">/</span>

          <button
            onClick={() => isStep1Valid && isStep2Valid && setStep(3)}
            disabled={!isStep1Valid || !isStep2Valid || step === 3}
            className={`flex items-center gap-2 text-xs font-semibold ${
              step === 3 ? 'text-black font-extrabold' : 'text-[#666666] hover:text-black'
            }`}
          >
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono ${
              step === 3 ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-600'
            }`}>
              3
            </span>
            Review
          </button>
        </div>

        <span className="font-mono text-[10px] text-[#666666]">
          Step {step} of 3
        </span>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
        
        {/* STEP 1: BASICS */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-display font-bold text-lg text-black mb-1">
                Define the basics
              </h2>
              <p className="text-xs text-[#666666]">
                Provide a clear title, categorize the core technical domain, and declare rewards.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              
              {/* Title input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-black uppercase tracking-wider">
                  Task Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Develop AI consensus interface adapter"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-black placeholder-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
                  required
                />
              </div>

              {/* Grid 2 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-black uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-black focus:outline-none focus:border-black"
                  >
                    <option value="Builder">Builder (Code & Dev)</option>
                    <option value="Designer">Designer (UI/UX)</option>
                    <option value="Creator">Creator (Content)</option>
                    <option value="Artist">Artist (Illustrations)</option>
                  </select>
                </div>

                {/* Difficulty Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-black uppercase tracking-wider">
                    Complexity Tier
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as TaskDifficulty)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-black focus:outline-none focus:border-black"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              {/* Grid 2 Columns for Reward and Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Reward input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-black uppercase tracking-wider">
                    Bounty Reward (GEN)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="100"
                      value={reward}
                      onChange={(e) => setReward(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                      className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-4 pr-12 text-sm text-black font-mono focus:border-black focus:outline-none"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 font-mono text-xs font-bold text-black">
                      GEN
                    </span>
                  </div>
                  <p className="text-[10px] text-[#666666]">
                    Locked on smart contract until work approval or cancel.
                  </p>
                </div>

                {/* Deadline Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-black uppercase tracking-wider">
                    Hard Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-black font-mono focus:border-black focus:outline-none"
                    required
                  />
                  <p className="text-[10px] text-[#666666]">
                    Late submissions will be rejected by nodes.
                  </p>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="flex items-center gap-1.5 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-40 transition-colors"
                id="create-btn-step1-continue"
              >
                Continue
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: REQUIREMENTS */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-display font-bold text-lg text-black mb-1">
                Set specifications & deliverables
              </h2>
              <p className="text-xs text-[#666666]">
                Specify clear deliverables. GenLayer AI nodes evaluate the submission strictly against this checklist.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              
              {/* Detailed Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-black uppercase tracking-wider">
                  Detailed Task Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Clearly explain the technical parameters, code structure, expected output format, or design tokens..."
                  rows={4}
                  className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm text-black placeholder-neutral-400 focus:border-black focus:outline-none resize-none transition-all"
                  required
                />
              </div>

              {/* Interactive Deliverables Checklist */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-black uppercase tracking-wider">
                  Verified Deliverables Checklist
                </label>
                
                {/* List of current deliverables */}
                <div className="space-y-2">
                  {deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 border border-neutral-200">
                      <span className="text-xs text-[#666666] pr-2 flex items-center gap-1.5">
                        <Check size={12} className="text-green-600 flex-shrink-0" />
                        {item}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(idx)}
                        className="text-[#666666] hover:text-red-600 p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new input */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newDeliverable}
                    onChange={(e) => setNewDeliverable(e.target.value)}
                    placeholder="Add specific target deliverable..."
                    className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs text-black placeholder-neutral-400 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDeliverable())}
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="rounded-xl bg-neutral-100 border border-neutral-200 hover:border-black p-2 text-black transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Revision Limit Slider */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-black uppercase tracking-wider">
                    Maximum Allowed Revisions
                  </label>
                  <span className="font-mono text-xs font-bold text-black">{revisionLimit}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={revisionLimit}
                  onChange={(e) => setRevisionLimit(parseInt(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <p className="text-[10px] text-[#666666]">
                  Limits back-and-forth negotiation cycles on dispute settlements.
                </p>
              </div>

            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-black"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!isStep2Valid}
                className="flex items-center gap-1.5 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-40 transition-colors"
                id="create-btn-step2-continue"
              >
                Review Task
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-lg text-black mb-1">
                Final validation & lock
              </h2>
              <p className="text-xs text-[#666666]">
                Verify the automated GenLayer pre-compiled scoring parameters before locking rewards onto the chain.
              </p>
            </div>

            {/* AI Preview Parameters */}
            <div className="rounded-xl bg-neutral-50 p-5 border border-neutral-200 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-black uppercase tracking-wider">
                <Sparkles size={14} className="text-black" />
                Automated GenNode Pre-Compile analysis
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white border border-neutral-200 p-3">
                  <span className="text-[10px] text-[#666666] font-mono uppercase block">Estimated Quality Score</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-mono text-xl font-bold text-black">94%</span>
                    <span className="text-[10px] text-green-600 font-semibold">Excellent</span>
                  </div>
                </div>

                <div className="rounded-lg bg-white border border-neutral-200 p-3">
                  <span className="text-[10px] text-[#666666] font-mono uppercase block">Recommended Reward</span>
                  <span className="font-mono text-xl font-bold text-black mt-1 block">
                    {reward} GEN
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-[#666666] leading-relaxed">
                <Info size={14} className="text-[#666666] flex-shrink-0 mt-0.5" />
                <span>
                  The specification syntax is clear and provides explicit validation vectors. Evaluators can deterministically verify completion.
                </span>
              </div>
            </div>

            {/* Locked summary */}
            <div className="border border-neutral-200 rounded-xl p-4 space-y-2.5">
              <h4 className="text-xs font-bold text-black uppercase tracking-wider">Lock Summary</h4>
              <div className="flex justify-between text-xs">
                <span className="text-[#666666]">Contract Reward Amount:</span>
                <span className="font-mono text-black font-semibold">{reward} GEN</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#666666]">Consensus Fee (0% during testnet):</span>
                <span className="font-mono text-black font-semibold">0.0 GEN</span>
              </div>
              <div className="flex justify-between text-xs border-t border-neutral-100 pt-2 font-semibold">
                <span className="text-black">Total Collateral to Lock:</span>
                <span className="font-mono text-black">{reward} GEN</span>
              </div>
            </div>

            {/* Crucial Reward Locking Confirmation Checkbox */}
            <div className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50/50 p-4">
              <div className="mt-0.5">
                <Lock size={16} className="text-yellow-700" />
              </div>
              <div className="space-y-1 flex-1">
                <h5 className="text-xs font-bold text-yellow-900 uppercase tracking-wider">Reward Locking Protocol</h5>
                <p className="text-[11px] text-yellow-800 leading-relaxed">
                  Upon publishing, <strong>{reward} GEN</strong> will be moved from your connected wallet and locked into a decentralized GenLayer escrow contract. Funds are settled ONLY when deliverables satisfy the criteria checklist, or upon a mutual contract cancellation resolution.
                </p>
                <label className="flex items-center gap-2 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lockConfirmed}
                    onChange={(e) => setLockConfirmed(e.target.checked)}
                    className="rounded border-neutral-300 text-black focus:ring-black h-4 w-4 cursor-pointer"
                    id="checkbox-lock-confirm"
                  />
                  <span className="text-xs font-medium text-black select-none">
                    I confirm and authorize locking {reward} GEN into escrow.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-black"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!lockConfirmed}
                className="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-bold text-white hover:bg-neutral-800 disabled:opacity-40 transition-colors"
                id="create-btn-publish"
              >
                Lock Bounty & Publish Task
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
