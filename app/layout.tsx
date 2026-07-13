import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import ToastProvider from "@/components/ToastProvider";
import PageTransition from "@/components/PageTransition";
import RealtimeNotificationToast from "@/components/RealtimeNotificationToast";

export const metadata: Metadata = {
  title: "Festara — Platform Vendor Pernikahan & Event",
  description: "Temukan vendor terbaik untuk acara spesialmu. Booking langsung, pembayaran aman.",
  icons: {
    icon: "/logo/festara-app-icon.png",
    apple: "/logo/festara-app-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body
        suppressHydrationWarning
        className="min-h-screen"
        style={{
          background: "linear-gradient(135deg, #DBEBC9 0%, #a8ddd8 50%, #1CABB4 100%)",
          backgroundAttachment: "fixed",
        }}>
        <ToastProvider />
        <RealtimeNotificationToast />
        <Navbar />
        <PageTransition>
          <main className="pb-20 md:pb-0">{children}</main>
        </PageTransition>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}