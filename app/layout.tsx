import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";
import RealtimeNotificationToast from "@/components/RealtimeNotificationToast";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Festara — Platform Vendor Pernikahan & Event",
  description: "Temukan vendor terbaik untuk acara spesialmu. Booking langsung, pembayaran aman.",
  icons: {
    icon: "/logo/festara-icon-color.png",
    apple: "/logo/festara-icon-color.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body suppressHydrationWarning className="min-h-screen">
        <ToastProvider />
        <RealtimeNotificationToast />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}