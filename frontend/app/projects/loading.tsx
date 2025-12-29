import { ProjectCardSkeleton, SkeletonBuilder } from "@/components/skeletons";
import { GalleryHeader } from "@/components/gallery/GalleryHeader";

export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* We can use the real GalleryHeader since it's client-side and static enough, 
          or mock it to avoid hydration mismatch if it relies on props. 
          Assuming it's safe to separate strictly content skeletons. */}
      {/* Actually GalleryHeader is simple text, let's keep the layout structure manual to be safe from simple flickers or re-use existing if stable.
          The user asked to sync design. GalleryHeader is pretty standard. 
          Let's use a Skeleton for the unique "Title" part if it's dynamic, 
          but usually the header "PORTFOLIO" is static. 
          However, GalleryGrid has the dynamic title "DỰ ÁN CỦA ...".
      */}
      {/* Simulate GalleryHeader Space or just import it if it has no data dependency */}
      <div className="h-20" /> {/* Spacer for Nav */}
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Header Section Skeleton */}
        <div className="mb-12 space-y-4">
          <SkeletonBuilder className="h-8 w-24 rounded border border-[#FF6B00]/30 bg-transparent" />
          <SkeletonBuilder className="h-10 w-96 rounded" />
          <div className="max-w-2xl space-y-2">
            <SkeletonBuilder className="h-4 w-full rounded" />
            <SkeletonBuilder className="h-4 w-2/3 rounded" />
          </div>
        </div>

        {/* Project Grid Skeleton */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
