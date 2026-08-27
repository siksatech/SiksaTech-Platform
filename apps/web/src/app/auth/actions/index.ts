"use server";

/**
 * Auth Server Actions for siksatech.in
 *
 * Handlers for login, register, logout, OTP authentication, and password reset.
 */

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@siksatech/auth";
import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────
// RESOLVE ID TO EMAIL
// ─────────────────────────────────────────────────────────────
export async function resolveIdToEmail(idOrEmail: string): Promise<string | null> {
  // If it's already an email, just return it
  if (idOrEmail.includes("@")) {
    return idOrEmail;
  }

  // Use service role key to bypass RLS if necessary to find the email
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceKey) {
    console.error("Missing Supabase env vars for admin client");
    return null;
  }

  const adminClient = createClient(supabaseUrl, serviceKey);
  const { data, error } = await adminClient
    .from("profiles")
    .select("email")
    .eq("siksa_id", idOrEmail.trim())
    .single();

  if (error || !data) {
    return null;
  }

  return data.email;
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
      data: {
        full_name: fullName,
        role: role,
      },
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

  if (!email) {
    return { error: "Please enter your email address.", success: false };
  }

  const supabase = await createSupabaseServerClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://siksatech.in";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?redirect=/auth/reset-password`,
  });

  if (error) {
    return { error: error.message, success: false };
  }

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

  if (!password || !confirmPassword) {
    return { error: "Both password fields are required.", success: false };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters.", success: false };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match.", success: false };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message, success: false };
  }

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
// PARENT: LINK CHILD BY ID OR EMAIL
// ─────────────────────────────────────────────────────────────
export async function linkChildByIdOrEmail(
  prevState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  const idOrEmail = (formData.get("id_or_email") as string)?.trim();

  if (!idOrEmail) {
    return { error: "Please enter a SiksaTech ID or email address.", success: false };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return { error: "Server configuration error. Please contact support.", success: false };
  }

  const adminClient = createClient(supabaseUrl, serviceKey);

  // Resolve the child profile
  const isEmail = idOrEmail.includes("@");
  const { data: childProfile, error: lookupErr } = await adminClient
    .from("profiles")
    .select("id, full_name, role")
    .eq(isEmail ? "email" : "siksa_id", idOrEmail)
    .maybeSingle();

  if (lookupErr || !childProfile) {
    return { error: "No student found with that ID or email. Please check and try again.", success: false };
  }

  if (childProfile.role !== "student") {
    return { error: "This account is not a student account.", success: false };
  }

  // Get current parent
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to link a child.", success: false };
  }

  // Check if already linked
  const { data: existing } = await adminClient
    .from("parent_child_links")
    .select("id")
    .eq("parent_id", user.id)
    .eq("child_id", childProfile.id)
    .maybeSingle();

  if (existing) {
    return { error: "This student is already linked to your account.", success: false };
  }

  const { error: insertErr } = await adminClient
    .from("parent_child_links")
    .insert({
      parent_id: user.id,
      child_id: childProfile.id,
      status: "pending",
    });

  if (insertErr) {
    return { error: "Failed to link child. Please try again.", success: false };
  }

  return { error: null, success: true };
}

// ─────────────────────────────────────────────────────────────
// PARENT: CREATE CHILD ACCOUNT
// ─────────────────────────────────────────────────────────────
export async function createChildAccount(
  prevState: { error: string | null; success: boolean; childId?: string },
  formData: FormData
): Promise<{ error: string | null; success: boolean; childId?: string }> {
  const childName = (formData.get("child_name") as string)?.trim();
  const childGrade = (formData.get("child_grade") as string)?.trim() || "";

  if (!childName) {
    return { error: "Child name is required.", success: false };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return { error: "Server configuration error. Please contact support.", success: false };
  }

  const adminClient = createClient(supabaseUrl, serviceKey);
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a child account.", success: false };
  }

  // Generate a unique SIKSA ID
  const suffix = Date.now().toString(36).toUpperCase().slice(-6);
  const saksaId = `SIKSA-${suffix}`;

  // Create the child profile directly (no separate auth account needed initially)
  const { data: childProfile, error: profileErr } = await adminClient
    .from("profiles")
    .insert({
      full_name: childName,
      role: "student",
      siksa_id: saksaId,
      grade_level: childGrade,
      email: null,           // Child can set email later
      is_profile_complete: false,
      parent_id: user.id,
    })
    .select("id, siksa_id")
    .single();

  if (profileErr || !childProfile) {
    console.error("createChildAccount error:", profileErr);
    return { error: "Failed to create child account. Please try again.", success: false };
  }

  // Create the link immediately as active (parent created the account)
  const { error: linkErr } = await adminClient
    .from("parent_child_links")
    .insert({
      parent_id: user.id,
      child_id: childProfile.id,
      status: "active",
    });

  if (linkErr) {
    console.error("parent_child_links insert error:", linkErr);
    // Don't fail — child account created, link can be repaired
  }

  return { error: null, success: true, childId: childProfile.siksa_id };
}
