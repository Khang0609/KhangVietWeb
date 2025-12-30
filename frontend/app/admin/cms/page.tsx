// @/app/admin/cms/page.tsx
"use client";

import React, { useState, FormEvent, useEffect, useCallback } from "react";
import { compressImage } from "@/lib/utils";
import { getApiUrl } from "@/lib/api";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartDatePicker } from "@/components/ui/SmartDatePicker";
import { Checkbox } from "@/components/ui/checkbox";
import {
  X,
  Upload,
  Loader2,
  Plus,
  Trash2,
  Pencil,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DraggableImageList } from "@/components/admin/DraggableImageList";
import { toast } from "sonner";

// --- INTERFACES ---
interface Company {
  id?: string;
  name: string;
  slug: string;
  logo_url?: string;
}

interface Project {
  id: string;
  _id: string;
  name: string;
  slug: string;
  company_slug: string;
  address?: string;
  completion_date?: string;
  is_featured: boolean;
  image_urls: string[];
}

type ActiveTab = "all-projects" | "editor" | "companies";

// --- MAIN PAGE COMPONENT ---
const CMSPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all-projects");

  // Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  // Editor/Form State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  // --- DATA FETCHING ---
  const fetchProjects = useCallback(async () => {
    setStatus("Đang tải danh sách dự án...");
    const baseUrl = getApiUrl();
    try {
      const response = await fetch(`${baseUrl}/projects`);
      if (!response.ok) throw new Error("Failed to fetch projects.");
      const data: Project[] = await response.json();
      setProjects(data);
      setStatus("");
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Could not fetch projects.";
      setStatus(`Error: ${msg}`);
      toast.error(`Error: ${msg}`);
    }
  }, []);

  const fetchCompanies = useCallback(async () => {
      setStatus("Đang tải danh sách công ty...");
    const baseUrl = getApiUrl();
    try {
      const response = await fetch(`${baseUrl}/companies`);
      if (!response.ok) throw new Error("Failed to fetch companies.");
      const data: Company[] = await response.json();
      setCompanies(data);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Could not fetch companies.";
      setStatus(`Error: ${msg}`);
      toast.error(`Error: ${msg}`);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchCompanies();
  }, [fetchProjects, fetchCompanies]);

  // --- HANDLERS ---
  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setActiveTab("editor");
  };

  const handleAddNewClick = () => {
    setSelectedProject(null);
    setActiveTab("editor");
  };

  const handleBackToList = () => {
    setSelectedProject(null);
    setActiveTab("all-projects");
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#121212] p-4 text-white sm:p-6 lg:p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-100">
        Quản lý Nội dung (CMS)
      </h1>

      <div className="mb-6 flex gap-1 border-b border-gray-700">
        <TabButton
          title="Tất cả dự án"
          isActive={activeTab === "all-projects"}
          onClick={() => setActiveTab("all-projects")}
        />
        <TabButton
          title={selectedProject ? "Sửa Dự án" : "Thêm Dự án"}
          isActive={activeTab === "editor"}
          onClick={() => setActiveTab("editor")}
        />
        <TabButton
          title="Quản lý Công ty"
          isActive={activeTab === "companies"}
          onClick={() => setActiveTab("companies")}
        />
      </div>

      <div className="transition-opacity duration-300">
        {activeTab === "all-projects" && (
          <ProjectList
            projects={projects}
            onEdit={handleEditClick}
            onAddNew={handleAddNewClick}
          />
        )}
        {activeTab === "editor" && (
          <ProjectEditor
            project={selectedProject}
            companies={companies}
            onSuccess={() => {
              fetchProjects();
              handleBackToList();
            }}
            onBack={handleBackToList}
            key={selectedProject?.id || "new"}
          />
        )}
        {activeTab === "companies" && (
          <CompanyManager
            companies={companies}
            onCompanyAdded={fetchCompanies}
          />
        )}
      </div>
    </div>
  );
};

