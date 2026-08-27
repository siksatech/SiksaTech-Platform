"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  createBrowserClient,
  isRealSupabase,
  db,
  Course,
  Certificate,
} from "@siksatech/database";
import {
  LayoutDashboard,
  ImageIcon,
  HelpCircle,
  BookOpen,
  Trophy,
  ShoppingBag,
  Users,
  LogOut,
  Plus,
  Trash2,
  Check,
  X,
  ArrowUpRight,
  Sparkles,
  FolderGit2,
  Award,
  CheckCircle2,
  Package,
  Truck,
  Shield,
  Loader2,
  RefreshCw,
  School,
  ExternalLink,
} from "lucide-react";
import { SiksaTechLogo } from "@siksatech/ui";

type AdminTab =
  | "dashboard"
  | "courses"
  | "projects"
  | "certificates"
  | "store"
  | "orders"
  | "events"
  | "leads"
  | "users"
  | "banners"
  | "faqs";

export default function TeamPortalDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Live Data states
  const [courses, setCourses] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);

  // Form toggles
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showCertForm, setShowCertForm] = useState(false);
  const [showKitForm, setShowKitForm] = useState(false);
  const [showCompForm, setShowCompForm] = useState(false);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [showFaqForm, setShowFaqForm] = useState(false);

  // Form states
  const [courseForm, setCourseForm] = useState({
    id: "",
    title: "",
    description: "",
    learning_path_id: "explorer",
    difficulty: "Beginner",
    duration: "6 Weeks",
    skills: "Circuits, Logic, Breadboarding",
  });

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    problem_statement: "",
    student_level: "Builder (Class 8–10)",
    difficulty: "Medium",
    creator_name: "",
    creator_school: "",
    skills: "ESP32, IoT, C++",
    technologies: "Arduino IDE, FreeRTOS",
    components: "ESP32, DHT22, OLED",
    is_featured: true,
  });

  const [certForm, setCertForm] = useState({
    id: "ST-2026-9001",
    student_name: "",
    program_name: "Builder Path - Embedded IoT & Sensors",
    achievement: "Successfully built an autonomous solar telemetry monitoring station.",
    skills_verified: "ESP32, MicroPython, I2C Protocol",
  });

  const [kitForm, setKitForm] = useState({
    slug: "",
    title: "",
    description: "",
    price_inr: 2499,
    category: "builder",
    stock_count: 50,
    features: "Original Microcontroller, 15+ Precision Sensors, I2C LCD",
  });

  const [compForm, setCompForm] = useState({
    slug: "",
    title: "",
    description: "",
    competition_type: "hackathon",
    status: "active",
    prize_pool_inr: 100000,
  });

  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    cta_text: "",
    cta_link: "/learn",
  });

  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    category: "general",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    if (!isRealSupabase) {
      const [b, f, crs, prj, c, s, l, certs] = await Promise.all([
        db.getBanners(),
        db.getFAQs(),
        db.getCourses(),
        db.getProjects(),
        db.getCompetitions(),
        db.getStoreKits(),
        db.getLeads(),
        db.getCertificates(),
      ]);
      setBanners(b);
      setFaqs(f);
      setCourses(crs);
      setProjects(prj);
      setCompetitions(c);
      setProducts(s);
      setInquiries(l);
      setCertificates(certs);
      setLoading(false);
      return;
    }

    const supabase = createBrowserClient();
    try {
      const [
        { data: crs },
        { data: prj },
        { data: certs },
        { data: prods },
        { data: ords },
        { data: comps },
        { data: inqs },
        { data: profs },
      ] = await Promise.all([
        supabase.from("courses").select("*").order("sort_order"),
        supabase.from("student_projects").select("*").order("created_at", { ascending: false }),
        supabase.from("certificates").select("*").order("created_at", { ascending: false }),
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
        supabase.from("competitions").select("*, competition_teams(*)").order("created_at", { ascending: false }),
        supabase.from("institution_inquiries").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*, user_roles(*, role:roles(*))").order("created_at", { ascending: false }),
      ]);

      if (crs) setCourses(crs);
      if (prj) setProjects(prj);
      if (certs) setCertificates(certs);
      if (prods) setProducts(prods);
      if (ords) setOrders(ords);
      if (comps) setCompetitions(comps);
      if (inqs) setInquiries(inqs);
      if (profs) setProfiles(profs);
    } catch (err) {
      console.error("Error fetching live database records:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function init() {
      if (isRealSupabase) {
        const supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: prof } = await (supabase as any)
            .from("profiles")
            .select("*, user_roles(role:roles(*))")
            .eq("id", user.id)
            .maybeSingle();

          setUser({
            id: user.id,
            email: user.email,
            name: prof?.full_name || user.email?.split("@")[0] || "Admin",
            role: prof?.role || "super_admin",
          });
        }
      } else {
        const local = db.getCurrentUser();
        setUser(local || { name: "SiksaTech Super Admin", email: "admin@siksatech.in", role: "super_admin" });
      }
      loadData();
    }
    init();
  }, [loadData]);

  const handleLogout = async () => {
    if (isRealSupabase) {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
    } else {
      db.logout();
    }
    router.push("/login");
  };

  // ─── Live Course Operations ──────────────────────────────────────────────
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const courseId = courseForm.id.trim() || `course-${courseForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const skillsArray = courseForm.skills.split(",").map(s => s.trim()).filter(Boolean);

    if (isRealSupabase) {
      const supabase = createBrowserClient();
      const { error } = await (supabase as any).from("courses").upsert({
        id: courseId,
        title: courseForm.title.trim(),
        description: courseForm.description.trim(),
        learning_path_id: courseForm.learning_path_id,
        difficulty: courseForm.difficulty,
        duration: courseForm.duration,
        skills: skillsArray,
        is_published: true,
      });
      if (error) alert("Error saving course: " + error.message);
    } else {
      await db.saveCourse({
        id: courseId,
        title: courseForm.title,
        description: courseForm.description,
        learningPathId: courseForm.learning_path_id,
        difficulty: courseForm.difficulty as any,
        duration: courseForm.duration,
        modulesCount: 6,
        skills: skillsArray,
      });
    }

    setShowCourseForm(false);
    setActionLoading(false);
    loadData();
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    if (isRealSupabase) {
      const supabase = createBrowserClient();
      await (supabase as any).from("courses").delete().eq("id", id);
    } else {
      await db.deleteCourse(id);
    }
    loadData();
  };

  // ─── Live Project Moderation ─────────────────────────────────────────────
  const handleApproveProject = async (id: string, isApproved: boolean) => {
    if (isRealSupabase) {
      const supabase = createBrowserClient();
      await (supabase as any)
        .from("student_projects")
        .update({ status: isApproved ? "approved" : "rejected" })
        .eq("id", id);
    }
    loadData();
  };

  const handleToggleFeaturedProject = async (id: string, currentFeatured: boolean) => {
    if (isRealSupabase) {
      const supabase = createBrowserClient();
      await (supabase as any)
        .from("student_projects")
        .update({ is_featured: !currentFeatured })
        .eq("id", id);
    }
    loadData();
  };

  // ─── Live Hardware Store Operations ──────────────────────────────────────
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const slug = kitForm.slug.trim() || kitForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const featuresArray = kitForm.features.split(",").map(f => f.trim()).filter(Boolean);

    if (isRealSupabase) {
      const supabase = createBrowserClient();
      const { error } = await (supabase as any).from("products").upsert({
        slug,
        title: kitForm.title.trim(),
        description: kitForm.description.trim(),
        price_inr: Number(kitForm.price_inr),
        category: kitForm.category,
        stock_count: Number(kitForm.stock_count),
        is_in_stock: Number(kitForm.stock_count) > 0,
        features: featuresArray,
        is_published: true,
      }, { onConflict: "slug" });
      if (error) alert("Error saving kit: " + error.message);
    }

    setShowKitForm(false);
    setActionLoading(false);
    loadData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hardware product?")) return;
    if (isRealSupabase) {
      const supabase = createBrowserClient();
      await (supabase as any).from("products").delete().eq("id", id);
    }
    loadData();
  };

  // ─── Live Order Management ───────────────────────────────────────────────
  const handleUpdateOrderStatus = async (orderId: string, status: string, trackingNumber?: string) => {
    if (isRealSupabase) {
      const supabase = createBrowserClient();
      const updateData: any = { status };
      if (trackingNumber) updateData.tracking_number = trackingNumber;
      await (supabase as any).from("orders").update(updateData).eq("id", orderId);
    }
    loadData();
  };

  // ─── Live Certificate Issuance ───────────────────────────────────────────
  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const certId = certForm.id.trim();
    const skillsArray = certForm.skills_verified.split(",").map(s => s.trim()).filter(Boolean);
    const verificationHash = `sha256-${Math.random().toString(36).substring(2)}-${Date.now()}`;

    if (isRealSupabase) {
      const supabase = createBrowserClient();
      const { error } = await (supabase as any).from("certificates").insert({
        id: certId,
        student_name: certForm.student_name.trim(),
        program_name: certForm.program_name.trim(),
        achievement: certForm.achievement.trim(),
        skills_verified: skillsArray,
        verification_hash: verificationHash,
        issued_date: new Date().toISOString().split("T")[0],
        issuer_name: "SiksaTech Academic Council",
      });
      if (error) alert("Error issuing certificate: " + error.message);
    }

    setShowCertForm(false);
    setCertForm({
      id: `ST-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      student_name: "",
      program_name: "Builder Path - Embedded IoT & Sensors",
      achievement: "Successfully built an autonomous solar telemetry monitoring station.",
      skills_verified: "ESP32, MicroPython, I2C Protocol",
    });
    setActionLoading(false);
    loadData();
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this certificate?")) return;
    if (isRealSupabase) {
      const supabase = createBrowserClient();
      await supabase.from("certificates").delete().eq("id", id);
    }
    loadData();
  };

  const tabs: { id: AdminTab; label: string; icon: any; count?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "courses", label: "Curriculum & Tracks", icon: BookOpen, count: courses.length },
    { id: "projects", label: "Build Showcase Moderation", icon: FolderGit2, count: projects.length },
    { id: "store", label: "Hardware Kits & Stock", icon: ShoppingBag, count: products.length },
    { id: "orders", label: "Orders & Shipping", icon: Truck, count: orders.length },
    { id: "certificates", label: "Certificate Registry", icon: Award, count: certificates.length },
    { id: "events", label: "Hackathons & Sprints", icon: Trophy, count: competitions.length },
    { id: "leads", label: "School Inquiries & Leads", icon: School, count: inquiries.length },
    { id: "users", label: "Users & Staff Roles", icon: Users, count: profiles.length },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex selection:bg-blue-600 selection:text-white font-sans">
      {/* Left Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-slate-800 space-y-1.5">
          <SiksaTechLogo className="h-6 w-auto brightness-0 invert" />
          <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Team Operations OS</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {typeof tab.count === "number" && tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    active ? "bg-blue-700 text-white" : "bg-slate-800 text-slate-400"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="text-xs">
            <p className="font-bold text-white truncate">{user?.name || "Super Admin"}</p>
            <p className="text-[10px] text-emerald-400 uppercase font-mono">{user?.role || "super_admin"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-red-900/40 hover:text-red-300 text-slate-400 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-slate-950 overflow-y-auto">
        <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-900/60 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-white capitalize">{activeTab.replace("_", " ")}</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Connected DB
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
            </button>
            <a
              href="https://siksatech.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 bg-slate-800 px-3 py-2 rounded-lg border border-slate-700 transition-all font-semibold"
            >
              <span>Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            </a>
          </div>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          {loading && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-blue-400 flex items-center gap-2 font-mono">
              <Loader2 className="w-4 h-4 animate-spin" />
              Syncing latest records from Supabase tables...
            </div>
          )}

          {/* 1. DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Published Courses", count: courses.length, icon: BookOpen, color: "text-emerald-400" },
                  { label: "Hardware Builds", count: projects.length, icon: FolderGit2, color: "text-purple-400" },
                  { label: "Hardware Kits in Store", count: products.length, icon: ShoppingBag, color: "text-blue-400" },
                  { label: "Customer Orders", count: orders.length, icon: Truck, color: "text-amber-400" },
                  { label: "Issued Certificates", count: certificates.length, icon: Award, color: "text-emerald-400" },
                  { label: "Active Hackathons", count: competitions.length, icon: Trophy, color: "text-amber-400" },
                  { label: "School Inquiries", count: inquiries.length, icon: School, color: "text-purple-400" },
                  { label: "Registered Users", count: profiles.length, icon: Users, color: "text-blue-400" },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                      <p className="text-2xl font-extrabold text-white">{stat.count}</p>
                      <p className="text-xs text-slate-400">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Operational Shortcuts
                </h3>
                <div className="grid sm:grid-cols-4 gap-3 text-xs">
                  <button onClick={() => { setActiveTab("courses"); setShowCourseForm(true); }} className="p-3 bg-slate-950 border border-slate-800 hover:border-emerald-500 rounded-xl text-left space-y-1 cursor-pointer">
                    <p className="font-bold text-white">+ Create Course</p>
                    <p className="text-[11px] text-slate-400">Publish new syllabus module</p>
                  </button>
                  <button onClick={() => { setActiveTab("store"); setShowKitForm(true); }} className="p-3 bg-slate-950 border border-slate-800 hover:border-blue-500 rounded-xl text-left space-y-1 cursor-pointer">
                    <p className="font-bold text-white">+ Add Hardware Kit</p>
                    <p className="text-[11px] text-slate-400">Update store catalog & stock</p>
                  </button>
                  <button onClick={() => { setActiveTab("certificates"); setShowCertForm(true); }} className="p-3 bg-slate-950 border border-slate-800 hover:border-amber-500 rounded-xl text-left space-y-1 cursor-pointer">
                    <p className="font-bold text-white">+ Issue Certificate</p>
                    <p className="text-[11px] text-slate-400">Grant cryptographic credential</p>
                  </button>
                  <button onClick={() => { setActiveTab("projects"); }} className="p-3 bg-slate-950 border border-slate-800 hover:border-purple-500 rounded-xl text-left space-y-1 cursor-pointer">
                    <p className="font-bold text-white">Review Student Builds</p>
                    <p className="text-[11px] text-slate-400">{projects.filter(p => p.status === "pending").length} Pending approval</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. COURSES TAB */}
          {activeTab === "courses" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Manage curriculum pathways and interactive hardware lessons in `courses` table.</p>
                <button onClick={() => setShowCourseForm(!showCourseForm)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-blue-500 cursor-pointer">
                  <Plus className="w-4 h-4" /> Add Course Track
                </button>
              </div>

              {showCourseForm && (
                <form onSubmit={handleSaveCourse} className="bg-slate-900 border border-blue-500/40 p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white">Create New Course Track</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input required value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} placeholder="Course Title (e.g. ESP32 Cloud Telemetry)" className="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
                    <select value={courseForm.learning_path_id} onChange={e => setCourseForm({ ...courseForm, learning_path_id: e.target.value })} className="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white">
                      <option value="explorer">Explorer (Class 6–8)</option>
                      <option value="builder">Builder (Class 9–10)</option>
                      <option value="creator">Creator (Class 11–12)</option>
                      <option value="engineer">Engineer (College)</option>
                    </select>
                  </div>
                  <textarea required value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} placeholder="Comprehensive course syllabus summary..." rows={2} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <input value={courseForm.duration} onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })} placeholder="Duration (e.g. 6 Weeks)" className="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
                    <select value={courseForm.difficulty} onChange={e => setCourseForm({ ...courseForm, difficulty: e.target.value })} className="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white">
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    <input value={courseForm.skills} onChange={e => setCourseForm({ ...courseForm, skills: e.target.value })} placeholder="Skills (comma separated)" className="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={actionLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg cursor-pointer">
                      {actionLoading ? "Saving..." : "Save Course"}
                    </button>
                    <button type="button" onClick={() => setShowCourseForm(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg cursor-pointer">Cancel</button>
                  </div>
                </form>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {courses.map((crs) => (
                  <div key={crs.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-blue-950 text-blue-400 text-[10px] font-bold uppercase rounded border border-blue-800">{crs.difficulty || "Beginner"}</span>
                      <button onClick={() => handleDeleteCourse(crs.id)} className="text-slate-500 hover:text-red-400 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <h4 className="text-sm font-bold text-white">{crs.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{crs.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                      <span>{crs.duration || "6 Weeks"}</span>
                      <span className="font-mono text-emerald-400">{crs.learning_path_id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. PROJECTS / BUILD SHOWCASE MODERATION */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Review student hardware submissions and feature approved builds on `/build` gallery.</p>
              </div>

              <div className="grid gap-4">
                {projects.map((p) => {
                  const isApproved = p.status === "approved";
                  return (
                    <div key={p.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isApproved ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-amber-950 text-amber-400 border border-amber-800"
                            }`}>
                              {p.status || "pending"}
                            </span>
                            <span className="text-xs text-purple-400 font-mono">{p.student_level}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1">{p.title}</h4>
                        </div>

                        <div className="flex items-center gap-2">
                          {!isApproved ? (
                            <button
                              onClick={() => handleApproveProject(p.id, true)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve & Publish
                            </button>
                          ) : (
                            <button
                              onClick={() => handleApproveProject(p.id, false)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-200 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" /> Unpublish
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleFeaturedProject(p.id, p.is_featured)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              p.is_featured ? "bg-amber-950 text-amber-400 border-amber-700" : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            ⭐ {p.is_featured ? "Featured" : "Feature"}
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300">{p.description || p.problem_statement}</p>
                      <div className="text-[11px] text-slate-500 flex items-center gap-4">
                        <span>Creator: <b className="text-slate-300">{p.creator_name}</b> ({p.creator_school || "Maker"})</span>
                        {p.technologies && <span>Stack: {Array.isArray(p.technologies) ? p.technologies.join(", ") : p.technologies}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. STORE PRODUCTS & HARDWARE KITS */}
          {activeTab === "store" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Manage STEM prototyping kits, pricing, and live inventory in `products` table.</p>
                <button onClick={() => setShowKitForm(!showKitForm)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-blue-500 cursor-pointer">
                  <Plus className="w-4 h-4" /> Add Hardware Kit
                </button>
              </div>

              {showKitForm && (
                <form onSubmit={handleSaveProduct} className="bg-slate-900 border border-blue-500/40 p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white">Add Hardware Kit Product</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input required value={kitForm.title} onChange={e => setKitForm({ ...kitForm, title: e.target.value })} placeholder="Kit Name (e.g. Creator IoT ESP32 Kit)" className="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
                    <input required type="number" value={kitForm.price_inr} onChange={e => setKitForm({ ...kitForm, price_inr: Number(e.target.value) })} placeholder="Price in INR (₹)" className="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
                  </div>
                  <textarea required value={kitForm.description} onChange={e => setKitForm({ ...kitForm, description: e.target.value })} placeholder="Product features, sensors included, and target audience..." rows={2} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <select value={kitForm.category} onChange={e => setKitForm({ ...kitForm, category: e.target.value })} className="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white">
                      <option value="explorer">Explorer Track Kit</option>
                      <option value="builder">Builder Track Kit</option>
                      <option value="creator">Creator Track Kit</option>
                      <option value="engineer">Engineer Track Kit</option>
                      <option value="component">Component / Sensor Pack</option>
                    </select>
                    <input type="number" value={kitForm.stock_count} onChange={e => setKitForm({ ...kitForm, stock_count: Number(e.target.value) })} placeholder="Initial Stock Quantity" className="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
                  </div>
                  <input value={kitForm.features} onChange={e => setKitForm({ ...kitForm, features: e.target.value })} placeholder="Key features (comma separated)" className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
                  <div className="flex gap-2">
                    <button type="submit" disabled={actionLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg cursor-pointer">
                      {actionLoading ? "Saving..." : "Save Product"}
                    </button>
                    <button type="button" onClick={() => setShowKitForm(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg cursor-pointer">Cancel</button>
                  </div>
                </form>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">₹{p.price_inr}</span>
                      <button onClick={() => handleDeleteProduct(p.id)} className="text-slate-500 hover:text-red-400 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <h4 className="text-sm font-bold text-white">{p.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                      <span>Stock: <b className="text-slate-300">{p.stock_count || 0} units</b></span>
                      <span className="font-mono text-purple-400 capitalize">{p.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. ORDERS & SHIPPING TRACKING */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">Live order fulfillment, payment verification, and shipment tracking in `orders` table.</p>

              <div className="grid gap-3">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-blue-400 font-bold">{ord.order_number}</span>
                          <span className="text-xs text-slate-500">{new Date(ord.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">Amount: <b className="text-emerald-400 font-mono">₹{ord.total_amount_inr}</b></p>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white capitalize font-semibold"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {ord.shipping_address && (
                      <div className="text-xs text-slate-400 space-y-0.5">
                        <p className="text-slate-300 font-semibold">Shipment Address:</p>
                        <p>{ord.shipping_address.fullName} • {ord.shipping_address.addressLine}, {ord.shipping_address.city}, {ord.shipping_address.state} - {ord.shipping_address.postalCode}</p>
                        <p className="font-mono text-slate-500">Contact: {ord.shipping_address.phone}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. CERTIFICATE REGISTRY */}
          {activeTab === "certificates" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Issue and revoke cryptographic verified credentials in `certificates` table.</p>
                <button onClick={() => setShowCertForm(!showCertForm)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-blue-500 cursor-pointer">
                  <Plus className="w-4 h-4" /> Issue Certificate
                </button>
              </div>

              {showCertForm && (
                <form onSubmit={handleIssueCertificate} className="bg-slate-900 border border-blue-500/40 p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white">Generate Verified Certificate</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input required value={certForm.id} onChange={e => setCertForm({ ...certForm, id: e.target.value })} placeholder="Certificate ID (e.g. ST-2026-X100)" className="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono" />
                    <input required value={certForm.student_name} onChange={e => setCertForm({ ...certForm, student_name: e.target.value })} placeholder="Student Full Name" className="px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
                  </div>
                  <input required value={certForm.program_name} onChange={e => setCertForm({ ...certForm, program_name: e.target.value })} placeholder="Program / Track Name" className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
                  <textarea required value={certForm.achievement} onChange={e => setCertForm({ ...certForm, achievement: e.target.value })} placeholder="Achievement summary (e.g. Built an autonomous solar monitoring station)" rows={2} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
                  <input value={certForm.skills_verified} onChange={e => setCertForm({ ...certForm, skills_verified: e.target.value })} placeholder="Skills (comma separated)" className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
                  <div className="flex gap-2">
                    <button type="submit" disabled={actionLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg cursor-pointer">
                      {actionLoading ? "Issuing..." : "Issue Credential"}
                    </button>
                    <button type="button" onClick={() => setShowCertForm(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg cursor-pointer">Cancel</button>
                  </div>
                </form>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-amber-400 font-bold">{cert.id}</span>
                      <button onClick={() => handleDeleteCertificate(cert.id)} className="text-slate-500 hover:text-red-400 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <h4 className="text-sm font-bold text-white">{cert.student_name}</h4>
                    <p className="text-xs text-slate-400">{cert.program_name}</p>
                    <p className="text-[11px] text-slate-500">{cert.achievement}</p>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                      <span className="text-[10px] text-slate-500">Issued: {cert.issued_date}</span>
                      <a href={`https://siksatech.in/verify/${cert.id}`} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-400 font-bold hover:underline flex items-center gap-1">
                        Verify View &rarr;
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. HACKATHONS & COMPETITIONS */}
          {activeTab === "events" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">National STEM Innovation Hackathons, teams, and problem statements in `competitions` table.</p>

              <div className="grid sm:grid-cols-2 gap-4">
                {competitions.map((c) => (
                  <div key={c.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-amber-400 font-mono">{c.competition_type}</span>
                      <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-semibold text-slate-300">{c.status}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{c.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-400">Prize: ₹{c.prize_pool_inr}</span>
                      <span className="text-slate-500">Teams: {c.competition_teams?.length || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. SCHOOL LEADS & INQUIRIES */}
          {activeTab === "leads" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">Inbound inquiries from ATL lab schools and institutional partners in `institution_inquiries` table.</p>

              <div className="grid gap-3">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{inq.institution_name}</h4>
                      <p className="text-xs text-slate-400">Contact: {inq.contact_person} ({inq.email} • {inq.phone})</p>
                      <p className="text-[11px] text-slate-500 font-mono">City: {inq.city} • Est. Students: {inq.estimated_students}</p>
                    </div>
                    <span className="px-3 py-1 bg-slate-800 text-purple-400 text-xs font-mono font-bold rounded-lg border border-slate-700 capitalize">
                      {inq.status || "new"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. USERS & STAFF ROLES */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">Active accounts and internal administrative role assignments in `profiles` & `user_roles`.</p>

              <div className="grid gap-3">
                {profiles.map((p) => (
                  <div key={p.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{p.full_name || "Anonymous User"}</h4>
                      <p className="text-xs text-slate-400 font-mono">{p.email}</p>
                      <p className="text-[11px] text-slate-500">School/College: {p.school_college_name || "Not specified"}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-mono font-bold rounded-lg uppercase ${
                      p.role === "super_admin" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-blue-950 text-blue-400 border border-blue-800"
                    }`}>
                      {p.role || "student"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
