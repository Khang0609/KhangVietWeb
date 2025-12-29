import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GalleryHeader } from "@/components/gallery/GalleryHeader";
import { GalleryFooter } from "@/components/gallery/GalleryFooter";
import { Project } from "@/types/project";
import { Company } from "@/components/home/ClientMarquee";
import { getApiUrl } from "@/lib/api";

// 1. Interface for the raw data from the backend API
interface BackendProject {
  _id: string;
  name: string;
  address: string | null;
  image_urls: string[];
  slug: string;
  company_slug: string; // The backend sends this, we can map it to client_name
  completion_date: string | null;
}

interface GalleryProps {
  companies: Company[];
}

// The frontend Project interface is defined in @/types/project.ts
// It expects: { title, slug, client_name, location, completion_year, cover_image, gallery_images, description? }

async function getProjects(company_slug?: string): Promise<Project[]> {
  try {
    const baseUrl = `${getApiUrl()}/projects`;
    const url = company_slug
      ? `${baseUrl}?company_slug=${company_slug}`
      : baseUrl;

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      throw new Error("Failed to fetch projects from backend");
    }

    const raw_data: BackendProject[] = await res.json();

    // 2. Map the raw backend data to the structure the frontend components expect
    const clean_data: Project[] = raw_data.map((project: BackendProject) => {
      // Handle completion year
      const completion_year = project.completion_date
        ? new Date(project.completion_date).getFullYear().toString()
        : "N/A";

      // Handle cover image and gallery images
      const cover_image =
        project.image_urls?.[0] ||
        "https://via.placeholder.com/1280x720.png?text=No+Image+Available";
      const gallery_images = project.image_urls?.slice(1) || [];

      return {
        slug: project.slug,
        title: project.name, // Map `name` to `title`
        location: project.address || "Unknown Location", // Map `address` to `location` with fallback
        cover_image: cover_image, // Use the first image as the cover
        completion_year: completion_year, // Extract year from date
        client_name: project.company_slug, // Map company_slug to client_name
        gallery_images: gallery_images, // Use remaining images for the gallery
        // description is optional and not provided by this endpoint
      };
    });

    return clean_data;
  } catch (error) {
    console.error("Error fetching or processing projects:", error);
    // Return an empty array on error to prevent the page from crashing
    return [];
  }
}

interface ProjectsPageProps {
  searchParams: Promise<{ company?: string }>; // Params bây giờ là Promise
}

// Data fetching function for Companies
async function getCompanies(): Promise<Company[]> {
  try {
    // Using a longer revalidation time as companies don't change often
    const res = await fetch(`${getApiUrl()}/companies`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error("Failed to fetch companies");
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params = await searchParams;
  const companySlug = params.company;
  const companies = await getCompanies();

  // Fetch and transform the data
  const projects = await getProjects(companySlug);

  // Log the final, cleaned data to verify
  console.log("Cleaned project data passed to component:", projects);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <GalleryHeader />
      <main>
        {/* 3. Pass the mapped clean_data and company name to the component */}
        <GalleryGrid projects={projects} companyName={companySlug} />
      </main>
      <GalleryFooter companies={companies} />
    </div>
  );
}
