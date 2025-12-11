"use client";

import React, { useState, useEffect } from "react";
import {
  UserCircle2,
  Briefcase,
  FolderKanban,
  GraduationCap,
  ChevronDownIcon,
  LogOutIcon,
  ShieldCheck,
} from "lucide-react";
import ThemeToggle from "../global/ThemeToggle";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export interface SubNavItem {
  name: string;
  path: string;
}

export interface NavItem {
  name: string;
  icon: React.ElementType;
  path?: string;
  subItems?: SubNavItem[];
}

const navigationItems: NavItem[] = [
  {
    name: "Profile",
    icon: UserCircle2,
    subItems: [{ name: "Personal Details", path: "/admin/personal-detail" }],
  },
  {
    name: "Internship",
    icon: Briefcase,
    subItems: [{ name: "Verification", path: "/admin/verification" }],
  },
  {
    name: "Project Management",
    icon: FolderKanban,
    subItems: [
      { name: "Manager", path: "/admin/manager" },
      { name: "Project", path: "/admin/projects" },
    ],
  },
  {
    name: "Students",
    icon: GraduationCap,
    subItems: [
      { name: "Student List", path: "/admin/students" },
      { name: "Student Documents", path: "/admin/student-docs" },
      { name: "Assign Project", path: "/admin/assign-project" },
      { name: "Attendance", path: "/admin/student-attendance" },
    ],
  },
  {
    name: "FeedBack",
    icon: ShieldCheck,
    subItems: [{ name: "View FeedBack", path: "/admin/feedback" }, { name: "View Guidelines", path: "/admin/guidelines" }],
  },
];

interface SidebarProps {
  isMobile: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobile,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>("Dashboard");
  const [activeSubItem, setActiveSubItem] = useState<string>(
    "/admin/notification"
  );
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const currentPath = window.location.pathname;
    setActiveSubItem(currentPath);
  }, []);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/auth");
  };

  const sidebarWidthClass = isMobile
    ? isMobileMenuOpen
      ? "translate-x-0 w-64"
      : "-translate-x-full w-64"
    : "w-64";

  const lightModeStyle =
    theme === "light"
      ? {
        background: "linear-gradient(145deg, #ffffff, #f3f4f6)",
        boxShadow:
          "0 4px 15px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(0, 0, 0, 0.04)",
        borderRight: "1px solid rgba(0, 0, 0, 0.08)",
        color: "#111827",
      }
      : {};

  return (
    <>
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen flex flex-col dark:bg-gray-900 dark:text-gray-200 border-r dark:border-gray-800 shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${sidebarWidthClass}`}
        style={lightModeStyle}
      >
        <div className="flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-800 px-4">
          <div className="flex items-center overflow-hidden">
            <img
              alt="Logo"
              width={36}
              height={36}
              src="/logo.png"
              className="rounded-full object-cover flex-shrink-0 shadow-sm"
            />
            <span className="ml-3 text-lg font-bold whitespace-nowrap tracking-wide">
              Admin Panel
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-none">
          {navigationItems.map((item) => (
            <div key={item.name} className="relative">
              <button
                onClick={() => toggleMenu(item.name)}
                className="group flex items-center w-full px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 text-left"
              >
                <item.icon className="w-5 h-5 mr-4 shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-sky-500" />
                <span className="flex-1 text-sm font-medium whitespace-nowrap">
                  {item.name}
                </span>
                {item.subItems && (
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform duration-300 ease-in-out ${openMenu === item.name ? "rotate-180" : ""
                      }`}
                  />
                )}
              </button>

              {item.subItems && openMenu === item.name && (
                <div className="mt-1 pl-8 pr-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <a
                      key={subItem.name}
                      href={subItem.path}
                      className={`relative flex items-center text-sm py-2 px-4 rounded-md transition-all duration-200 ${activeSubItem === subItem.path
                        ? "text-sky-600 dark:text-sky-400 font-semibold bg-sky-100 dark:bg-sky-900/30 shadow-sm"
                        : "text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                    >
                      <span
                        className={`absolute left-0 h-full w-1 rounded-r-full transition-all duration-200 ${activeSubItem === subItem.path
                          ? "bg-sky-500"
                          : "bg-transparent"
                          }`}
                      />
                      {subItem.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 18px",
              fontSize: "0.9rem",
              borderRadius: "10px",
              cursor: "pointer",
              border: "none",
              outline: "none",
              backgroundColor: theme === "dark" ? "#1f2937" : "#f3f4f6",
              color: theme === "dark" ? "#f9fafb" : "#111827",
              boxShadow:
                theme === "dark"
                  ? "0 2px 5px rgba(0,0,0,0.3)"
                  : "0 2px 6px rgba(0,0,0,0.1)",
              transition: "all 0.25s ease-in-out",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                theme === "dark" ? "#374151" : "#e5e7eb";
              e.currentTarget.style.boxShadow =
                theme === "dark"
                  ? "0 3px 8px rgba(0,0,0,0.4)"
                  : "0 4px 10px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                theme === "dark" ? "#1f2937" : "#f3f4f6";
              e.currentTarget.style.boxShadow =
                theme === "dark"
                  ? "0 2px 5px rgba(0,0,0,0.3)"
                  : "0 2px 6px rgba(0,0,0,0.1)";
            }}
          >
            <LogOutIcon
              className="w-5 h-5 mr-3"
              color={theme === "dark" ? "#f9fafb" : "#111827"}
            />
            Logout
          </button>

          <ThemeToggle />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
