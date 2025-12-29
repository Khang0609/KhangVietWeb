"use client";

import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { ExternalLink } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import Link from "next/link";

export interface FeaturedProject {
  name: string;
  slug: string;
  address: string | null;
  company_slug: string;
  image_urls: string[];
}

interface FeaturedProjectsProps {
  projects: FeaturedProject[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (projects.length === 0) {
    return null; // Don't render the section if there are no featured projects
  }

  return (
    <section
      id="projects"
      ref={ref}
      className="py-24 bg-[#0A0A0A] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF6B00]/3 blur-[200px] rounded-full -z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-4">
            <span className="text-[#FF6B00] tracking-[0.3em] uppercase text-sm border border-[#FF6B00]/30 px-4 py-2">
              Dự án nổi bật
            </span>
          </div>
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] uppercase tracking-tight leading-tight">
            <span className="text-white">Những công trình </span>
            <span className="bg-gradient-to-r from-[#FF6B00] to-[#D32F2F] bg-clip-text text-transparent">
              ấn tượng
            </span>
          </h2>
        </motion.div>

        {/* Responsive Grid instead of Horizontal Scroll */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch gap-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {projects.map((project, index) => (
            <Link href={`/projects/${project.slug}`} key={project.slug}>
              <motion.div
                className="group relative cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative h-[550px] overflow-hidden border-2 border-[#FF6B00]/30 group-hover:border-[#FF6B00] transition-all duration-500">
                  <div className="relative h-[350px] overflow-hidden">
                    <ImageWithFallback
                      src={
                        project.image_urls[0] ||
                        "https://via.placeholder.com/450x350.png?text=No+Image"
                      }
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent"></div>
                    {/* <div className="absolute top-6 left-6 bg-[#FF6B00]/90 backdrop-blur-sm text-white px-4 py-2 text-sm uppercase tracking-wider">
                      {project.address || 'Dự án'}
                    </div> */}
                    <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <ExternalLink className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="p-8 bg-gradient-to-b from-[#0A0A0A] to-[#1E1E1E] h-full">
                    <div className="mb-3">
                      <span className="text-[#FF6B00]/70 text-sm tracking-wider uppercase">
                        {project.company_slug}
                      </span>
                    </div>
                    <h3 className="text-[clamp(1.5rem,2vw,1.75rem)] text-white mb-4 group-hover:text-[#FF6B00] transition-colors duration-300">
                      {project.name}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      Thi công tại: {project.address || "Không rõ địa chỉ"}.
                    </p>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
                <motion.div
                  className="h-1 bg-gradient-to-r from-[#FF6B00] to-[#D32F2F] mt-2"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                ></motion.div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
