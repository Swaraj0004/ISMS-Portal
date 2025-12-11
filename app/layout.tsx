import AppLayout from "@/components/AppLayout";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ReactNode } from "react";
import Chatbot from "@/components/ChatBot";

export const metadata = {
  title: "ISMS Portal",
  description: "Modern glassmorphism dashboard with light/dark mode",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] transition-colors duration-500">
        <Providers>
          <AppLayout>
            {children}
            <Chatbot />
          </AppLayout>
        </Providers>
      </body>
    </html>
  );
}
