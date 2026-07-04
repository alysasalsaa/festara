"use client";
import { useState, useEffect, useCallback } from "react";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("festara_wishlist") || "[]");
    setWishlist(saved);
  }, []);

  const toggle = useCallback((vendorId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(vendorId);
      const updated = exists
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId];
      localStorage.setItem("festara_wishlist", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isWished = useCallback((vendorId: string) => {
    return wishlist.includes(vendorId);
  }, [wishlist]);

  return { wishlist, toggle, isWished };
}