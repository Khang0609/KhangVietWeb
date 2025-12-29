"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, ProductOptionChoice } from "@/types/product";
import { useCart } from "@/components/providers/CartContext";
import { toast } from "sonner";

interface QuickAddModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickAddModal({
  product,
  isOpen,
  onClose,
}: QuickAddModalProps) {
  const { addToCart } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, ProductOptionChoice>
  >({});
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Reset state when product changes or modal opens
  useEffect(() => {
    if (product && isOpen) {
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
      setUploadedFile(null);
    }
  }, [product, isOpen]);

  console.log(product);

  const totalPrice = useMemo(() => {
    if (!product) return 0;
    let price = product.price;
    Object.values(selectedOptions).forEach((choice) => {
      price += choice.price_modifier;
    });
    return price;
  }, [product, selectedOptions]);

  const handleOptionSelect = (
    groupName: string,
    choice: ProductOptionChoice,
  ) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupName]: choice,
    }));
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleConfirm = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: totalPrice,
      imageUrl: product.images?.[0],
      // Note: We might want to pass options/file to cart if supported
    });

    toast.success(`${product.name} đã được thêm vào giỏ hàng!`);
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in-95 relative w-full max-w-lg rounded-2xl border border-[#FF6B00]/20 bg-[#1E1E1E] p-6 shadow-2xl shadow-black/50 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 transition-colors hover:text-white"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <h2 className="mb-1 text-xl font-bold text-white">{product.name}</h2>
          <p className="text-2xl font-bold text-[#FF6B00]">
            {formatPrice(totalPrice)}
          </p>
        </div>

        {/* Options */}
        <div className="custom-scrollbar max-h-[60vh] space-y-6 overflow-y-auto pr-2">
          {product.options &&
            product.options.map((group, groupIndex) => (
              <div key={groupIndex}>
                <label className="mb-3 block text-sm font-medium text-white/90">
                  {group.name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {group.choices.map((choice, choiceIndex) => {
                    const isSelected =
                      selectedOptions[group.name]?.label === choice.label;
                    return (
                      <button
                        key={choiceIndex}
                        type="button"
                        onClick={() => handleOptionSelect(group.name, choice)}
                        className={`relative rounded-lg border px-4 py-2 text-sm transition-all duration-200 ${
                          isSelected
                            ? "border-[#FF6B00] bg-[#FF6B00] text-white"
                            : "border-white/20 text-white/70 hover:border-[#FF6B00]/50 hover:bg-white/5"
                        }`}
                      >
                        {choice.label}
                        {choice.price_modifier > 0 && (
                          <span className="ml-1 opacity-80">
                            (+{formatPrice(choice.price_modifier)})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* File Upload */}
          <div className="pt-2">
            <label className="mb-3 block text-sm font-medium text-white/90">
              File thiết kế (Tùy chọn)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
                uploadedFile
                  ? "border-green-500 bg-green-500/5"
                  : isDragging
                    ? "border-[#FF6B00] bg-[#FF6B00]/10"
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
                <div className="flex items-center justify-center gap-2 text-green-500">
                  <Check size={20} />
                  <span className="max-w-[200px] truncate text-sm font-medium">
                    {uploadedFile}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-white/50">
                  <Upload size={20} />
                  <span className="text-sm">Kéo thả hoặc chọn file</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-white/10 bg-transparent py-6 text-white hover:bg-white/5 hover:text-white"
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-linear-to-r from-[#FF6B00] to-[#FF8C00] py-6 text-white shadow-lg shadow-[#FF6B00]/20 hover:from-[#FF8C00] hover:to-[#FF6B00]"
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
}
