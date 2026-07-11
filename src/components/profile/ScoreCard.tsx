import type { LucideIcon } from 'lucide-react';

interface ScoreCardProps {
  label: string;
  score: number;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
}

export function ScoreCard({ label, score, description, icon: Icon, iconClassName }: ScoreCardProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider">
          {label}
        </h4>
        <Icon className={`w-4 h-4 ${iconClassName}`} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-mono font-bold text-[#111827]">
          {score}
        </span>
        <span className="text-xs text-[#6B7280]">/ 100</span>
      </div>
      <p className="text-[10px] text-[#6B7280] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
