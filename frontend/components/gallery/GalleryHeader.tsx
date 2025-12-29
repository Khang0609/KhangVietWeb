import Link from "next/link";

export function GalleryHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#121212]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-[#FF6B00] tracking-wider">
          KHANG VIỆT
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-white/80 hover:text-white transition-colors"
          >
            Trang chủ
          </Link>
          <Link
            href="/projects"
            className="text-white/80 hover:text-white transition-colors"
          >
            Dự án
          </Link>
          <Link
            href="/dich-vu"
            className="text-white/80 hover:text-white transition-colors"
          >
            Dịch vụ
          </Link>
          <Link
            href="/shop"
            className="text-white/80 hover:text-white transition-colors"
          >
            Cửa hàng
          </Link>
        </nav>

        {/* CTA Button */}
        <Link
          href="/ghe-cua-hang"
          className="bg-[#FF6B00] text-white px-6 py-2 rounded hover:bg-[#FF6B00]/90 transition-colors"
        >
          Ghé Cửa Hàng
        </Link>
      </div>
    </header>
  );
}
