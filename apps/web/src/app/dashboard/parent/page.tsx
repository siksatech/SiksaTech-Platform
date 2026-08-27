"use client";

import { useState, useEffect, useActionState, useCallback, Suspense } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import { createBrowserClient, isRealSupabase } from "@siksatech/database";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users, Package, UserPlus, Search, BookOpen, ChevronRight,
  CheckCircle2, Clock, AlertCircle, Loader2, BadgeCheck,
  Plus, ArrowRight, ShoppingBag, User, KeyRound, RefreshCw,
} from "lucide-react";
import {
  initiateChildLink,
  verifyChildLinkOtp,
  createChildAccount,
  checkChildLinkStatus,
} from "../../auth/actions";

// ─── Types ─────────────────────────────────────────────────────
interface ChildProfile {
  id: string;
  name: string;
  siksa_id: string;
  grade: string;
  link_status: "active" | "pending";
  enrollments_count: number;
}

// ─── 3-Step Link Child Form ─────────────────────────────────────
function LinkChildForm({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<"link" | "create">("link");

  // Step 1 — search
  const [step, setStep] = useState<"search" | "otp" | "done">("search");
  const [otpChildId, setOtpChildId] = useState("");
  const [otpChildName, setOtpChildName] = useState("");
  const [otpMaskedEmail, setOtpMaskedEmail] = useState("");

  const [initiateState, initiateAction, initiatePending] = useActionState(initiateChildLink, {
    error: null, success: false,
  });

  const [verifyState, verifyAction, verifyPending] = useActionState(verifyChildLinkOtp, {
    error: null, success: false,
  });

  const [createState, createAction, createPending] = useActionState(createChildAccount, {
    error: null, success: false, childId: undefined,
  });

  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // After step-1 succeeds move to step-2 or immediate success
  useEffect(() => {
    if (initiateState.success && initiateState.childId) {
      if (initiateState.noEmailRequired) {
        setStep("done");
        onSuccess();
      } else {
        setOtpChildId(initiateState.childId);
        setOtpChildName(initiateState.childName || "");
        setOtpMaskedEmail(initiateState.maskedEmail || "");
        setStep("otp");
      }
    }
  }, [initiateState, onSuccess]);

  // Auto-poll approval status every 3.5 seconds while waiting for OTP
  useEffect(() => {
    if (step !== "otp" || !otpChildId) return;
    const timer = setInterval(async () => {
      try {
        const res = await checkChildLinkStatus(otpChildId);
        if (res.linked) {
          setStep("done");
          onSuccess();
        }
      } catch {
        // ignore poll errors
      }
    }, 3500);

    return () => clearInterval(timer);
  }, [step, otpChildId, onSuccess]);

  const handleManualCheck = async () => {
    if (!otpChildId) return;
    setIsCheckingStatus(true);
    try {
      const res = await checkChildLinkStatus(otpChildId);
      if (res.linked) {
        setStep("done");
        onSuccess();
      }
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // After OTP verify succeeds
  useEffect(() => {
    if (verifyState.success) {
      setStep("done");
      onSuccess();
    }
  }, [verifyState.success, onSuccess]);

  // After create succeeds
  useEffect(() => {
    if (createState.success) onSuccess();
  }, [createState.success, onSuccess]);

  const inputClass = "w-full px-4 py-3 bg-input-bg border border-app-border rounded-xl text-sm text-foreground placeholder-muted-text focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all";
  const btnPrimary = "w-full flex items-center justify-center gap-2 px-4 py-3 bg-electric-blue hover:bg-electric-blue-hover disabled:opacity-60 text-white rounded-xl text-sm font-bold transition-all";

  return (
    <div className="p-6 rounded-2xl border border-app-border bg-card shadow-sm space-y-5">
      {/* Mode Tabs */}
      <div className="flex gap-2 p-1 bg-elevated rounded-xl w-fit">
        {[
          { id: "link", label: "Find Existing Student", icon: Search },
          { id: "create", label: "Create New Account", icon: Plus },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => { setMode(id as any); setStep("search"); }}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === id ? "bg-electric-blue text-white shadow-sm" : "text-muted-text hover:text-foreground"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Link Mode: Step 1 — Search ── */}
      {mode === "link" && step === "search" && (
        <form action={initiateAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-secondary mb-1.5">
              Student&apos;s SiksaTech ID or Email
            </label>
            <input name="id_or_email" type="text" placeholder="e.g. SIKSA-AB1234 or student@email.com" required className={inputClass} />
            <p className="text-[11px] text-muted-text mt-1.5">
              An OTP will be sent to the student&apos;s registered email for verification.
            </p>
          </div>
          {initiateState.error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {initiateState.error}
            </div>
          )}
          <button type="submit" disabled={initiatePending} className={btnPrimary}>
            {initiatePending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {initiatePending ? "Searching..." : "Find Student & Send OTP"}
          </button>
        </form>
      )}

      {/* ── Link Mode: Step 2 — Enter OTP ── */}
      {mode === "link" && step === "otp" && (
        <form action={verifyAction} className="space-y-4">
          <input type="hidden" name="child_id" value={otpChildId} />
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300">
              <Users className="w-4 h-4" />
              <span>Link Request Created for {otpChildName}!</span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
              An authorization request was sent to <span className="font-mono font-bold">{otpMaskedEmail}</span>.
            </p>
            <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-blue-200 dark:border-blue-800/50 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
              <p className="font-semibold text-blue-800 dark:text-blue-200">How to authorize:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Your child can open their <strong>Student Dashboard</strong> and click <strong>&quot;Approve &amp; Link Parent&quot;</strong>.</li>
                <li>Or ask your child for the <strong>6-digit code</strong> shown on their screen and enter it below:</li>
              </ul>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-secondary mb-1.5">Enter 6-Digit Code from Student</label>
            <input
              name="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="e.g. 482913"
              required
              className={inputClass + " tracking-[0.4em] text-center text-lg font-bold"}
            />
            {isRealSupabase ? null : (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Demo mode: use <span className="font-mono font-bold">123456</span></p>
            )}
          </div>
          {verifyState.error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {verifyState.error}
            </div>
          )}
          <button type="submit" disabled={verifyPending} className={btnPrimary}>
            {verifyPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            {verifyPending ? "Verifying..." : "Verify & Link Account"}
          </button>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualCheck}
              disabled={isCheckingStatus}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-elevated hover:bg-card border border-app-border text-xs font-semibold text-secondary hover:text-foreground transition-all cursor-pointer"
            >
              {isCheckingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin text-electric-blue" /> : <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />}
              <span>{isCheckingStatus ? "Checking..." : "Check If Approved by Student"}</span>
            </button>
            <button
              type="button"
              onClick={() => setStep("search")}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-elevated hover:bg-card border border-app-border text-xs font-semibold text-muted-text hover:text-foreground transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Create Mode ── */}
      {mode === "create" && !createState.success && (
        <form action={createAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-secondary mb-1.5">
              Child&apos;s Full Name <span className="text-red-500">*</span>
            </label>
            <input name="child_name" type="text" placeholder="e.g. Aryan Sharma" required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-secondary mb-1.5">
              Grade / Class <span className="text-muted-text">(optional)</span>
            </label>
            <select name="child_grade" className={inputClass}>
              <option value="">Select grade</option>
              {["Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","College"].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="p-3 rounded-lg bg-elevated border border-app-border text-xs text-secondary leading-relaxed">
            💡 A unique <span className="font-mono text-electric-blue">SIKSA-ID</span> will be generated. No separate email required — your child can add their email later.
          </div>
          {createState.error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {createState.error}
            </div>
          )}
          <button type="submit" disabled={createPending} className={btnPrimary}>
            {createPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            {createPending ? "Creating..." : "Create Child Account"}
          </button>
        </form>
      )}

      {/* Create success */}
      {mode === "create" && createState.success && createState.childId && (
        <div className="p-5 rounded-xl bg-green-50 dark:bg-emerald-950/40 border border-green-200 dark:border-emerald-700/40 space-y-3 text-center">
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-emerald-400 mx-auto" />
          <p className="text-sm font-bold text-green-700 dark:text-emerald-300">Child account created!</p>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-green-200 dark:border-emerald-800/40">
            <p className="text-xs text-muted-text mb-1">SiksaTech ID</p>
            <p className="font-mono text-xl font-bold text-foreground tracking-widest">{createState.childId}</p>
          </div>
          <p className="text-xs text-secondary">Save this ID. Your child will use it to log in and can set a password and email later.</p>
        </div>
      )}
    </div>
  );
}

// ─── Child Card ─────────────────────────────────────────────────
function ChildCard({ child }: { child: ChildProfile }) {
  return (
    <div className="p-5 rounded-2xl border border-app-border bg-card shadow-sm space-y-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">{child.name}</h3>
            <p className="font-mono text-xs text-muted-text">{child.siksa_id}</p>
          </div>
        </div>
        <span className={`text-[10px] font-mono px-2 py-1 rounded-full border ${
          child.link_status === "active"
            ? "bg-green-50 dark:bg-emerald-950 text-green-700 dark:text-emerald-400 border-green-200 dark:border-emerald-800/50"
            : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50"
        }`}>
          {child.link_status === "active" ? "✓ Linked" : "⏳ Pending"}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-text">
        <span>{child.grade || "Grade not set"}</span>
        <span className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          {child.enrollments_count} course{child.enrollments_count !== 1 ? "s" : ""}
        </span>
      </div>
      {child.enrollments_count === 0 ? (
        <Link href="/learn" className="block text-center text-xs font-semibold text-electric-blue hover:underline">
          Browse courses for {child.name.split(" ")[0]} <ArrowRight className="inline w-3.5 h-3.5" />
        </Link>
      ) : (
        <Link href={`/dashboard/parent/child/${child.id}`} className="flex items-center justify-between text-xs font-semibold text-secondary hover:text-foreground transition-colors">
          <span>View progress</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────
function ParentDashboardContent() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLinkForm, setShowLinkForm] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    if (isRealSupabase) {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const { data: prof } = await (supabase as any)
        .from("profiles").select("id, full_name, email, siksa_id, role").eq("id", user.id).maybeSingle();
      if (prof) setProfile(prof);

      const { data: links } = await (supabase as any)
        .from("parent_child_links")
        .select(`id, verified, status, child:profiles!parent_child_links_child_id_fkey(id, full_name, siksa_id, grade_level)`)
        .eq("parent_id", user.id);

      if (links?.length > 0) {
        const childProfiles: ChildProfile[] = await Promise.all(
          links.map(async (link: any) => {
            const child = link.child;
            const isLinked = link.verified === true || link.status === "active";
            const { count } = await (supabase as any).from("enrollments")
              .select("id", { count: "exact", head: true }).eq("student_id", child.id);
            return {
              id: child.id,
              name: child.full_name,
              siksa_id: child.siksa_id || "—",
              grade: child.grade_level || "",
              link_status: isLinked ? "active" : "pending",
              enrollments_count: count ?? 0,
            };
          })
        );
        setChildren(childProfiles);
      }

      const { data: ords } = await (supabase as any)
        .from("orders").select("id, order_number, status, total_amount_inr, created_at")
        .eq("user_id", user.id).order("created_at", { ascending: false }).limit(5);
      if (ords) setOrders(ords);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) {
    return <div className="min-h-screen bg-surface flex items-center justify-center"><Loader2 className="w-8 h-8 text-electric-blue animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-surface text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-card border border-app-border shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-700/40 text-blue-700 dark:text-blue-400 text-xs font-mono">
              <Users className="w-3.5 h-3.5" />
              <span>Parent Portal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
              Welcome, {profile?.full_name || "Parent"}
            </h1>
            {profile?.siksa_id && (
              <p className="text-xs font-mono text-muted-text">Your ID: <span className="text-electric-blue font-bold">{profile.siksa_id}</span></p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/store" className="px-4 py-2.5 bg-electric-blue hover:bg-electric-blue-hover text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2">
              <Package className="w-4 h-4" /> Order STEM Kit
            </Link>
            <Link href="/profile" className="px-4 py-2.5 bg-elevated hover:bg-card text-secondary rounded-xl text-xs font-bold border border-app-border transition-all">
              Profile &amp; Settings
            </Link>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Children management */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-electric-blue" /> My Children
                </h2>
                <p className="text-xs text-muted-text mt-0.5">Monitor your child&apos;s learning progress</p>
              </div>
              <button
                onClick={() => setShowLinkForm((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 bg-electric-blue hover:bg-electric-blue-hover text-white rounded-xl text-xs font-bold transition-all"
              >
                <UserPlus className="w-4 h-4" /> Add Child
              </button>
            </div>

            {showLinkForm && (
              <LinkChildForm onSuccess={() => { setShowLinkForm(false); loadData(); }} />
            )}

            {children.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {children.map((child) => <ChildCard key={child.id} child={child} />)}
              </div>
            ) : !showLinkForm ? (
              <div className="p-10 rounded-2xl border border-dashed border-app-border bg-card text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-elevated flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-muted-text" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">No children linked yet</h3>
                  <p className="text-xs text-muted-text mt-1 max-w-xs mx-auto">
                    Link your child&apos;s existing SiksaTech account (with OTP verification), or create a new one.
                  </p>
                </div>
                <button
                  onClick={() => setShowLinkForm(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-electric-blue hover:bg-electric-blue-hover text-white rounded-xl text-sm font-bold transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Your First Child
                </button>
              </div>
            ) : null}

            {children.length > 0 && (
              <div className="p-4 rounded-xl bg-elevated border border-app-border text-xs text-secondary flex items-start gap-3">
                <BadgeCheck className="w-4 h-4 text-electric-blue flex-shrink-0 mt-0.5" />
                <p>For linked children, view enrolled courses, completed lessons, and certificates from their individual progress pages.</p>
              </div>
            )}
          </div>

          {/* RIGHT: Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="p-5 rounded-2xl border border-app-border bg-card shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-foreground">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: "Browse STEM Courses", href: "/learn", icon: BookOpen },
                  { label: "Shop Hardware Kits", href: "/store", icon: Package },
                  { label: "Profile & Settings", href: "/profile", icon: User },
                ].map((link) => (
                  <Link key={link.href} href={link.href}
                    className="flex items-center gap-3 p-3 rounded-xl bg-elevated hover:bg-card border border-app-border text-xs font-semibold text-secondary hover:text-foreground transition-all group">
                    <link.icon className="w-4 h-4 text-muted-text group-hover:text-electric-blue transition-colors" />
                    {link.label}
                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Orders */}
            <div className="p-5 rounded-2xl border border-app-border bg-card shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-electric-blue" /> Recent Orders
              </h3>
              {orders.length > 0 ? (
                <div className="space-y-2">
                  {orders.map((ord: any) => (
                    <div key={ord.id} className="p-3 rounded-lg bg-elevated border border-app-border space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-electric-blue font-bold">{ord.order_number}</span>
                        <span className={`capitalize ${ord.status === "delivered" ? "text-green-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>{ord.status}</span>
                      </div>
                      {ord.total_amount_inr && <p className="text-xs text-muted-text">₹{ord.total_amount_inr}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 space-y-2">
                  <Package className="w-8 h-8 text-muted-text mx-auto" />
                  <p className="text-xs text-muted-text">No orders yet</p>
                  <Link href="/store" className="text-xs text-electric-blue hover:underline font-semibold">Browse Store →</Link>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="p-5 rounded-2xl border border-app-border bg-card shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-foreground">Summary</h3>
              <div className="space-y-2.5 text-xs">
                {[
                  { label: "Children linked", icon: Users, value: children.length, color: "text-foreground" },
                  { label: "Active links", icon: CheckCircle2, value: children.filter(c => c.link_status === "active").length, color: "text-green-600 dark:text-emerald-400" },
                  { label: "Pending approval", icon: Clock, value: children.filter(c => c.link_status === "pending").length, color: "text-amber-600 dark:text-amber-400" },
                  { label: "Kit orders", icon: ShoppingBag, value: orders.length, color: "text-foreground" },
                ].map(({ label, icon: Icon, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-text"><Icon className="w-3.5 h-3.5" /> {label}</span>
                    <span className={`font-mono font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ParentDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><Loader2 className="w-8 h-8 text-electric-blue animate-spin" /></div>}>
      <ParentDashboardContent />
    </Suspense>
  );
}
