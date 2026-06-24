import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { ScrollTraceIndicator } from "@/components/scroll-trace-indicator";
import "./globals.css";

// Inter for everything readable, JetBrains Mono for labels, dates and chips.
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Abhinav Joshi",
  description: "Software Engineer — backend systems, infra, and the occasional 3D scene.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <ThemeProvider>
          <SmoothScrollProvider>
            <SiteHeader />
            {children}
            <ScrollTraceIndicator />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
