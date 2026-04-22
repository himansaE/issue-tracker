import { useState, useEffect } from 'react';
import { useIssueStore } from '../../store/issueStore';
import { IssueStatus, IssuePriority } from '../../types/issue';
import type { Issue } from '../../types/issue';
import { Add, SearchNormal1 } from 'iconsax-react';
import IssueSlideOverDetail from './IssueSlideOverDetail';
import KanbanBoard from './KanbanBoard';
import KanbanSkeleton from './KanbanSkeleton';
import { useDebounce } from '../../lib/hooks/useDebounce';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export default function IssueList() {
  const { issues, isLoading, fetchIssues } = useIssueStore();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isSlideOverOpen, setSlideOverOpen] = useState(false);
  const [isCreatingForStatus, setIsCreatingForStatus] = useState<IssueStatus | null>(null);

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    fetchIssues({
      search: debouncedSearch || undefined,
      priority: priorityFilter || undefined,
    });
  }, [debouncedSearch, priorityFilter, fetchIssues]);

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

  const priorityLabels: Record<string, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    URGENT: 'Urgent',
  };

  const isEmpty = !isLoading && issues.length === 0;

  if (isLoading && issues.length === 0) {
    return (
      <div className="relative">
        <KanbanSkeleton />
      </div>
    );
  }

  return (
    <>
      {/* Search + filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <SearchNormal1
            size="15"
            variant="Outline"
            color="currentColor"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search issues..."
            className="w-full bg-surface-800 border border-white/10 text-white text-sm placeholder:text-slate-500 rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <Select
          value={priorityFilter || 'ALL'}
          onValueChange={(val) => setPriorityFilter(val === 'ALL' ? '' : val)}
        >
          <SelectTrigger className="w-40 bg-surface-800 border border-white/10 text-sm text-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-brand-500">
            <SelectValue placeholder="All priorities" />
          </SelectTrigger>
          <SelectContent className="bg-surface-800 border-white/10 text-slate-200 rounded-lg shadow-xl">
            <SelectItem value="ALL" className="cursor-pointer rounded-md mx-1 my-1 text-sm">
              All priorities
            </SelectItem>
            {Object.values(IssuePriority).map((p) => (
              <SelectItem key={p} value={p} className="cursor-pointer rounded-md mx-1 my-1 text-sm">
                {priorityLabels[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 animate-enter">
          <div className="w-16 h-16 bg-surface-800 rounded-2xl border border-white/5 flex items-center justify-center mb-6 shadow-xl shadow-black/20">
            <Add size="32" color="currentColor" variant="Outline" className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
            {search || priorityFilter ? 'No issues match your filters' : 'Your board is clear'}
          </h3>
          <p className="text-slate-400 text-sm mb-8 max-w-sm text-center">
            {search || priorityFilter
              ? 'Try adjusting the search or filters to find what you\'re looking for.'
              : 'Create your first issue to kick off the development process and track your progress.'}
          </p>
          {!search && !priorityFilter && (
            <button
              type="button"
              onClick={() => openCreateDialog('OPEN')}
              className="bg-brand-600 hover:bg-brand-500 text-white font-medium px-6 py-2.5 rounded-xl transition-btn active:scale-98 shadow-lg shadow-brand-500/20 ring-1 ring-white/10 ring-inset"
            >
              Create Issue
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          <KanbanBoard onIssueClick={openDetail} onCreateClick={openCreateDialog} />
        </div>
      )}

      <IssueSlideOverDetail
        isOpen={isSlideOverOpen}
        onClose={closeSlideOver}
        issue={selectedIssue}
        initialStatus={isCreatingForStatus}
      />
    </>
  );
}
