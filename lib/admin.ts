import { supabase } from "@/lib/supabase";

export type VendorApplication = {
  id: string;
  user_id: string;
  business_name: string;
  category_id: string;
  location: string;
  phone: string;
  description: string | null;
  status: string | null;
  created_at: string;
  years_experience: number | null;
  instagram_url: string | null;
  ktp_url: string | null;
  portfolio_urls: string[] | null;
  applicant_name?: string;
  applicant_email?: string;
  ktp_signed_url?: string | null;
  portfolio_signed_urls?: string[];
};

export async function isCurrentUserAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !data) return false;
  return data.role === "admin";
}

export async function getVendorApplications(status?: string): Promise<VendorApplication[]> {
  let query = supabase
    .from("vendor_applications")
    .select("id, user_id, business_name, category_id, location, phone, description, status, created_at, years_experience, instagram_url, ktp_url, portfolio_urls")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;

  if (error) {
    console.error("Gagal ambil aplikasi vendor:", error);
    return [];
  }

  const applications = data || [];
  const userIds = [...new Set(applications.map(a => a.user_id))];

  let userMap: Record<string, { full_name: string; email: string }> = {};
  if (userIds.length > 0) {
    const { data: usersData } = await supabase
      .from("users")
      .select("id, full_name, email")
      .in("id", userIds);
    userMap = Object.fromEntries((usersData || []).map(u => [u.id, u]));
  }

  // Generate signed URL untuk KTP dan portofolio (berlaku 1 jam)
  const withSignedUrls = await Promise.all(
    applications.map(async (app) => {
      let ktpSignedUrl: string | null = null;
      if (app.ktp_url) {
        const { data } = await supabase.storage
          .from("vendor-application-files")
          .createSignedUrl(app.ktp_url, 3600);
        ktpSignedUrl = data?.signedUrl || null;
      }

      let portfolioSignedUrls: string[] = [];
      if (app.portfolio_urls && app.portfolio_urls.length > 0) {
        const signedResults = await Promise.all(
          app.portfolio_urls.map((path: string) =>
            supabase.storage.from("vendor-application-files").createSignedUrl(path, 3600)
          )
        );
        portfolioSignedUrls = signedResults.map(r => r.data?.signedUrl).filter(Boolean) as string[];
      }

      return {
        ...app,
        applicant_name: userMap[app.user_id]?.full_name,
        applicant_email: userMap[app.user_id]?.email,
        ktp_signed_url: ktpSignedUrl,
        portfolio_signed_urls: portfolioSignedUrls,
      };
    })
  );

  return withSignedUrls;
}

// Salin foto portofolio dari bucket privat aplikasi ke bucket publik "portfolio",
// lalu catat setiap foto di tabel portfolio_images untuk vendor yang baru disetujui.
async function copyApplicationPortfolioToVendor(
  applicationId: string,
  vendorId: string
): Promise<{ success: boolean; error?: string }> {
  const { data: app, error: fetchError } = await supabase
    .from("vendor_applications")
    .select("portfolio_urls")
    .eq("id", applicationId)
    .single();

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  const portfolioUrls: string[] = app?.portfolio_urls || [];
  if (portfolioUrls.length === 0) {
    return { success: true };
  }

  for (let i = 0; i < portfolioUrls.length; i++) {
    const sourcePath = portfolioUrls[i];

    // Download file dari bucket privat
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from("vendor-application-files")
      .download(sourcePath);

    if (downloadError || !fileBlob) {
      console.error(`Gagal download portofolio ${sourcePath}:`, downloadError);
      continue;
    }

    // Tentukan nama file tujuan di bucket publik
    const extension = sourcePath.split(".").pop() || "jpg";
    const destPath = `${vendorId}/${crypto.randomUUID()}.${extension}`;

    // Upload ke bucket publik "portfolio"
    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(destPath, fileBlob, { contentType: fileBlob.type, upsert: false });

    if (uploadError) {
      console.error(`Gagal upload portofolio ${destPath}:`, uploadError);
      continue;
    }

    const { data: publicUrlData } = supabase.storage.from("portfolio").getPublicUrl(destPath);

    const { error: insertError } = await supabase.from("portfolio_images").insert({
      vendor_id: vendorId,
      image_url: publicUrlData.publicUrl,
      order_index: i,
    });

    if (insertError) {
      console.error(`Gagal simpan portfolio_images untuk ${destPath}:`, insertError);
    }
  }

  return { success: true };
}

export async function approveVendorApplication(applicationId: string): Promise<{ success: boolean; error?: string }> {
  const { data: newVendorId, error } = await supabase.rpc("approve_vendor_application", {
    application_id: applicationId,
  });

  if (error) {
    console.error("Gagal approve aplikasi:", error);
    return { success: false, error: error.message };
  }

  if (newVendorId) {
    const copyResult = await copyApplicationPortfolioToVendor(applicationId, newVendorId as string);
    if (!copyResult.success) {
      console.error("Vendor berhasil dibuat tapi portofolio gagal disalin:", copyResult.error);
      // Tidak menggagalkan approve secara keseluruhan — vendor tetap disetujui,
      // tapi catat error supaya bisa diinvestigasi.
    }
  }

  return { success: true };
}

export async function rejectVendorApplication(applicationId: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.rpc("reject_vendor_application", { application_id: applicationId });

  if (error) {
    console.error("Gagal reject aplikasi:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
}