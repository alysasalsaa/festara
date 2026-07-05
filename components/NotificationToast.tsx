"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

export default function NotificationToast() {
  useEffect(() => {
    const channel = supabase
      .channel("realtime-bookings-toast")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings_public" },
        async (payload) => {
          const booking = payload.new as {
            guest_name?: string;
            vendor_id?: string;
            package_id?: string;
          };

          const name = booking.guest_name || "Seseorang";
          let target = "sebuah vendor";

          try {
            if (booking.package_id) {
              const { data: pkg } = await supabase
                .from("packages")
                .select("name")
                .eq("id", booking.package_id)
                .single();
              if (pkg?.name) target = pkg.name;
            } else if (booking.vendor_id) {
              const { data: vendor } = await supabase
                .from("vendors")
                .select("name")
                .eq("id", booking.vendor_id)
                .single();
              if (vendor?.name) target = vendor.name;
            }
          } catch (err) {
            console.error("Gagal ambil nama paket/vendor:", err);
          }

          toast(`${name} baru saja booking ${target} 🎉`, {
            icon: "🔔",
            duration: 4000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
}