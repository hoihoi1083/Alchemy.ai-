import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "alchemy.ai",
  description:
    "Product ad and video studio — Nano Banana + Seedance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
