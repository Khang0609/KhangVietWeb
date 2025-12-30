import { GalleryProjectDetail } from "@/components/gallery/GalleryProjectDetail";
import { notFound } from "next/navigation";
import { getApiUrl } from "@/lib/api";

// Revalidate every 60 seconds
export const revalidate = 60;

interface ProjectPageProps {
  params: Promise<{ slug: string }>; // Params bây giờ là Promise
}

const baseUrl = getApiUrl();

// Statically generate routes at build time
export async function generateStaticParams() {

  try {
    const projects = await fetch(
      `${baseUrl}/projects`
    ).then((res) => res.json());

    if (!Array.isArray(projects)) {
      return [];
    }

    return projects.map((project: { slug: string }) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.error("Failed to fetch projects for static generation:", error);
    return [];
  }
}

// Fetch a single project's data
async function getProject(slug: string) {
  try {
    const res = await fetch(
      `${baseUrl}/projects/${slug}`
    );

    if (!res.ok) {
      // If the response is not OK, trigger a 404 not found page
      if (res.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch project data");
    }

    return res.json();
  } catch (error) {
    console.error(`Failed to fetch project with slug ${slug}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  const project = await getProject(resolvedParams.slug);

  return {
    title: project?.name,
    description: `Xem chi tiết dự án ${project?.name} tại Quảng Cáo Khang Việt. Thi công chất lượng, bảo hành uy tín.`,
    openGraph: {
      images: [project?.image_urls[0]],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const projectData = await getProject(slug);

  if (!projectData) {
    notFound();
  }

  // --- Data Transformation ---
  // Map the API response to the format expected by the GalleryProjectDetail component
  const clean_project = {
    ...projectData,
    gallery_images: projectData.image_urls || [], // Critical fix: Map image_urls to gallery_images
    title: projectData.name, // Map name to title
    location: projectData.address || "Unknown", // Map address to location with a fallback
    year: projectData.completion_date
      ? new Date(projectData.completion_date).getFullYear().toString()
      : "N/A", // Extract year from completion_date
  };

  return <GalleryProjectDetail project={clean_project} />;
}