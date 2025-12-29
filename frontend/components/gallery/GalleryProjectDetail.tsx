"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Project } from "@/types/project";

interface GalleryProjectDetailProps {
  project: Project;
}

export function GalleryProjectDetail({ project }: GalleryProjectDetailProps) {
  return (
    <div className="min-h-screen bg-[#121212] pt-24">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Back Button */}
        <Link
          href="/projects"
          className="group mb-8 flex items-center gap-2 text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span>Quay lại Bộ sưu tập</span>
        </Link>

        {/* Project Header */}
        <div className="mb-12">
          <div className="mb-4 inline-block rounded border border-[#FF6B00] px-4 py-1">
            <span className="tracking-wider text-[#FF6B00] uppercase">
              Dự Án
            </span>
          </div>
          <h1 className="mb-2 text-white">{project.title}</h1>
          <p className="text-white/60">
            {project.location} • {project.completion_year}
          </p>
          {project.description && (
            <p className="mt-4 max-w-3xl text-white/80">
              {project.description}
            </p>
          )}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
          {project.gallery_images.map((image, index) => (
            <div
              key={index}
              className="group relative mb-4 h-[200px] w-auto cursor-pointer overflow-hidden rounded-lg border border-white/5 transition-all duration-300 hover:border-[#FF6B00]"
            >
              <ImageWithFallback
                src={image}
                alt={`${project.title} - Hình ${index + 1}`}
                className="absolute transform transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
