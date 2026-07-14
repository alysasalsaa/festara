// Helper untuk memicu notifikasi email ke admin (halo@festara.id).
// Dipanggil "fire-and-forget" — kalau gagal kirim email, tidak mengganggu alur utama user.
export async function notifyAdmin(subject: string, message: string) {
  try {
    await fetch("/api/notify-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message }),
    });
  } catch (err) {
    console.error("Gagal memicu notifikasi email admin:", err);
  }
}