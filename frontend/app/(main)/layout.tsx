"use client";
import ResponsiveDrawer from "@/components/ResponsiveDrawer";
import { useGenre } from "@/hooks/useGenre";
import { useJobStatus } from "@/hooks/useJobStatus";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useJobStatus();
  useGenre();
  
  return (
    <ResponsiveDrawer>{children}</ResponsiveDrawer>
  );
}
