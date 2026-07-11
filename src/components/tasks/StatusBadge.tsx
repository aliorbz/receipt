import type { TaskStatus } from '../../types';
import { getStatusBadgeStyle, getStatusLabel } from '../../utils/taskHelpers';

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${getStatusBadgeStyle(status)} ${className}`}>
      {getStatusLabel(status)}
    </span>
  );
}
