/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, UploadCloud, Link2, FileText, Check, ShieldAlert, Sparkles } from 'lucide-react';
import { Task } from '../types';

interface ScreenSubmissionProps {
  task: Task;
  onSubmitWork: (taskId: string, submissionDetails: { workUrl: string; screenshots: string[]; notes: string }) => void;
  onNavigateBack: () => void;
}

export const ScreenSubmission: React.FC<ScreenSubmissionProps> = ({
  task,
  onSubmitWork,
  onNavigateBack,
}) => {
  const [workUrl, setWorkUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    // Simulated upload of screenshot
    setScreenshots(['/assets/screenshot_proof_main.png']);
    setSelectedFile('screenshot_proof_main.png (240 KB)');
  };

  const handleFileSelectClick = () => {
    // Simulated file selection
    setScreenshots(['/assets/screenshot_proof_main.png']);
    setSelectedFile('screenshot_proof_main.png (240 KB)');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workUrl.trim()) return;

    onSubmitWork(task.id, {
      workUrl: workUrl.trim(),
      screenshots,
      notes: notes.trim() || 'No supplementary notes provided.',
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Navigation and context info */}
      <button
        onClick={onNavigateBack}
        className="mb-6 flex items-center gap-1.5 text-xs font-semibold text-[#666666] hover:text-black transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </button>

      <div className="mb-8">
        <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[9px] font-bold text-[#666666] uppercase">
          TASK: {task.id}
        </span>
        <h1 className="font-display text-2xl font-bold text-black tracking-tight mt-1">
          Submit Work for: {task.title}
        </h1>
        <p className="text-xs text-[#666666] mt-1">
          Bounty size: <strong className="text-black font-mono font-semibold">{task.reward} GEN</strong>. Provide verified URLs and screenshot outputs for automated node audit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Submission form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-5">
            
            {/* Work URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-black uppercase tracking-wider">
                Production Deliverable URL
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                  <Link2 size={14} />
                </span>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/yourusername/genlayer-wrapper-repo"
                  value={workUrl}
                  onChange={(e) => setWorkUrl(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-black placeholder-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
                  id="submit-url-input"
                />
              </div>
              <p className="text-[10px] text-[#666666]">
                Provide public code repos, live build URLs, or public document storage feeds.
              </p>
            </div>

            {/* Screenshots Drag and Drop */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-black uppercase tracking-wider">
                Screenshot / Proof of Deliverables (Optional)
              </label>
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={handleFileSelectClick}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragActive ? 'border-black bg-neutral-50' : 'border-neutral-200 hover:border-black bg-white'
                }`}
              >
                <UploadCloud size={24} className="text-[#666666] mb-2" />
                <span className="text-xs font-medium text-black">
                  {selectedFile ? 'Proof Added' : 'Drag screenshot here, or click to upload'}
                </span>
                <span className="text-[10px] text-[#666666] mt-1">
                  {selectedFile ? selectedFile : 'Supports PNG, JPG, or PDF up to 8MB'}
                </span>
              </div>
            </div>

            {/* Explanatory notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-black uppercase tracking-wider">
                Notes for AI Validator
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="List code files, highlight particular functions, or outline setup dependencies to streamline node scoring..."
                rows={4}
                className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm text-black placeholder-neutral-400 focus:border-black focus:outline-none resize-none transition-all"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!workUrl.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-40 transition-colors shadow-sm"
              id="submit-btn-publish"
            >
              Dispatch Submission to Nodes
            </button>
          </form>
        </div>

        {/* Right Preview Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="font-display font-semibold text-sm text-black uppercase tracking-wider mb-4 pb-3 border-b border-neutral-100">
              Live Submission Review
            </h3>

            {/* Task Deliverable Checker */}
            <div className="space-y-4">
              <p className="text-xs text-[#666666] leading-relaxed">
                Nodes will score your production package strictly against these {task.deliverables.length} deliverables:
              </p>

              <div className="space-y-2.5">
                {task.deliverables.map((item, index) => (
                  <div key={index} className="flex gap-2.5 text-xs text-[#666666]">
                    <span className="rounded-full bg-neutral-100 font-mono text-[9px] h-5 w-5 flex items-center justify-center font-bold text-black flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              {/* simulated prompt scanner warning */}
              <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-black uppercase tracking-wider">
                  <Sparkles size={12} className="text-black" />
                  Pre-validation Check
                </div>
                <div className="flex items-start gap-2 text-[11px] text-[#666666] leading-normal">
                  <Check size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    No prompt injection patterns or format discrepancies detected. The deliverables structure appears complete.
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
