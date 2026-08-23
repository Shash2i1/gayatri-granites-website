import Skeleton from './Skeleton';

export default function SkeletonText({ width = 'w-full', className = '' }) {
  return <Skeleton className={`h-4 ${width} ${className}`} />;
}