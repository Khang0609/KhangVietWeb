import Link from "next/link";
import { ImageWithFallback } from "@/components/ImageWithFallback";

interface GalleryProjectCardProps {
  slug: string;
  title: string;
  location: string;
  year: string;
  image: string;
}

export function GalleryProjectCard({
  title,
  location,
  year,
  image,
  slug,
}: GalleryProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className="group cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-[#1E1E1E] mb-4 border border-white/5 group-hover:border-[#FF6B00] transition-all duration-300">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Metadata */}
      <div className="px-1">
        <h3 className="text-white mb-1">{title}</h3>
        <p className="text-white/50">
          {location} • {year}
        </p>
      </div>
    </Link>
  );
}
