import { toast } from "sonner";

const CLOUD_NAME = "dc8vptxiq"; // Thay vào đây
const UPLOAD_PRESET = "khangviet_upload"; // Thay vào đây

export const uploadToCloudinary = async (
  file: File,
): Promise<string | null> => {
  // Task 2: Upload Constraints - Limit file size to 2MB
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  if (file.size > MAX_SIZE) {
    console.error(
      `File size exceeds limit: ${(file.size / 1024 / 1024).toFixed(2)}MB > 2MB`,
    );
    toast.error(`File ${file.name} quá lớn! Vui lòng chọn file dưới 2MB.`);
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "khangviet-projects"); // Tự động tạo folder trên cloud

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    const data = await res.json();
    return data.secure_url; // Đây là cái link ảnh vĩnh viễn (https://...)
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    return null;
  }
};
