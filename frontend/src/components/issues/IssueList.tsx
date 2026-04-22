import { useState } from 'react';
import { useIssueStore } from '../../store/issueStore';
import { IssueStatus } from '../../types/issue';
import type { Issue } from '../../types/issue';
import IssueCard from './IssueCard';
import { Add, Record, Timer1, TickCircle, CloseCircle, More } from 'iconsax-react';
import IssueSlideOverDetail from './IssueSlideOverDetail';

const COLUMNS: { id: IssueStatus; label: string; icon: any; color: string }[] = [
  { id: 'OPEN', label: 'Open', icon: Record, color: 'text-amber-500' },
  { id: 'IN_PROGRESS', label: 'In Progress', icon: Timer1, color: 'text-brand-400' },
  { id: 'RESOLVED', label: 'Resolved', icon: TickCircle, color: 'text-emerald-500' },
  { id: 'CLOSED', label: 'Closed', icon: CloseCircle, color: 'text-slate-500' },
];

export default function IssueList() {
  const { issues, isLoading } = useIssueStore();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isSlideOverOpen, setSlideOverOpen] = useState(false);
  const [isCreatingForStatus, setIsCreatingForStatus] = useState<IssueStatus | null>(null);

  const openDetail = (issue: Issue) => {
    setSelectedIssue(issue);
    setSlideOverOpen(true);
  };

  const openCreateDialog = (status: IssueStatus) => {
    setSelectedIssue(null);
    setIsCreatingForStatus(status);
    setSlideOverOpen(true);
  };

  const closeSlideOver = () => {
    setSlideOverOpen(false);
    // slight delay to clear content so the drawer content doesn't snap to null while animating out
    setTimeout(() => {
      setSelectedIssue(null);
      setIsCreatingForStatus(null);
    }, 300);
  };

  if (isLoading && issues.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoading && issues.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-24 px-6 animate-enter">
          <div className="w-16 h-16 bg-surface-800 rounded-2xl border border-white/5 flex items-center justify-center mb-6 shadow-xl shadow-black/20">
            <Add size="32" color="currentColor" variant="Outline" className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Your board is clear</h3>
          <p className="text-slate-400 text-sm mb-8 max-w-sm text-center">Create your first issue to kick off the development process and track your progress.</p>
          <button
            onClick={() => openCreateDialog('OPEN')}
            className="bg-brand-600 hover:bg-brand-500 text-white font-medium px-6 py-2.5 rounded-xl transition-btn active:scale-98 shadow-lg shadow-brand-500/20 ring-1 ring-white/10 ring-inset"
          >
            Create Issue
          </button>
        </div>
        
        <IssueSlideOverDetail
          isOpen={isSlideOverOpen}
          onClose={closeSlideOver}
          issue={selectedIssue}
          initialStatus={isCreatingForStatus}
        />
      </>
    );
  }

  return (
    <div className="relative">
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-kanban min-h-[60vh] snap-x snap-mandatory pt-2 mt-[-8px]">
        {COLUMNS.map(column => {
          const columnIssues = issues.filter(i => i.status === column.id);

          return (
            <div key={column.id} className="flex-none w-[280px] sm:w-[320px] snap-start flex flex-col">
              <div className="flex items-center justify-between mb-3 px-1 sticky top-0 bg-surface-900/80 backdrop-blur-sm z-10 py-2">
                <div className="flex items-center gap-2">
                  <column.icon size="16" variant="Bulk" color="currentColor" className={column.color} />
                  <h3 className="text-[13px] font-semibold text-slate-200">{column.label}</h3>
                  <span className="text-[11px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded-md font-medium">{columnIssues.length}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <button onClick={() => openCreateDialog(column.id)} className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
                    <Add size="14" color="currentColor" />
                  </button>
                  <button className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
                    <More size="14" color="currentColor" variant="Outline" />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-2 pt-1 pb-4">
                {columnIssues.map((issue, idx) => (
                  <div
                    key={issue.id}
                    className="animate-enter"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <IssueCard issue={issue} onClick={openDetail} />
                  </div>
                ))}
                
                {columnIssues.length === 0 && (
                  <div className="h-24 border border-dashed border-white/5 rounded-xl flex items-center justify-center">
                    <span className="text-xs text-slate-600 font-medium tracking-wide">No tasks</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <IssueSlideOverDetail
        isOpen={isSlideOverOpen}
        onClose={closeSlideOver}
        issue={selectedIssue}
        initialStatus={isCreatingForStatus}
      />
    </div>
  );
}
