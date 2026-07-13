"use client";
import { useState, useEffect } from "react";
import { Check, X, Clock, MapPin, Phone, Loader2, AtSign, IdCard, Images, Calendar } from "lucide-react";
import { getVendorApplications, approveVendorApplication, rejectVendorApplication, VendorApplication } from "@/lib/admin";
import { categories } from "@/data";

const FILTERS = [
  { value: "", label: "Semua" },
  { value: "pending", label: "Menunggu" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
];

export default function VendorApplicationsPage() {
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true);
    const data = await getVendorApplications(filter || undefined);
    setApplications(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [filter]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    setErrorMsg("");
    const result = await approveVendorApplication(id);
    if (result.success) {
      await fetchData();
    } else {
      setErrorMsg(result.error || "Gagal approve aplikasi");
    }
    setProcessingId(null);
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    setErrorMsg("");
    const result = await rejectVendorApplication(id);
    if (result.success) {
      await fetchData();
    } else {
      setErrorMsg(result.error || "Gagal reject aplikasi");
    }
    setProcessingId(null);
  };

  return (
    <div className="space-y-4">
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="Preview" className="max-w-full max-h-full rounded-2xl" />
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="font-bold text-[#1A3A3C]">Aplikasi Vendor</h2>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${
                filter === f.value ? "bg-[#1CABB4] text-white" : "bg-white text-[#4A7A6D] border border-[#D4EAC8]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="bg-[#FEF2F2] border border-[#EF4444]/20 rounded-xl px-4 py-3">
          <p className="text-sm text-[#EF4444]">{errorMsg}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <p className="text-center text-sm text-[#8ABDB5] py-16 bg-white/80 rounded-2xl">Tidak ada aplikasi vendor</p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const categoryLabel = categories.find((c) => c.id === app.category_id)?.name || app.category_id;
            const isPending = app.status === "pending" || !app.status;

            return (
              <div key={app.id} className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-bold text-[#1A3A3C]">{app.business_name}</h3>
                    <p className="text-xs text-[#8ABDB5]">
                      Diajukan oleh {app.applicant_name || "Pengguna"} ({app.applicant_email})
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                      app.status === "approved"
                        ? "bg-[#DCFCE7] text-[#15803D]"
                        : app.status === "rejected"
                        ? "bg-[#FEF2F2] text-[#EF4444]"
                        : "bg-[#FFF7ED] text-[#F59E0B]"
                    }`}
                  >
                    {app.status === "approved" ? "Disetujui" : app.status === "rejected" ? "Ditolak" : "Menunggu"}
                  </span>
                </div>

                <div className="grid md:grid-cols-4 gap-3 text-xs text-[#4A7A6D] mb-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} /> {app.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} /> {app.phone}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} /> {app.years_experience ? `${app.years_experience} tahun pengalaman` : "-"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />{" "}
                    {new Date(app.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-xs bg-[#E8F8F9] text-[#1CABB4] font-semibold px-2.5 py-1 rounded-full">
                    {categoryLabel}
                  </span>
                  {app.instagram_url ? (
                    
                      href={app.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-[#FDF2F8] text-[#DB2777] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 hover:underline"
                    >
                      <AtSign size={11} />
                      Instagram
                    </a>
                  ) : null}
                </div>

                {app.description ? (
                  <p className="text-sm text-[#4A7A6D] leading-relaxed mb-4">{app.description}</p>
                ) : null}

                {app.ktp_signed_url ? (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-[#1A3A3C] mb-2 flex items-center gap-1.5">
                      <IdCard size={13} />
                      Foto KTP
                    </p>
                    <img
                      src={app.ktp_signed_url}
                      alt="KTP"
                      onClick={() => setPreviewImage(app.ktp_signed_url as string)}
                      className="w-40 h-28 object-cover rounded-xl border border-[#D4EAC8] cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  </div>
                ) : null}

                {app.portfolio_signed_urls && app.portfolio_signed_urls.length > 0 ? (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-[#1A3A3C] mb-2 flex items-center gap-1.5">
                      <Images size={13} />
                      Portofolio ({app.portfolio_signed_urls.length} foto)
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {app.portfolio_signed_urls.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt={`Portofolio ${i + 1}`}
                          onClick={() => setPreviewImage(url)}
                          className="w-20 h-20 object-cover rounded-xl border border-[#D4EAC8] cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                {isPending ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(app.id)}
                      disabled={processingId === app.id}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#1CABB4] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#178E96] transition-colors disabled:opacity-60"
                    >
                      {processingId === app.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      Setujui
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      disabled={processingId === app.id}
                      className="flex-1 flex items-center justify-center gap-1.5 border border-[#EF4444] text-[#EF4444] text-sm font-bold py-2.5 rounded-xl hover:bg-[#FEF2F2] transition-colors disabled:opacity-60"
                    >
                      <X size={14} />
                      Tolak
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}