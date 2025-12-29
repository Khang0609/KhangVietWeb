"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { SHOW_COMMERCE_FEATURES } from "@/lib/config";
import { useCart } from "@/components/providers/CartContext";
import { QuickAddModal } from "./QuickAddModal";

const ALL_CATEGORIES = "Tất cả sản phẩm";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ShopProps {
  products: Product[];
}

export function Shop({ products }: ShopProps) {
  const router = useRouter();
  const { cartCount } = useCart();

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(ALL_CATEGORIES);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch categories from backend on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8000/categories");
        if (res.ok) {
          let data = await res.json();
          // Normalize data
          data = data.map((c: any) => ({ ...c, id: c._id || c.id }));
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((product) => {
    // Determine product category match
    let matchesCategory = false;

    if (selectedCategory === ALL_CATEGORIES) {
      matchesCategory = true;
    } else {
      // Match by Name (Legacy) OR Match by ID (New)
      // If we have an activeCategoryId, try to match that first
      if (
        activeCategoryId &&
        (product as any).category_id === activeCategoryId
      ) {
        matchesCategory = true;
      }
      // Fallback to name match if id match failed or not present
      else if (product.category === selectedCategory) {
        matchesCategory = true;
      }
    }

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Quick Add Modal */}
      <QuickAddModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#FF6B00]/20 bg-[#121212]/95 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="grid grid-cols-3 items-center">
            {/* Logo */}
            <button
              onClick={handleBackToHome}
              className="group relative cursor-pointer justify-self-start"
            >
              <span className="bg-linear-to-r from-[#FF6B00] to-[#D32F2F] bg-clip-text text-[24px] tracking-widest text-transparent transition-all duration-300 group-hover:tracking-[0.3em]">
                KHANG VIỆT
              </span>
            </button>

            {/* Search Bar */}
            <div className="mx-8 w-120 max-w-md flex-1 justify-self-center">
              <div className="relative">
                <Search
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-white/50"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#1E1E1E] py-2 pr-4 pl-10 text-white transition-colors placeholder:text-white/50 focus:border-[#FF6B00] focus:outline-none"
                />
              </div>
            </div>

            {/* Cart Icon */}
            {SHOW_COMMERCE_FEATURES && (
              <button
                onClick={() => router.push("/checkout")}
                className="group relative justify-self-end rounded-lg bg-[#1E1E1E] p-3 transition-colors hover:bg-[#FF6B00]/20"
              >
                <ShoppingBag
                  className="text-white transition-colors group-hover:text-[#FF6B00]"
                  size={24}
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6B00] text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full shrink-0 md:w-64">
            <div className="sticky top-32">
              <h3 className="mb-4 tracking-wider text-white/50 uppercase">
                Danh mục
              </h3>
              <nav className="space-y-2">
                {/* All Products Option */}
                <button
                  onClick={() => {
                    setSelectedCategory(ALL_CATEGORIES);
                    setActiveCategoryId(null);
                  }}
                  className={`block w-full rounded-lg px-4 py-3 text-left transition-all duration-300 ${
                    selectedCategory === ALL_CATEGORIES
                      ? "bg-[#FF6B00] text-white"
                      : "text-white/70 hover:bg-[#1E1E1E] hover:text-white"
                  }`}
                >
                  {ALL_CATEGORIES}
                </button>
                {/* Dynamic Categories */}
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.name);
                      setActiveCategoryId(category.id);
                    }}
                    className={`block w-full rounded-lg px-4 py-3 text-left transition-all duration-300 ${
                      activeCategoryId === category.id
                        ? "bg-[#FF6B00] text-white"
                        : "text-white/70 hover:bg-[#1E1E1E] hover:text-white"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>

              {/* Category Header Decoration */}
              <div className="mt-12 rounded-lg border border-[#FF6B00]/20 bg-[#1E1E1E] p-6">
                <h4 className="mb-2 text-[#FF6B00]">Hỗ trợ tư vấn</h4>
                <p className="mb-4 text-sm text-white/60">
                  Liên hệ để được tư vấn chi tiết về sản phẩm
                </p>
                <a
                  href="tel:0123456789"
                  className="text-sm text-white transition-colors hover:text-[#FF6B00]"
                >
                  📞 0903 680 449
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content - Product Grid */}
          <main className="flex-1">
            {/* Category Title */}
            <div className="mb-8">
              <h2 className="relative mb-2 inline-block text-4xl">
                {selectedCategory}
                <span className="absolute -bottom-2 left-0 h-1 w-1/3 bg-[#FF6B00]"></span>
              </h2>
              <p className="mt-4 text-white/50">
                {filteredProducts.length} sản phẩm
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="group cursor-pointer overflow-hidden rounded-lg border border-transparent bg-[#1E1E1E] transition-all duration-300 hover:border-[#FF6B00]/50"
                >
                  {/* Product Image */}
                  <div className="relative aspect-4/3 overflow-hidden bg-[#2C2C2C]">
                    <ImageWithFallback
                      src={product.images?.[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Add to Cart Button - Appears on Hover */}
                    {SHOW_COMMERCE_FEATURES && (
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="absolute right-4 bottom-4 translate-y-4 transform rounded-full bg-[#FF6B00] p-3 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110"
                      >
                        <ShoppingBag size={20} />
                      </button>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="mb-2 text-white transition-colors group-hover:text-[#FF6B00]">
                      {product.name}
                    </h3>
                    <p className="text-xl text-[#FF6B00]">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-lg text-white/50">
                  Không tìm thấy sản phẩm phù hợp
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
