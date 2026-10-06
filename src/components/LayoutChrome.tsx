"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

type Props = {
  children: React.ReactNode;
  settings: any;
  showCatalog: any;
};

export default function LayoutChrome({
  children,
  settings,
  showCatalog,
}: Props) {
  const pathname = usePathname();

  /*
   * تمام صفحات Visualizer
   * بدون Navbar و Footer نمایش داده می‌شوند.
   */
  const isVisualizer = pathname.includes("/visualizer");

  if (isVisualizer) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar
        settings={settings}
        showCatalog={showCatalog}
      />

      {children}

      <Footer
        settings={settings}
      />
    </>
  );
}