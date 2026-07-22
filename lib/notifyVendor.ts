// Helper untuk memicu notifikasi email ke vendor (misal: ada booking baru masuk).
// Dipanggil "fire-and-forget" — kalau gagal kirim email, tidak mengganggu alur utama user.
export async function notifyVendor(to: string, subject: string, message: string) {
  try {
    await fetch("/api/notify-vendor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, message }),
    });
  } catch (err) {
    console.error("Gagal memicu notifikasi email vendor:", err);
  }
}