"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";

const NOTIFS = [
  "Dewi S. baru saja booking Lavinia Wedding Fotografer 🎉",
  "5 vendor baru bergabung hari ini!",
  "Budi P. memberikan ulasan bintang 5 ⭐",
  "Flash promo: Diskon 20% untuk booking minggu ini!",
];

let notifIndex = 0;

export default function NotificationToast() {
  useEffect(() => {
    const t = setTimeout(() => {
      toast(NOTIFS[notifIndex % NOTIFS.length], {
        icon: "🔔",
        duration: 4000,
      });
      notifIndex++;  // ← taruh di sini
    }, 3000);
    return () => clearTimeout(t);
  }, []);
  return null;
}