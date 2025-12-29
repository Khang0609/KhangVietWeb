"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, X, ShoppingCart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useCart } from "./providers/CartContext";
import { SHOW_COMMERCE_FEATURES } from "@/lib/config";

interface NavigationProps {
  onShopClick?: () => void;
}

export function Navigation({ onShopClick }: NavigationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 80);
    };

    const checkAuth = () => {
      const token = Cookies.get("token");
      const role = localStorage.getItem("userRole");
      if (token && role) {
        setIsLoggedIn(true);
        setUserRole(role);
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    handleScroll();
    checkAuth();

    window.addEventListener("scroll", handleScroll);
    // Listen for storage changes to update auth status across tabs
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
    setIsMobileMenuOpen(false);
    router.push("/"); // Redirect to home after logout
  };

  const navLinks = [
    { label: "Trang chủ", href: "#home" },
    { label: "Dự án", href: "/projects" },
    { label: "Dịch vụ", href: "#services" },
    // Cửa hàng is now conditional
  ];

  if (SHOW_COMMERCE_FEATURES) {
    navLinks.push({ label: "Cửa hàng", href: "/shop" });
  }

  const AuthLink = () => {
    if (isLoggedIn) {
      const accountLabel = userRole === "admin" ? "Admin" : "Tài khoản";
      const accountHref = userRole === "admin" ? "/admin" : "/account"; // Assuming a generic /account page
      return (
        <div className="group relative">
          <Link
            href={accountHref}
            className="tracking-wide text-white/80 transition-colors duration-300 hover:text-[#FF6B00]"
          >
            {accountLabel}
          </Link>
        </div>
      );
    }
    return (
      <Link
        href="/login"
        className="tracking-wide text-white/80 transition-colors duration-300 hover:text-[#FF6B00]"
      >
        Đăng nhập
      </Link>
    );
  };

  const ActionButton = () => {
    if (isLoggedIn) {
      return (
        <Button
          onClick={handleLogout}
          className="bg-red-600 px-6 py-2 text-white hover:bg-red-700"
        >
          Đăng xuất
        </Button>
      );
    }

    return (
      <Button
        onClick={onShopClick}
        className="group relative overflow-hidden bg-[#FF6B00] px-6 py-2 text-white hover:bg-[#FF6B00]/80"
      >
        <span className="relative z-10">Ghé Cửa Hàng</span>
        <span className="absolute inset-0 bg-linear-to-r from-[#FF6B00] to-[#D32F2F] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
      </Button>
    );
  };

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transform transition-all duration-300 ${
        isVisible
          ? "translate-y-0 border-b border-[#FF6B00]/20 bg-white/5 opacity-100 backdrop-blur-md"
          : "pointer-events-none -translate-y-full opacity-0"
      }`}
    >
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="group relative">
            <span className="bg-linear-to-r from-[#FF6B00] to-[#D32F2F] bg-clip-text text-[28px] tracking-widest text-transparent transition-all duration-300 group-hover:tracking-[0.3em]">
              KHANG VIỆT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative tracking-wide text-white/80 transition-colors duration-300 hover:text-[#FF6B00]"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#FF6B00] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            <AuthLink />
            <ActionButton />
            {SHOW_COMMERCE_FEATURES && (
              <Link
                href="/checkout"
                className="relative text-white/80 transition-colors duration-300 hover:text-[#FF6B00]"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6B00] text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 text-white md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mt-6 border-t border-[#FF6B00]/20 pt-6 pb-6 md:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="py-2 tracking-wide text-white/80 transition-colors duration-300 hover:text-[#FF6B00]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="py-2">
                <AuthLink />
              </div>

              <div className="flex items-center justify-between">
                <ActionButton />
                {SHOW_COMMERCE_FEATURES && (
                  <button
                    onClick={() => router.push("/checkout")}
                    className="group relative rounded-lg bg-[#1E1E1E] p-3 transition-colors hover:bg-[#FF6B00]/20"
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
          </div>
        )}
      </div>
    </nav>
  );
}
