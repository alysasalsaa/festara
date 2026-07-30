"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    supabase.from("page_views").insert({ path: pathname }).then(({ error }) => {
      if (error) console.error("Gagal mencatat page view:", error);
    });
  }, [pathname]);

  return null;
}