import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";
import RealtimeNotificationToast from "@/components/RealtimeNotificationToast";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  metadataBase: new URL("https://festara.id"),
  title: {
    default: "Festara — Platform Booking Vendor Pernikahan, Wisuda & Event di Yogyakarta",
    template: "%s | Festara",
  },
  description: "Temukan dan booking vendor terbaik untuk pernikahan, wisuda, dan event di Yogyakarta — fotografer, wedding organizer, venue, dekorasi, catering, MUA, dan sewa perlengkapan. Booking langsung, pembayaran aman dengan sistem escrow.",
  keywords: ["Festara", "festara.id", "vendor pernikahan yogyakarta", "wedding organizer jogja", "fotografer wisuda yogyakarta", "sewa gedung pernikahan", "vendor wisuda jogja", "booking vendor event", "MUA yogyakarta", "sewa baju wisuda"],
  icons: {
    icon: "/logo/festara-icon-color.png",
    apple: "/logo/festara-icon-color.png",
  },
  openGraph: {
    title: "Festara — Platform Booking Vendor Pernikahan, Wisuda & Event di Yogyakarta",
    description: "Temukan dan booking vendor terbaik untuk pernikahan, wisuda, dan event di Yogyakarta. Booking langsung, pembayaran aman.",
    url: "https://festara.id",
    siteName: "Festara",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Festara — Platform Booking Vendor Pernikahan, Wisuda & Event di Yogyakarta",
    description: "Temukan dan booking vendor terbaik untuk pernikahan, wisuda, dan event di Yogyakarta.",
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