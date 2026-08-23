import Skeleton from '../common/Skeleton';

export default function AdminLayoutSkeleton() {
  return (
    <div className="flex min-h-screen">
      {/* sidebar skeleton - hidden on mobile, matches real sidebar's responsive behavior */}
      <aside className="hidden md:block w-60 bg-primary p-6 shrink-0">
        <Skeleton className="h-6 w-32 bg-white/10 mb-8" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full bg-white/10 mb-4" />
        ))}
      </aside>

      <div className="flex-1">
        <div className="h-16 bg-surface border-b border-border flex items-center px-4 md:px-8">
          <Skeleton className="h-4 w-24 md:hidden" />
        </div>
        <div className="p-4 md:p-8">
          <Skeleton className="h-8 w-40 md:w-48 mb-6" />
          <Skeleton className="h-28 md:h-32 w-full mb-4" />
          <Skeleton className="h-28 md:h-32 w-full" />
        </div>
      </div>
    </div>
  );
}