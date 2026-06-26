import { PageHeaderSkeleton, CardGridSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <CardGridSkeleton count={6} />
    </div>
  );
}
