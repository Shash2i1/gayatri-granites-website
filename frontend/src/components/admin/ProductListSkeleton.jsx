import Skeleton from '../common/Skeleton';

export default function ProductListSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-4 flex gap-3">
            <Skeleton className="w-16 h-16 shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-surface border border-border rounded-lg overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-6 py-4 border-b border-border last:border-0">
            <Skeleton className="w-10 h-10 shrink-0" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}