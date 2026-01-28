import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


export const metadata: Metadata = {
  title: "Dyploma Project",
  description: "Study app. Easily learn new words.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="bg-gray-200 h-dvh overflow-hidden"
      >
        {children}
      </body>
    </html>
  );
}
