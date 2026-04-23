import { useState, useEffect } from 'react';
import SlideOver from '../ui/SlideOver';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import Modal from '../ui/Modal';
import { useIssueStore } from '../../store/issueStore';
import { useAuthStore } from '../../store/authStore';
import { IssueStatus, IssuePriority, IssueSeverity } from '../../types/issue';
import type { Issue, CreateIssueInput, UpdateIssueInput } from '../../types/issue';
import { Trash, Record, ArrowDown, ArrowRight, ArrowUp, Warning2, Shield, ShieldTick, ShieldCross, Danger } from 'iconsax-react';

interface IssueSlideOverDetailProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue | null;
  initialStatus: IssueStatus | null;
}

export default function IssueSlideOverDetail({ isOpen, onClose, issue, initialStatus }: IssueSlideOverDetailProps) {
  const { createIssue, updateIssue, deleteIssue } = useIssueStore();
  const { user } = useAuthStore();

  const isEditing = !!issue;

  const issueAuthorId = issue?.author
    ? (typeof issue.author === 'string' ? issue.author : (issue.author._id || issue.author.id))
    : null;

  const isCreatorLock = isEditing && issueAuthorId !== user?.id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IssueStatus>('OPEN');
  const [priority, setPriority] = useState<IssuePriority>('MEDIUM');
  const [severity, setSeverity] = useState<IssueSeverity>('MEDIUM');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [pendingStatusChange, setPendingStatusChange] = useState<IssueStatus | null>(null);
  const [openSelect, setOpenSelect] = useState<'status' | 'priority' | 'severity' | null>(null);
  // Sync state when issue or initialStatus changes
  useEffect(() => {
    if (isOpen) {
      if (issue) {
        setTitle(issue.title);
        setDescription(issue.description || '');
        setStatus(issue.status);
        setPriority(issue.priority);
        setSeverity(issue.severity);
      } else {
        setTitle('');
        setDescription('');
        setStatus(initialStatus || 'OPEN');
        setPriority('MEDIUM');
        setSeverity('MEDIUM');
      }
      setError('');
      setPendingStatusChange(null);
      setOpenSelect(null);
    }
  }, [isOpen, issue, initialStatus]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Issue title is required");
      return;
    }

    if (!description.trim()) {
      setError("Issue description is required");
      return;
    }

    if (isCreatorLock) {
      setError("You are not the creator of this issue so you cannot edit it.");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (isEditing) {
        const updateData: UpdateIssueInput = { title, description, status, priority, severity };
        await updateIssue(issue.id, updateData);
      } else {
        const createData: CreateIssueInput = { title, description, status, priority, severity };
        await createIssue(createData);
      }
      onClose();
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.errors) {
        console.log(data.errors);
        const fieldErrors = Object.values(data.errors).flat().join(', ');
        setError(fieldErrors || 'Validation failed.');
      } else {
        setError(data?.message || err?.message || 'Something went wrong while saving the issue.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!issue) return;
    setIsSubmitting(true);
    try {
      await deleteIssue(issue.id);
      setDeleteModalOpen(false);
      onClose();
    } catch (err: any) {
      const data = err?.response?.data;
      setError(data?.message || err?.message || 'Failed to delete issue.');
      setDeleteModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SlideOver
        isOpen={isOpen}
        onClose={onClose}
        title={isEditing ? `Edit Issue ${issue?.shortId ? `(${issue.shortId})` : ''}` : 'New Task'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full grow">
          <div className="flex-1 space-y-6 pt-2">
            {isCreatorLock && (
              <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm rounded-lg">
                View-only mode. You can only edit or delete issues that you created.
              </div>
            )}

            <Input
              label="Title"
              id="title"
              value={title}
              error={error && error.toLowerCase().includes('title') ? error : ''}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="E.g. Fix navigation bar contrast"
              disabled={isCreatorLock || isSubmitting}
            />

            <Textarea
              label="Description"
              id="description"
              rows={4}
              value={description}
              error={error && error.toLowerCase().includes('description') ? error : ''}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError('');
              }}
              disabled={isCreatorLock || isSubmitting}
              placeholder="Give some details..."
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-300">Status</label>
                <Select
                  open={openSelect === 'status'}
                  onOpenChange={(open) => setOpenSelect(open ? 'status' : null)}
                  value={status}
                  onValueChange={(val) => {
                    const next = val as IssueStatus;
                    if (next === 'RESOLVED' || next === 'CLOSED') {
                      setPendingStatusChange(next);
                    } else {
                      setStatus(next);
                    }
                  }}
                  disabled={isCreatorLock || isSubmitting}
                >
                  <SelectTrigger className="w-full bg-surface-800 border border-white/10 text-white focus:bg-surface-700 focus:ring-2 focus:ring-brand-500 rounded-lg py-[11px] px-3.5 shadow-sm">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-800 border-white/10 text-slate-200 rounded-lg shadow-xl">
                    {Object.values(IssueStatus).map(s => {
                      const color = s === 'OPEN' ? 'text-amber-500' : s === 'IN_PROGRESS' ? 'text-brand-400' : s === 'RESOLVED' ? 'text-emerald-500' : 'text-slate-500';
                      const label = s === 'OPEN' ? 'Open' : s === 'IN_PROGRESS' ? 'In Progress' : s === 'RESOLVED' ? 'Resolved' : 'Closed';
                      return (
                        <SelectItem key={s} value={s} className="cursor-pointer rounded-md mx-1 my-1">
                          <div className="flex items-center gap-2">
                            <Record size="14" variant="Bulk" color="currentColor" className={color} />
                            <span className="text-[13px] font-medium text-slate-200">{label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-300">Priority</label>
                <Select
                  open={openSelect === 'priority'}
                  onOpenChange={(open) => setOpenSelect(open ? 'priority' : null)}
                  value={priority}
                  onValueChange={(val) => setPriority(val as IssuePriority)}
                  disabled={isCreatorLock || isSubmitting}
                >
                  <SelectTrigger className="w-full bg-surface-800 border border-white/10 text-white focus:bg-surface-700 focus:ring-2 focus:ring-brand-500 rounded-lg py-[11px] px-3.5 shadow-sm">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-800 border-white/10 text-slate-200 rounded-lg shadow-xl">
                    {Object.values(IssuePriority).map(p => {
                      const color = p === 'LOW' ? 'text-blue-400' : p === 'MEDIUM' ? 'text-amber-500' : p === 'HIGH' ? 'text-orange-500' : 'text-red-500';
                      const Icon = p === 'LOW' ? ArrowDown : p === 'MEDIUM' ? ArrowRight : p === 'HIGH' ? ArrowUp : Warning2;
                      return (
                        <SelectItem key={p} value={p} className="cursor-pointer rounded-md mx-1 my-1">
                          <div className="flex items-center gap-2">
                            <Icon size="14" variant="Bulk" color="currentColor" className={color} />
                            <span className="text-[13px] font-medium text-slate-200">{p.charAt(0) + p.slice(1).toLowerCase()}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-300">Severity</label>
              <Select
                open={openSelect === 'severity'}
                onOpenChange={(open) => setOpenSelect(open ? 'severity' : null)}
                value={severity}
                onValueChange={(val) => setSeverity(val as IssueSeverity)}
                disabled={isCreatorLock || isSubmitting}
              >
                <SelectTrigger className="w-full bg-surface-800 border border-white/10 text-white focus:bg-surface-700 focus:ring-2 focus:ring-brand-500 rounded-lg py-[11px] px-3.5 shadow-sm">
                  <SelectValue placeholder="Select Severity" />
                </SelectTrigger>
                <SelectContent className="bg-surface-800 border-white/10 text-slate-200 rounded-lg shadow-xl">
                  {Object.values(IssueSeverity).map(s => {
                    const color = s === 'LOW' ? 'text-slate-400' : s === 'MEDIUM' ? 'text-blue-400' : s === 'HIGH' ? 'text-amber-500' : 'text-red-500';
                    const Icon = s === 'LOW' ? Shield : s === 'MEDIUM' ? ShieldTick : s === 'HIGH' ? ShieldCross : Danger;
                    return (
                      <SelectItem key={s} value={s} className="cursor-pointer rounded-md mx-1 my-1">
                        <div className="flex items-center gap-2">
                          <Icon size="14" variant="Outline" color="currentColor" className={color} />
                          <span className="text-[13px] font-medium text-slate-200">{s.charAt(0) + s.slice(1).toLowerCase()}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {isEditing && issue?.author && typeof issue.author === 'object' && (
              <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 shrink-0 rounded-full bg-brand-600 flex items-center justify-center text-[10px] font-bold text-white tracking-widest shadow-inner overflow-hidden border border-white/10">
                  {issue.author.avatarUrl ? (
                    <img src={issue.author.avatarUrl} alt={issue.author.name} className="w-full h-full object-cover" />
                  ) : (
                    issue.author.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Created by</span>
                  <span className="text-sm text-slate-300 font-medium">{issue.author.name}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex gap-3 pb-8">
            {!isCreatorLock && (
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {isEditing ? 'Save Changes' : 'Create Issue'}
              </Button>
            )}

            {isEditing && !isCreatorLock && (
              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                disabled={isSubmitting}
                className="px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors flex items-center justify-center outline-none active:scale-[0.97]"
                title="Delete Issue"
              >
                <Trash size="18" variant="Outline" color="currentColor" />
              </button>
            )}
          </div>
        </form>
      </SlideOver>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Issue"
        description="Are you sure you want to delete this issue? This action cannot be undone."
      >
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors outline-none"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors outline-none active:scale-[0.97]"
          >
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={!!pendingStatusChange}
        onClose={() => setPendingStatusChange(null)}
        title={`Mark as ${pendingStatusChange === 'RESOLVED' ? 'Resolved' : 'Closed'}?`}
        description={
          pendingStatusChange === 'RESOLVED'
            ? 'This marks the issue as resolved. You can reopen it at any time.'
            : 'This will close the issue. You can reopen it at any time.'
        }
      >
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setPendingStatusChange(null)}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors outline-none"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (!pendingStatusChange) return;
              setStatus(pendingStatusChange);
              setPendingStatusChange(null);
            }}
            className="px-4 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-500 transition-colors outline-none active:scale-[0.97]"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </>
  );
}
