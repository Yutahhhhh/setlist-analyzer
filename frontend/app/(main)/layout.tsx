"use client";
import { Suspense } from "react";
import ResponsiveDrawer from "@/components/ResponsiveDrawer";
import { useGenre } from "@/hooks/useGenreHook";
import { useJobStatus } from "@/hooks/useJobStatusHook";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useJobStatus();
  useGenre();
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResponsiveDrawer>{children}</ResponsiveDrawer>
    </Suspense>
  );
}
