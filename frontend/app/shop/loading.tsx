import { ProductCardSkeleton, SkeletonBuilder } from "@/components/skeletons";

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Fake Header for layout stability */}
      <header className="sticky top-0 z-50 h-[88px] border-b border-[#FF6B00]/20 bg-[#121212]/95 backdrop-blur-md" />

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Sidebar Skeletons */}
          <aside className="w-full shrink-0 md:w-64">
            <div className="sticky top-32 space-y-2">
              <SkeletonBuilder className="mb-4 h-6 w-24 rounded" />
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonBuilder key={i} className="h-12 w-full rounded-lg" />
              ))}

              {/* Consult Box Skeleton */}
              <div className="mt-12 space-y-3 rounded-lg border border-[#FF6B00]/20 bg-[#1E1E1E] p-6">
                <SkeletonBuilder className="h-5 w-32 rounded" />
                <SkeletonBuilder className="h-4 w-full rounded" />
                <SkeletonBuilder className="h-4 w-2/3 rounded" />
              </div>
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="flex-1">
            {/* Category Title Area */}
            <div className="mb-8 space-y-4">
              <SkeletonBuilder className="h-10 w-64 rounded" />
              <SkeletonBuilder className="h-5 w-32 rounded" />
            </div>

            {/* Product Grid Skeleton */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
