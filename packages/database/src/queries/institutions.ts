/**
 * Server-side Institutions, School Cohorts & Tinkering Lab Inquiries queries
 */
import type { SupabaseClient } from "../client";

export interface InstitutionInquiryPayload {
  institution_name: string;
  institution_type: "k12_school" | "college" | "university" | "polytechnic" | "tinkering_lab";
  city: string;
  state: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  student_count: number;
  target_programs: string[];
  message?: string;
}

export interface InstitutionRecord {
  id: string;
  code: string;
  name: string;
  institution_type: string;
  city: string;
  state: string;
  contact_person_name: string;
  total_licenses: number;
  active_students_count: number;
  status: "active" | "pending" | "suspended";
}

export const DEMO_INSTITUTIONS: InstitutionRecord[] = [
  {
    id: "inst-1",
    code: "INST-DPS-VK",
    name: "Delhi Public School, Vasant Kunj",
    institution_type: "k12_school",
    city: "New Delhi",
    state: "Delhi",
    contact_person_name: "Dr. Rajeshwar Verma",
    total_licenses: 250,
    active_students_count: 184,
    status: "active"
  },
  {
    id: "inst-2",
    code: "INST-VIT-VEL",
    name: "Vellore Institute of Technology",
    institution_type: "university",
    city: "Vellore",
    state: "Tamil Nadu",
    contact_person_name: "Prof. K. Sundaram",
    total_licenses: 500,
    active_students_count: 340,
    status: "active"
  }
];

/**
 * Submit an institutional partnership or Tinkering Lab setup inquiry
 */
export async function submitInstitutionInquiry(
  supabase: SupabaseClient | undefined,
  payload: InstitutionInquiryPayload
): Promise<{ success: boolean; inquiryId?: string; error?: string }> {
  if (supabase) {
    const { data, error } = await (supabase as any)
      .from("institution_inquiries")
      .insert({
        institution_name: payload.institution_name,
        institution_type: payload.institution_type,
        city: payload.city,
        state: payload.state,
        contact_name: payload.contact_name,
        contact_email: payload.contact_email,
        contact_phone: payload.contact_phone,
        student_count: payload.student_count,
        target_programs: payload.target_programs,
        message: payload.message || "",
        status: "new"
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, inquiryId: data.id };
  }

  return { success: true, inquiryId: `demo-inq-${Date.now()}` };
}

/**
 * Fetch all partner institutions
 */
export async function getPartnerInstitutions(
  supabase?: SupabaseClient
): Promise<InstitutionRecord[]> {
  if (supabase) {
    const { data, error } = await (supabase as any)
      .from("institutions")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }
  }

  return DEMO_INSTITUTIONS;
}
