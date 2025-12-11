"use client";
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";
import { ReactNode } from "react";

interface Props extends ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children, ...props }: Props) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
