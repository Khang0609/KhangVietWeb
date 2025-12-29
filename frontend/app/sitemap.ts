import { MetadataRoute } from "next";
import { getProducts } from "@/lib/api";
import { getProjects } from "@/lib/api";
import { Product } from "@/types/product";
import { Project } from "@/types/project";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://khang-viet-design.up.railway.app"; // Thay bằng domain thật sau này

  // 1. Các trang tĩnh (Trang chủ, Giới thiệu, Liên hệ)
  const staticPages = [""].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  // 2. Các trang sản phẩm động
  const products = await getProducts();
  const productPages = products.map((product: Product) => ({
    url: `${baseUrl}/products/${product.id}`,
    priority: 0.8,
  }));

  // 3. Các trang dự án động
  const projects = await getProjects();
  const projectPages = projects.map((project: Project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages, ...projectPages];
}
