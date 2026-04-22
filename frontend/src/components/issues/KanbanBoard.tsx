import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { IssueStatus } from '../../types/issue';
import type { Issue } from '../../types/issue';
import { useIssueStore } from '../../store/issueStore';
import KanbanColumn from './KanbanColumn';
import IssueCard from './IssueCard';
import { Record, Timer1, TickCircle, CloseCircle } from 'iconsax-react';

const COLUMNS: { id: IssueStatus; label: string; icon: any; color: string }[] = [
  { id: IssueStatus.OPEN, label: 'Open', icon: Record, color: 'text-amber-500' },
  { id: IssueStatus.IN_PROGRESS, label: 'In Progress', icon: Timer1, color: 'text-brand-400' },
  { id: IssueStatus.RESOLVED, label: 'Resolved', icon: TickCircle, color: 'text-emerald-500' },
  { id: IssueStatus.CLOSED, label: 'Closed', icon: CloseCircle, color: 'text-slate-500' },
];

interface KanbanBoardProps {
  onIssueClick: (issue: Issue) => void;
  onCreateClick: (status: IssueStatus) => void;
}

export default function KanbanBoard({ onIssueClick, onCreateClick }: KanbanBoardProps) {
  const { issues, reorderIssues } = useIssueStore();
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

  // 5px activation distance to stop accidental drags on click
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const draggedIssue = issues.find(i => i.id === event.active.id);
    setActiveIssue(draggedIssue ?? null);
  }, [issues]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIssue = issues.find(i => i.id === active.id);
    if (!activeIssue) return;

    const overIssue = issues.find(i => i.id === over.id);
    const targetStatus: IssueStatus = overIssue
      ? overIssue.status
      : (over.id as IssueStatus);

    if (activeIssue.status !== targetStatus) {
      const updated = issues.map(i =>
        i.id === activeIssue.id ? { ...i, status: targetStatus } : i
      );
      useIssueStore.getState().setIssues(updated);
    }
  }, [issues]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveIssue(null);
    if (!over) return;

    const activeIssue = issues.find(i => i.id === active.id);
    if (!activeIssue) return;

    const overIssue = issues.find(i => i.id === over.id);
    const targetStatus: IssueStatus = overIssue
      ? overIssue.status
      : (over.id as IssueStatus);



    const activeIndex = issues.findIndex(i => i.id === active.id);
    const overIndex = issues.findIndex(i => i.id === over.id);

    let reordered: Issue[];
    if (activeIssue.status === targetStatus && activeIndex !== overIndex) {
      // same column - reorder
      reordered = arrayMove(issues, activeIndex, overIndex);
    } else {
      reordered = issues;
    }

    const finalIssues = reordered.map((issue, idx) => ({ ...issue, order: idx }));

    const originalById = new Map(issues.map(i => [i.id, i]));
    const changedItems = finalIssues
      .filter(issue => {
        const original = originalById.get(issue.id);
        return !original || original.status !== issue.status || original.order !== issue.order;
      })
      .map(i => ({ id: i.id, status: i.status, order: i.order }));

    if (changedItems.length === 0) return;

    reorderIssues(changedItems, finalIssues);
  }, [issues, reorderIssues]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-kanban min-h-[60vh] snap-x snap-mandatory pt-2 mt-[-8px]">
        {COLUMNS.map(column => {
          const columnIssues = issues
            .filter(i => i.status === column.id)
            .sort((a, b) => a.order - b.order || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              label={column.label}
              icon={column.icon}
              color={column.color}
              issues={columnIssues}
              onCreateClick={() => onCreateClick(column.id)}
              onIssueClick={onIssueClick}
            />
          );
        })}
      </div>

      <DragOverlay dropAnimation={{
        duration: 200,
        easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
      }}>
        {activeIssue ? (
          <IssueCard issue={activeIssue} onClick={() => { }} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
