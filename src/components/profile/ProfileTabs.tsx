import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Task } from '../../types';
import {
  getProfileAcceptedTasks,
  getProfileCompletedTasks,
  getProfilePublishedTasks,
} from '../../utils/taskHelpers';

interface ProfileTabsProps {
  tasks: Task[];
  currentUserAddress: string;
  onViewTask: (id: string) => void;
}

export function ProfileTabs({ tasks, currentUserAddress, onViewTask }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<'Accepted' | 'Published' | 'Completed'>('Accepted');

  const acceptedTasks = getProfileAcceptedTasks(tasks, currentUserAddress);
  const publishedTasks = getProfilePublishedTasks(tasks, currentUserAddress);
  const completedTasks = getProfileCompletedTasks(tasks, currentUserAddress);

  const currentTabTasks =
    activeTab === 'Accepted' ? acceptedTasks :
    activeTab === 'Published' ? publishedTasks :
    completedTasks;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-6">
      <div className="flex border-b border-[#E5E7EB] gap-6 text-sm">
        {(['Accepted', 'Published', 'Completed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-semibold relative transition-colors cursor-pointer ${
              activeTab === tab ? 'text-[#4F46E5]' : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {currentTabTasks.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#6B7280] space-y-2">
          <p className="font-semibold text-[#111827]">No tasks found under {activeTab}</p>
          <p>Your action records on Receipt will be documented chronologically here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentTabTasks.map(task => (
            <div
              key={task.id}
              className="border border-[#E5E7EB] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-300 transition-colors bg-[#FAFAFA]"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-[#4F46E5] bg-[#4F46E5]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {task.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#4F46E5]">
                    {task.reward} GEN
                  </span>
                  {task.status === 'Completed' && (
                    <span className="text-[9px] font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Receipt Signed
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-[#111827]">{task.title}</h4>
                <p className="text-[11px] text-[#6B7280] line-clamp-1">
                  Client: {task.publisher} - Deadline: {task.deadline}
                </p>
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-start">
                <span className="text-[10px] uppercase font-bold text-[#6B7280] bg-white border border-[#E5E7EB] px-2.5 py-1 rounded-md">
                  {task.status}
                </span>
                <button
                  onClick={() => onViewTask(task.id)}
                  className="px-3 py-1.5 bg-[#4F46E5] text-white hover:bg-[#4F46E5]/90 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1"
                >
                  View Detail
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
