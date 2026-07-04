import { Link2, MessageCircle, PlayCircle, Globe, Mail, Phone } from "lucide-react";

const CATEGORY_LINKS = [
  { label: "Wedding Organizer", href: "/search?cat=wedding-organizer" },
  { label: "Event Organizer", href: "/search?cat=event-organizer" },
  { label: "Fotografer", href: "/search?cat=photographer" },
  { label: "Venue", href: "/search?cat=venue" },
  { label: "Dekorasi", href: "/search?cat=dekorasi" },
  { label: "Merchandise Wisuda", href: "/search?cat=merchandise-wisuda" },
  { label: "Catering", href: "/search?cat=catering" },
];

const VENDOR_LINKS = [
  { label: "Daftarkan Vendor", href: "/register" },
  { label: "Dashboard Vendor", href: "/seller" },
  { label: "Panduan Booking", href: "/help" },
  { label: "Sistem Escrow", href: "/help" },
  { label: "Komunitas", href: "/help" },
];

const HELP_LINKS = [
  { label: "Pusat Bantuan", href: "/help" },
  { label: "Cara Booking", href: "/help" },
  { label: "Cara Pembayaran", href: "/help" },
  { label: "Lacak Pesanan", href: "/dashboard" },
  { label: "Kebijakan Privasi", href: "/help" },
];

export default function Footer() {
  return (
    <footer className="bg-[#16302e] text-white hidden md:block">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/logo/festara-icon-color.png"
                alt="Festara"
                className="h-9 w-auto object-contain"
              />
              <span className="text-xl font-bold text-white"
                style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.03em" }}>
                festara
              </span>
            </div>
            <p className="text-[#8ABDB5] text-sm leading-relaxed mb-5">
              Platform booking vendor pernikahan & event terpercaya. Temukan WO, fotografer, venue, dekorasi, dan MUA terbaik untuk acara spesialmu.
            </p>
            <div className="flex gap-3">
              {[Link2, MessageCircle, PlayCircle, Globe].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-[#1CABB4] rounded-xl flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Kategori */}
          <div>
            <h4 className="font-bold mb-4 text-sm text-[#DBEBC9]">Kategori</h4>
            <ul className="space-y-2.5">
              {CATEGORY_LINKS.map(link => (
                <li key={link.label}>
                  <a href={link.href}
                    className="text-[#8ABDB5] hover:text-[#DBEBC9] text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Vendor */}
          <div>
            <h4 className="font-bold mb-4 text-sm text-[#DBEBC9]">Vendor</h4>
            <ul className="space-y-2.5">
              {VENDOR_LINKS.map(link => (
                <li key={link.label}>
                  <a href={link.href}
                    className="text-[#8ABDB5] hover:text-[#DBEBC9] text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="font-bold mb-4 text-sm text-[#DBEBC9]">Bantuan</h4>
            <ul className="space-y-2.5">
              {HELP_LINKS.map(link => (
                <li key={link.label}>
                  <a href={link.href}
                    className="text-[#8ABDB5] hover:text-[#DBEBC9] text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo/festara-logo-horizontal.png" alt="Festara"
              className="h-6 w-auto object-contain brightness-0 invert opacity-50" />
          </div>
          <p className="text-[#8ABDB5] text-xs">© 2026 Festara. Platform vendor pernikahan & event terpercaya.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[#8ABDB5] text-xs">
              <Mail size={12} /><span>support@festara.id</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#8ABDB5] text-xs">
              <Phone size={12} /><span>0800-FESTARA</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}