// --- TAB BUTTON COMPONENT ---
const TabButton = ({
  title,
  isActive,
  onClick,
}: {
  title: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
      isActive
        ? "border-b-2 border-orange-500 text-orange-500"
        : "text-gray-400 hover:text-white"
    }`}
  >
    {title}
  </button>
);

// --- PROJECT LIST COMPONENT ---
const ProjectList = ({
  projects,
  onEdit,
  onAddNew,
}: {
  projects: Project[];
  onEdit: (p: Project) => void;
  onAddNew: () => void;
}) => (
  <Card className="border-gray-800 bg-[#1E1E1E] text-white">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Tất cả dự án ({projects.length})</CardTitle>
      <Button onClick={onAddNew}>
        <Plus className="mr-2 h-4 w-4" /> Thêm dự án mới
      </Button>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-transparent">
              <TableHead className="text-gray-400">Tên dự án</TableHead>
              <TableHead className="text-gray-400">Công ty</TableHead>
              <TableHead className="text-gray-400">Địa điểm</TableHead>
              <TableHead className="text-gray-400">Ngày hoàn thành</TableHead>
              <TableHead className="text-right text-gray-400">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length > 0 ? (
              projects.map((p) => (
                <TableRow key={p.id || p._id} className="border-gray-800">
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{p.company_slug}</Badge>
                  </TableCell>
                  <TableCell>{p.address || "N/A"}</TableCell>
                  <TableCell>
                    {p.completion_date
                      ? new Date(p.completion_date).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(p)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center">
                  Chưa có dự án nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

// --- PROJECT EDITOR COMPONENT ---
const ProjectEditor = ({
  project,
  companies,
  onSuccess,
  onBack,
}: {
  project: Project | null;
  companies: Company[];
  onSuccess: () => void;
  onBack: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    slug: project?.slug || "",
    company_slug: project?.company_slug || "",
    address: project?.address || "",
    completion_date: project?.completion_date
      ? new Date(project.completion_date)
      : undefined,
    is_featured: project?.is_featured || false,
    image_urls: project?.image_urls || [],
  });
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("");

  const isEditMode = project !== null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setStatus("Đang nén ảnh...");
    try {
      const compressedFiles = await Promise.all(
        Array.from(files).map(compressImage),
      );
      setStatus("Đang tải ảnh lên...");
      const results = await Promise.all(
        compressedFiles.map(uploadToCloudinary),
      );
      const successfulUrls = results.filter((url): url is string => !!url);
      if (successfulUrls.length < files.length) {
        setStatus(
          `Lỗi: ${files.length - successfulUrls.length} ảnh tải lên thất bại.`,
        );
      } else {
        setStatus("Tải lên hoàn tất!");
      }
      setFormData((prev) => ({
        ...prev,
        image_urls: [...prev.image_urls, ...successfulUrls],
      }));
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Lỗi không xác định.";
      setStatus(`Lỗi: ${msg}`);
    } finally {
      setIsUploading(false);
    }
  };

  /* --- Reorder Handler --- */
  const handleReorder = (newImages: string[]) => {
    setFormData((prev) => ({
      ...prev,
      image_urls: newImages,
    }));
  };

  const handleRemoveImage = (urlToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      image_urls: prev.image_urls.filter((url) => url !== urlToRemove),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.slug ||
      !formData.company_slug ||
      formData.image_urls.length === 0
    ) {
      toast.error(
        "Vui lòng điền các trường bắt buộc (Tên, Slug, Công ty) và tải lên ít nhất 1 ảnh.",
      );
      return;
    }
    setStatus(isEditMode ? "Đang cập nhật dự án..." : "Đang tạo dự án...");

    const url = isEditMode
      ? `${getApiUrl()}/projects/${project.id || project._id}`
      : `${getApiUrl()}/projects`;
    const method = isEditMode ? "PUT" : "POST";

    const payload = {
      ...formData,
      completion_date: formData.completion_date
        ? formData.completion_date.toISOString()
        : undefined,
    };
    // Ensure we don't send an empty string for optional fields
    if (!payload.address) delete (payload as any).address;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Thao tác thất bại.");
      }
      setStatus(`Dự án đã được ${isEditMode ? "cập nhật" : "tạo"} thành công!`);
      toast.success(
        `Dự án đã được ${isEditMode ? "cập nhật" : "tạo"} thành công!`,
      );
      onSuccess();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Lỗi không xác định.";
      setStatus(`Lỗi: ${msg}`);
      toast.error(`Lỗi: ${msg}`);
    }
  };

  return (
    <Card className="border-gray-800 bg-[#1E1E1E] text-white">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>
            {isEditMode ? `Sửa dự án: ${project.name}` : "Tạo dự án mới"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Tên dự án"
          />
          <Input
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            required
            placeholder="Slug (ví dụ: du-an-vinhome)"
          />
          <Select
            name="company_slug"
            value={formData.company_slug}
            onValueChange={(v) =>
              setFormData((p) => ({ ...p, company_slug: v }))
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="-- Chọn công ty --" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Địa chỉ (tùy chọn)"
          />
          <SmartDatePicker
            value={formData.completion_date}
            onChange={(d) => setFormData((p) => ({ ...p, completion_date: d }))}
          />
          <div className="flex items-center gap-x-2">
            <Checkbox
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(c) =>
                setFormData((p) => ({ ...p, is_featured: !!c }))
              }
            />
            <Label htmlFor="is_featured">Đánh dấu là dự án nổi bật?</Label>
          </div>
          <div>
            <Label className="mb-2 block">
              Ảnh dự án <span className="text-orange-500">*</span>
            </Label>
            <div className="rounded-md border border-gray-600 bg-gray-900/50 p-4">
              <div className="mb-4">
                <DraggableImageList
                  images={formData.image_urls}
                  onReorder={handleReorder}
                  onRemove={handleRemoveImage}
                />
                {formData.image_urls.length === 0 && (
                  <p className="mb-2 text-gray-500">Chưa có ảnh nào.</p>
                )}
              </div>
              <Label
                htmlFor="image-upload"
                className="w-full cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-orange-700"
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
            </div>
          </div>
          <div>
            <Button
              type="submit"
              disabled={isUploading || status.includes("Đang")}
              className="w-full py-3"
            >
              {isUploading
                ? "Đang chờ tải ảnh..."
                : isEditMode
                  ? "Lưu thay đổi"
                  : "Tạo dự án"}
            </Button>
            {status && <p className="mt-4 text-center text-sm">{status}</p>}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// --- COMPANY MANAGER COMPONENT ---
const CompanyManager = ({
  companies,
  onCompanyAdded,
}: {
  companies: Company[];
  onCompanyAdded: () => void;
}) => {
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanySlug, setNewCompanySlug] = useState("");
  const [newCompanyLogoUrl, setNewCompanyLogoUrl] = useState("");
  const [status, setStatus] = useState("");

  const handleNewCompanySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("Đang tạo công ty mới...");
    try {
      const payload: Omit<Company, "id"> = {
        name: newCompanyName,
        slug: newCompanySlug,
        logo_url: newCompanyLogoUrl || undefined,
      };
      const response = await fetch(`${getApiUrl()}/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Không thể tạo công ty.");
      }
      setStatus("Tạo công ty thành công!");
      toast.success("Tạo công ty thành công!");
      setIsCompanyModalOpen(false);
      setNewCompanyName("");
      setNewCompanySlug("");
      setNewCompanyLogoUrl("");
      onCompanyAdded(); // Callback to refresh company list
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Lỗi không xác định.";
      setStatus(`Lỗi: ${msg}`);
      toast.error(`Lỗi: ${msg}`);
    }
  };

  return (
    <Card className="border-gray-800 bg-[#1E1E1E] text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quản lý Công ty ({companies.length})</CardTitle>
        <Dialog open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Thêm công ty
            </Button>
          </DialogTrigger>
          <DialogContent className="border-gray-700 bg-[#1E1E1E] text-white">
            <DialogHeader>
              <DialogTitle className="text-orange-500">
                Thêm công ty mới
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleNewCompanySubmit} className="space-y-4 pt-4">
              <Input
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                required
                placeholder="Tên công ty"
              />
              <Input
                value={newCompanySlug}
                onChange={(e) => setNewCompanySlug(e.target.value)}
                required
                placeholder="Slug công ty"
              />
              <Input
                value={newCompanyLogoUrl}
                onChange={(e) => setNewCompanyLogoUrl(e.target.value)}
                placeholder="URL Logo (tùy chọn)"
              />
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsCompanyModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">Tạo</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-transparent">
              <TableHead className="text-gray-400">Logo</TableHead>
              <TableHead className="text-gray-400">Tên Công ty</TableHead>
              <TableHead className="text-gray-400">Slug</TableHead>
              <TableHead className="text-right text-gray-400">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <tr
                key={company.slug}
                className="border-b border-gray-800 text-sm hover:bg-[#252525]"
              >
                <td className="px-4 py-2">
                  {company.logo_url && (
                    <Image
                      src={company.logo_url}
                      alt={company.name}
                      width={40}
                      height={40}
                      className="rounded-full bg-white object-contain p-1"
                    />
                  )}
                </td>
                <td className="px-4 py-2 font-medium">{company.name}</td>
                <td className="px-4 py-2 text-gray-400">{company.slug}</td>
                <td className="px-4 py-2 text-right">
                  {/* Add edit/delete functionality later */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    disabled
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CMSPage;
