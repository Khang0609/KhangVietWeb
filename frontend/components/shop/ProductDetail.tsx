"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload, Check, Plus, CreditCard } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/CartContext";
import { toast } from "sonner";
import { Product, ProductOptionChoice } from "@/types/product";
import { SHOW_COMMERCE_FEATURES } from "@/lib/config";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, ProductOptionChoice>
  >({});
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onBack = () => {
    router.back();
  };

  // Initialize selected options with the first choice of each group
  useEffect(() => {
    if (product.options && product.options.length > 0) {
      const initialOptions: Record<string, ProductOptionChoice> = {};
      product.options.forEach((group) => {
        if (group.choices.length > 0) {
          initialOptions[group.name] = group.choices[0];
        }
      });
      setSelectedOptions(initialOptions);
    } else {
      setSelectedOptions({});
    }
  }, [product.id, product.options]);

  const totalPrice = useMemo(() => {
    let price = product.price;
    Object.values(selectedOptions).forEach((choice) => {
      price += choice.price_modifier;
    });
    return price;
  }, [product.price, selectedOptions]);

  const handleOptionSelect = (
    groupName: string,
    choice: ProductOptionChoice,
  ) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupName]: choice,
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file.name);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const getCartProduct = () => ({
    id: product.id,
    name: product.name,
    price: totalPrice,
    imageUrl: product.images[0],
  });

  const handleAddToCart = () => {
    addToCart(getCartProduct());
    toast.success(`${product.name} đã được thêm vào giỏ hàng!`);
  };

  console.log(product)

  const handleBuyNow = () => {
    addToCart(getCartProduct());
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#FF6B00]/20 bg-[#121212]/95 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 transition-colors hover:text-[#FF6B00]"
          >
            <ChevronLeft size={24} />
            <span>Quay lại</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[60%_40%]">
          {/* Left Side - Images & Description */}
          <div>
            {/* Main Image */}
            <div className="relative mb-4 aspect-4/3 w-[750px] overflow-hidden rounded-lg border border-white/10 bg-[#2C2C2C]">
              <ImageWithFallback
                src={
                  product.images?.[selectedImage] ||
                  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NTAiIGhlaWdodD0iMzUwIiB2aWV3Qm94PSIwIDAgNDUwIDM1MCI+PHJlY3Qgd2lkdGg9IjQ1MCIgaGVpZ2h0PSIzNTAiIGZpbGw9IiMyQzJDMkMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM1NTUiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=="
                }
                alt={product.name}
                className="absolute"
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="mb-8 flex gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-4/3 w-24 overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index
                        ? "border-[#FF6B00]"
                        : "border-transparent hover:border-white/30"
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="absolute"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Product Description */}
            <div className="mt-8 space-y-6">
              <div>
                <h2 className="mb-4 border-l-4 border-[#FF6B00] pl-3 text-2xl font-semibold text-[#FF6B00]">
                  Mô tả sản phẩm
                </h2>
                <div className="text-lg leading-relaxed whitespace-pre-wrap text-white/80">
                  {product.description || "Đang cập nhật mô tả..."}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Configuration Panel */}
          <div className="relative">
            <div className="sticky top-28 space-y-8 rounded-xl border border-[#FF6B00]/20 bg-[#1E1E1E] p-6 shadow-2xl shadow-black/50">
              {/* Product Name & Price */}
              <div>
                <h1 className="mb-2 text-3xl leading-tight font-bold">
                  {product.name}
                </h1>
                <div className="text-4xl font-bold text-[#FF6B00] transition-all duration-300">
                  {formatPrice(totalPrice)}
                </div>
              </div>

              {/* Dynamic Options Rendering */}
              {product.options &&
                product.options.map((group, groupIndex) => (
                  <div key={groupIndex}>
                    <label className="mb-3 block font-medium text-white/90">
                      {group.name}
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {group.choices.map((choice, choiceIndex) => {
                        const isSelected =
                          selectedOptions[group.name]?.label === choice.label;
                        return (
                          <button
                            key={choiceIndex}
                            type="button"
                            onClick={() =>
                              handleOptionSelect(group.name, choice)
                            }
                            className={`relative overflow-hidden rounded-lg border px-5 py-2 transition-all duration-200 ${
                              isSelected
                                ? "border-[#FF6B00] bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20"
                                : "border-white/20 text-white/70 hover:border-[#FF6B00]/50 hover:bg-white/5"
                            }`}
                          >
                            <span className="relative z-10">
                              {choice.label}
                            </span>
                            {choice.price_modifier > 0 && (
                              <span className="ml-2 text-xs underline decoration-dotted opacity-80">
                                + {formatPrice(choice.price_modifier)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

              {/* File Upload Section */}
              <div className="border-t border-white/10 pt-4">
                <label className="mb-3 block font-medium text-white/90">
                  Tải lên file thiết kế / Logo (Nếu có)
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`group relative rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
                    uploadedFile
                      ? "border-green-500 bg-green-500/5"
                      : isDragging
                        ? "scale-[1.02] border-[#FF6B00] bg-[#FF6B00]/10"
                        : "border-white/20 hover:border-[#FF6B00]/50 hover:bg-white/5"
                  }`}
                >
                  <input
                    type="file"
                    onChange={handleFileInput}
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                    accept="image/*,.pdf,.ai,.psd"
                  />

                  {uploadedFile ? (
                    <div className="animate-in fade-in zoom-in flex flex-col items-center gap-3 duration-300">
                      <div className="rounded-full bg-green-500/20 p-3">
                        <Check className="text-green-500" size={24} />
                      </div>
                      <div className="space-y-1">
                        <p className="max-w-[200px] truncate font-medium text-green-500">
                          {uploadedFile}
                        </p>
                        <p className="text-xs text-white/40">Sẵn sàng để gửi</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="rounded-full bg-white/5 p-3 transition-colors group-hover:bg-[#FF6B00]/10">
                        <Upload
                          className="text-white/50 group-hover:text-[#FF6B00]"
                          size={24}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-white/80 group-hover:text-white">
                          Kéo thả file vào đây
                        </p>
                        <p className="text-xs text-white/40">
                          Hỗ trợ: PDF, AI, PSD, JPG, PNG
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-col gap-4 border-t border-white/10 pt-6">
                {SHOW_COMMERCE_FEATURES ? (
                  <>
                    <Button
                      onClick={handleAddToCart}
                      variant="outline"
                      className="w-full border-[#FF6B00] py-7 text-lg font-medium text-[#FF6B00] transition-all duration-300 hover:bg-[#FF6B00] hover:text-white active:scale-[0.98]"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Thêm vào giỏ hàng
                    </Button>
                    <Button
                      onClick={handleBuyNow}
                      className="w-full bg-linear-to-r from-[#FF6B00] to-[#FF8C00] py-7 text-lg font-bold text-white shadow-lg shadow-[#FF6B00]/25 transition-all duration-300 hover:from-[#FF8C00] hover:to-[#FF6B00] hover:shadow-[#FF6B00]/40 active:scale-[0.98]"
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      Mua ngay
                    </Button>
                  </>
                ) : (
                  <div className="rounded-lg border border-[#FF6B00]/20 bg-[#FF6B00]/10 p-4 text-center">
                    <p className="font-medium text-[#FF6B00]">
                      Tính năng mua hàng trực tuyến đang được cập nhật...
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="pt-2 text-center text-sm text-white/40">
                <p>
                  Cần tư vấn thêm?{" "}
                  <a
                    href="tel:0903680449"
                    className="text-[#FF6B00] decoration-wavy underline-offset-2 hover:underline"
                  >
                    Liên hệ ngay
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
