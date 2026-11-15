"use client";

import { useState } from "react";
import { Toaster } from "sonner";

import AuthInitializer from "@/components/AuthInitializer";
import AppLoader from "../app/loader";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <AppLoader onComplete={() => setIsLoading(false)} />}

      <AuthInitializer />

      {children}

      <Toaster position="top-right" richColors closeButton theme="dark" />
    </>
  );
}
