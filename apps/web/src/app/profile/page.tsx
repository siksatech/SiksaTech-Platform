"use client";

import { useState, useEffect, Suspense } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import { createBrowserClient, isRealSupabase } from "@siksatech/database";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logout } from "../auth/actions";
import {
  User,
  Mail,
  BadgeCheck,
  Shield,
  Settings,
  LogOut,
  Copy,
  Check,
  Users,
  ChevronRight,
  Loader2,
  Lock,
  AlertTriangle,
  Edit3,
  Save,
} from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  siksa_id: string;
  role: string;
  grade_level?: string;
  school_college_name?: string;
  phone?: string;
  is_profile_complete: boolean;
}

function ProfileContent() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editGrade, setEditGrade] = useState("");
  const [editSchool, setEditSchool] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!isRealSupabase) {
        setLoading(false);
        return;
      }
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      const { data: prof } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      const p: UserProfile = {
        id: user.id,
        full_name: prof?.full_name || user.user_metadata?.full_name || "",
        email: prof?.email || user.email || "",
        siksa_id: prof?.siksa_id || "—",
        role: prof?.role || user.user_metadata?.role || "student",
        grade_level: prof?.grade_level || "",
        school_college_name: prof?.school_college_name || "",
        phone: prof?.phone || "",
        is_profile_complete: prof?.is_profile_complete ?? false,
      };
      setProfile(p);
      setEditName(p.full_name);
      setEditGrade(p.grade_level || "");
      setEditSchool(p.school_college_name || "");
      setLoading(false);
    }
    load();
  }, [router]);

  function copyId() {
    if (profile?.siksa_id && profile.siksa_id !== "—") {
      navigator.clipboard.writeText(profile.siksa_id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !isRealSupabase) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const supabase = createBrowserClient() as any;
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editName,
          grade_level: editGrade,
          school_college_name: editSchool,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;
      setProfile((prev) => prev ? { ...prev, full_name: editName, grade_level: editGrade, school_college_name: editSchool } : prev);
      setEditing(false);
      setSaveMsg("Profile updated successfully.");
    } catch {
      setSaveMsg("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const roleLabels: Record<string, { label: string; color: string }> = {
    student: { label: "Student", color: "text-blue-400 bg-blue-950 border-blue-800/50" },
    parent: { label: "Parent", color: "text-emerald-400 bg-emerald-950 border-emerald-800/50" },
    school: { label: "School Admin", color: "text-amber-400 bg-amber-950 border-amber-800/50" },
    college: { label: "College Admin", color: "text-purple-400 bg-purple-950 border-purple-800/50" },
  };

  const roleMeta = profile ? (roleLabels[profile.role] || roleLabels.student) : roleLabels.student;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Demo / not configured state
  if (!isRealSupabase) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
          <h1 className="text-2xl font-bold text-white">Profile unavailable in demo mode</h1>
          <p className="text-slate-400 text-sm">Connect your Supabase credentials to enable full profile management.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 space-y-6">

        {/* Page header */}
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-slate-400" />
          <h1 className="text-xl font-bold text-white">Profile &amp; Settings</h1>
        </div>

        {saveMsg && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${saveMsg.includes("success") ? "bg-emerald-950/40 border-emerald-700/40 text-emerald-300" : "bg-red-950/40 border-red-700/40 text-red-300"}`}>
            {saveMsg.includes("success") ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {saveMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Identity card */}
          <div className="space-y-4">

            {/* SiksaTech ID Card */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-2xl font-bold">
                  {profile?.full_name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-bold text-white text-lg leading-tight">{profile?.full_name || "—"}</p>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border mt-1 inline-block ${roleMeta.color}`}>
                    {roleMeta.label}
                  </span>
                </div>
              </div>

              {/* SiksaTech ID prominently displayed */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-700 space-y-1">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">SiksaTech ID</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono font-bold text-xl text-white tracking-widest">
                    {profile?.siksa_id || "—"}
                  </p>
                  {profile?.siksa_id && profile.siksa_id !== "—" && (
                    <button
                      onClick={copyId}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                      title="Copy ID"
                    >
                      {copiedId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-500">
                  Share this ID with your institution or link to family accounts.
                </p>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{profile?.email || "No email linked"}</span>
              </div>

              {/* Completion badge */}
              <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${
                profile?.is_profile_complete
                  ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-400"
                  : "bg-amber-950/40 border-amber-800/40 text-amber-400"
              }`}>
                {profile?.is_profile_complete ? (
                  <><BadgeCheck className="w-3.5 h-3.5" /> Profile complete</>
                ) : (
                  <><AlertTriangle className="w-3.5 h-3.5" /> Profile incomplete</>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Go to</h3>
              {[
                { label: "My Dashboard", href: "/dashboard" },
                { label: "My Courses", href: "/learn" },
                ...(profile?.role === "parent" ? [{ label: "Manage Children", href: "/dashboard/parent" }] : []),
                { label: "Store", href: "/store" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between text-xs text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-all"
                >
                  {link.label}
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                </Link>
              ))}
            </div>

          </div>

          {/* RIGHT: Edit form + security */}
          <div className="lg:col-span-2 space-y-6">

            {/* Edit Profile */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  Personal Information
                </h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={saveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {(profile?.role === "student") && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Grade / Class</label>
                        <select
                          value={editGrade}
                          onChange={(e) => setEditGrade(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select grade</option>
                          {["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "College"].map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">School / College</label>
                        <input
                          type="text"
                          value={editSchool}
                          onChange={(e) => setEditSchool(e.target.value)}
                          placeholder="Your school or college name"
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}
                  <div className="flex gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  {[
                    { label: "Full Name", value: profile?.full_name },
                    { label: "Email", value: profile?.email },
                    { label: "Role", value: roleMeta.label },
                    ...(profile?.role === "student" ? [
                      { label: "Grade", value: profile?.grade_level || "Not set" },
                      { label: "Institution", value: profile?.school_college_name || "Not set" },
                    ] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0">
                      <span className="text-xs text-slate-400 font-medium">{label}</span>
                      <span className="text-sm text-slate-200 font-medium">{value || "—"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Security */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Security
              </h2>
              <div className="space-y-2">
                <Link
                  href="/auth/forgot-password"
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    <div>
                      <p className="text-sm font-semibold text-slate-200">Change Password</p>
                      <p className="text-xs text-slate-500">Update your account password</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </Link>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-6 rounded-2xl border border-red-900/30 bg-red-950/10 space-y-4">
              <h2 className="font-bold text-red-400 flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4" />
                Account Actions
              </h2>
              <form action={logout}>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
