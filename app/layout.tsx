import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abhinav Joshi",
  description: "Software Engineer — backend systems, infra, and the occasional 3D scene.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
