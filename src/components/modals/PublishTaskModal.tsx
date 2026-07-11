import type React from 'react';
import { X } from 'lucide-react';
import type { PublishTaskFormState } from '../../types';

interface PublishTaskModalProps {
  isOpen: boolean;
  form: PublishTaskFormState;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
  onFormChange: (form: PublishTaskFormState) => void;
}

export function PublishTaskModal({
  isOpen,
  form,
  onClose,
  onSubmit,
  onFormChange,
}: PublishTaskModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 flex items-center justify-center p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <h3 className="text-base font-bold text-[#111827]">Publish New Task</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-[#111827]">Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Implement LLM Smart Contract Wrapper"
              value={form.title}
              onChange={(event) => onFormChange({ ...form, title: event.target.value })}
              className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] focus:outline-hidden focus:border-[#4F46E5] text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-[#111827]">Category</label>
              <select
                value={form.category}
                onChange={(event) => onFormChange({ ...form, category: event.target.value })}
                className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] focus:outline-hidden focus:border-[#4F46E5]"
              >
                <option value="Developer">Developer</option>
                <option value="Design">Design</option>
                <option value="Writing">Writing</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#111827]">Reward Amount (1-5 GEN)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.5"
                required
                value={form.reward}
                onChange={(event) => onFormChange({ ...form, reward: parseFloat(event.target.value) || 1 })}
                className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] focus:outline-hidden focus:border-[#4F46E5]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#111827]">Deadline Date</label>
            <input
              type="date"
              required
              value={form.deadline}
              onChange={(event) => onFormChange({ ...form, deadline: event.target.value })}
              className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] focus:outline-hidden focus:border-[#4F46E5]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#111827]">Description</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the task workflow, goal, context, and model settings if any..."
              value={form.description}
              onChange={(event) => onFormChange({ ...form, description: event.target.value })}
              className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] focus:outline-hidden focus:border-[#4F46E5]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#111827]">Requirements & Deliverables</label>
            <textarea
              rows={2}
              placeholder="List exact deliverables or testing procedures expected..."
              value={form.requirements}
              onChange={(event) => onFormChange({ ...form, requirements: event.target.value })}
              className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] focus:outline-hidden focus:border-[#4F46E5]"
            />
          </div>

          <div className="bg-[#4F46E5]/5 rounded-lg p-3 text-[11px] text-[#4F46E5] leading-relaxed">
            The reward will be locked when the task is published. Publishing only requires normal gas beyond the locked reward.
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#E5E7EB] text-[#6B7280] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white font-semibold rounded-lg shadow-xs transition-colors"
            >
              Publish Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
