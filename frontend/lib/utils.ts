import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import imageCompression from "browser-image-compression";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(file, options);
    console.log(
      `Compressed file size: ${compressedFile.size / 1024 / 1024} MB`
    );
    return compressedFile;
  } catch (error) {
    console.error("Image compression error:", error);
    throw error;
  }
}
