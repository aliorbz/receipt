import { Briefcase, Plus } from 'lucide-react';
import { TaskCard } from '../components/tasks/TaskCard';
import type { Task } from '../types';
import { getAvailableTasks, getConnectedTasks } from '../utils/taskHelpers';

interface TaskBoardScreenProps {
  tasks: Task[];
  currentUserAddress: string;
  isLoading: boolean;
  onOpenPublishModal: () => void;
  onViewTask: (taskId: string) => void;
}

export function TaskBoardScreen({
  tasks,
  currentUserAddress,
  isLoading,
  onOpenPublishModal,
  onViewTask,
}: TaskBoardScreenProps) {
  const availableTasks = getAvailableTasks(tasks);
  const connectedTasks = getConnectedTasks(tasks, currentUserAddress);

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 space-y-10 animate-fade-in">
      {isLoading ? (
        <div className="space-y-8 animate-pulse">
          <div className="flex justify-between items-center border-b border-gray-100 pb-6">
            <div className="space-y-2">
              <div className="h-7 w-48 bg-gray-200 rounded" />
              <div className="h-3.5 w-64 bg-gray-200 rounded" />
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg" />
          </div>

          <div className="space-y-4">
            <div className="h-5 w-36 bg-gray-200 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="border border-gray-100 rounded-xl p-5 space-y-4 bg-white">
                  <div className="flex justify-between">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                  </div>
                  <div className="h-5 w-3/4 bg-gray-200 rounded" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-200 rounded" />
                    <div className="h-3 w-5/6 bg-gray-200 rounded" />
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="sticky top-[68px] z-20 bg-white/95 backdrop-blur-md border border-[#E5E7EB] rounded-2xl p-4 shadow-md flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#111827] tracking-tight">
                Available Tasks
              </h1>
            </div>
            <div>
              <button
                onClick={onOpenPublishModal}
                className="inline-flex items-center justify-center gap-1.5 p-2 sm:px-4 sm:py-2.5 bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Publish Task</span>
              </button>
            </div>
          </div>

          <div id="available-tasks-section" className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
              <h2 className="text-sm font-semibold text-[#111827] uppercase tracking-wider">
                Available Tasks
              </h2>
              <span className="text-xs font-mono text-[#6B7280] bg-gray-100 px-2 py-0.5 rounded-full">
                {availableTasks.length} Open
              </span>
            </div>

            {availableTasks.length === 0 ? (
              <div className="border border-dashed border-[#E5E7EB] rounded-2xl p-12 text-center space-y-4 bg-white max-w-md mx-auto">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400 border border-[#E5E7EB]">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#111827]">No Available Tasks</p>
                  <p className="text-xs text-[#6B7280]">Be the first to publish a verified task on the GenLayer marketplace.</p>
                </div>
                <button
                  onClick={onOpenPublishModal}
                  className="px-4 py-2 bg-[#4F46E5] text-white hover:bg-[#4F46E5]/90 text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 mx-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Publish First Task
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    variant="available"
                    currentUserAddress={currentUserAddress}
                    onViewTask={onViewTask}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <h2 className="text-sm font-semibold text-[#111827] uppercase tracking-wider">
                Your Tasks
              </h2>
              <span className="text-xs font-mono text-[#6B7280] bg-gray-100 px-2 py-0.5 rounded-full">
                {connectedTasks.length} Connected
              </span>
            </div>

            {connectedTasks.length === 0 ? (
              <div className="border border-dashed border-[#E5E7EB] rounded-2xl p-12 text-center space-y-4 bg-white max-w-md mx-auto">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400 border border-[#E5E7EB]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#111827]">No Active Commitments</p>
                  <p className="text-xs text-[#6B7280]">You haven't accepted or interacted with any tasks yet.</p>
                </div>
                <button
                  onClick={() => {
                    const element = document.getElementById('available-tasks-section');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-4 py-2 bg-black hover:bg-black/90 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer mx-auto block"
                >
                  Browse Tasks
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connectedTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    variant="connected"
                    currentUserAddress={currentUserAddress}
                    onViewTask={onViewTask}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
