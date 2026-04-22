import type { Issue } from '../../types/issue';
import { More, ArrowDown, ArrowRight, ArrowUp, Warning2 } from 'iconsax-react';

interface IssueCardProps {
  issue: Issue;
  onClick: (issue: Issue) => void;
  isDragging?: boolean;
  isOverlay?: boolean;
}

export default function IssueCard({ issue, onClick, isDragging = false, isOverlay = false }: IssueCardProps) {
  const displayId = issue.shortId || `IS-${issue.id.substring(issue.id.length - 4).toUpperCase()}`;

  const statusColors = {
    OPEN: "text-amber-500",
    IN_PROGRESS: "text-brand-400",
    RESOLVED: "text-emerald-500",
    CLOSED: "text-slate-500",
  };

  const priorityBgColors = {
    LOW: "bg-slate-500/10 text-slate-400",
    MEDIUM: "bg-blue-500/10 text-blue-400",
    HIGH: "bg-amber-500/10 text-amber-500",
    URGENT: "bg-red-500/10 text-red-500",
  };

  const PriorityIcon = issue.priority === 'LOW' ? ArrowDown :
    issue.priority === 'MEDIUM' ? ArrowRight :
      issue.priority === 'HIGH' ? ArrowUp : Warning2;

  if (isDragging) {
    return (
      <div className="rounded-[20px] border-2 border-dashed border-white/10 bg-white/2 h-[116px]" />
    );
  }

  return (
    <div
      onClick={() => onClick(issue)}
      className={`bg-[#1A1D24] rounded-[20px] p-4 flex flex-col gap-3 group cursor-pointer border transition-all duration-200 ease-out ${isOverlay
        ? 'border-brand-500/50 shadow-2xl shadow-brand-500/20 rotate-[1.5deg] scale-105 opacity-95'
        : 'border-[#2A2E37] hover:border-brand-500/30 hover:shadow-lg'
        }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-2 h-2">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-50 blur-[2px] bg-current ${statusColors[issue.status]}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 bg-current ${statusColors[issue.status]}`}></span>
          </div>
          <span className="text-[11px] font-bold text-slate-400 tracking-widest font-mono uppercase">{displayId}</span>
        </div>

        <button className="text-slate-600 hover:text-white transition-colors" title="More Options">
          <More size="16" variant="Outline" color="currentColor" />
        </button>
      </div>

      <h4 className="text-[15px] font-semibold text-slate-100 leading-[1.4] pr-2 mt-1 mb-2 group-hover:text-white transition-colors">{issue.title}</h4>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex -space-x-1.5">
          {issue.author?.avatarUrl ? (
            <img src={issue.author.avatarUrl} alt={issue.author.name} className="w-[26px] h-[26px] rounded-full object-cover border-2 border-[#1A1D24] bg-surface-800" />
          ) : (
            <div className="w-[26px] h-[26px] rounded-full bg-brand-600 border-2 border-[#1A1D24] flex items-center justify-center text-[9px] font-bold text-white">
              {issue.author?.name?.substring(0, 1).toUpperCase() || 'U'}
            </div>
          )}
        </div>

        <div className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 ${priorityBgColors[issue.priority]}`}>
          <PriorityIcon size="12" variant="Bulk" color="currentColor" />
          {issue.priority}
        </div>
      </div>
    </div>
  );
}
