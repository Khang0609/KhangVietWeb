import { SplashProvider } from "@/components/providers/SplashProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/providers/CartContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Khang Việt Design",
    template: "%s | Khang Việt Design" 
  },
  description: "Chuyên thiết kế, thi công bảng hiệu, hộp đèn, chữ nổi uy tín tại TP.HCM. Chất lượng bền bỉ, giá cả cạnh tranh.",
  keywords: ["bảng hiệu quận bình tân", "thi công quảng cáo", "làm bảng hiệu giá rẻ", "hộp đèn led"],
  openGraph: {
    title: "Khang Việt Design",
    description: "Chuyên thiết kế, thi công bảng hiệu quảng cáo chất lượng cao.",
    url: "https://khangvietweb.com", // Sau này thay bằng link thật
    siteName: "Khang Việt Design",
    images: [
      {
        url: "/og-image.jpg", // Cậu chuẩn bị 1 tấm ảnh 1200x630 đẹp nhất nhé
        width: 1200,
        height: 630,
        alt: "Khang Việt Design",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <SplashProvider>{children}</SplashProvider>
        </CartProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
