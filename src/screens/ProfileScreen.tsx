import { Award, Clock, Shield } from 'lucide-react';
import { ProfileTabs } from '../components/profile/ProfileTabs';
import { ScoreCard } from '../components/profile/ScoreCard';
import type { Task, UserProfile } from '../types';
import { getRecentReceipts, getStatusLabel } from '../utils/taskHelpers';

interface ProfileScreenProps {
  tasks: Task[];
  userProfile: UserProfile;
  currentUserAddress: string;
  walletShortAddress: string | null;
  isCorrectNetwork: boolean;
  isLoading: boolean;
  onViewTask: (taskId: string) => void;
}

export function ProfileScreen({
  tasks,
  userProfile,
  currentUserAddress,
  walletShortAddress,
  isCorrectNetwork,
  isLoading,
  onViewTask,
}: ProfileScreenProps) {
  const recentReceipts = getRecentReceipts(tasks, currentUserAddress);

  if (isLoading) {
    return (
      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 space-y-8 animate-pulse">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 flex gap-5">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div className="space-y-3 flex-1">
            <div className="h-5 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-72 bg-gray-200 rounded" />
            <div className="h-3 w-full max-w-lg bg-gray-200 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(item => (
            <div key={item} className="h-36 bg-white border border-[#E5E7EB] rounded-xl p-5">
              <div className="h-4 w-24 bg-gray-200 rounded mb-5" />
              <div className="h-8 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 space-y-8 animate-fade-in">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-full border-2 border-[#E5E7EB] bg-gray-50 flex-shrink-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
              alt="Satoshi Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#111827]">
                {userProfile.username}
              </h2>
              <span className="text-[9px] font-mono font-semibold text-[#6B7280] bg-gray-100 px-2 py-0.5 rounded-full">
                Temporary profile
              </span>
            </div>
            <p className="text-xs font-mono text-[#6B7280]">
              Address: {userProfile.address}
            </p>
            <p className="text-[10px] font-mono text-[#6B7280]">
              Wallet: {walletShortAddress || 'Not connected'}{isCorrectNetwork ? '' : ' - Switch to Bradbury'}
            </p>
            <p className="text-xs text-[#6B7280] max-w-lg leading-relaxed pt-1">
              {userProfile.bio}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScoreCard
          label="Contributor Score"
          score={userProfile.contributorScore}
          description="Reflects promptness, deliverable quality, and completion rates."
          icon={Award}
          iconClassName="text-[#4F46E5]"
        />
        <ScoreCard
          label="Client Score"
          score={userProfile.clientScore}
          description="Reflects prompt escrow settling, clear guidelines, and fair evaluation parameters."
          icon={Shield}
          iconClassName="text-[#22C55E]"
        />

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-4">
          <h4 className="text-xs text-[#111827] font-bold uppercase tracking-wider">
            Verification Stats
          </h4>
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
            <div>
              <span className="text-[10px] text-[#6B7280] block">Accepted Tasks</span>
              <span className="font-mono font-bold text-sm text-[#111827]">{userProfile.acceptedTasksCount}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6B7280] block">Published Tasks</span>
              <span className="font-mono font-bold text-sm text-[#111827]">{userProfile.publishedTasksCount}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6B7280] block">Completed Receipts</span>
              <span className="font-mono font-bold text-sm text-[#111827]">{userProfile.completedReceiptsCount}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6B7280] block">Completion Rate</span>
              <span className="font-mono font-bold text-sm text-[#22C55E]">{userProfile.completionRate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4">
        <h3 className="text-xs uppercase tracking-wider font-bold text-[#111827] flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-gray-500" />
          Recent Receipts
        </h3>
        {recentReceipts.length === 0 ? (
          <p className="text-xs text-[#6B7280]">No recent receipt activity recorded on GenLayer.</p>
        ) : (
          <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-xl overflow-hidden bg-[#FAFAFA]">
            {recentReceipts.map(receipt => (
              <div
                key={receipt.id}
                onClick={() => onViewTask(receipt.id)}
                className="p-3 flex items-center justify-between gap-4 hover:bg-gray-100 transition-colors cursor-pointer text-xs"
              >
                <div className="space-y-0.5">
                  <p className="font-bold text-[#111827] line-clamp-1">{receipt.title}</p>
                  <p className="text-[10px] text-[#6B7280]">
                    {receipt.category} - {receipt.reward} GEN - Client Score: {receipt.clientScore || 95}
                  </p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  receipt.status === 'Completed' ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' :
                  receipt.status === 'Cancelled' ? 'bg-red-50 text-red-500 border border-red-100' :
                  'bg-gray-100 text-gray-500 border border-gray-200'
                }`}>
                  {getStatusLabel(receipt.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProfileTabs
        tasks={tasks}
        currentUserAddress={currentUserAddress}
        onViewTask={onViewTask}
      />
    </div>
  );
}
