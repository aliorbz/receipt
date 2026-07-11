import type React from 'react';
import { UploadCloud, X } from 'lucide-react';
import type { SubmitWorkFormState } from '../../types';

interface SubmissionFormProps {
  form: SubmitWorkFormState;
  onSubmit: (event: React.FormEvent) => void;
  onClose: () => void;
  onFormChange: (form: SubmitWorkFormState) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (event: React.DragEvent) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SubmissionForm({
  form,
  onSubmit,
  onClose,
  onFormChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
}: SubmissionFormProps) {
  return (
    <form onSubmit={onSubmit} className="border border-[#E5E7EB] rounded-xl p-5 bg-[#FAFAFA] space-y-4 text-xs mt-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
        <h4 className="font-bold text-[#111827]">Submit Finished Work</h4>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-1">
        <label className="font-semibold text-[#111827]">Work URL</label>
        <input
          type="url"
          required
          placeholder="https://github.com/your-username/repo-name or design link"
          value={form.workUrl}
          onChange={(event) => onFormChange({ ...form, workUrl: event.target.value })}
          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] focus:outline-hidden focus:border-[#4F46E5] text-xs"
        />
      </div>

      <div className="space-y-1">
        <label className="font-semibold text-[#111827]">Notes & Explanation</label>
        <textarea
          required
          rows={3}
          placeholder="Explain your approach, libraries used, or describe files for automated or client review..."
          value={form.notes}
          onChange={(event) => onFormChange({ ...form, notes: event.target.value })}
          className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] focus:outline-hidden focus:border-[#4F46E5]"
        />
      </div>

      <div className="space-y-1">
        <label className="font-semibold text-[#111827]">Screenshot Upload</label>
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`border border-dashed rounded-lg p-4 text-center transition-all cursor-pointer ${
            form.isDragging ? 'border-[#4F46E5] bg-[#4F46E5]/5' : 'border-[#E5E7EB] hover:border-[#4F46E5]'
          }`}
        >
          <input
            type="file"
            id="screenshot-file-inline"
            accept="image/*"
            onChange={onFileSelect}
            className="hidden"
          />
          <label htmlFor="screenshot-file-inline" className="cursor-pointer space-y-1 block">
            <div className="flex justify-center">
              <UploadCloud className="w-6 h-6 text-[#6B7280]" />
            </div>
            {form.screenshotName ? (
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-[#22C55E]">Screenshot Chosen</p>
                <p className="text-[10px] font-mono text-[#6B7280]">{form.screenshotName}</p>
              </div>
            ) : (
              <div className="space-y-0.5">
                <p className="text-[11px] font-semibold text-[#111827]">Drag and drop screenshot, or click to browse</p>
                <p className="text-[9px] text-[#6B7280]">Supports PNG, JPG up to 10MB</p>
              </div>
            )}
          </label>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-1">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 bg-white border border-[#E5E7EB] text-[#6B7280] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-1.5 bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white font-semibold rounded-lg shadow-xs transition-colors"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
