import { CustomCursor } from "@/components/CustomCursor";
import { Shop } from "@/components/shop/Shop";
import { Product } from "@/types/product";
import { getApiUrl } from "@/lib/api";

export const dynamic = "force-dynamic";


async function getProducts() {
  const baseUrl = getApiUrl();
  try {
    const res = await fetch(`${baseUrl}/products`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(
        `Failed to fetch products from ${baseUrl}/products:`,
        res.status,
        res.statusText,
      );
      return [];
    }

    const rawData: any[] = await res.json();

    if (!Array.isArray(rawData)) {
      console.error("API response is not an array:", rawData);
      return [];
    }

    // --- MAPPING DATA ---
    const cleanData = rawData.map((item) => ({
      id: item._id,
      name: item.name,
      price: item.price,
      images: item.images || [],
      // Use the real category from DB, or fallback to type if missing
      category:
        item.category ||
        (item.type === "ready" ? "Sản phẩm có sẵn" : "Thiết kế riêng"),
      category_id: item.category_id,
      description: item.description,
      options: item.options,
      type: item.type,
    }));

    return cleanData;
  } catch (error) {
    console.error("Error connecting to backend:", error);
    return [];
  }
}

export default async function ShopPage() {
  // 1. Lấy dữ liệu
  const products = await getProducts();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#121212] text-white">
      <CustomCursor />
      <Shop products={products} />
    </div>
  );
}
