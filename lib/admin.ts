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
  applicant_name?: string;
  applicant_email?: string;
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
    .select("id, user_id, business_name, category_id, location, phone, description, status, created_at")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;

  if (error) {
    console.error("Gagal ambil aplikasi vendor:", error);
    return [];
  }

  const applications = data || [];
  const userIds = [...new Set(applications.map(a => a.user_id))];

  if (userIds.length > 0) {
    const { data: usersData } = await supabase
      .from("users")
      .select("id, full_name, email")
      .in("id", userIds);

    const userMap = Object.fromEntries((usersData || []).map(u => [u.id, u]));
    return applications.map(a => ({
      ...a,
      applicant_name: userMap[a.user_id]?.full_name,
      applicant_email: userMap[a.user_id]?.email,
    }));
  }

  return applications;
}

export async function approveVendorApplication(applicationId: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.rpc("approve_vendor_application", { application_id: applicationId });

  if (error) {
    console.error("Gagal approve aplikasi:", error);
    return { success: false, error: error.message };
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