"use client";

import { useState, useEffect, useActionState, Suspense } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import { createBrowserClient, isRealSupabase } from "@siksatech/database";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Package,
  UserPlus,
  Search,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  BadgeCheck,
  Plus,
  ArrowRight,
  ShoppingBag,
  User,
} from "lucide-react";
import {
  linkChildByIdOrEmail,
  createChildAccount,
} from "../../auth/actions";

// ─── Types ────────────────────────────────────────────────────
interface ChildProfile {
  id: string;
  name: string;
  siksa_id: string;
  grade: string;
  link_status: "active" | "pending";
  enrollments_count: number;
}

interface ParentProfile {
  id: string;
  full_name: string;
  email: string;
  siksa_id: string;
  role: string;
}

// ─── Link Child Form ──────────────────────────────────────────
function LinkChildForm({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<"link" | "create">("link");
  const [linkState, linkAction, linkPending] = useActionState(linkChildByIdOrEmail, {
    error: null,
    success: false,
  });
  const [createState, createAction, createPending] = useActionState(createChildAccount, {
    error: null,
    success: false,
    childId: undefined,
  });

  useEffect(() => {
    if (linkState.success || createState.success) {
      onSuccess();
    }
  }, [linkState.success, createState.success, onSuccess]);

  return (
    <div className="p-6 rounded-2xl border border-blue-800/40 bg-slate-900/80 space-y-6">
      {/* Mode Tabs */}
      <div className="flex gap-2 p-1 bg-slate-800/60 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setMode("link")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === "link"
              ? "bg-blue-600 text-white shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Search className="w-3.5 h-3.5 inline mr-1.5" />
          Find Existing Student
        </button>
        <button
          type="button"
          onClick={() => setMode("create")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            mode === "create"
              ? "bg-blue-600 text-white shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Plus className="w-3.5 h-3.5 inline mr-1.5" />
          Create New Account
        </button>
      </div>

      {/* Link Mode */}
      {mode === "link" && (
        <form action={linkAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Student&apos;s SiksaTech ID or Email
            </label>
            <input
              type="text"
              name="id_or_email"
              placeholder="e.g. SIKSA-AB1234 or student@email.com"
              required
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              The student must have an existing SiksaTech account. They will receive a link request notification.
            </p>
          </div>
          {linkState.error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/40 border border-red-800/40 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {linkState.error}
            </div>
          )}
          <button
            type="submit"
            disabled={linkPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-xl text-sm font-bold transition-all"
          >
            {linkPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {linkPending ? "Sending Request..." : "Send Link Request"}
          </button>
        </form>
      )}

      {/* Create Mode */}
      {mode === "create" && !createState.success && (
        <form action={createAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Child&apos;s Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="child_name"
              placeholder="e.g. Aryan Sharma"
              required
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Grade / Class <span className="text-slate-500">(optional)</span>
            </label>
            <select
              name="child_grade"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select grade</option>
              {["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "College"].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-400 leading-relaxed">
            💡 A unique <span className="font-mono text-blue-400">SIKSA-ID</span> will be generated for your child. No separate email is required — they can add their own email later.
          </div>
          {createState.error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/40 border border-red-800/40 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {createState.error}
            </div>
          )}
          <button
            type="submit"
            disabled={createPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-xl text-sm font-bold transition-all"
          >
            {createPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            {createPending ? "Creating Account..." : "Create Child Account"}
          </button>
        </form>
      )}

      {/* Success: show generated ID */}
      {mode === "create" && createState.success && createState.childId && (
        <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-700/40 space-y-3 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <p className="text-sm font-bold text-emerald-300">Child account created!</p>
          <div className="bg-slate-900 rounded-lg p-3 border border-emerald-800/40">
            <p className="text-xs text-slate-400 mb-1">SiksaTech ID</p>
            <p className="font-mono text-xl font-bold text-white tracking-widest">{createState.childId}</p>
          </div>
          <p className="text-xs text-slate-400">
            Save this ID. Your child will use it to log in. They can set a password and email later.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Child Card ───────────────────────────────────────────────
function ChildCard({ child }: { child: ChildProfile }) {
  return (
    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">{child.name}</h3>
            <p className="font-mono text-xs text-slate-400">{child.siksa_id}</p>
          </div>
        </div>
        <span className={`text-[10px] font-mono px-2 py-1 rounded-full border ${
          child.link_status === "active"
            ? "bg-emerald-950 text-emerald-400 border-emerald-800/50"
            : "bg-amber-950 text-amber-400 border-amber-800/50"
        }`}>
          {child.link_status === "active" ? "Linked" : "Pending"}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{child.grade || "Grade not set"}</span>
        <span className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          {child.enrollments_count} course{child.enrollments_count !== 1 ? "s" : ""} enrolled
        </span>
      </div>

      {child.enrollments_count === 0 ? (
        <Link
          href="/learn"
          className="block text-center text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors py-1"
        >
          Browse courses for {child.name.split(" ")[0]} <ArrowRight className="inline w-3.5 h-3.5" />
        </Link>
      ) : (
        <Link
          href={`/dashboard/parent/child/${child.id}`}
          className="flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <span>View progress</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────
function ParentDashboardContent() {
  const router = useRouter();
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLinkForm, setShowLinkForm] = useState(false);

  async function loadData() {
    setLoading(true);
    if (isRealSupabase) {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Fetch parent profile
      const { data: prof } = await (supabase as any)
        .from("profiles")
        .select("id, full_name, email, siksa_id, role")
        .eq("id", user.id)
        .maybeSingle();

      if (prof) setProfile(prof);

      // Fetch linked children with their enrollment counts
      const { data: links } = await (supabase as any)
        .from("parent_child_links")
        .select(`
          status,
          child:profiles!parent_child_links_child_id_fkey(
            id, full_name, siksa_id, grade_level
          )
        `)
        .eq("parent_id", user.id);

      if (links && links.length > 0) {
        const childProfiles: ChildProfile[] = await Promise.all(
          links.map(async (link: any) => {
            const child = link.child;
            const { count } = await (supabase as any)
              .from("enrollments")
              .select("id", { count: "exact", head: true })
              .eq("student_id", child.id);
            return {
              id: child.id,
              name: child.full_name,
              siksa_id: child.siksa_id || "—",
              grade: child.grade_level || "",
              link_status: link.status,
              enrollments_count: count ?? 0,
            };
          })
        );
        setChildren(childProfiles);
      }

      // Fetch orders
      const { data: ords } = await (supabase as any)
        .from("orders")
        .select("id, order_number, status, total_amount_inr, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (ords) setOrders(ords);
    }
    // In demo mode: just show empty state — no fake data
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-blue-950/30 via-slate-900 to-slate-900 border border-blue-800/30 shadow-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-700/40 text-blue-400 text-xs font-mono">
              <Users className="w-3.5 h-3.5" />
              <span>Parent Portal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Welcome, {profile?.full_name || "Parent"}
            </h1>
            {profile?.siksa_id && (
              <p className="text-xs font-mono text-slate-400">
                Your ID: <span className="text-blue-400 font-bold">{profile.siksa_id}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/store"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <Package className="w-4 h-4" />
              Order STEM Kit
            </Link>
            <Link
              href="/profile"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition-all"
            >
              Profile &amp; Settings
            </Link>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Children management (full width on mobile, 2/3 on desktop) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  My Children
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Monitor your child&apos;s learning progress and course activity
                </p>
              </div>
              <button
                onClick={() => setShowLinkForm((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Add Child
              </button>
            </div>

            {/* Link form */}
            {showLinkForm && (
              <LinkChildForm
                onSuccess={() => {
                  setShowLinkForm(false);
                  loadData();
                }}
              />
            )}

            {/* Child cards or empty state */}
            {children.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {children.map((child) => (
                  <ChildCard key={child.id} child={child} />
                ))}
              </div>
            ) : !showLinkForm ? (
              <div className="p-10 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-slate-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-300 text-base">No children linked yet</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Link your child&apos;s existing SiksaTech account, or create a new one for them to get started.
                  </p>
                </div>
                <button
                  onClick={() => setShowLinkForm(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Child
                </button>
              </div>
            ) : null}

            {/* What Parents Can See notice */}
            {children.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
                <BadgeCheck className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p>
                  For linked children, you can view their enrolled courses, completed lessons, and certificates from their individual progress pages.
                  Student progress is always live and updated in real time.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: Sidebar */}
          <div className="space-y-6">

            {/* Quick Links */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3">
              <h3 className="font-bold text-sm text-white">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: "Browse STEM Courses", href: "/learn", icon: BookOpen },
                  { label: "Shop Hardware Kits", href: "/store", icon: Package },
                  { label: "Profile & Settings", href: "/profile", icon: User },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-xs font-semibold text-slate-300 hover:text-white transition-all group"
                  >
                    <link.icon className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    {link.label}
                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-blue-400" />
                Recent Orders
              </h3>
              {orders.length > 0 ? (
                <div className="space-y-2">
                  {orders.map((ord: any) => (
                    <div key={ord.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-blue-400 font-bold">{ord.order_number}</span>
                        <span className={`capitalize ${ord.status === "delivered" ? "text-emerald-400" : "text-amber-400"}`}>
                          {ord.status}
                        </span>
                      </div>
                      {ord.total_amount_inr && (
                        <p className="text-xs text-slate-400">₹{ord.total_amount_inr}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 space-y-2">
                  <Package className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-500">No orders yet</p>
                  <Link href="/store" className="text-xs text-blue-400 hover:underline font-semibold">
                    Browse Store →
                  </Link>
                </div>
              )}
            </div>

            {/* Status indicators */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3">
              <h3 className="font-bold text-sm text-white">Summary</h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Users className="w-3.5 h-3.5" /> Children linked
                  </span>
                  <span className="font-mono font-bold text-white">{children.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active links
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {children.filter((c) => c.link_status === "active").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> Pending approval
                  </span>
                  <span className="font-mono font-bold text-amber-400">
                    {children.filter((c) => c.link_status === "pending").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-400">
                    <ShoppingBag className="w-3.5 h-3.5" /> Kit orders
                  </span>
                  <span className="font-mono font-bold text-white">{orders.length}</span>
                </div>
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      }
    >
      <ParentDashboardContent />
    </Suspense>
  );
}
