"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";

export default function RealtimeNotificationToast() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`personal-notif-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const n = payload.new as { title: string; message: string };
          toast(`${n.title}\n${n.message}`, {
            icon: "🔔",
            duration: 5000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return null;
}