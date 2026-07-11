import type { Task, TaskStatus } from '../types';

export function getAvailableTasks(tasks: Task[]) {
  return tasks.filter(task => task.status === 'Available' || task.status === 'Needs Revision');
}

export function getConnectedTasks(tasks: Task[], currentUserAddress: string) {
  return tasks.filter(
    task =>
      task.status !== 'Available' &&
      (task.acceptedBy === currentUserAddress || task.publisherAddress === currentUserAddress),
  );
}

export function getRecentReceipts(tasks: Task[], currentUserAddress: string) {
  return tasks
    .filter(task => task.acceptedBy === currentUserAddress || task.publisherAddress === currentUserAddress)
    .slice(-5)
    .reverse();
}

export function getProfileAcceptedTasks(tasks: Task[], currentUserAddress: string) {
  return tasks.filter(task => task.acceptedBy === currentUserAddress && task.status !== 'Completed');
}

export function getProfilePublishedTasks(tasks: Task[], currentUserAddress: string) {
  return tasks.filter(task => task.publisherAddress === currentUserAddress);
}

export function getProfileCompletedTasks(tasks: Task[], currentUserAddress: string) {
  return tasks.filter(
    task =>
      task.status === 'Completed' &&
      (task.acceptedBy === currentUserAddress || task.publisherAddress === currentUserAddress),
  );
}

export function getStatusLabel(status: TaskStatus) {
  return status === 'Waiting for Client Review' ? 'Client Review' : status;
}

export function getStatusBadgeStyle(status: TaskStatus) {
  if (status === 'Accepted') {
    return 'bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20';
  }
  if (status === 'Under GenLayer Review') {
    return 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20';
  }
  if (status === 'Waiting for Client Review') {
    return 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20';
  }
  if (status === 'Completed') {
    return 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20';
  }
  if (status === 'Cancelled' || status === 'Needs Revision') {
    return 'bg-red-50 text-red-500 border border-red-100';
  }
  return 'bg-gray-100 text-gray-500 border border-gray-200';
}

export function getTimelineStepIndex(status: TaskStatus) {
  if (status === 'Available') return 0;
  if (status === 'Accepted' || status === 'Needs Revision') return 1;
  if (status === 'Under GenLayer Review') return 3;
  if (status === 'Waiting for Client Review') return 4;
  if (status === 'Completed') return 5;
  return 0;
}

export function formatShortAddress(address: string, length = 12) {
  return `${address.slice(0, length)}...`;
}
