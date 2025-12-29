import { HomeClient } from "@/components/home/HomeClient";
import type { Company } from "@/components/home/ClientMarquee";
import type { FeaturedProject } from "@/components/home/FeaturedProjects";

export const dynamic = "force-dynamic";

// Data fetching function for Companies
async function getCompanies(): Promise<Company[]> {
  try {
    // Using a longer revalidation time as companies don't change often
    const res = await fetch(`${process.env.INTERNAL_API_URL}/companies`, {
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

// Data fetching function for Featured Projects
async function getFeaturedProjects(): Promise<FeaturedProject[]> {
  try {
    const res = await fetch(
      `${process.env.INTERNAL_API_URL}/projects/featured`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) {
      console.error("Failed to fetch featured projects");
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }
}

export default async function Home() {
  // Fetch data in the Server Component
  const companies = await getCompanies();
  const featuredProjects = await getFeaturedProjects();

  return (
    // Render the Client Component and pass the fetched data as props
    <HomeClient companies={companies} featuredProjects={featuredProjects} />
  );
}
