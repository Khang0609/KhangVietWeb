// @/components/admin/AdminSidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ClipboardList, LayoutTemplate, Package, LogOut } from "lucide-react";

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      href: "/admin/orders",
      label: "Quản lý đơn hàng",
      icon: ClipboardList,
      group: "main",
    },
    {
      href: "/admin/cms",
      label: "Dự án & Công ty",
      icon: LayoutTemplate,
      group: "main",
    },
    // Product Group
    {
      href: "/admin/products",
      label: "Kho hàng",
      icon: Package,
      group: "product",
    },
    {
      href: "/admin/categories",
      label: "Quản lý Danh mục",
      icon: ClipboardList,
      group: "product",
    },
  ];

  const handleLogout = () => {
    // 1. Remove authentication cookie
    Cookies.remove("token");

    // 2. Remove any user info from local storage
    localStorage.removeItem("user_info");

    // 3. Redirect to the login page
    router.push("/");
  };

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-gray-800 bg-[#121212] text-white md:flex">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#FF6B00]">KhangViet</h1>
        <span className="text-sm text-gray-400">Admin Panel</span>
      </div>
      <nav className="flex-grow space-y-6 px-4">
        {/* Main Group */}
        <div>
          {menuItems
            .filter((i) => i.group === "main")
            .map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mt-2 flex items-center rounded-lg px-4 py-3 transition-colors duration-200 ${
                    isActive
                      ? "bg-[#FF6B00] text-white"
                      : "text-gray-300 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
        </div>

        {/* Product Group */}
        <div>
          <h3 className="mb-2 px-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            SẢN PHẨM
          </h3>
          {menuItems
            .filter((i) => i.group === "product")
            .map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mt-2 flex items-center rounded-lg px-4 py-3 transition-colors duration-200 ${
                    isActive
                      ? "bg-[#FF6B00] text-white"
                      : "text-gray-300 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
        </div>
      </nav>
      <div className="border-t border-gray-800 px-4 py-6">
        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-lg px-4 py-3 text-gray-300 transition-colors duration-200 hover:bg-neutral-800 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
