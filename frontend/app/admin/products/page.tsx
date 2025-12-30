// @/app/admin/products/page.tsx
"use client";

import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import {
  Plus,
  Pencil,
  ArrowLeft,
  Trash2,
  Upload,
  Loader2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { compressImage } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { DraggableImageList } from "@/components/admin/DraggableImageList";
import { toast } from "sonner";
import { getApiUrl } from "@/lib/api";

// --- TYPE DEFINITIONS (matching backend models.py) ---
interface ProductOptionChoice {
  label: string;
  price_modifier: number;
}

interface ProductOptionGroup {
  name: string;
  choices: ProductOptionChoice[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string; // Changed from _id to id to match Beanie's default
  name: string;
  slug: string; // Add slug field
  price: number;
  category?: string;
  category_id?: string;
  description?: string;
  type: "ready" | "custom";
  images: string[];
  options: ProductOptionGroup[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Simple slugify function
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Split accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
};

// --- MAIN PAGE COMPONENT ---
export default function ProductManagementPage() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    const baseUrl = getApiUrl();
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/products`);
      if (!response.ok) throw new Error("Failed to fetch");
      let data: Product[] = await response.json();
      // Beanie uses `id` but MongoDB driver might return `_id`. Let's standardize.
      data = data.map((p) => ({ ...p, id: (p as any)._id || p.id }));
      setProducts(data);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
      toast.error("Không thể tải danh sách sản phẩm.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setView("editor");
  };

  const handleAddNewClick = () => {
    setSelectedProduct(null);
    setView("editor");
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
    setView("list");
  };

  const onFormSuccess = () => {
    fetchProducts();
    handleBackToList();
  };

  const handleDelete = async (productId: string) => {
    if (
      !confirm(
        "Bạn có chắc muốn xóa sản phẩm này vĩnh viễn? Hành động này không thể hoàn tác.",
      )
    )
      return;
    const baseUrl = getApiUrl();
    try {
      const response = await fetch(
        `${baseUrl}/products/${productId}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Server error");
      }
      await fetchProducts();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error(
        `Không thể xóa sản phẩm: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] p-4 text-white sm:p-6 lg:p-8">
      {view === "list" ? (
        <ProductList
          products={products}
          onEdit={handleEditClick}
          onAddNew={handleAddNewClick}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      ) : (
        <ProductEditor
          product={selectedProduct}
          onSuccess={onFormSuccess}
          onBack={handleBackToList}
          key={selectedProduct?.id || "new"}
        />
      )}
    </div>
  );
}

// --- PRODUCT LIST COMPONENT ---
const ProductList = ({
  products,
  onEdit,
  onAddNew,
  onDelete,
  isLoading,
}: {
  products: Product[];
  onEdit: (p: Product) => void;
  onAddNew: () => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}) => (
  <Card className="border-gray-800 bg-[#1E1E1E] text-white">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Quản lý Sản phẩm ({products.length})</CardTitle>
      <Button onClick={onAddNew} className="bg-[#FF6B00] hover:bg-[#FF8533]">
        <Plus className="mr-2 h-4 w-4" /> Thêm Sản phẩm
      </Button>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-transparent">
              <TableHead className="w-[80px] text-gray-400">Ảnh</TableHead>
              <TableHead className="text-gray-400">Tên sản phẩm</TableHead>
              <TableHead className="text-gray-400">Phân loại</TableHead>
              <TableHead className="text-gray-400">Giá gốc</TableHead>
              <TableHead className="text-gray-400">Loại</TableHead>
              <TableHead className="text-right text-gray-400">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <Loader2 className="mx-auto animate-spin" />
                </TableCell>
              </TableRow>
            ) : products.length > 0 ? (
              products.map((p) => (
                <TableRow key={p.id} className="border-gray-800">
                  <TableCell>
                    <Image
                      src={p.images?.[0] || "/placeholder.svg"}
                      alt={p.name}
                      width={48}
                      height={48}
                      className="aspect-square rounded-md bg-gray-700 object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{p.category || "N/A"}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(p.price)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={p.type === "custom" ? "default" : "secondary"}
                    >
                      {p.type === "custom" ? "Đặt làm" : "Có sẵn"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(p)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-400"
                      onClick={() => onDelete(p.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  Chưa có sản phẩm nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

// --- PRODUCT EDITOR COMPONENT ---
const ProductEditor = ({
  product,
  onSuccess,
  onBack,
}: {
  product: Product | null;
  onSuccess: () => void;
  onBack: () => void;
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const baseUrl = getApiUrl();
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${baseUrl}/categories`);
        if (res.ok) {
          let data = await res.json();
          // Normalize _id to id
          data = data.map((c: any) => ({ ...c, id: c._id || c.id }));
          setCategories(data);
        }
      } catch (e) {
        console.error("Failed to fetch categories", e);
      }
    };
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: product?.name || "",
    slug: product?.slug || "",
    price: product?.price || 0,
    category: product?.category || "",
    category_id: product?.category_id || "",
    description: product?.description || "",
    type: product?.type || "ready",
    images: product?.images || [],
    options: product?.options
      ? JSON.parse(JSON.stringify(product.options))
      : [],
  });
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("");
  const isEditMode = product !== null;

  // Update slug when name changes (only in create mode or if slug is empty)
  useEffect(() => {
    if (!product && formData.name) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.name) }));
    }
  }, [formData.name, product]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setStatus("Đang nén & tải ảnh lên...");
    try {
      const compressedFiles = await Promise.all(
        Array.from(files).map(compressImage),
      );
      const results = await Promise.all(
        compressedFiles.map(uploadToCloudinary),
      );
      const successfulUrls = results.filter((url): url is string => !!url);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...successfulUrls],
      }));
      setStatus(`Tải lên ${successfulUrls.length} ảnh thành công!`);
    } catch (error) {
      setStatus("Lỗi tải ảnh lên.");
    } finally {
      setIsUploading(false);
    }
  };

  /* --- Reorder Handler --- */
  const handleReorder = (newImages: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const handleRemoveImage = (urlToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((url) => url !== urlToRemove),
    }));
  };

  // --- Dynamic Options Handlers ---
  const addOptionGroup = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { name: "", choices: [] }],
    }));
  };

  const removeOptionGroup = (groupIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== groupIndex),
    }));
  };

  const handleGroupChange = (groupIndex: number, name: string) => {
    const newOptions = [...formData.options];
    newOptions[groupIndex].name = name;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const addOptionChoice = (groupIndex: number) => {
    const newOptions = [...formData.options];
    newOptions[groupIndex].choices.push({ label: "", price_modifier: 0 });
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const removeOptionChoice = (groupIndex: number, choiceIndex: number) => {
    const newOptions = [...formData.options];
    newOptions[groupIndex].choices = newOptions[groupIndex].choices.filter(
      (_, i) => i !== choiceIndex,
    );
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleChoiceChange = (
    groupIndex: number,
    choiceIndex: number,
    field: "label" | "price_modifier",
    value: string | number,
  ) => {
    const newOptions = [...formData.options];
    const choice = newOptions[groupIndex].choices[choiceIndex];
    if (field === "price_modifier") {
      (choice[field] as number) = Number(value);
    } else {
      (choice[field] as string) = String(value);
    }
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price < 0) {
      toast.error("Tên sản phẩm và giá hợp lệ là bắt buộc.");
      return;
    }

    // Ensure slug exists
    const finalData = {
      ...formData,
      slug: formData.slug || slugify(formData.name),
    };

    setStatus(isEditMode ? "Đang cập nhật..." : "Đang tạo...");
    
    const baseUrl = getApiUrl();
    // Add trailing slash to avoid 307 Redirects
    const url = isEditMode
      ? `${baseUrl}/products/${product.id}`
      : `${baseUrl}/products/`;
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        let errorMsg = "Thao tác thất bại.";
        if (Array.isArray(errorData.detail)) {
          errorMsg = errorData.detail
            .map((err: any) => `${err.loc.join(".")}: ${err.msg}`)
            .join("\n");
        } else if (typeof errorData.detail === "string") {
          errorMsg = errorData.detail;
        } else {
          errorMsg = JSON.stringify(errorData);
        }
        throw new Error(errorMsg);
      }
      toast.success(`Sản phẩm đã được ${isEditMode ? "cập nhật" : "tạo"} thành công!`);
      onSuccess();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Lỗi không xác định.";
      console.error(error);
      setStatus(`Lỗi: ${msg}`);
      toast.error(`Lỗi: ${msg}`);
    }
  };

  return (
    <Card className="animate-fade-in border-gray-800 bg-[#1E1E1E] text-white">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>
            {isEditMode ? `Sửa sản phẩm: ${product.name}` : "Tạo sản phẩm mới"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- Basic Info --- */}
          <Card className="border-gray-700 bg-neutral-900">
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Tên sản phẩm"
              />
              <Input
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="URL Slug (auto create)"
              />
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    price: Number(e.target.value),
                  }))
                }
                required
                placeholder="Giá gốc (VND)"
              />

              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Mô tả chi tiết sản phẩm..."
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Select
                  name="type"
                  value={formData.type}
                  onValueChange={(v: "ready" | "custom") =>
                    setFormData((p) => ({ ...p, type: v }))
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Chọn loại sản phẩm --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ready">Hàng có sẵn</SelectItem>
                    <SelectItem value="custom">
                      Hàng đặt làm (có tùy chọn)
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={formData.category_id || ""}
                  onValueChange={(v) => {
                    const cat = categories.find((c) => c.id === v);
                    setFormData((p) => ({
                      ...p,
                      category_id: v,
                      category: cat ? cat.name : "",
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Chọn danh mục --" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* --- Image Uploader --- */}
          <Card className="border-gray-700 bg-neutral-900">
            <CardHeader>
              <CardTitle>Hình ảnh</CardTitle>
              <CardDescription>Ảnh đầu tiên sẽ là ảnh bìa.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <DraggableImageList
                  images={formData.images}
                  onReorder={handleReorder}
                  onRemove={handleRemoveImage}
                />
                {formData.images.length === 0 && (
                  <p className="mb-2 text-gray-500">Chưa có ảnh nào.</p>
                )}
              </div>
              <Label
                htmlFor="image-upload"
                className="w-full cursor-pointer rounded-md bg-[#FF6B00] px-4 py-2 text-center font-semibold text-white"
              >
                <div className="flex items-center justify-center gap-2">
                  {isUploading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Upload />
                  )}
                  <span>{isUploading ? "Đang tải..." : "Tải thêm ảnh"}</span>
                </div>
              </Label>
              <Input
                id="image-upload"
                type="file"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
                disabled={isUploading}
              />
            </CardContent>
          </Card>

          {/* --- Dynamic Options Builder --- */}
          {formData.type === "custom" && (
            <Card className="border-gray-700 bg-neutral-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Tùy chọn sản phẩm</CardTitle>
                  <CardDescription>
                    Thêm các lựa chọn cho khách hàng.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOptionGroup}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm Nhóm
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.options.map((group, groupIndex) => (
                  <Card
                    key={groupIndex}
                    className="border-gray-600 bg-neutral-800 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <Input
                        value={group.name}
                        onChange={(e) =>
                          handleGroupChange(groupIndex, e.target.value)
                        }
                        placeholder="Tên nhóm (ví dụ: Kích thước, Màu sắc)"
                        className="text-lg font-semibold"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOptionGroup(groupIndex)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="space-y-2 border-l-2 border-gray-700 pl-4">
                      {group.choices.map((choice, choiceIndex) => (
                        <div
                          key={choiceIndex}
                          className="flex items-center gap-2"
                        >
                          <Input
                            value={choice.label}
                            onChange={(e) =>
                              handleChoiceChange(
                                groupIndex,
                                choiceIndex,
                                "label",
                                e.target.value,
                              )
                            }
                            placeholder="Tên lựa chọn (ví dụ: Nhỏ, Đỏ)"
                          />
                          <Input
                            type="number"
                            value={choice.price_modifier}
                            onChange={(e) =>
                              handleChoiceChange(
                                groupIndex,
                                choiceIndex,
                                "price_modifier",
                                e.target.value,
                              )
                            }
                            placeholder="Giá cộng thêm"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              removeOptionChoice(groupIndex, choiceIndex)
                            }
                          >
                            <X className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => addOptionChoice(groupIndex)}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Thêm Lựa chọn
                      </Button>
                    </div>
                  </Card>
                ))}
                {formData.options.length === 0 && (
                  <p className="py-4 text-center text-gray-400">
                    Chưa có nhóm tùy chọn nào.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* --- Actions --- */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onBack}>
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-[#FF6B00] hover:bg-[#FF8533]"
              disabled={isUploading}
            >
              {isUploading
                ? "Đang tải ảnh..."
                : isEditMode
                  ? "Lưu thay đổi"
                  : "Tạo sản phẩm"}
            </Button>
          </div>
          {status && (
            <p className="mt-4 text-center text-sm text-gray-400">{status}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
