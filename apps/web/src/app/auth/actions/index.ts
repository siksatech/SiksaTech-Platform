"use server";

/**
 * Auth Server Actions for siksatech.in
 *
 * Handlers for login, register, logout, OTP authentication, password reset,
 * and parent-child linking (with deterministic time-windowed OTP, email dispatch, & in-app approval).
 */

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@siksatech/auth";
import { createAdminClient, isRealSupabase } from "@siksatech/database";
import crypto from "crypto";

const OTP_SECRET = "siksatech-parent-otp-secret-key-2026";

/**
 * Generate a 6-digit OTP valid for a 15-minute window
 */
export async function generateLinkOtp(parentId: string, childId: string, windowOffset = 0): Promise<string> {
  const windowIndex = Math.floor(Date.now() / (15 * 60 * 1000)) + windowOffset;
  const hash = crypto
    .createHmac("sha256", OTP_SECRET)
    .update(`${parentId}:${childId}:${windowIndex}`)
    .digest("hex");
  const num = parseInt(hash.slice(0, 8), 16) % 1000000;
  return num.toString().padStart(6, "0");
}

async function verifyLinkOtp(parentId: string, childId: string, candidateOtp: string): Promise<boolean> {
  if (candidateOtp === "123456" && !isRealSupabase) return true;
  const currentOtp = await generateLinkOtp(parentId, childId, 0);
  const prevOtp = await generateLinkOtp(parentId, childId, -1);
  const nextOtp = await generateLinkOtp(parentId, childId, 1);
  return candidateOtp === currentOtp || candidateOtp === prevOtp || candidateOtp === nextOtp;
}

/**
 * Send styled transactional email with OTP code if Resend API key is available
 */
async function sendOtpEmail(toEmail: string, childName: string, parentName: string, otp: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.info(`[SiksaTech OTP Dispatch] (Resend key not set in env) OTP for ${toEmail}: ${otp}`);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SiksaTech Security <auth@siksatech.in>",
        to: [toEmail],
        subject: "SiksaTech: Parent Account Linking Authorization Code",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px; background-color: #ffffff; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #2563eb; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">SIKSATECH</h2>
              <p style="color: #64748b; font-size: 12px; margin-top: 4px; text-transform: uppercase; font-family: monospace;">Knowledge • Technology • Wisdom</p>
            </div>
            <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">Parent Authorization Request</h3>
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">Hello <strong>${childName}</strong>,</p>
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
              <strong>${parentName}</strong> has requested to link with your SiksaTech student account as your parent/guardian to monitor your course progress and certificates.
            </p>
            <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
              <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">Your 6-Digit Authorization Code</span>
              <span style="font-family: monospace; font-size: 32px; font-weight: 800; color: #2563eb; letter-spacing: 6px;">${otp}</span>
              <span style="font-size: 11px; color: #94a3b8; display: block; margin-top: 8px;">Valid for 15 minutes</span>
            </div>
            <p style="font-size: 13px; line-height: 1.5; color: #64748b;">
              Share this code with your parent, or log in to your <a href="https://siksatech.in/dashboard/student" style="color: #2563eb; text-decoration: underline;">Student Dashboard</a> to approve this request directly.
            </p>
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
            <p style="font-size: 11px; color: #94a3b8; text-align: center;">If you did not expect this request, you can safely ignore this email.</p>
          </div>
        `,
      }),
    });
    if (!res.ok) {
      const errBody = await res.text();
      console.warn("Resend API response:", errBody);
    }
  } catch (err) {
    console.warn("Error sending OTP email via Resend:", err);
  }
}

/**
 * Get an effective DB client:
 * Uses privileged admin client if SUPABASE_SERVICE_ROLE_KEY is present,
 * otherwise safely falls back to standard server-authenticated Supabase client.
 */
async function getEffectiveDbClient() {
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return createAdminClient();
    }
  } catch {
    // Fall back to server client
  }
  return await createSupabaseServerClient();
}

// ─────────────────────────────────────────────────────────────
// RESOLVE ID TO EMAIL
// ─────────────────────────────────────────────────────────────
export async function resolveIdToEmail(idOrEmail: string): Promise<string | null> {
  if (idOrEmail.includes("@")) return idOrEmail;

  if (!isRealSupabase) return null;

  try {
    const client = await getEffectiveDbClient();
    const { data, error } = await (client as any)
      .from("profiles")
      .select("email")
      .eq("siksa_id", idOrEmail.trim())
      .maybeSingle();
    if (error || !data) return null;
    return (data as any).email;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// LOGIN with email + password
// ─────────────────────────────────────────────────────────────
export async function loginWithEmail(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const emailOrId = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirect") as string | null;

  if (!emailOrId || !password) {
    return { error: "Email/ID and password are required." };
  }

  const email = await resolveIdToEmail(emailOrId);
  if (!email) {
    return { error: "SiksaTech ID not found." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect(redirectTo && redirectTo.startsWith("/") ? redirectTo : "/dashboard");
}

// ─────────────────────────────────────────────────────────────
// REGISTER with email + password
// ─────────────────────────────────────────────────────────────
export async function registerWithEmail(
  prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const role = (formData.get("role") as string) || "student";

  if (!email || !password || !fullName) {
    return { error: "All fields are required.", success: false };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters.", success: false };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://siksatech.in"}/auth/callback?redirect=/dashboard`,
    },
  });

  if (error) {
    return { error: error.message, success: false };
  }

  return { error: null, success: true };
}

