"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, Banner, FAQ, Competition, StoreKit, Lead, ADMIN_ROLES, DEMO_BANNERS } from "@/lib/db";
import SiksaTechLogo from "@/components/SiksaTechLogo";
import {
  LayoutDashboard, Image as ImageIcon, HelpCircle, BookOpen, Trophy,
  ShoppingBag, Users, Settings, LogOut, Plus, Trash2, Eye, EyeOff,
  ChevronRight, Package, Calendar, MapPin, AlertCircle, CheckCircle2,
  ArrowLeft, Menu, X
} from "lucide-react";

type AdminTab = "dashboard" | "banners" | "faqs" | "courses" | "events" | "store" | "leads";

export default function TeamPortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [banners, setBanners] = useState<Banner[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [storeKits, setStoreKits] = useState<StoreKit[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  // Form states
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showKitForm, setShowKitForm] = useState(false);

  const [bannerForm, setBannerForm] = useState({ title: "", subtitle: "", ctaText: "", ctaLink: "/learn", bgColor: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)" });
  const [faqForm, setFaqForm] = useState({ question: "", answer: "", category: "general" as FAQ["category"] });
  const [eventForm, setEventForm] = useState({ title: "", description: "", date: "", location: "", type: "hackathon" as Competition["type"], status: "upcoming" as Competition["status"] });
  const [kitForm, setKitForm] = useState({ name: "", description: "", price: 0, category: "explorer" as StoreKit["category"], features: "" });

  useEffect(() => {
    const u = db.getCurrentUser();
    if (!u || u.role === "student") {
      router.push("/auth/login");
      return;
    }
    setUser(u);
    loadData();
  }, [router]);

  const loadData = async () => {
    const [b, f, c, s, l] = await Promise.all([
      db.getBanners(),
      db.getFAQs(),
      db.getCompetitions(),
      db.getStoreKits(),
      db.getLeads(),
    ]);
    setBanners(b);
    setFaqs(f);
    setCompetitions(c);
    setStoreKits(s);
    setLeads(l);
  };

  const userRole = user?.role || "student";
  const roleConfig = ADMIN_ROLES.find(r => r.role === userRole) || ADMIN_ROLES[0];
  const permissions = userRole === "super_admin" ? ["banners", "faqs", "courses", "events", "store", "leads", "users", "settings"] : (roleConfig?.permissions || []);

  const hasPermission = (perm: string) => permissions.includes(perm);

  const tabs: { id: AdminTab; label: string; icon: any; permission: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "" },
    { id: "banners", label: "Banners", icon: ImageIcon, permission: "banners" },
    { id: "faqs", label: "FAQs", icon: HelpCircle, permission: "faqs" },
    { id: "courses", label: "Courses", icon: BookOpen, permission: "courses" },
    { id: "events", label: "Events", icon: Trophy, permission: "events" },
    { id: "store", label: "Store", icon: ShoppingBag, permission: "store" },
    { id: "leads", label: "Leads", icon: Users, permission: "leads" },
  ];

  const visibleTabs = tabs.filter(t => t.permission === "" || hasPermission(t.permission));

  const handleLogout = () => {
    db.logout();
    router.push("/");
  };

  // CRUD handlers
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

  const addEvent = async () => {
    await db.saveCompetition({ ...eventForm });
    setShowEventForm(false);
    setEventForm({ title: "", description: "", date: "", location: "", type: "hackathon", status: "upcoming" });
    loadData();
  };

  const removeEvent = async (id: string) => {
    await db.deleteCompetition(id);
    loadData();
  };

  const addKit = async () => {
    await db.saveStoreKit({
      ...kitForm,
      features: kitForm.features.split(",").map(f => f.trim()).filter(Boolean),
      inStock: true,
      stockCount: 20,
    });
    setShowKitForm(false);
    setKitForm({ name: "", description: "", price: 0, category: "explorer", features: "" });
    loadData();
  };

  const removeKit = async (id: string) => {
    await db.deleteStoreKit(id);
    loadData();
  };

  const updateLeadStatus = async (id: string, status: Lead["status"]) => {
    await db.updateLeadStatus(id, status);
    loadData();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
            <SiksaTechLogo size={32} />
            <div>
              <p className="text-sm font-bold text-white">SiksaTech</p>
              <p className="text-[10px] text-slate-400">Admin Portal</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {visibleTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* User + Logout */}
          <div className="border-t border-slate-800 px-4 py-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {user.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{roleConfig?.label}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold text-slate-400 border border-slate-700 rounded-lg hover:text-white hover:border-slate-600 transition-all">
                <ArrowLeft className="w-3 h-3" /> Site
              </Link>
              <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold text-red-400 border border-slate-700 rounded-lg hover:text-red-300 hover:border-red-800 transition-all">
                <LogOut className="w-3 h-3" /> Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:text-slate-700 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 capitalize">{activeTab}</h1>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          {/* ===== DASHBOARD ===== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Active Banners", value: banners.length, icon: ImageIcon, color: "text-blue-600 bg-blue-50" },
                  { label: "FAQs", value: faqs.length, icon: HelpCircle, color: "text-purple-600 bg-purple-50" },
                  { label: "Events", value: competitions.length, icon: Trophy, color: "text-amber-600 bg-amber-50" },
                  { label: "Leads", value: leads.length, icon: Users, color: "text-emerald-600 bg-emerald-50" },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Leads */}
              {hasPermission("leads") && leads.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-4">Recent Leads</h3>
                  <div className="space-y-3">
                    {leads.slice(0, 5).map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{lead.name}</p>
                          <p className="text-xs text-slate-500">{lead.email} · {lead.leadType}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          lead.status === "new" ? "bg-blue-100 text-blue-700" :
                          lead.status === "contacted" ? "bg-amber-100 text-amber-700" :
                          "bg-emerald-100 text-emerald-700"
                        }`}>
                          {lead.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== BANNERS ===== */}
          {activeTab === "banners" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">{banners.length} banner(s) active on the homepage carousel.</p>
                <button
                  onClick={() => setShowBannerForm(!showBannerForm)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Banner
                </button>
              </div>

              {showBannerForm && (
                <div className="bg-white rounded-xl border border-blue-200 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">New Banner</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input value={bannerForm.title} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} placeholder="Banner title" className="px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    <input value={bannerForm.ctaText} onChange={e => setBannerForm({...bannerForm, ctaText: e.target.value})} placeholder="Button text (e.g. Explore Now)" className="px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <textarea value={bannerForm.subtitle} onChange={e => setBannerForm({...bannerForm, subtitle: e.target.value})} placeholder="Subtitle / description" rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input value={bannerForm.ctaLink} onChange={e => setBannerForm({...bannerForm, ctaLink: e.target.value})} placeholder="CTA link (e.g. /learn)" className="px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    <select value={bannerForm.bgColor} onChange={e => setBannerForm({...bannerForm, bgColor: e.target.value})} className="px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)">Dark Blue</option>
                      <option value="linear-gradient(135deg, #064E3B 0%, #065F46 50%, #064E3B 100%)">Green</option>
                      <option value="linear-gradient(135deg, #4C1D95 0%, #5B21B6 50%, #4C1D95 100%)">Purple</option>
                      <option value="linear-gradient(135deg, #7C2D12 0%, #9A3412 50%, #7C2D12 100%)">Orange</option>
                      <option value="linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #1E1B4B 100%)">Indigo</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addBanner} disabled={!bannerForm.title} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-40">Save Banner</button>
                    <button onClick={() => setShowBannerForm(false)} className="px-4 py-2 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
                  </div>
                </div>
              )}

              {banners.map((banner) => (
                <div key={banner.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-10 rounded-lg flex-shrink-0" style={{ background: banner.bgColor }} />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{banner.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{banner.subtitle}</p>
                    </div>
                  </div>
                  <button onClick={() => removeBanner(banner.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ===== FAQS ===== */}
          {activeTab === "faqs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">{faqs.length} FAQ(s) displayed on the homepage.</p>
                <button onClick={() => setShowFaqForm(!showFaqForm)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all">
                  <Plus className="w-3.5 h-3.5" /> Add FAQ
                </button>
              </div>

              {showFaqForm && (
                <div className="bg-white rounded-xl border border-blue-200 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">New FAQ</h3>
                  <input value={faqForm.question} onChange={e => setFaqForm({...faqForm, question: e.target.value})} placeholder="Question" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  <textarea value={faqForm.answer} onChange={e => setFaqForm({...faqForm, answer: e.target.value})} placeholder="Answer" rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  <select value={faqForm.category} onChange={e => setFaqForm({...faqForm, category: e.target.value as FAQ["category"]})} className="px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="general">General</option>
                    <option value="student">Student</option>
                    <option value="institution">Institution</option>
                    <option value="store">Store</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={addFaq} disabled={!faqForm.question || !faqForm.answer} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-40">Save FAQ</button>
                    <button onClick={() => setShowFaqForm(false)} className="px-4 py-2 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
                  </div>
                </div>
              )}

              {faqs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">{faq.question}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{faq.answer}</p>
                      <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">{faq.category}</span>
                    </div>
                    <button onClick={() => removeFaq(faq.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ===== COURSES ===== */}
          {activeTab === "courses" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">Course Management</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Course catalog is currently managed via the database seed data. Full CRUD course editor with lesson markdown support will be enabled in the next update.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {["Explorer (Class 5–7)", "Builder (Class 8–10)", "Creator (Class 11–12)", "Engineer (College)"].map((path, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{path}</p>
                      <p className="text-xs text-slate-500">2 courses</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== EVENTS ===== */}
          {activeTab === "events" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">{competitions.length} event(s) listed.</p>
                <button onClick={() => setShowEventForm(!showEventForm)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all">
                  <Plus className="w-3.5 h-3.5" /> Add Event
                </button>
              </div>

              {showEventForm && (
                <div className="bg-white rounded-xl border border-blue-200 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">New Event</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} placeholder="Event title" className="px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    <input value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} type="date" className="px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <textarea value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} placeholder="Description" rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <input value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} placeholder="Location" className="px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    <select value={eventForm.type} onChange={e => setEventForm({...eventForm, type: e.target.value as Competition["type"]})} className="px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="hackathon">Hackathon</option>
                      <option value="competition">Competition</option>
                      <option value="workshop">Workshop</option>
                      <option value="event">Event</option>
                    </select>
                    <select value={eventForm.status} onChange={e => setEventForm({...eventForm, status: e.target.value as Competition["status"]})} className="px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addEvent} disabled={!eventForm.title || !eventForm.date} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-40">Save Event</button>
                    <button onClick={() => setShowEventForm(false)} className="px-4 py-2 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
                  </div>
                </div>
              )}

              {competitions.map((comp) => (
                <div key={comp.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      comp.type === "hackathon" ? "bg-red-50" : comp.type === "workshop" ? "bg-amber-50" : "bg-purple-50"
                    }`}>
                      <Trophy className={`w-5 h-5 ${
                        comp.type === "hackathon" ? "text-red-600" : comp.type === "workshop" ? "text-amber-600" : "text-purple-600"
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{comp.title}</p>
                      <p className="text-xs text-slate-500">{comp.date} · {comp.location}</p>
                    </div>
                  </div>
                  <button onClick={() => removeEvent(comp.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ===== STORE ===== */}
          {activeTab === "store" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">{storeKits.length} product(s) in the store.</p>
                <button onClick={() => setShowKitForm(!showKitForm)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all">
                  <Plus className="w-3.5 h-3.5" /> Add Product
                </button>
              </div>

              {showKitForm && (
                <div className="bg-white rounded-xl border border-blue-200 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">New Product</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input value={kitForm.name} onChange={e => setKitForm({...kitForm, name: e.target.value})} placeholder="Product name" className="px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    <input value={kitForm.price} onChange={e => setKitForm({...kitForm, price: Number(e.target.value)})} type="number" placeholder="Price (₹)" className="px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <textarea value={kitForm.description} onChange={e => setKitForm({...kitForm, description: e.target.value})} placeholder="Description" rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <select value={kitForm.category} onChange={e => setKitForm({...kitForm, category: e.target.value as StoreKit["category"]})} className="px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="explorer">Explorer</option>
                      <option value="builder">Builder</option>
                      <option value="creator">Creator</option>
                      <option value="engineer">Engineer</option>
                      <option value="accessory">Accessory</option>
                    </select>
                    <input value={kitForm.features} onChange={e => setKitForm({...kitForm, features: e.target.value})} placeholder="Features (comma separated)" className="px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addKit} disabled={!kitForm.name || !kitForm.price} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-40">Save Product</button>
                    <button onClick={() => setShowKitForm(false)} className="px-4 py-2 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
                  </div>
                </div>
              )}

              {storeKits.map((kit) => (
                <div key={kit.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{kit.name}</p>
                      <p className="text-xs text-slate-500">₹{kit.price.toLocaleString("en-IN")} · {kit.stockCount} in stock</p>
                    </div>
                  </div>
                  <button onClick={() => removeKit(kit.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ===== LEADS ===== */}
          {activeTab === "leads" && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">{leads.length} lead(s) in the pipeline.</p>

              {leads.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                  <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No leads yet. They will appear here when visitors submit inquiry forms.</p>
                </div>
              ) : (
                leads.map((lead) => (
                  <div key={lead.id} className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-slate-900">{lead.name}</p>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">{lead.leadType}</span>
                        </div>
                        <p className="text-xs text-slate-500">{lead.email} · {lead.phone}</p>
                        {lead.details && Object.keys(lead.details).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {Object.entries(lead.details).map(([k, v]) => (
                              <span key={k} className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                                {k}: {v}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        {lead.status !== "contacted" && (
                          <button
                            onClick={() => updateLeadStatus(lead.id, "contacted")}
                            className="px-3 py-1.5 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-all"
                          >
                            Mark Contacted
                          </button>
                        )}
                        {lead.status !== "converted" && (
                          <button
                            onClick={() => updateLeadStatus(lead.id, "converted")}
                            className="px-3 py-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all"
                          >
                            Convert
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
