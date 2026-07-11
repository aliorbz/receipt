interface FooterNavProps {
  show: boolean;
  onGoToBoard: () => void;
  onGoToProfile: () => void;
}

export function FooterNav({ show, onGoToBoard, onGoToProfile }: FooterNavProps) {
  if (!show) return null;

  return (
    <footer className="bg-white border-t border-[#E5E7EB] py-4 px-6 text-center text-xs text-[#6B7280]">
      <div className="max-w-4xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>Receipt task marketplace, optimized for GenLayer optimistic smart contract beta protocol.</p>
        <div className="flex gap-4">
          <button onClick={onGoToBoard} className="hover:text-[#111827] font-semibold">
            Task Board
          </button>
          <button onClick={onGoToProfile} className="hover:text-[#111827] font-semibold">
            Profile Workspace
          </button>
        </div>
      </div>
    </footer>
  );
}