// ─────────────────────────────────────────────────────────────
// REQUEST PASSWORD RESET (Forgot Password)
// ─────────────────────────────────────────────────────────────
export async function requestPasswordReset(
  prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const email = formData.get("email") as string;
  if (!email) return { error: "Please enter your email address.", success: false };

  const supabase = await createSupabaseServerClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://siksatech.in";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?redirect=/auth/reset-password`,
  });

  if (error) return { error: error.message, success: false };
  return { error: null, success: true };
}

// ─────────────────────────────────────────────────────────────
// RESET PASSWORD (New Password)
// ─────────────────────────────────────────────────────────────
export async function updatePassword(
  prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  if (!password || !confirmPassword) return { error: "Both password fields are required.", success: false };
  if (password.length < 8) return { error: "Password must be at least 8 characters.", success: false };
  if (password !== confirmPassword) return { error: "Passwords do not match.", success: false };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message, success: false };
  return { error: null, success: true };
}

// ─────────────────────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────────────────────
export async function logout(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

// ─────────────────────────────────────────────────────────────
// PARENT: INITIATE CHILD LINK (creates link request + OTP)
// ─────────────────────────────────────────────────────────────
export async function initiateChildLink(
  prevState: { error: string | null; success: boolean; childName?: string; maskedEmail?: string; childId?: string; noEmailRequired?: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean; childName?: string; maskedEmail?: string; childId?: string; noEmailRequired?: boolean }> {
  const idOrEmail = (formData.get("id_or_email") as string)?.trim();

  if (!idOrEmail) {
    return { error: "Please enter a SiksaTech ID or email address.", success: false };
  }

  // In demo mode — return mock success
  if (!isRealSupabase) {
    return {
      error: null,
      success: true,
      childName: "Demo Student",
      maskedEmail: "d***@siksatech.in",
      childId: "DEMO-CHILD-01",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to link a child.", success: false };

  const dbClient = await getEffectiveDbClient();

  // Resolve the child profile
  const isEmail = idOrEmail.includes("@");
  const { data: childProfile, error: lookupErr } = await (dbClient as any)
    .from("profiles")
    .select("id, full_name, role, email, siksa_id")
    .eq(isEmail ? "email" : "siksa_id", idOrEmail)
    .maybeSingle();

  if (lookupErr || !childProfile) {
    return { error: "No student found with that ID or email. Please check and try again.", success: false };
  }

  if ((childProfile as any).role !== "student") {
    return { error: "This account is not a student account.", success: false };
  }

  // Check if already active/linked
  const { data: existing } = await (dbClient as any)
    .from("parent_child_links")
    .select("id, verified")
    .eq("parent_id", user.id)
    .eq("child_id", (childProfile as any).id)
    .maybeSingle();

  if (existing && existing.verified) {
    return { error: "This student is already linked to your account.", success: false };
  }

  const childEmail = (childProfile as any).email;

  // If no email (parent-created account) — link immediately, no OTP needed
  if (!childEmail) {
    const { error: insertErr } = await (dbClient as any).from("parent_child_links").upsert({
      parent_id: user.id,
      child_id: (childProfile as any).id,
      verified: true,
    }, { onConflict: "parent_id,child_id" });

    if (insertErr) {
      console.error("Link insert error:", insertErr);
      return { error: "Could not link child. Please try again.", success: false };
    }
    return {
      error: null,
      success: true,
      childName: (childProfile as any).full_name,
      childId: (childProfile as any).id,
      noEmailRequired: true,
    };
  }

  // Compute 6-digit OTP
  const otp = await generateLinkOtp(user.id, (childProfile as any).id);

  // Try saving pending link with standard columns
  try {
    await (dbClient as any).from("parent_child_links").upsert({
      parent_id: user.id,
      child_id: (childProfile as any).id,
      verified: false,
    }, { onConflict: "parent_id,child_id" });
  } catch (err) {
    console.warn("Could not insert pending parent_child_links record:", err);
  }

  const parentName = user.user_metadata?.full_name || "Parent";
  sendOtpEmail(childEmail, (childProfile as any).full_name, parentName, otp);

  // Mask email for display
  const maskedEmail = childEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3");

  return {
    error: null,
    success: true,
    childName: (childProfile as any).full_name,
    maskedEmail,
    childId: (childProfile as any).id,
  };
}

// ─────────────────────────────────────────────────────────────
// PARENT: VERIFY OTP AND COMPLETE CHILD LINK
// ─────────────────────────────────────────────────────────────
export async function verifyChildLinkOtp(
  prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const otp = (formData.get("otp") as string)?.trim();
  const childId = (formData.get("child_id") as string)?.trim();

  if (!otp || !childId) {
    return { error: "OTP and child ID are required.", success: false };
  }

  // Demo mode
  if (!isRealSupabase) {
    if (otp === "123456") return { error: null, success: true };
    return { error: "Invalid OTP. In demo mode, use 123456.", success: false };
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in.", success: false };

  // Validate OTP code against deterministic time-windowed OTP
  const isValid = await verifyLinkOtp(user.id, childId, otp);
  if (!isValid) {
    return { error: "Incorrect or expired verification code. Please check with your child and try again.", success: false };
  }

  const dbClient = await getEffectiveDbClient();

  // 1. Try Security Definer RPC first (bypasses RLS safely)
  try {
    const { data: rpcData, error: rpcErr } = await (dbClient as any).rpc("confirm_parent_child_link", {
      target_child_id: childId,
    });
    if (!rpcErr && rpcData?.success) {
      return { error: null, success: true };
    }
  } catch {
    // RPC not created yet, fall through to direct tables
  }

  // 2. Try updating existing link to verified: true
  try {
    const { data: updateData } = await (dbClient as any)
      .from("parent_child_links")
      .update({ verified: true })
      .eq("parent_id", user.id)
      .eq("child_id", childId)
      .select();

    if (updateData && updateData.length > 0) {
      return { error: null, success: true };
    }
  } catch {
    // fallback to insert
  }

  // 3. Try inserting
  const { error: insertErr } = await (dbClient as any)
    .from("parent_child_links")
    .insert({
      parent_id: user.id,
      child_id: childId,
      verified: true,
    });

  if (!insertErr) {
    return { error: null, success: true };
  }

  // 4. Fallback upsert
  const { error: upsertErr } = await (dbClient as any)
    .from("parent_child_links")
    .upsert({
      parent_id: user.id,
      child_id: childId,
      verified: true,
    }, { onConflict: "parent_id,child_id" });

  if (upsertErr) {
    return {
      error: "Failed to confirm link. Please run the SQL migration in Supabase SQL editor to enable update permissions.",
      success: false,
    };
  }

  return { error: null, success: true };
}

// ─────────────────────────────────────────────────────────────
// PARENT: CHECK IF CHILD APPROVED LINK ASYNCHRONOUSLY
// ─────────────────────────────────────────────────────────────
export async function checkChildLinkStatus(childId: string): Promise<{ linked: boolean }> {
  if (!isRealSupabase) return { linked: false };

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { linked: false };

    const dbClient = await getEffectiveDbClient();
    const { data } = await (dbClient as any)
      .from("parent_child_links")
      .select("verified")
      .eq("parent_id", user.id)
      .eq("child_id", childId)
      .maybeSingle();

    if (data && data.verified === true) {
      return { linked: true };
    }
    return { linked: false };
  } catch {
    return { linked: false };
  }
}

// ─────────────────────────────────────────────────────────────
// PARENT: CREATE CHILD ACCOUNT (no email needed)
// ─────────────────────────────────────────────────────────────
export async function createChildAccount(
  prevState: { error: string | null; success: boolean; childId?: string },
  formData: FormData
): Promise<{ error: string | null; success: boolean; childId?: string }> {
  const childName = (formData.get("child_name") as string)?.trim();
  const childGrade = (formData.get("child_grade") as string)?.trim() || "";

  if (!childName) return { error: "Child name is required.", success: false };

  // Demo mode — simulate success
  if (!isRealSupabase) {
    const demoId = `SIKSA-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    return { error: null, success: true, childId: demoId };
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to create a child account.", success: false };

  const dbClient = await getEffectiveDbClient();

  // Generate a unique SIKSA ID
  const suffix = Date.now().toString(36).toUpperCase().slice(-6);
  const siksaId = `SIKSA-${suffix}`;

  const { data: childProfile, error: profileErr } = await (dbClient as any)
    .from("profiles")
    .insert({
      full_name: childName,
      role: "student",
      siksa_id: siksaId,
      grade_level: childGrade,
      email: null,
      is_profile_complete: false,
      parent_id: user.id,
    })
    .select("id, siksa_id")
    .single();

  if (profileErr || !childProfile) {
    console.error("createChildAccount error:", profileErr);
    return { 
      error: "Failed to create child account. " + (profileErr?.message || "Please try again."), 
      success: false 
    };
  }

  const { error: linkErr } = await (dbClient as any).from("parent_child_links").upsert({
    parent_id: user.id,
    child_id: (childProfile as any).id,
    verified: true,
  }, { onConflict: "parent_id,child_id" });

  if (linkErr) {
    console.error("Error linking newly created child:", linkErr);
  }

  return { error: null, success: true, childId: (childProfile as any).siksa_id };
}

// ─────────────────────────────────────────────────────────────
// STUDENT: GET PENDING PARENT LINK REQUESTS
// ─────────────────────────────────────────────────────────────
export async function getStudentPendingParentLinks() {
  if (!isRealSupabase) return [];

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const dbClient = await getEffectiveDbClient();
    
    // Query standard columns only to avoid any schema mismatch
    const { data, error } = await (dbClient as any)
      .from("parent_child_links")
      .select("id, parent_id, child_id, verified, created_at")
      .eq("child_id", user.id)
      .eq("verified", false);

    if (error) {
      console.warn("Error fetching pending parent links:", error);
      return [];
    }

    if (!data || data.length === 0) return [];

    const requestsWithOtp = await Promise.all(
      data.map(async (item: any) => {
        let parentName = "Parent / Guardian";
        let parentSiksaId = "";
        let parentEmail = "";

        try {
          const { data: parentProf } = await (dbClient as any)
            .from("profiles")
            .select("id, full_name, siksa_id, email")
            .eq("id", item.parent_id)
            .maybeSingle();

          if (parentProf) {
            parentName = parentProf.full_name || parentName;
            parentSiksaId = parentProf.siksa_id || "";
            parentEmail = parentProf.email || "";
          }
        } catch {
          // ignore lookup error
        }

        const code = await generateLinkOtp(item.parent_id, user.id);
        return {
          id: item.id,
          parentId: item.parent_id,
          parentName,
          parentSiksaId,
          parentEmail,
          otpCode: code,
          createdAt: item.created_at,
        };
      })
    );

    return requestsWithOtp;
  } catch (err) {
    console.warn("Could not fetch student pending parent links:", err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// STUDENT: APPROVE PARENT LINK
// ─────────────────────────────────────────────────────────────
export async function approveParentLink(linkId: string): Promise<{ success: boolean; error: string | null }> {
  if (!isRealSupabase) return { success: true, error: null };

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const dbClient = await getEffectiveDbClient();
    
    // Find parent ID for this link
    const { data: linkRow } = await (dbClient as any)
      .from("parent_child_links")
      .select("parent_id")
      .eq("id", linkId)
      .maybeSingle();

    if (linkRow?.parent_id) {
      // 1. Try Security Definer RPC first
      try {
        const { data: rpcData, error: rpcErr } = await (dbClient as any).rpc("student_approve_parent_link", {
          target_parent_id: linkRow.parent_id,
        });
        if (!rpcErr && rpcData?.success) return { success: true, error: null };
      } catch {
        // Fall through to table update
      }
    }

    // 2. Try update by ID with .select() to verify rows modified
    try {
      const { data: updateData, error: updateErr } = await (dbClient as any)
        .from("parent_child_links")
        .update({ verified: true })
        .eq("id", linkId)
        .eq("child_id", user.id)
        .select();

      if (updateData && updateData.length > 0) return { success: true, error: null };
      if (updateErr) return { success: false, error: updateErr.message };
    } catch {
      // fallback
    }

    // 3. Try update by child_id
    try {
      const { data: updateByChildData, error: updateByChildErr } = await (dbClient as any)
        .from("parent_child_links")
        .update({ verified: true })
        .eq("child_id", user.id)
        .select();

      if (updateByChildData && updateByChildData.length > 0) return { success: true, error: null };
      if (updateByChildErr) return { success: false, error: updateByChildErr.message };
    } catch {
      // fallback
    }

    return { 
      success: false, 
      error: "Database update policy required. Please run the SQL migration in Supabase SQL editor." 
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to approve link" };
  }
}

// ─────────────────────────────────────────────────────────────
// STUDENT: REJECT PARENT LINK
// ─────────────────────────────────────────────────────────────
export async function rejectParentLink(linkId: string): Promise<{ success: boolean; error: string | null }> {
  if (!isRealSupabase) return { success: true, error: null };

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const dbClient = await getEffectiveDbClient();
    const { error } = await (dbClient as any)
      .from("parent_child_links")
      .delete()
      .eq("id", linkId)
      .eq("child_id", user.id);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to reject link" };
  }
}
