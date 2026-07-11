/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, DollarSign, Calendar, Sliders, ArrowUpRight, CheckCircle2, UserCheck, Play } from 'lucide-react';
import { Task, UserProfile, TaskCategory, TaskStatus } from '../types';

interface ScreenHomeFeedProps {
  tasks: Task[];
  userProfile: UserProfile;
  onViewTaskDetail: (task: Task) => void;
  onAcceptTask: (taskId: string) => void;
  onNavigateToCreateTask: () => void;
  onNavigateToActiveWork: () => void;
  recentActivityText: string[];
}

export const ScreenHomeFeed: React.FC<ScreenHomeFeedProps> = ({
  tasks,
  userProfile,
  onViewTaskDetail,
  onAcceptTask,
  onNavigateToCreateTask,
  onNavigateToActiveWork,
  recentActivityText,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedReward, setSelectedReward] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    // 1. Search term match
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.requesterName.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Category match
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;

    // 3. Reward match
    let matchesReward = true;
    if (selectedReward === 'Low') matchesReward = task.reward <= 2;
    else if (selectedReward === 'Medium') matchesReward = task.reward > 2 && task.reward <= 4;
    else if (selectedReward === 'High') matchesReward = task.reward > 4;

    // 4. Difficulty match
    const matchesDifficulty = selectedDifficulty === 'All' || task.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesReward && matchesDifficulty;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Search and Action Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex-1 max-w-lg relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search tasks, requesters, or key terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-black placeholder-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
            id="task-search-input"
          />
        </div>

        {/* Create Task (Requester View) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToCreateTask}
            className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-all shadow-sm"
            id="home-btn-create-task"
          >
            Create New Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Filter and Tasks Grid */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Filters Bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
            
            {/* Header info */}
            <div className="flex items-center gap-1 text-xs font-semibold text-[#666666] uppercase tracking-wider mb-1">
              <Sliders size={12} />
              Filter Discovery Feed
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Category Dropdown */}
              <div>
                <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs font-medium text-black focus:outline-none focus:border-black"
                >
                  <option value="All">All Categories</option>
                  <option value="Builder">Builder (Code & Dev)</option>
                  <option value="Designer">Designer (UI/UX)</option>
                  <option value="Creator">Creator (Content)</option>
                  <option value="Artist">Artist (Illustrations)</option>
                </select>
              </div>

              {/* Reward Filter */}
              <div>
                <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-wider mb-1">
                  Reward Size
                </label>
                <select
                  value={selectedReward}
                  onChange={(e) => setSelectedReward(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs font-medium text-black focus:outline-none focus:border-black"
                >
                  <option value="All">All Rewards</option>
                  <option value="Low">Low (≤ 2.0 GEN)</option>
                  <option value="Medium">Medium (2.1 - 4.0 GEN)</option>
                  <option value="High">High (&gt; 4.0 GEN)</option>
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-wider mb-1">
                  Complexity
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs font-medium text-black focus:outline-none focus:border-black"
                >
                  <option value="All">All Complexities</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

            </div>
          </div>

          {/* Task Feed */}
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white p-16 text-center">
              <span className="text-3xl mb-3">🔍</span>
              <h3 className="font-semibold text-base text-black">No matching tasks found</h3>
              <p className="text-xs text-[#666666] mt-1 max-w-sm">
                Try widening your search terms, modifying category choices, or checking alternative reward criteria.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedReward('All');
                  setSelectedDifficulty('All');
                }}
                className="mt-4 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-black hover:border-black hover:bg-neutral-50 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:border-black transition-all duration-300"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[9px] font-bold text-[#666666]">
                          {task.category.toUpperCase()}
                        </span>
                        <span className={`rounded px-2 py-0.5 font-mono text-[9px] font-bold ${
                          task.difficulty === 'Expert' ? 'bg-red-50 text-red-700' :
                          task.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                        }`}>
                          {task.difficulty}
                        </span>
                        <span className="text-xs text-neutral-400">•</span>
                        <span className="flex items-center gap-1 font-mono text-[10px] text-neutral-400">
                          <Calendar size={10} />
                          Deadline: {task.deadline}
                        </span>
                      </div>

                      <h3 className="font-display font-semibold text-base text-black group-hover:text-black leading-snug">
                        {task.title}
                      </h3>

                      <p className="text-xs text-[#666666] line-clamp-2 mt-1 leading-relaxed">
                        {task.description}
                      </p>

                      {/* Reputational scoring parameters */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3 text-[11px] text-[#666666] font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-400">Requester Score:</span>
                          <span className="font-semibold text-black">{task.requesterScore}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-400">Target Quality:</span>
                          <span className="font-semibold text-black">{task.taskQuality}%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-400">Revision Cap:</span>
                          <span className="font-semibold text-black">{task.revisionLimit} Max</span>
                        </div>
                      </div>

                    </div>

                    {/* Reward & CTA button */}
                    <div className="flex flex-row items-center justify-between sm:flex-col sm:items-end sm:justify-start gap-3 pt-3 border-t border-neutral-100 sm:pt-0 sm:border-none">
                      <div className="text-left sm:text-right">
                        <span className="block text-[9px] font-bold text-[#666666] uppercase tracking-wider font-mono">
                          REWARD
                        </span>
                        <span className="font-mono text-lg font-extrabold text-black block mt-0.5">
                          {task.reward} GEN
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewTaskDetail(task)}
                          className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-black hover:border-black transition-all"
                        >
                          View
                        </button>
                        
                        {task.status === 'Open' ? (
                          <button
                            onClick={() => onAcceptTask(task.id)}
                            className="flex items-center gap-1 rounded-lg bg-black px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-all"
                          >
                            <Play size={10} className="fill-current" />
                            Accept
                          </button>
                        ) : (
                          <span className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-[#666666]">
                            Assigned
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Side: Profile Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Global score card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="font-display font-semibold text-sm text-black mb-4 pb-3 border-b border-neutral-100 uppercase tracking-wider">
              Reputation Profile
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] text-[#666666] uppercase">Global Credential Index</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-mono text-3xl font-extrabold text-black">
                    {userProfile.globalScore}
                  </span>
                  <span className="text-xs text-neutral-400">/ 100</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-50 border border-neutral-200">
                <ShieldCheck size={24} className="text-black" />
              </div>
            </div>

            <p className="text-[11px] text-[#666666] mt-3 leading-relaxed">
              Your global rating is evaluated on GenLayer based on accuracy, deadlines met, and revision compliance.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-neutral-100">
              <div>
                <span className="block text-[9px] font-bold text-[#666666] uppercase tracking-wider font-mono">
                  Contributor
                </span>
                <span className="font-mono text-base font-bold text-black block mt-0.5">
                  {userProfile.contributorScore}
                </span>
              </div>
              <div>
                <span className="block text-[9px] font-bold text-[#666666] uppercase tracking-wider font-mono">
                  Requester
                </span>
                <span className="font-mono text-base font-bold text-black block mt-0.5">
                  {userProfile.requesterScore}
                </span>
              </div>
            </div>
          </div>

          {/* Quick activity feed inside sidebar */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h4 className="font-display font-semibold text-sm text-black uppercase tracking-wider">
                My Recent Activity
              </h4>
              <button 
                onClick={onNavigateToActiveWork}
                className="text-[10px] font-semibold text-[#666666] hover:text-black underline"
              >
                Dashboard
              </button>
            </div>

            <div className="space-y-4">
              {recentActivityText.length === 0 ? (
                <p className="text-xs text-neutral-400 text-center py-4">No recent activities on GenNode.</p>
              ) : (
                recentActivityText.slice(0, 4).map((activity, index) => (
                  <div key={index} className="flex gap-2 text-xs">
                    <span className="text-neutral-400 mt-0.5">●</span>
                    <span className="text-[#666666] leading-snug">{activity}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
