import { GalleryProjectCard } from "./GalleryProjectCard";
import { Project } from "@/types/project";


interface GalleryGridProps {
  projects: Project[];
  companyName?: string;
}

export function GalleryGrid({ projects, companyName }: GalleryGridProps) {
  const title = companyName ? (
    <>
      <span className="text-white/70">DỰ ÁN CỦA </span>
      <span className="text-[#FF6B00]">{companyName.toUpperCase()}</span>
    </>
  ) : (
    <>
      <span className="text-white/70">BỘ SƯU TẬP </span>
      <span className="text-[#FF6B00]">DỰ ÁN</span>
    </>
  );
  
  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-block border border-[#FF6B00] px-4 py-1 rounded mb-4">
          <span className="text-[#FF6B00] tracking-wider uppercase">Dự Án</span>
        </div>
        <h1 className="text-white mb-4">
          {title}
        </h1>
        <p className="text-white/60 max-w-2xl">
          {companyName 
            ? `Khám phá những dự án mà Khang Việt đã thực hiện cho ${companyName}.`
            : `Khám phá những dự án nổi bật của Khang Việt - nơi nghệ thuật thiết kế 
               kết hợp hoàn hảo với chất lượng thi công cao cấp.`
          }
        </p>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <GalleryProjectCard
            key={project.slug}
            slug={project.slug}
            title={project.title}
            location={project.location}
            year={project.completion_year}
            image={project.cover_image}
          />
        ))}
      </div>
    </div>
  );
}
