"use client";

import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { getApiUrl } from "@/lib/api";
import { toast } from "sonner";

// --- INTERFACES ---
interface Category {
  id: string; // PydanticObjectId from backend is string in JSON
  name: string;
  slug: string;
  product_count: number;
}

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use localhost directly if getApiUrl not reliable in this context, or use standard env
      const response = await fetch("http://localhost:8000/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      let data = await response.json();
      // Normalize _id to id if needed, though Pydantic usually handles it
      data = data.map((c: any) => ({ ...c, id: c._id || c.id }));
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle opening modal for Add
  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "" });
    setStatus("");
    setIsModalOpen(true);
  };

  // Handle opening modal for Edit
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, slug: category.slug });
    setStatus("");
    setIsModalOpen(true);
  };

  // Helper to generate slug from name
  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    // Only auto-generate slug if adding new or if slug was previously matching name
    if (!editingCategory) {
      setFormData({ name, slug: generateSlug(name) });
    } else {
      setFormData((prev) => ({ ...prev, name }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      const url = editingCategory
        ? `http://localhost:8000/categories/${editingCategory.id}`
        : "http://localhost:8000/categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Action failed");
      }

      await fetchCategories();
      setIsModalOpen(false);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Error unknown";
      setStatus(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      const response = await fetch(`http://localhost:8000/categories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to delete");
      }
      await fetchCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error deleting category");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] p-4 text-white sm:p-6 lg:p-8">
      <Card className="border-gray-800 bg-[#1E1E1E] text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Quản lý Danh mục
            </CardTitle>
            <p className="mt-1 text-sm text-gray-400">
              Quản lý các nhóm sản phẩm hiển thị trên website.
            </p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleAddNew}
                className="bg-[#FF6B00] hover:bg-[#FF8533]"
              >
                <Plus className="mr-2 h-4 w-4" /> Thêm Danh mục
              </Button>
            </DialogTrigger>
            <DialogContent className="border-gray-700 bg-[#1E1E1E] text-white">
              <DialogHeader>
                <DialogTitle className="text-[#FF6B00]">
                  {editingCategory ? "Cập nhật Danh mục" : "Thêm Danh mục mới"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium">Tên hiển thị</span>
                  <Input
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                    placeholder="Ví dụ: Bảng hiệu Mica"
                    className="border-gray-700 bg-neutral-800"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">Đường dẫn (Slug)</span>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    required
                    placeholder="vi-du-bang-hieu-mica"
                    className="border-gray-700 bg-neutral-800"
                  />
                  <p className="text-xs text-gray-500">
                    Sử dụng cho URL trang web. Ký tự không dấu, nối bằng gạch
                    ngang.
                  </p>
                </div>

                {status && <p className="text-sm text-red-500">{status}</p>}

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#FF6B00] hover:bg-[#FF8533]"
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingCategory ? "Lưu thay đổi" : "Tạo mới"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-transparent">
                <TableHead className="text-gray-400">Tên danh mục</TableHead>
                <TableHead className="text-gray-400">
                  Đường dẫn (Slug)
                </TableHead>
                <TableHead className="text-center text-gray-400">
                  Sản phẩm
                </TableHead>
                <TableHead className="text-right text-gray-400">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center">
                    <Loader2 className="mx-auto animate-spin" />
                  </TableCell>
                </TableRow>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <TableRow
                    key={cat.id}
                    className="border-gray-800 hover:bg-neutral-800/50"
                  >
                    <TableCell className="text-lg font-medium">
                      {cat.name}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-400">
                      {cat.slug}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center rounded-full bg-neutral-700 px-2.5 py-0.5 text-xs font-medium text-white">
                        {cat.product_count}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(cat)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 text-red-500 hover:text-red-400"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-gray-500"
                  >
                    Chưa có danh mục nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
