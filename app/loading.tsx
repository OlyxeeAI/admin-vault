import {
  PageHeaderSkeleton,
  StatCardsSkeleton,
  TableSkeleton,
} from "@/components/Skeleton";

export default function Loading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <StatCardsSkeleton count={6} />
      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <TableSkeleton rows={5} />
        </div>
        <div className="xl:col-span-2">
          <TableSkeleton rows={5} />
        </div>
      </div>
    </div>
  );
}
