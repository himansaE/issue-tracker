import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Issue } from '../../types/issue';
import IssueCard from './IssueCard';

interface SortableIssueCardProps {
  issue: Issue;
  onClick: (issue: Issue) => void;
}

export default function SortableIssueCard({ issue, onClick }: SortableIssueCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: issue.id,
    data: { issue },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 200ms cubic-bezier(0.32, 0.72, 0, 1)',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <IssueCard
        issue={issue}
        onClick={onClick}
        isDragging={isDragging}
      />
    </div>
  );
}
