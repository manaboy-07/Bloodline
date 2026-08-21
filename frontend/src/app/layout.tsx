"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "../providers/providers";
import { useState } from "react";
import AppLoader from "./loader";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  return (
    <html lang="en" className="   bg-neutral-900">
      <body className="   bg-neutral-900">
        <Providers>
          {loading && <AppLoader onComplete={() => setLoading(false)} />}
          {!loading && children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
