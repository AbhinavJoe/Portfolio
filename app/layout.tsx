import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { ScrollTraceIndicator } from "@/components/scroll-trace-indicator";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

// Display face for headings — bigger, tighter editorial sizing than body
// copy calls for. Body text and mono labels keep their existing faces.
const inter = Inter({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Abhinav Joshi",
  description: "Software Engineer — backend systems, infra, and the occasional 3D scene.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
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
