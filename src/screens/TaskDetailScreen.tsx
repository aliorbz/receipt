import type React from 'react';
import { ArrowLeft, Check, CheckCircle2, ExternalLink } from 'lucide-react';
import { SubmissionForm } from '../components/tasks/SubmissionForm';
import type { SubmitWorkFormState, Task } from '../types';
import { formatShortAddress, getStatusLabel, getTimelineStepIndex } from '../utils/taskHelpers';

interface TaskDetailScreenProps {
  task: Task;
  currentUserAddress: string;
  isSubmitFormOpen: boolean;
  submitForm: SubmitWorkFormState;
  onBackToBoard: () => void;
  onAcceptTask: (taskId: string) => void;
  onCancelTask: (taskId: string) => void;
  onReviewTask: (taskId: string, decision: 'Approve' | 'Revision') => void;
  onToggleSubmitForm: () => void;
  onCloseSubmitForm: () => void;
  onSubmitWork: (event: React.FormEvent) => void;
  onSubmitFormChange: (form: SubmitWorkFormState) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (event: React.DragEvent) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TaskDetailScreen({
  task,
  currentUserAddress,
  isSubmitFormOpen,
  submitForm,
  onBackToBoard,
  onAcceptTask,
  onCancelTask,
  onReviewTask,
  onToggleSubmitForm,
  onCloseSubmitForm,
  onSubmitWork,
  onSubmitFormChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
}: TaskDetailScreenProps) {
  const timelineSteps = ['Available', 'Accepted', 'Submitted', 'GenLayer Review', 'Client Review', 'Completed'];
  const currentStepIndex = getTimelineStepIndex(task.status);

  return (
    <div className="flex-1 max-w-2xl w-full mx-auto px-6 py-10 space-y-8 animate-fade-in">
      <button
        onClick={onBackToBoard}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to available tasks
      </button>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#E5E7EB] pb-5">
          <div className="flex items-center justify-between text-[9px] text-gray-400 font-mono font-medium max-w-lg mx-auto">
            {timelineSteps.map((step, idx) => {
              const isCurrent = currentStepIndex === idx;
              const isPassed = currentStepIndex > idx;
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center transition-all ${
                      isCurrent ? 'bg-[#4F46E5] border-[#4F46E5] ring-2 ring-[#4F46E5]/20' :
                      isPassed ? 'bg-[#22C55E] border-[#22C55E]' :
                      'bg-white border-gray-300'
                    }`}>
                      {isPassed && <Check className="w-1.5 h-1.5 text-white stroke-[3px]" />}
                    </span>
                    <span className={`text-[8px] sm:text-[9px] font-semibold whitespace-nowrap ${
                      isCurrent ? 'text-[#4F46E5] font-bold' :
                      isPassed ? 'text-[#111827]' :
                      'text-gray-400'
                    }`}>
                      {step}
                    </span>
                  </div>
                  {idx < timelineSteps.length - 1 && (
                    <div className={`h-[1px] flex-1 mx-1.5 ${
                      isPassed ? 'bg-[#22C55E]' : 'bg-[#E5E7EB]'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <span className="text-xs font-bold text-[#4F46E5] bg-[#4F46E5]/10 px-3 py-1 rounded-full uppercase tracking-wider">
            {task.category}
          </span>
          <div className="text-right">
            <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Reward locked</p>
            <p className="text-lg font-mono font-bold text-[#4F46E5]">{task.reward} GEN</p>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#111827] tracking-tight">
            {task.title}
          </h1>
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#6B7280]">
            <p>Client: <span className="font-semibold text-[#111827]">{task.publisher}</span></p>
            <span className="hidden sm:inline text-gray-300">-</span>
            <p className="font-mono">Address: {formatShortAddress(task.publisherAddress)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-4 text-xs">
          <div>
            <p className="text-[#6B7280] font-medium">Deadline Date</p>
            <p className="font-semibold text-[#111827] mt-0.5">{task.deadline}</p>
          </div>
          <div>
            <p className="text-[#6B7280] font-medium">Agreement Status</p>
            <p className="font-bold text-[#111827] mt-0.5 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <span className={`w-2 h-2 rounded-full ${
                task.status === 'Completed' ? 'bg-[#22C55E]' :
                task.status === 'Cancelled' ? 'bg-[#EF4444]' :
                task.status === 'Waiting for Client Review' ? 'bg-[#F59E0B]' :
                'bg-[#4F46E5]'
              }`} />
              {getStatusLabel(task.status)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs uppercase tracking-wider font-bold text-[#111827]">
            Description
          </h3>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            {task.description}
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <h3 className="text-xs uppercase tracking-wider font-bold text-[#111827]">
            Requirements & Deliverables
          </h3>
          <div className="bg-gray-50 rounded-xl p-4 border border-[#E5E7EB] text-xs space-y-2">
            <p className="text-[#111827] font-medium leading-relaxed">
              {task.requirements}
            </p>
          </div>
        </div>

        {isSubmitFormOpen && task.status === 'Accepted' && (
          <SubmissionForm
            form={submitForm}
            onSubmit={onSubmitWork}
            onClose={onCloseSubmitForm}
            onFormChange={onSubmitFormChange}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onFileSelect={onFileSelect}
          />
        )}

        {task.submission && (
          <div className="border-t border-[#E5E7EB] pt-6 space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#111827]">
              Submitted Work
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 border border-[#E5E7EB] space-y-3 text-xs">
              <div>
                <p className="text-[#6B7280] font-medium">Work URL Reference</p>
                <a
                  href={task.submission.workUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#4F46E5] hover:underline font-mono inline-flex items-center gap-1 mt-0.5"
                >
                  {task.submission.workUrl}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div>
                <p className="text-[#6B7280] font-medium">Notes & Explanatory Proof</p>
                <p className="text-[#111827] mt-0.5 leading-relaxed">{task.submission.notes}</p>
              </div>
              {task.submission.screenshotName && (
                <div>
                  <p className="text-[#6B7280] font-medium">Uploaded Screenshot</p>
                  <div className="mt-1 flex items-center gap-2 text-[#22C55E] bg-[#22C55E]/5 border border-[#22C55E]/10 px-2 py-1.5 rounded-lg w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="font-mono text-[11px]">{task.submission.screenshotName}</span>
                  </div>
                </div>
              )}
              <div>
                <p className="text-[#6B7280] font-medium">Current Status</p>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mt-1 border ${
                  task.status === 'Completed' ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' :
                  task.status === 'Needs Revision' ? 'bg-red-50 text-red-500 border-red-100' :
                  'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    task.status === 'Completed' ? 'bg-[#22C55E]' :
                    task.status === 'Needs Revision' ? 'bg-red-500' :
                    'bg-[#3B82F6] animate-pulse'
                  }`} />
                  {getStatusLabel(task.status)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[#E5E7EB]">
          {task.status === 'Available' && (
            <div className="space-y-3">
              {task.publisherAddress === currentUserAddress ? (
                <div className="bg-[#F59E0B]/5 border border-[#F59E0B]/20 p-4 rounded-xl text-center">
                  <p className="text-xs text-[#F59E0B] font-semibold">
                    You published this task. Clients must not accept their own tasks.
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => onAcceptTask(task.id)}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white font-medium rounded-xl text-sm transition-all shadow-xs cursor-pointer"
                >
                  Accept Task
                </button>
              )}
            </div>
          )}

          {task.status === 'Accepted' && task.acceptedBy === currentUserAddress && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={onToggleSubmitForm}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white font-medium rounded-xl text-sm transition-all shadow-xs cursor-pointer"
                >
                  {isSubmitFormOpen ? 'Cancel Submission' : 'Submit Work'}
                </button>
                <button
                  onClick={() => onCancelTask(task.id)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-red-50 text-[#EF4444] border border-[#E5E7EB] font-medium rounded-xl text-sm transition-all cursor-pointer"
                >
                  Cancel Task
                </button>
              </div>

              <p className="text-[11px] text-[#6B7280] text-center leading-relaxed max-w-md mx-auto">
                Cancelling will reduce your Contributor Score. Future versions may also include token penalties.
              </p>
            </div>
          )}

          {task.status === 'Waiting for Client Review' && task.publisherAddress === currentUserAddress && (
            <div className="space-y-4 bg-[#FAFAFA] p-5 border border-[#E5E7EB] rounded-xl text-center">
              <div>
                <p className="text-xs font-bold text-[#111827]">Review this Contributor Submission</p>
                <p className="text-[11px] text-[#6B7280] mt-0.5">As the client, evaluate the submitted work to release the GEN tokens or request revisions.</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                <button
                  onClick={() => onReviewTask(task.id, 'Approve')}
                  className="px-4 py-2 bg-[#22C55E] hover:bg-[#22C55E]/90 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Approve & Release Funds
                </button>
                <button
                  onClick={() => onReviewTask(task.id, 'Revision')}
                  className="px-4 py-2 bg-white hover:bg-gray-100 text-[#111827] border border-[#E5E7EB] text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Request Revision
                </button>
              </div>
            </div>
          )}

          {task.acceptedBy === currentUserAddress && task.status !== 'Accepted' && (
            <div className="bg-[#FAFAFA] border border-[#E5E7EB] p-5 rounded-xl space-y-2">
              <p className="text-xs font-medium text-[#6B7280] text-center">Your Submission Status:</p>
              <div className="flex items-center justify-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  task.status === 'Completed' ? 'bg-[#22C55E]' :
                  task.status === 'Needs Revision' ? 'bg-[#F59E0B]' :
                  'bg-[#4F46E5] animate-pulse'
                }`} />
                <span className="text-sm font-bold text-[#111827]">
                  {getStatusLabel(task.status)}
                </span>
              </div>

              {task.status === 'Needs Revision' && (
                <div className="text-center pt-2">
                  <button
                    onClick={onToggleSubmitForm}
                    className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white text-xs font-medium rounded-lg cursor-pointer"
                  >
                    {isSubmitFormOpen ? 'Cancel Revision' : 'Submit Revision'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
