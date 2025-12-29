import React from "react";

// --- Primitives ---
export const SkeletonBuilder = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-white/5 ${className}`} />
);

// --- Product Card Skeleton (Shop) ---
export const ProductCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-lg border border-transparent bg-[#1E1E1E]">
      {/* Image Placeholder - Aspect 4:3 */}
      <div className="relative aspect-4/3 animate-pulse bg-[#2C2C2C]" />

      {/* Content Placeholder */}
      <div className="space-y-3 p-4">
        {/* Title */}
        <div className="h-6 w-3/4 animate-pulse rounded bg-white/10" />
        {/* Price */}
        <div className="h-7 w-1/2 animate-pulse rounded bg-[#FF6B00]/20" />
      </div>
    </div>
  );
};

// --- Project Card Skeleton (Projects List) ---
export const ProjectCardSkeleton = () => {
  return (
    <div className="mb-8">
      {/* Image Placeholder - Aspect Square */}
      <div className="mb-4 aspect-square w-full animate-pulse overflow-hidden rounded-lg border border-white/5 bg-[#1E1E1E]" />

      {/* Meta Placeholder */}
      <div className="space-y-2 px-1">
        {/* Title */}
        <div className="h-6 w-3/4 animate-pulse rounded bg-white/10" />
        {/* Location • Year */}
        <div className="h-5 w-1/2 animate-pulse rounded bg-white/5" />
      </div>
    </div>
  );
};

// --- Gallery Image Skeleton (Project Detail) ---
export const GalleryImageSkeleton = () => {
  return (
    <div className="mb-4 h-[200px] w-full animate-pulse rounded-lg border border-white/5 bg-[#2C2C2C]" />
  );
};
