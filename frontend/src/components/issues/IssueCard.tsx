import type { Issue } from '../../types/issue';
import Badge from '../ui/Badge';
import { Record } from 'iconsax-react';

interface IssueCardProps {
  issue: Issue;
  onClick: (issue: Issue) => void;
}

export default function IssueCard({ issue, onClick }: IssueCardProps) {
  return (
    <div 
      onClick={() => onClick(issue)}
      className="bg-surface-800 rounded-xl p-4 border border-white/5 shadow-sm hover:border-white/10 hover:bg-surface-800/80 hover:shadow-lg hover:ring-1 hover:ring-brand-500/20 cursor-pointer active:scale-98 transition-content flex flex-col gap-3 group"
    >
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-medium text-slate-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">{issue.title}</h4>
      </div>
      
      <div className="flex items-center justify-between mt-1">
        <Badge type="priority" value={issue.priority} />
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Record size="12" color="currentColor" variant="Bulk" className={
            issue.status === 'RESOLVED' || issue.status === 'CLOSED' ? "text-emerald-500/50" : "text-amber-500/50" 
          } />
          {new Date(issue.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
}
