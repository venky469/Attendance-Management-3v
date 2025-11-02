import { TableSkeleton } from "@/components/loading-skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3"></div>
      <div className="h-8 bg-gray-100 rounded animate-pulse w-1/2"></div>
      <TableSkeleton rows={6} />
    </div>
  )
}
