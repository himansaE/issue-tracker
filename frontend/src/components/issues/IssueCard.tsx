import type { Issue } from '../../types/issue';
import Badge from '../ui/Badge';
import { Record } from 'iconsax-react';

interface IssueCardProps {
  issue: Issue;
  onClick: (issue: Issue) => void;
}

export default function IssueCard({ issue, onClick }: IssueCardProps) {
  const displayId = issue.shortId || `IS-${issue.id.substring(issue.id.length - 4).toUpperCase()}`;

  return (
    <div
      onClick={() => onClick(issue)}
      className="bg-surface-800 rounded-xl px-3.5 py-3 border border-white/4 shadow-sm hover:border-white/10 hover:bg-surface-800/80 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer transition-all duration-200 ease-out flex flex-col gap-2.5 group"
    >
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-slate-500 tracking-wider font-mono">{displayId}</span>

        {issue.author?.avatarUrl ? (
          <img src={issue.author.avatarUrl} alt={issue.author.name} className="w-5 h-5 rounded-full object-cover border border-white/5 opacity-80 group-hover:opacity-100 transition-opacity" />
        ) : (
          <div className="w-5 h-5 rounded-full bg-brand-600/20 text-brand-400 flex items-center justify-center text-[8px] font-bold border border-brand-500/10">
            {issue.author?.name?.substring(0, 1).toUpperCase() || 'U'}
          </div>
        )}
      </div>

      <h4 className="text-[13px] font-medium text-slate-200 leading-snug group-hover:text-white transition-colors">{issue.title}</h4>

      <div className="flex items-center justify-between mt-1">
        <Badge type="priority" value={issue.priority} />
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <Record size="12" color="currentColor" variant="Bulk" className={
            issue.status === 'RESOLVED' || issue.status === 'CLOSED' ? "text-emerald-500/50" : "text-amber-500/50"
          } />
          {new Date(issue.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
}
