"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import PageTransition from "@/components/PageTransition";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Admin: background netral, tanpa navbar/footer/mobilenav publik
    return (
      <div className="min-h-screen bg-[#F5F8F6]">
        <PageTransition>{children}</PageTransition>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #DBEBC9 0%, #a8ddd8 50%, #1CABB4 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <Navbar />
      <PageTransition>
        <main className="pb-20 md:pb-0">{children}</main>
      </PageTransition>
      <Footer />
      <MobileNav />
    </div>
  );
}