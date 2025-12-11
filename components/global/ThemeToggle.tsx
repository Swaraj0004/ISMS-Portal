"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button className="p-2 rounded bg-gray-200 dark:bg-gray-700">
        <Sun className="w-5 h-5 text-yellow-500" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-2 p-3 rounded-lg font-semibold shadow 
                 text-white  dark:text-blue-900
                 hover:scale-105 transition-transform"
    >
      {isDark ? (
        <>
          <Sun className="w-5 h-5 text-yellow-400" />
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 text-blue-800" />
        </>
      )}
    </button>
  );
}
