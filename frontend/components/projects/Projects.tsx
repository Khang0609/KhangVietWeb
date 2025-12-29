"use client";

import { useState } from "react";
import { Briefcase, MapPin } from "lucide-react";
import { ImageWithFallback } from "../ImageWithFallback";
import { useRouter } from "next/navigation";

interface Project {
  slug: string;
  title: string;
  client_name: string;
  location: string;
  cover_image: string;
}

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  const router = useRouter();

  const handleProjectClick = (slug: string) => {
    router.push(`/projects/${slug}`);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#121212]/95 backdrop-blur-md border-b border-[#FF6B00]/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={handleBackToHome}
              className="relative group cursor-pointer"
            >
              <span className="text-[24px] tracking-widest bg-gradient-to-r from-[#FF6B00] to-[#D32F2F] bg-clip-text text-transparent transition-all duration-300 group-hover:tracking-[0.3em]">
                KHANG VIỆT
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Main Content - Project Grid */}
        <main className="flex-1">
          {/* Category Title */}
          <div className="mb-8">
            <h2 className="text-4xl mb-2 relative inline-block">
              Dự án đã thực hiện
              <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-[#FF6B00]"></span>
            </h2>
            <p className="text-white/50 mt-4">{projects.length} dự án</p>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.slug}
                onClick={() => handleProjectClick(project.slug)}
                className="group cursor-pointer bg-[#1E1E1E] rounded-lg overflow-hidden hover:border-[#FF6B00]/50 border border-transparent transition-all duration-300"
              >
                {/* Project Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#2C2C2C]">
                  <ImageWithFallback
                    src={project.cover_image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Project Info */}
                <div className="p-4">
                  <h3 className="text-white group-hover:text-[#FF6B00] transition-colors mb-2">
                    {project.title}
                  </h3>
                  <div className="flex items-center text-white/50 text-sm mb-1">
                    <Briefcase size={14} className="mr-2" />
                    <span>{project.client_name}</span>
                  </div>
                  <div className="flex items-center text-white/50 text-sm">
                    <MapPin size={14} className="mr-2" />
                    <span>{project.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/50 text-lg">
                Chưa có dự án nào để hiển thị.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
