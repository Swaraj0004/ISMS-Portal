"use client";

import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      {children}

    </>
  );
}
