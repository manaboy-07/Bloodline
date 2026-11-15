"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "../providers/providers";
import { useState } from "react";
import AppLoader from "./loader";
import { Toaster } from "sonner";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  return (
    <html lang="en" className="bg-neutral-950">
      <body
        className={`${geist.variable} ${geistMono.variable} min-h-screen bg-neutral-950 antialiased`}
      >
        <Providers>
          <AppLoader onComplete={() => setLoading(false)} />

          <div className={loading ? "invisible" : "visible"}>{children}</div>

          <Toaster richColors position="top-right" closeButton theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
