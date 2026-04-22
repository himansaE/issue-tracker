import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Issue, IssueStatus } from '../../types/issue';
import { Add, More } from 'iconsax-react';
import SortableIssueCard from './SortableIssueCard';

interface KanbanColumnProps {
  id: IssueStatus;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  issues: Issue[];
  onCreateClick: () => void;
  onIssueClick: (issue: Issue) => void;
}

export default function KanbanColumn({
  id,
  label,
  icon: Icon,
  color,
  issues,
  onCreateClick,
  onIssueClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex-none w-[280px] sm:w-[320px] snap-start flex flex-col">
      {/* Sticky column header */}
      <div className="flex items-center justify-between mb-3 px-1 sticky top-0 bg-surface-900/80 backdrop-blur-sm z-10 py-2">
        <div className="flex items-center gap-2">
          <Icon size="16" variant="Bulk" color="currentColor" className={color} />
          <h3 className="text-[13px] font-semibold text-slate-200">{label}</h3>
          <span className="text-[11px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded-md font-medium">
            {issues.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onCreateClick}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Add size="14" color="currentColor" />
          </button>
          <button
            type="button"
            className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            <More size="14" color="currentColor" variant="Outline" />
          </button>
        </div>
      </div>

      {/* Drop zone */}
      <SortableContext items={issues.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex-1 flex flex-col gap-2 pt-1 pb-4 rounded-xl min-h-[120px] transition-colors duration-150 ${
            isOver ? 'bg-brand-500/5 ring-1 ring-brand-500/20' : ''
          }`}
        >
          {issues.map((issue, idx) => (
            <div
              key={issue.id}
              className="animate-enter"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <SortableIssueCard issue={issue} onClick={onIssueClick} />
            </div>
          ))}

          {issues.length === 0 && (
            <div className={`h-24 border border-dashed rounded-xl flex items-center justify-center transition-colors duration-150 ${
              isOver ? 'border-brand-500/40 bg-brand-500/5' : 'border-white/5'
            }`}>
              <span className="text-xs text-slate-600 font-medium tracking-wide">
                {isOver ? 'Drop here' : 'No tasks'}
              </span>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
