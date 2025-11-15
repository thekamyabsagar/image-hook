import type { Metadata } from "next";
import "./styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "N8N Image Analysis",
  description: "Upload images for N8N webhook analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
