"use client";

import { useState } from "react";
import { ChevronLeft, Briefcase, MapPin, Calendar } from "lucide-react";
import { ImageWithFallback } from "../ImageWithFallback";
import { useRouter } from "next/navigation";

interface Project {
  title: string;
  slug: string;
  client_name: string;
  location: string;
  completion_year: string;
  cover_image: string;
  gallery_images: string[];
  description: string;
}

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#121212]/95 backdrop-blur-md border-b border-[#FF6B00]/20">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white/70 hover:text-[#FF6B00] transition-colors"
          >
            <ChevronLeft size={24} />
            <span>Quay lại</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12">
          {/* Left Side - Images & Description */}
          <div>
            {/* Main Image */}
            <div className="aspect-4/3 bg-[#2C2C2C] rounded-lg overflow-hidden mb-4">
              <ImageWithFallback
                src={project.gallery_images[selectedImage]}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {project.gallery_images.length > 1 && (
              <div className="flex gap-4 mb-8">
                {project.gallery_images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-4/3 w-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-[#FF6B00]"
                        : "border-transparent hover:border-white/30"
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${project.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Project Info Panel */}
          <div className="sticky top-32 h-fit">
            <div className="bg-[#1E1E1E] rounded-lg p-6 space-y-6 border border-[#FF6B00]/20">
              {/* Project Name */}
              <div>
                <h1 className="text-2xl mb-4">{project.title}</h1>
              </div>

              {/* Project Info */}
              <div className="space-y-4">
                <div className="flex items-center text-white/70">
                  <Briefcase size={16} className="mr-3 text-[#FF6B00]" />
                  <span>Khách hàng: {project.client_name}</span>
                </div>
                <div className="flex items-center text-white/70">
                  <MapPin size={16} className="mr-3 text-[#FF6B00]" />
                  <span>Địa điểm: {project.location}</span>
                </div>
                <div className="flex items-center text-white/70">
                  <Calendar size={16} className="mr-3 text-[#FF6B00]" />
                  <span>Năm hoàn thành: {project.completion_year}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="text-center text-white/50 text-sm pt-4 border-t border-white/10">
                <p>Quan tâm đến dịch vụ của chúng tôi? Gọi ngay:</p>
                <a
                  href="tel:0123456789"
                  className="text-[#FF6B00] hover:underline"
                >
                  0123 456 789
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
