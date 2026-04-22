import { useState, useEffect } from 'react';
import SlideOver from '../ui/SlideOver';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import Modal from '../ui/Modal';
import { useIssueStore } from '../../store/issueStore';
import { useAuthStore } from '../../store/authStore';
import { IssueStatus, IssuePriority, IssueSeverity } from '../../types/issue';
import type { Issue, CreateIssueInput, UpdateIssueInput } from '../../types/issue';
import { Trash } from 'iconsax-react';

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
    }
  }, [isOpen, issue, initialStatus]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

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
      setError(err?.message || 'Something went wrong');
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
      setError(err?.message || 'Failed to delete issue');
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
        title={isEditing ? 'Edit Issue' : 'New Task'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full grow">
          <div className="flex-1 space-y-6 pt-2">

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                {error}
              </div>
            )}

            {isCreatorLock && (
              <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm rounded-lg">
                View-only mode. You can only edit or delete issues that you created.
              </div>
            )}

            <Input
              label="Title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Fix navigation bar contrast"
              disabled={isCreatorLock || isSubmitting}
            />

            <div className="space-y-1">
              <label htmlFor="description" className="block text-sm font-medium text-slate-300">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isCreatorLock || isSubmitting}
                className="block w-full bg-surface-950 border border-white/10 rounded-lg py-2.5 px-3.5 text-sm outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-slate-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Give some details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-300">Status</label>
                <Select
                  value={status}
                  onValueChange={(val) => setStatus(val as IssueStatus)}
                  disabled={isCreatorLock || isSubmitting}
                >
                  <SelectTrigger className="w-full bg-surface-950 border-white/10 text-white focus:ring-1 focus:ring-brand-500 rounded-lg">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-900 border-white/5 text-slate-200">
                    {Object.values(IssueStatus).map(s => (
                      <SelectItem key={s} value={s} className="hover:bg-surface-800 focus:bg-surface-800">
                        {s.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-300">Priority</label>
                <Select
                  value={priority}
                  onValueChange={(val) => setPriority(val as IssuePriority)}
                  disabled={isCreatorLock || isSubmitting}
                >
                  <SelectTrigger className="w-full bg-surface-950 border-white/10 text-white focus:ring-1 focus:ring-brand-500 rounded-lg">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-900 border-white/5 text-slate-200">
                    {Object.values(IssuePriority).map(p => (
                      <SelectItem key={p} value={p} className="hover:bg-surface-800 focus:bg-surface-800">
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-300">Severity</label>
              <Select
                value={severity}
                onValueChange={(val) => setSeverity(val as IssueSeverity)}
                disabled={isCreatorLock || isSubmitting}
              >
                <SelectTrigger className="w-full bg-surface-950 border-white/10 text-white focus:ring-1 focus:ring-brand-500 rounded-lg">
                  <SelectValue placeholder="Select Severity" />
                </SelectTrigger>
                <SelectContent className="bg-surface-900 border-white/5 text-slate-200">
                  {Object.values(IssueSeverity).map(s => (
                    <SelectItem key={s} value={s} className="hover:bg-surface-800 focus:bg-surface-800">
                      {s}
                    </SelectItem>
                  ))}
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
                disabled={isSubmitting || !title.trim()}
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
                <Trash size="18" />
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
    </>
  );
}
