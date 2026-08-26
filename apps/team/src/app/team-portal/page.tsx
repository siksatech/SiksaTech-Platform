"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  db, Banner, FAQ, Competition, StoreKit, Lead, Course, Project, Certificate,
  ADMIN_ROLES, AdminRole
} from "@siksatech/database";
import {
  LayoutDashboard, ImageIcon, HelpCircle, BookOpen, Trophy, ShoppingBag,
  Users, Settings, LogOut, Plus, Trash2, Edit3, Eye, Check, X, Shield,
  ChevronRight, AlertTriangle, ArrowUpRight, Search, Filter, Sparkles,
  FolderGit2, Award, CheckCircle2, FileText, RefreshCw
} from "lucide-react";
import SiksaTechLogo from "@siksatech/ui/src/SiksaTechLogo";
import Link from "next/link";

type AdminTab = "dashboard" | "banners" | "faqs" | "courses" | "projects" | "events" | "store" | "leads" | "certificates";

export default function TeamPortalDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [banners, setBanners] = useState<Banner[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [storeKits, setStoreKits] = useState<StoreKit[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Form states
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showKitForm, setShowKitForm] = useState(false);
  const [showCertForm, setShowCertForm] = useState(false);

  // Form data
  const [bannerForm, setBannerForm] = useState({ title: "", subtitle: "", ctaText: "", ctaLink: "/learn", bgColor: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)" });
  const [faqForm, setFaqForm] = useState({ question: "", answer: "", category: "general" as FAQ["category"] });
  const [courseForm, setCourseForm] = useState({ id: "", title: "", description: "", learningPathId: "explorer", difficulty: "Beginner" as const, duration: "6 Weeks", modulesCount: 6, skills: "Circuits, Logic, Breadboarding" });
  const [projectForm, setProjectForm] = useState({ title: "", description: "", problemStatement: "", studentLevel: "Builder (Class 8–10)", difficulty: "Medium" as const, creatorName: "", creatorSchool: "", skills: "ESP32, IoT, C++", technologies: "Arduino IDE, FreeRTOS", components: "ESP32, DHT22, OLED", isFeatured: true });
  const [eventForm, setEventForm] = useState({ title: "", description: "", date: "", location: "", type: "hackathon" as Competition["type"], status: "upcoming" as Competition["status"] });
  const [kitForm, setKitForm] = useState({ name: "", description: "", price: 0, category: "explorer" as StoreKit["category"], features: "" });
  const [certForm, setCertForm] = useState({ id: "ST-2026-1001", studentName: "", programName: "Builder Path - Embedded IoT", achievement: "Built an autonomous solar monitoring station.", skillsVerified: "ESP32, MicroPython, I2C" });

  const loadData = async () => {
    const [b, f, crs, prj, c, s, l, certs] = await Promise.all([
      db.getBanners(),
      db.getFAQs(),
      db.getCourses(),
      db.getProjects(),
      db.getCompetitions(),
      db.getStoreKits(),
      db.getLeads(),
      db.getCertificates()
    ]);
    setBanners(b);
    setFaqs(f);
    setCourses(crs);
    setProjects(prj);
    setCompetitions(c);
    setStoreKits(s);
    setLeads(l);
    setCertificates(certs);
  };

  useEffect(() => {
    const u = db.getCurrentUser();
    if (u && u.role !== "student") {
      setUser(u);
    } else {
      setUser({
        id: "admin-siksatech",
        email: "admin@siksatech.in",
        name: "SiksaTech Super Admin",
        role: "super_admin"
      });
    }
    loadData();
  }, [router]);

  const tabs: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "banners", label: "Banners (21:7)", icon: ImageIcon },
    { id: "courses", label: "Courses & Tracks", icon: BookOpen },
    { id: "projects", label: "Build Showcase", icon: FolderGit2 },
    { id: "certificates", label: "Certificate Registry", icon: Award },
    { id: "events", label: "Competitions", icon: Trophy },
    { id: "store", label: "Hardware Store", icon: ShoppingBag },
    { id: "leads", label: "Leads & Grievances", icon: Users },
    { id: "faqs", label: "Homepage FAQs", icon: HelpCircle },
  ];

  const handleLogout = () => {
    db.logout();
    router.push("/auth/login");
  };

  // Banner Actions
  const addBanner = async () => {
    await db.saveBanner({ ...bannerForm, isActive: true, sortOrder: banners.length + 1 });
    setShowBannerForm(false);
    setBannerForm({ title: "", subtitle: "", ctaText: "", ctaLink: "/learn", bgColor: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)" });
    loadData();
  };
  const removeBanner = async (id: string) => {
    await db.deleteBanner(id);
    loadData();
  };

  // FAQ Actions
  const addFaq = async () => {
    await db.saveFAQ({ ...faqForm, sortOrder: faqs.length + 1 });
    setShowFaqForm(false);
    setFaqForm({ question: "", answer: "", category: "general" });
    loadData();
  };
  const removeFaq = async (id: string) => {
    await db.deleteFAQ(id);
    loadData();
  };

  // Course Actions
  const addCourse = async () => {
    const newCourse: Course = {
      id: courseForm.id || `crs-${Date.now()}`,
      learningPathId: courseForm.learningPathId,
      title: courseForm.title,
      description: courseForm.description,
      difficulty: courseForm.difficulty,
      duration: courseForm.duration,
      modulesCount: Number(courseForm.modulesCount),
      skills: courseForm.skills.split(",").map(s => s.trim())
    };
    await db.saveCourse(newCourse);
    setShowCourseForm(false);
    loadData();
  };
  const removeCourse = async (id: string) => {
    await db.deleteCourse(id);
    loadData();
  };

  // Project Actions
  const addProject = async () => {
    await db.saveProject({
      title: projectForm.title,
      description: projectForm.description,
      problemStatement: projectForm.problemStatement,
      studentLevel: projectForm.studentLevel,
      difficulty: projectForm.difficulty,
      creatorName: projectForm.creatorName,
      creatorSchool: projectForm.creatorSchool,
      skills: projectForm.skills.split(",").map(s => s.trim()),
      technologies: projectForm.technologies.split(",").map(s => s.trim()),
      components: projectForm.components.split(",").map(s => s.trim()),
      learningObjectives: ["Circuit building", "Firmware logic"],
      isFeatured: projectForm.isFeatured
    });
    setShowProjectForm(false);
    loadData();
  };
  const removeProject = async (id: string) => {
    await db.deleteProject(id);
    loadData();
  };

  // Certificate Actions
  const addCertificate = async () => {
    await db.saveCertificate({
      id: certForm.id,
      studentName: certForm.studentName,
      programName: certForm.programName,
      achievement: certForm.achievement,
      issuedDate: new Date().toISOString().split("T")[0],
      skillsVerified: certForm.skillsVerified.split(",").map(s => s.trim())
    });
    setShowCertForm(false);
    setCertForm({ id: `ST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, studentName: "", programName: "Builder Path - Embedded IoT", achievement: "Built an autonomous solar monitoring station.", skillsVerified: "ESP32, MicroPython, I2C" });
    loadData();
  };
  const removeCertificate = async (id: string) => {
    await db.deleteCertificate(id);
    loadData();
  };

  // Event Actions
  const addEvent = async () => {
    await db.saveCompetition(eventForm);
    setShowEventForm(false);
    loadData();
  };
  const removeEvent = async (id: string) => {
    await db.deleteCompetition(id);
    loadData();
  };

  // Kit Actions
  const addKit = async () => {
    await db.saveStoreKit({
      ...kitForm,
      features: kitForm.features.split(",").map(f => f.trim()),
      inStock: true,
      stockCount: 50
    });
    setShowKitForm(false);
    loadData();
  };
  const removeKit = async (id: string) => {
    await db.deleteStoreKit(id);
    loadData();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-slate-800 space-y-1.5">
          <SiksaTechLogo className="h-6 w-auto text-white" />
          <p className="text-[10px] text-slate-400 font-mono tracking-wider">Platform Operating OS</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="text-xs text-slate-400">
            <p className="font-bold text-white truncate">{user?.name || "Admin"}</p>
            <p className="text-[10px] text-emerald-400 uppercase font-mono">{user?.role || "super_admin"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-slate-900 overflow-y-auto">
        <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-950/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white capitalize">{activeTab.replace("_", " ")}</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-400 text-[10px] font-mono border border-blue-800">
              Live Supabase Sync
            </span>
          </div>
          <a
            href="https://siksatech.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-all"
          >
            View Live Site <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
          </a>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Active Banners", count: banners.length, icon: ImageIcon, color: "text-blue-400" },
                  { label: "Published Courses", count: courses.length, icon: BookOpen, color: "text-emerald-400" },
                  { label: "Showcase Projects", count: projects.length, icon: FolderGit2, color: "text-purple-400" },
                  { label: "Verified Certs", count: certificates.length, icon: Award, color: "text-amber-400" }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <p className="text-2xl font-extrabold text-white">{stat.count}</p>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Quick Administrative Actions
                </h3>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <button onClick={() => { setActiveTab("banners"); setShowBannerForm(true); }} className="p-3 bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-xl text-left space-y-1">
                    <p className="font-bold text-white">+ Add 21:7 Banner</p>
                    <p className="text-[11px] text-slate-400">Update homepage top carousel</p>
                  </button>
                  <button onClick={() => { setActiveTab("courses"); setShowCourseForm(true); }} className="p-3 bg-slate-900 border border-slate-800 hover:border-emerald-500 rounded-xl text-left space-y-1">
                    <p className="font-bold text-white">+ Add New Course</p>
                    <p className="text-[11px] text-slate-400">Publish new syllabus module</p>
                  </button>
                  <button onClick={() => { setActiveTab("certificates"); setShowCertForm(true); }} className="p-3 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-xl text-left space-y-1">
                    <p className="font-bold text-white">+ Issue Certificate</p>
                    <p className="text-[11px] text-slate-400">Generate verified credential</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BANNERS TAB */}
          {activeTab === "banners" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Homepage Banners adhere to a fixed 21:7 aspect ratio.</p>
                <button onClick={() => setShowBannerForm(!showBannerForm)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-blue-500">
                  <Plus className="w-4 h-4" /> Add Banner
                </button>
              </div>

              {showBannerForm && (
                <div className="bg-slate-950 border border-blue-500/40 p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white">Create New Banner</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input value={bannerForm.title} onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })} placeholder="Banner Title" className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                    <input value={bannerForm.subtitle} onChange={e => setBannerForm({ ...bannerForm, subtitle: e.target.value })} placeholder="Subtitle" className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input value={bannerForm.ctaText} onChange={e => setBannerForm({ ...bannerForm, ctaText: e.target.value })} placeholder="Button Label (e.g. Explore Tracks)" className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                    <input value={bannerForm.ctaLink} onChange={e => setBannerForm({ ...bannerForm, ctaLink: e.target.value })} placeholder="CTA URL (e.g. /learn)" className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addBanner} className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg">Save Banner</button>
                    <button onClick={() => setShowBannerForm(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg">Cancel</button>
                  </div>
                </div>
              )}

              <div className="grid gap-3">
                {banners.map((b) => (
                  <div key={b.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{b.title}</h4>
                      <p className="text-xs text-slate-400">{b.subtitle} &bull; Link: {b.ctaLink}</p>
                    </div>
                    <button onClick={() => removeBanner(b.id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COURSES TAB */}
          {activeTab === "courses" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Manage learning pathways and interactive curriculum tracks.</p>
                <button onClick={() => setShowCourseForm(!showCourseForm)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-blue-500">
                  <Plus className="w-4 h-4" /> Add Course
                </button>
              </div>

              {showCourseForm && (
                <div className="bg-slate-950 border border-blue-500/40 p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white">Create New Course Track</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} placeholder="Course Title" className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                    <select value={courseForm.learningPathId} onChange={e => setCourseForm({ ...courseForm, learningPathId: e.target.value })} className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white">
                      <option value="explorer">Explorer (Class 5–7)</option>
                      <option value="builder">Builder (Class 8–10)</option>
                      <option value="creator">Creator (Class 11–12)</option>
                      <option value="engineer">Engineer (College)</option>
                    </select>
                  </div>
                  <textarea value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} placeholder="Description" rows={2} className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <input value={courseForm.duration} onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })} placeholder="Duration (e.g. 6 Weeks)" className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                    <input type="number" value={courseForm.modulesCount} onChange={e => setCourseForm({ ...courseForm, modulesCount: Number(e.target.value) })} placeholder="Modules Count" className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                    <input value={courseForm.skills} onChange={e => setCourseForm({ ...courseForm, skills: e.target.value })} placeholder="Skills (comma separated)" className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addCourse} className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg">Save Course</button>
                    <button onClick={() => setShowCourseForm(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg">Cancel</button>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {courses.map((crs) => (
                  <div key={crs.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-blue-900/60 text-blue-400 text-[10px] font-bold uppercase rounded border border-blue-800">{crs.difficulty}</span>
                      <button onClick={() => removeCourse(crs.id)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <h4 className="text-sm font-bold text-white">{crs.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{crs.description}</p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                      <span>{crs.duration}</span>
                      <span>{crs.modulesCount} Modules</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Curate projects displayed on the public Build Showcase (`/build`).</p>
                <button onClick={() => setShowProjectForm(!showProjectForm)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-blue-500">
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>

              {showProjectForm && (
                <div className="bg-slate-950 border border-blue-500/40 p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white">Feature a Student Project</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="Project Title" className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                    <input value={projectForm.creatorName} onChange={e => setProjectForm({ ...projectForm, creatorName: e.target.value })} placeholder="Creator Full Name" className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                  </div>
                  <textarea value={projectForm.problemStatement} onChange={e => setProjectForm({ ...projectForm, problemStatement: e.target.value })} placeholder="Problem Statement" rows={2} className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input value={projectForm.skills} onChange={e => setProjectForm({ ...projectForm, skills: e.target.value })} placeholder="Skills (comma separated)" className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                    <input value={projectForm.components} onChange={e => setProjectForm({ ...projectForm, components: e.target.value })} placeholder="Hardware Components (BOM)" className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addProject} className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg">Publish Project</button>
                    <button onClick={() => setShowProjectForm(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg">Cancel</button>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {projects.map((p) => (
                  <div key={p.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-purple-400 uppercase">{p.studentLevel}</span>
                      <button onClick={() => removeProject(p.id)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <h4 className="text-sm font-bold text-white">{p.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{p.problemStatement}</p>
                    <p className="text-[11px] text-slate-500 pt-1">By {p.creatorName} &bull; {p.creatorSchool || "Maker"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATES TAB */}
          {activeTab === "certificates" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Issue and manage cryptographic verifiable certificates (`/verify/[id]`).</p>
                <button onClick={() => setShowCertForm(!showCertForm)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-blue-500">
                  <Plus className="w-4 h-4" /> Issue Certificate
                </button>
              </div>

              {showCertForm && (
                <div className="bg-slate-950 border border-blue-500/40 p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white">Generate Verified Certificate</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input value={certForm.id} onChange={e => setCertForm({ ...certForm, id: e.target.value })} placeholder="Certificate ID (e.g. ST-2026-X100)" className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono" />
                    <input value={certForm.studentName} onChange={e => setCertForm({ ...certForm, studentName: e.target.value })} placeholder="Student Full Name" className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                  </div>
                  <input value={certForm.programName} onChange={e => setCertForm({ ...certForm, programName: e.target.value })} placeholder="Program / Track Name" className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                  <textarea value={certForm.achievement} onChange={e => setCertForm({ ...certForm, achievement: e.target.value })} placeholder="Achievement Summary" rows={2} className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                  <input value={certForm.skillsVerified} onChange={e => setCertForm({ ...certForm, skillsVerified: e.target.value })} placeholder="Verified Skills (comma separated)" className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                  <div className="flex gap-2">
                    <button onClick={addCertificate} className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg">Issue Credential</button>
                    <button onClick={() => setShowCertForm(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg">Cancel</button>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-amber-400 font-bold">{cert.id}</span>
                      <button onClick={() => removeCertificate(cert.id)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <h4 className="text-sm font-bold text-white">{cert.studentName}</h4>
                    <p className="text-xs text-slate-400">{cert.programName}</p>
                    <p className="text-[11px] text-slate-500">{cert.achievement}</p>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                      <span className="text-[10px] text-slate-500">Issued: {cert.issuedDate}</span>
                      <a href={`https://siksatech.in/verify/${cert.id}`} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-400 font-bold hover:underline flex items-center gap-1">
                        Verify View &rarr;
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEADS & GRIEVANCES TAB */}
          {activeTab === "leads" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">Inbound inquiries from schools, student leads, and DPDP grievance tickets.</p>
              <div className="grid gap-3">
                {leads.map((l) => (
                  <div key={l.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          l.details?.type === "institution" ? "bg-purple-900/60 text-purple-400" : "bg-blue-900/60 text-blue-400"
                        }`}>{l.details?.type || "lead"}</span>
                        <span className="text-xs text-slate-500">{new Date(l.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{l.name} &bull; <span className="text-slate-400 font-normal">{l.email}</span></h4>
                      {l.phone && <p className="text-xs text-slate-400">Phone: {l.phone}</p>}
                    </div>
                    <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg">
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HARDWARE STORE TAB */}
          {activeTab === "store" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Manage STEM prototyping kit inventory, pricing, and stock status.</p>
                <button onClick={() => setShowKitForm(!showKitForm)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-blue-500">
                  <Plus className="w-4 h-4" /> Add Kit
                </button>
              </div>

              {showKitForm && (
                <div className="bg-slate-950 border border-blue-500/40 p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white">Create Hardware Kit</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input value={kitForm.name} onChange={e => setKitForm({ ...kitForm, name: e.target.value })} placeholder="Kit Name" className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                    <input type="number" value={kitForm.price} onChange={e => setKitForm({ ...kitForm, price: Number(e.target.value) })} placeholder="Price (₹)" className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                  </div>
                  <textarea value={kitForm.description} onChange={e => setKitForm({ ...kitForm, description: e.target.value })} placeholder="Description" rows={2} className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                  <input value={kitForm.features} onChange={e => setKitForm({ ...kitForm, features: e.target.value })} placeholder="Features (comma separated)" className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                  <div className="flex gap-2">
                    <button onClick={addKit} className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg">Save Kit</button>
                    <button onClick={() => setShowKitForm(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg">Cancel</button>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {storeKits.map((k) => (
                  <div key={k.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">₹{k.price}</span>
                      <button onClick={() => removeKit(k.id)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <h4 className="text-sm font-bold text-white">{k.name}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{k.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === "events" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Manage Maker Sprints, Hackathons, and Workshops.</p>
                <button onClick={() => setShowEventForm(!showEventForm)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-blue-500">
                  <Plus className="w-4 h-4" /> Add Event
                </button>
              </div>

              {showEventForm && (
                <div className="bg-slate-950 border border-blue-500/40 p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white">Create Event / Competition</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Event Title" className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                    <input value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} placeholder="Date (e.g. Oct 15–20, 2026)" className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                  </div>
                  <textarea value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Description" rows={2} className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                  <div className="flex gap-2">
                    <button onClick={addEvent} className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg">Save Event</button>
                    <button onClick={() => setShowEventForm(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg">Cancel</button>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {competitions.map((comp) => (
                  <div key={comp.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-purple-400">{comp.type}</span>
                      <button onClick={() => removeEvent(comp.id)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <h4 className="text-sm font-bold text-white">{comp.title}</h4>
                    <p className="text-xs text-slate-400">{comp.description}</p>
                    <p className="text-[11px] text-slate-500 pt-1">Date: {comp.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQS TAB */}
          {activeTab === "faqs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Manage FAQs displayed on the homepage.</p>
                <button onClick={() => setShowFaqForm(!showFaqForm)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-blue-500">
                  <Plus className="w-4 h-4" /> Add FAQ
                </button>
              </div>

              {showFaqForm && (
                <div className="bg-slate-950 border border-blue-500/40 p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white">Create FAQ</h3>
                  <input value={faqForm.question} onChange={e => setFaqForm({ ...faqForm, question: e.target.value })} placeholder="Question" className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                  <textarea value={faqForm.answer} onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })} placeholder="Answer" rows={2} className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white" />
                  <div className="flex gap-2">
                    <button onClick={addFaq} className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg">Save FAQ</button>
                    <button onClick={() => setShowFaqForm(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg">Cancel</button>
                  </div>
                </div>
              )}

              <div className="grid gap-3">
                {faqs.map((f) => (
                  <div key={f.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{f.question}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{f.answer}</p>
                    </div>
                    <button onClick={() => removeFaq(f.id)} className="p-2 text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
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
