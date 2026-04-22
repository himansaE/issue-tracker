import { IssuePriority, IssueStatus } from '../../types/issue';

interface BadgeProps {
  type: 'status' | 'priority' | 'severity';
  value: string;
}

export default function Badge({ type, value }: BadgeProps) {
  let dotColor = 'bg-slate-400';
  let bgColor = 'bg-slate-500/10';
  let textColor = 'text-slate-400';

  if (type === 'status') {
    switch (value) {
      case IssueStatus.OPEN:
        dotColor = 'bg-sky-400'; bgColor = 'bg-sky-500/10'; textColor = 'text-sky-400';
        break;
      case IssueStatus.IN_PROGRESS:
        dotColor = 'bg-amber-400'; bgColor = 'bg-amber-500/10'; textColor = 'text-amber-400';
        break;
      case IssueStatus.RESOLVED:
        dotColor = 'bg-indigo-400'; bgColor = 'bg-indigo-500/10'; textColor = 'text-indigo-400';
        break;
      case IssueStatus.CLOSED:
        dotColor = 'bg-emerald-400'; bgColor = 'bg-emerald-500/10'; textColor = 'text-emerald-400';
        break;
    }
  } else if (type === 'priority') {
    switch (value) {
      case IssuePriority.LOW:
        dotColor = 'bg-slate-400'; bgColor = 'bg-slate-500/10'; textColor = 'text-slate-400';
        break;
      case IssuePriority.MEDIUM:
        dotColor = 'bg-orange-400'; bgColor = 'bg-orange-500/10'; textColor = 'text-orange-400';
        break;
      case IssuePriority.HIGH:
        dotColor = 'bg-rose-400'; bgColor = 'bg-rose-500/10'; textColor = 'text-rose-400';
        break;
      case IssuePriority.URGENT:
        dotColor = 'bg-red-500'; bgColor = 'bg-red-500/10'; textColor = 'text-red-500';
        break;
    }
  }

  const label = value.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium tracking-tight ${bgColor} ${textColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </span>
  );
}
