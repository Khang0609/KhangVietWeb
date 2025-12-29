import { GalleryImageSkeleton, SkeletonBuilder } from "@/components/skeletons";

export default function ProjectDetailLoading() {
  return (
    <div className="min-h-screen bg-[#121212] pt-24">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Back Button Skeleton */}
        <div className="mb-8 flex items-center gap-2">
          <SkeletonBuilder className="h-5 w-5 rounded-full" />
          <SkeletonBuilder className="h-5 w-40 rounded" />
        </div>

        {/* Project Header Skeleton */}
        <div className="mb-12">
          {/* Badge */}
          <div className="mb-4 inline-block">
            <SkeletonBuilder className="h-8 w-20 rounded" />
          </div>

          {/* Title */}
          <SkeletonBuilder className="mb-4 h-10 w-1/2 rounded" />

          {/* Meta */}
          <SkeletonBuilder className="mb-6 h-5 w-64 rounded" />

          {/* Description */}
          <div className="max-w-3xl space-y-2">
            <SkeletonBuilder className="h-4 w-full rounded" />
            <SkeletonBuilder className="h-4 w-full rounded" />
            <SkeletonBuilder className="h-4 w-3/4 rounded" />
          </div>
        </div>

        {/* Masonry Grid Skeleton */}
        <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
          {/* 
            Generating random-looking heights for masonry feel is hard with static loops,
            but the skeleton component uses fixed h-[200px] as per the component found earlier.
            We will assume the simple grid for loading state.
          */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <GalleryImageSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
