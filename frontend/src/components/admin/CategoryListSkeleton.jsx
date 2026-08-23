import Skeleton from '../common/Skeleton';

export default function CategoryListSkeleton() {
  return (
    <div>
      {/* mobile: skeleton cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-4">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>

      {/* desktop: skeleton table rows */}
      <div className="hidden md:block bg-surface border border-border rounded-lg overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-6 py-4 border-b border-border last:border-0">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-20 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}