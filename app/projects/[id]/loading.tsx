import { Skeleton, TableSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="mb-5 h-4 w-20" />
      <div className="mb-8 flex items-start gap-4">
        <Skeleton className="h-16 w-16 !rounded-3xl" />
        <div className="flex-1 space-y-3 pt-1">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      </div>
      <Skeleton className="mb-3 h-5 w-40" />
      <div className="mb-8">
        <TableSkeleton rows={3} />
      </div>
      <Skeleton className="mb-3 h-5 w-52" />
      <TableSkeleton rows={3} />
    </div>
  );
}
