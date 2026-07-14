"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";

export function useWishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    async function fetchWishlist() {
      const { data, error } = await supabase
        .from("wishlists")
        .select("vendor_id")
        .eq("user_id", user!.id);

      if (!error && data) setWishlist(data.map((w) => w.vendor_id));
      setLoading(false);
    }
    fetchWishlist();
  }, [user]);

  const toggle = useCallback(
    async (vendorId: string) => {
      if (!user) return;

      const exists = wishlist.includes(vendorId);

      if (exists) {
        setWishlist((prev) => prev.filter((id) => id !== vendorId));
        await supabase.from("wishlists").delete().eq("user_id", user.id).eq("vendor_id", vendorId);
      } else {
        setWishlist((prev) => [...prev, vendorId]);
        await supabase.from("wishlists").insert({ user_id: user.id, vendor_id: vendorId });
      }
    },
    [user, wishlist]
  );

  const isWished = useCallback(
    (vendorId: string) => {
      return wishlist.includes(vendorId);
    },
    [wishlist]
  );

  return { wishlist, toggle, isWished, loading };
}