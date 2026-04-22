// Skeleton for a single issue card
function CardSkeleton() {
  return (
    <div className="bg-[#1A1D24] rounded-[20px] p-4 flex flex-col gap-3 border border-[#2A2E37]">
      {/* Header row: status dot + ID + more icon */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="skeleton w-2 h-2 rounded-full" />
          <div className="skeleton h-2.5 w-16 rounded" />
        </div>
        <div className="skeleton w-4 h-4 rounded" />
      </div>

      {/* Title lines */}
      <div className="flex flex-col gap-1.5 mt-1">
        <div className="skeleton h-3.5 w-full rounded" />
        <div className="skeleton h-3.5 w-3/4 rounded" />
      </div>

      {/* Footer: avatar + priority badge */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="skeleton w-[26px] h-[26px] rounded-full" />
        <div className="skeleton h-5 w-16 rounded-md" />
      </div>
    </div>
  );
}

// Skeleton for one full Kanban column
function ColumnSkeleton({ cardCount }: { cardCount: number }) {
  return (
    <div className="flex-none w-[280px] sm:w-[320px] snap-start flex flex-col">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1 py-2">
        <div className="flex items-center gap-2">
          <div className="skeleton w-4 h-4 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-4 w-5 rounded-md" />
        </div>
        <div className="flex items-center gap-1">
          <div className="skeleton w-5 h-5 rounded" />
          <div className="skeleton w-5 h-5 rounded" />
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 pt-1">
        {Array.from({ length: cardCount }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Distribution of skeleton cards per column — matches a realistic board
const SKELETON_COLUMNS = [3, 2, 1, 1];

export default function KanbanSkeleton() {
  return (
    <div
      className="flex gap-4 md:gap-6 overflow-x-hidden pb-6 min-h-[60vh] pt-2 mt-[-8px]"
      aria-label="Loading board…"
      aria-busy="true"
    >
      {SKELETON_COLUMNS.map((count, i) => (
        <ColumnSkeleton key={i} cardCount={count} />
      ))}
    </div>
  );
}
