import { CustomCursor } from "@/components/CustomCursor";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { Product } from "@/types/product";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function getProduct(id: string): Promise<Product | null> {
  // Use INTERNAL_API_URL or BACKEND_URL, fallback to localhost
  const baseUrl =
    process.env.INTERNAL_API_URL ||
    process.env.BACKEND_URL ||
    "http://backend:8000";

  try {
    const res = await fetch(`${baseUrl}/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      console.error(
        `Failed to fetch product ${id}:`,
        res.status,
        res.statusText,
      );
      return null;
    }

    const item = await res.json();

    // Map backend data to frontend Product type
    return {
      id: item.id || item._id,
      name: item.name,
      price: item.price,
      images: item.images || [],
      category:
        item.category ||
        (item.type === "ready" ? "Sản phẩm có sẵn" : "Thiết kế riêng"),
      category_id: item.category_id,
      description: item.description,
      options: item.options,
      type: item.type,
      // Highlights skipped as per user request
    };
  } catch (error) {
    console.error("Error connecting to backend:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { productId: string } }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.productId);

  return {
    title: product?.name,
    description: `Xem chi tiết sản phẩm ${product?.name} tại Quảng Cáo Khang Việt. Thi công chất lượng, bảo hành uy tín.`,
    openGraph: {
      images: [product?.images[0]],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#121212] text-white">
      <CustomCursor />
      <ProductDetail product={product} />
    </div>
  );
}


