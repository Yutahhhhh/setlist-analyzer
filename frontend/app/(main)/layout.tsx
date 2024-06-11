"use client";
import ResponsiveDrawer from "@/components/ResponsiveDrawer";
import { useJobStatus } from "@/hooks/useJobStatus";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useJobStatus();
  
  return (
    <ResponsiveDrawer>{children}</ResponsiveDrawer>
  );
}
