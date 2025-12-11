"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BouncingDots } from "@/components/global/Loader";
import Sidebar from "@/components/admin/Sidebar";
import { MenuIcon, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import type React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.replace("/auth");
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== "admin") {
        router.replace("/unauthorized");
        return;
      }
      setLoading(false);
    } catch (err) {
      console.error("Invalid user data", err);
      localStorage.removeItem("user");
      router.replace("/auth");
    }
  }, [router]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BouncingDots />
      </div>
    );

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#0f172a] text-gray-100"
          : "bg-[#f9fafb] text-gray-900"
      }`}
    >
      <Sidebar
        isMobile={isMobile}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main
        className={`flex-1 md:ml-64 relative overflow-y-auto transition-all duration-300 ${
          theme === "dark"
            ? "bg-[#0f172a] text-gray-100"
            : "bg-[#f9fafb] text-gray-900"
        }`}
      >
        {isMobile && (
          <header
            className={`flex items-center justify-between h-16 px-4 sticky top-0 z-30 backdrop-blur-md border-b ${
              theme === "dark"
                ? "bg-[#1e293b]/80 border-gray-800"
                : "bg-white/70 border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <MenuIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </button>
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            </div>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </header>
        )}

        <div className="p-4 md:p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
