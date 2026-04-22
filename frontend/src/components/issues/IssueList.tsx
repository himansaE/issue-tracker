import { useState } from 'react';
import { useIssueStore } from '../../store/issueStore';
import { IssueStatus } from '../../types/issue';
import type { Issue } from '../../types/issue';
import { Add } from 'iconsax-react';
import IssueSlideOverDetail from './IssueSlideOverDetail';
import KanbanBoard from './KanbanBoard';
import KanbanSkeleton from './KanbanSkeleton';

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
    setTimeout(() => {
      setSelectedIssue(null);
      setIsCreatingForStatus(null);
    }, 300);
  };

  if (isLoading && issues.length === 0) {
    return (
      <div className="relative">
        <KanbanSkeleton />
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
            type="button"
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
      <KanbanBoard onIssueClick={openDetail} onCreateClick={openCreateDialog} />

      <IssueSlideOverDetail
        isOpen={isSlideOverOpen}
        onClose={closeSlideOver}
        issue={selectedIssue}
        initialStatus={isCreatingForStatus}
      />
    </div>
  );
}
