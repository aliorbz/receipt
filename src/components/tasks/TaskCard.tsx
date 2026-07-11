import { Clock } from 'lucide-react';
import type { Task } from '../../types';
import { StatusBadge } from './StatusBadge';

interface TaskCardProps {
  key?: string;
  task: Task;
  variant: 'available' | 'connected';
  currentUserAddress: string;
  onViewTask: (taskId: string) => void;
}

export function TaskCard({ task, variant, currentUserAddress, onViewTask }: TaskCardProps) {
  const isSelfAccepted = task.acceptedBy === currentUserAddress;

  if (variant === 'available') {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-[#4F46E5]/40 hover:shadow-xs transition-all flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold text-[#4F46E5] bg-[#4F46E5]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {task.category}
            </span>
            <span className="text-xs font-mono font-bold text-[#4F46E5] flex items-center gap-1">
              {task.reward} GEN
            </span>
          </div>
          <h3 className="text-sm font-bold text-[#111827] line-clamp-1 group-hover:text-[#4F46E5]">
            {task.title}
          </h3>
          <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        </div>

        <div className="pt-3 border-t border-[#E5E7EB]/50 flex items-center justify-between text-[11px] text-[#6B7280]">
          <div className="space-y-0.5">
            <p className="line-clamp-1 text-[#111827]">
              By <span className="font-semibold">{task.publisher}</span>
            </p>
            <p className="text-[10px] text-gray-500 font-medium">
              Client Score: <span className="font-semibold text-gray-800">{task.clientScore || 95}</span>
            </p>
            <p className="flex items-center gap-1 font-mono text-[10px] mt-0.5">
              <Clock className="w-3 h-3 text-[#6B7280]" />
              {task.deadline}
            </p>
          </div>
          <button
            onClick={() => onViewTask(task.id)}
            className="px-3 py-1.5 bg-gray-50 hover:bg-[#4F46E5]/5 hover:text-[#4F46E5] border border-[#E5E7EB] text-xs font-medium text-[#111827] rounded-md transition-colors cursor-pointer"
          >
            View Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-gray-300 transition-colors">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold text-[#6B7280] bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {task.category}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#4F46E5]">
              {task.reward} GEN
            </span>
            <StatusBadge status={task.status} />
          </div>
        </div>
        <h3 className="text-sm font-bold text-[#111827] line-clamp-1">
          {task.title}
        </h3>
        <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      </div>

      <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#6B7280]">
        <div>
          <p className="line-clamp-1">
            Contributor:{' '}
            <span className="font-semibold text-[#111827]">
              {isSelfAccepted ? 'You (@satoshi)' : task.acceptedBy ? `${task.acceptedBy.slice(0, 6)}...` : 'External User'}
            </span>
          </p>
          <p className="text-[10px] text-gray-500 font-medium mt-0.5">
            Client Score: <span className="font-semibold text-gray-800">{task.clientScore || 95}</span>
          </p>
          <p className="font-mono mt-0.5 text-[10px]">Deadline: {task.deadline}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewTask(task.id)}
            className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-[#E5E7EB] text-xs font-medium text-[#111827] rounded-md transition-colors cursor-pointer"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
