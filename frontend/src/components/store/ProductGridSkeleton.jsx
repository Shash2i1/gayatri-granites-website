import Skeleton from '../common/Skeleton';

export default function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-border rounded-lg overflow-hidden">
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="p-3">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}