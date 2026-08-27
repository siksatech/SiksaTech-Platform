"use server";

/**
 * Auth Server Actions for siksatech.in
 *
 * Handlers for login, register, logout, OTP authentication, password reset,
 * and parent-child linking (with OTP verification for existing accounts).
 */

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@siksatech/auth";
import { createAdminClient, isRealSupabase } from "@siksatech/database";

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
// PARENT: INITIATE CHILD LINK (sends OTP to student's email)
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

  // Check if already linked
  const { data: existing } = await (dbClient as any)
    .from("parent_child_links")
    .select("id")
    .eq("parent_id", user.id)
    .eq("child_id", (childProfile as any).id)
    .maybeSingle();

  if (existing) {
    return { error: "This student is already linked to your account.", success: false };
  }

  const childEmail = (childProfile as any).email;

  // If no email (parent-created account) — link immediately, no OTP needed
  if (!childEmail) {
    const { error: insertErr } = await (dbClient as any).from("parent_child_links").insert({
      parent_id: user.id,
      child_id: (childProfile as any).id,
      status: "active",
    });
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

  // Generate a 6-digit OTP and store its hash
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = Buffer.from(`${otp}:${(childProfile as any).id}:${user.id}`).toString("base64");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

  // Store OTP request
  try {
    await (dbClient as any).from("parent_link_requests").upsert({
      parent_id: user.id,
      child_id: (childProfile as any).id,
      otp_hash: otpHash,
      expires_at: expiresAt,
      used: false,
    }, { onConflict: "parent_id,child_id" });
  } catch (err) {
    console.warn("Could not upsert into parent_link_requests:", err);
  }

  // Send OTP via Supabase auth email if admin auth available
  try {
    if ((dbClient as any).auth?.admin?.generateLink) {
      await (dbClient.auth as any).admin.generateLink({
        type: "magiclink",
        email: childEmail,
        options: {
          data: {
            subject: "SiksaTech Parent Linking OTP",
            message: `Your parent has requested to link your SiksaTech account. Your OTP is: ${otp}\n\nThis code expires in 10 minutes. If you did not expect this, ignore this message.`,
          },
        },
      });
    }
  } catch (mailErr) {
    console.warn("Could not send email via admin auth API:", mailErr);
  }

  console.info(`[SiksaTech] Parent Link OTP generated for ${childEmail}: ${otp}`);

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

  const dbClient = await getEffectiveDbClient();

  // Look up the pending request
  const { data: request, error: reqErr } = await (dbClient as any)
    .from("parent_link_requests")
    .select("otp_hash, expires_at, used")
    .eq("parent_id", user.id)
    .eq("child_id", childId)
    .maybeSingle();

  if (reqErr || !request || (request as any).used) {
    return { error: "No pending link request found or OTP already used.", success: false };
  }

  if (new Date((request as any).expires_at) < new Date()) {
    return { error: "OTP has expired. Please start the linking process again.", success: false };
  }

  // Verify OTP hash
  const expectedHash = Buffer.from(`${otp}:${childId}:${user.id}`).toString("base64");
  if ((request as any).otp_hash !== expectedHash) {
    return { error: "Incorrect OTP. Please check the code and try again.", success: false };
  }

  // Mark request as used and create the active link
  await (dbClient as any)
    .from("parent_link_requests")
    .update({ used: true })
    .eq("parent_id", user.id)
    .eq("child_id", childId);

  const { error: linkErr } = await (dbClient as any).from("parent_child_links").insert({
    parent_id: user.id,
    child_id: childId,
    status: "active",
  });

  if (linkErr) {
    console.error("Link creation error:", linkErr);
    return { error: "Failed to create link: " + (linkErr.message || "Database error"), success: false };
  }

  return { error: null, success: true };
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

  const { error: linkErr } = await (dbClient as any).from("parent_child_links").insert({
    parent_id: user.id,
    child_id: (childProfile as any).id,
    status: "active",
  });

  if (linkErr) {
    console.error("Error linking newly created child:", linkErr);
  }

  return { error: null, success: true, childId: (childProfile as any).siksa_id };
}
