"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createBrowserClient,
  isRealSupabase,
  db,
  DEMO_COURSES,
  DEMO_PROJECTS,
  DEMO_STORE_KITS,
  DEMO_CERTIFICATES,
  DEMO_HACKATHON,
  DEMO_BANNERS,
  DEMO_FAQS,
  type Course,
  type Project,
  type StoreKit
} from "@siksatech/database";
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  Users,
  Award,
  FolderGit2,
  Package,
  Truck,
  Building2,
  Trophy,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  PhoneCall,
  Mail,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Save,
  X,
  Check,
  Eye,
  Filter,
  ArrowUpRight
} from "lucide-react";
import SiksaTechLogo from "./SiksaTechLogo";

export type AdminTab =
  | "overview"
  | "courses"
  | "reviews"
  | "inventory"
  | "orders"
  | "certificates"
  | "leads"
  | "users"
  | "competitions"
  | "banners";

export default function AdminPortalView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Core Data Collections
  const [courses, setCourses] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [kits, setKits] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterOrderStatus, setFilterOrderStatus] = useState("all");
  const [filterProjectStatus, setFilterProjectStatus] = useState("all");

  // Modals & Form States
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showKitModal, setShowKitModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  // Forms
  const [newCourse, setNewCourse] = useState({
    id: "",
    title: "",
    description: "",
    learningPathId: "builder",
    difficulty: "Intermediate",
    duration: "8 Weeks",
    modulesCount: 4,
    skills: "Arduino, C++, Digital GPIO, Sensor Interfacing",
    price: 1999
  });

  const [newKit, setNewKit] = useState({
    id: "",
    name: "",
    description: "",
    category: "builder",
    price: 2499,
    originalPrice: 3999,
    stockCount: 50,
    features: "Microcontroller Board, 16 Sensors, USB Cable, Acrylic Base"
  });

  const [newCert, setNewCert] = useState({
    id: `ST-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    studentName: "",
    programName: "Advanced Embedded Firmware & IoT Track",
    achievement: "Successfully engineered and demonstrated an autonomous physical IoT prototype with sensor telemetry.",
    skillsVerified: "Embedded C++, ADC Calibration, Circuit Debugging, I2C Protocol"
  });

  // Triage state for projects
  const [feedbackInputs, setFeedbackInputs] = useState<Record<string, string>>({});
  const [scoreInputs, setScoreInputs] = useState<Record<string, string>>({});

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setActionMsg({ text, type });
    setTimeout(() => setActionMsg(null), 3500);
  };

  // Load all platform data
  const loadPlatformData = useCallback(async () => {
    setLoading(true);
    if (isRealSupabase) {
      try {
        const supabase = createBrowserClient() as any;

        // 1. Courses
        const { data: dbCourses } = await supabase.from("courses").select("*");
        setCourses(dbCourses || DEMO_COURSES);

        // 2. Student Projects
        const { data: dbProjects } = await supabase.from("student_projects").select("*").order("created_at", { ascending: false });
        setProjects(dbProjects || DEMO_PROJECTS);

        // 3. Store Kits
        const { data: dbKits } = await supabase.from("store_kits").select("*");
        setKits(dbKits || DEMO_STORE_KITS);

        // 4. Orders
        const { data: dbOrders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
        setOrders(dbOrders || []);

        // 5. Certificates
        const { data: dbCerts } = await supabase.from("certificates").select("*").order("created_at", { ascending: false });
        setCertificates(dbCerts || Object.values(DEMO_CERTIFICATES));

        // 6. Inquiries
        const { data: dbInquiries } = await supabase.from("institution_inquiries").select("*").order("created_at", { ascending: false });
        setInquiries(dbInquiries || []);

        // 7. Users
        const { data: dbProfiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
        setUsers(dbProfiles || []);

        // 8. Banners
        const { data: dbBanners } = await supabase.from("banners").select("*");
        setBanners(dbBanners || DEMO_BANNERS);

      } catch (err) {
        console.error("Admin data load error:", err);
      }
    } else {
      // Local fallback with real mock datasets
      setCourses(DEMO_COURSES);
      setProjects(DEMO_PROJECTS);
      setKits(DEMO_STORE_KITS);
      setCertificates(Object.values(DEMO_CERTIFICATES));
      setBanners(DEMO_BANNERS);

      // Default mock orders
      const localOrders = JSON.parse(localStorage.getItem("siksatech_all_orders") || "[]");
      setOrders(localOrders.length > 0 ? localOrders : [
        {
          id: "ord-101",
          order_number: "ST-ORD-98211",
          user_id: "u-1",
          status: "processing",
          total_amount_inr: 2999,
          items: [{ product_name: "Builder Embedded Arduino Kit", quantity: 1, price_inr: 2999 }],
          shipping_address: { fullName: "Aarav Sharma", phone: "9876543210", addressLine: "B-42 Vasant Vihar", city: "New Delhi", state: "Delhi", postalCode: "110057" },
          created_at: new Date(Date.now() - 3600000 * 4).toISOString()
        },
        {
          id: "ord-102",
          order_number: "ST-ORD-98212",
          user_id: "u-2",
          status: "shipped",
          tracking_number: "BLUEDART-8821992",
          total_amount_inr: 4999,
          items: [{ product_name: "Engineer OpenCV Robotics Kit", quantity: 1, price_inr: 4999 }],
          shipping_address: { fullName: "Pooja Patel", phone: "9811223344", addressLine: "Flat 402, Skyline Towers", city: "Bengaluru", state: "Karnataka", postalCode: "560001" },
          created_at: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ]);

      // Default mock institutional inquiries
      setInquiries([
        {
          id: "inq-1",
          institution_name: "Delhi Public School, R.K. Puram",
          institution_type: "k12_school",
          contact_name: "Dr. Sunita Rao (Principal)",
          contact_email: "principal@dpsrkp.net",
          contact_phone: "+91 98100 23456",
          city: "New Delhi",
          student_count: 850,
          status: "new",
          message: "Interested in setting up 30-seater ATL Robotics Lab for Class 6-10 students.",
          created_at: new Date(Date.now() - 3600000 * 6).toISOString()
        },
        {
          id: "inq-2",
          institution_name: "Vellore Institute of Technology (VIT)",
          institution_type: "university",
          contact_name: "Prof. K. Ramanathan (HOD ECE)",
          contact_email: "hod.ece@vit.ac.in",
          contact_phone: "+91 94440 98765",
          city: "Vellore",
          student_count: 1400,
          status: "proposal_sent",
          message: "Require curriculum modules and hardware kits for Edge AI and ROS Robotics laboratory.",
          created_at: new Date(Date.now() - 86400000 * 3).toISOString()
        }
      ]);

      // Default mock users
      setUsers([
        { id: "u-1", full_name: "Aarav Sharma", email: "aarav@student.in", role: "student", grade_level: "Class 9", school_college_name: "Delhi Public School", siksa_id: "ST-88219" },
        { id: "u-2", full_name: "Rajesh Sharma", email: "rajesh.sharma@parent.in", role: "parent", school_college_name: "New Delhi", siksa_id: "ST-P-4401" },
        { id: "u-3", full_name: "Sister Mary", email: "coordinator@stmarys.edu", role: "school", school_college_name: "St. Mary's Academy", siksa_id: "ST-SCH-109" },
        { id: "u-4", full_name: "Dr. Ananya Sen", email: "admin@siksatech.in", role: "super_admin", school_college_name: "SiksaTech Academic Council", siksa_id: "ST-ADM-001" },
      ]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPlatformData();
  }, [loadPlatformData]);

  // 1. ADD NEW COURSE
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const courseId = newCourse.id || `course-${newCourse.learningPathId}-${Date.now().toString(36)}`;
    const coursePayload = {
      id: courseId,
      title: newCourse.title,
      description: newCourse.description,
      learning_path_id: newCourse.learningPathId,
      learningPathId: newCourse.learningPathId,
      difficulty: newCourse.difficulty,
      duration: newCourse.duration,
      modules_count: Number(newCourse.modulesCount),
      modulesCount: Number(newCourse.modulesCount),
      skills: newCourse.skills.split(",").map(s => s.trim())
    };

    if (isRealSupabase) {
      try {
        const supabase = createBrowserClient() as any;
        await supabase.from("courses").upsert(coursePayload);
      } catch (err: any) {
        showToast("Error creating course: " + err.message, "error");
        return;
      }
    }

    setCourses(prev => [coursePayload, ...prev]);
    setShowCourseModal(false);
    setNewCourse({
      id: "",
      title: "",
      description: "",
      learningPathId: "builder",
      difficulty: "Intermediate",
      duration: "8 Weeks",
      modulesCount: 4,
      skills: "Arduino, C++, Digital GPIO, Sensor Interfacing",
      price: 1999
    });
    showToast("New Course Batch published successfully!");
  };

  // 2. TRIAGE & APPROVE PROJECT BUILD
  const handleTriageProject = async (projId: string, status: "approved" | "rejected") => {
    const feedback = feedbackInputs[projId] || "Excellent circuit design and neat sensor wiring. Passes all firmware telemetry checks.";
    const score = scoreInputs[projId] || "9.5/10 (Gold Tier)";

    if (isRealSupabase) {
      try {
        const supabase = createBrowserClient() as any;
        await supabase
          .from("student_projects")
          .update({ status, review_feedback: `${feedback} [Score: ${score}]` })
          .eq("id", projId);

        if (status === "approved") {
          const targetProj = projects.find(p => p.id === projId);
          if (targetProj) {
            const certId = `ST-2026-${projId.slice(0, 4).toUpperCase()}`;
            await supabase.from("certificates").upsert({
              id: certId,
              student_name: targetProj.student_name || targetProj.creatorName || "Student",
              program_name: `Maker Build Verification - ${targetProj.title}`,
              achievement: `Demonstrated high engineering competence for project "${targetProj.title}". Score: ${score}`,
              issued_date: new Date().toISOString().split("T")[0],
              skills_verified: ["Circuit Architecture", "Sensor Calibration", "Firmware Logic"]
            });
          }
        }
      } catch (err: any) {
        showToast("Failed to triage: " + err.message, "error");
        return;
      }
    }

    setProjects(prev => prev.map(p => p.id === projId ? { ...p, status, mentor_feedback: feedback } : p));
    showToast(status === "approved" ? "Project approved & Verifiable Certificate minted!" : "Revision requested from student.");
  };

  // 3. UPDATE ORDER STATUS & DISPATCH
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: string, trackingNum?: string) => {
    if (isRealSupabase) {
      try {
        const supabase = createBrowserClient() as any;
        await supabase
          .from("orders")
          .update({
            status: nextStatus,
            ...(trackingNum ? { tracking_number: trackingNum } : {})
          })
          .eq("id", orderId);
      } catch (err: any) {
        showToast("Failed to update order: " + err.message, "error");
        return;
      }
    }

    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status: nextStatus,
      tracking_number: trackingNum || o.tracking_number
    } : o));
    showToast(`Order status updated to "${nextStatus.toUpperCase()}"!`);
  };

  // 4. ADD HARDWARE STORE KIT
  const handleCreateKit = async (e: React.FormEvent) => {
    e.preventDefault();
    const kitId = newKit.id || `kit-${newKit.category}-${Date.now().toString(36)}`;
    const kitPayload = {
      id: kitId,
      name: newKit.name,
      description: newKit.description,
      category: newKit.category,
      price: Number(newKit.price),
      original_price: Number(newKit.originalPrice),
      originalPrice: Number(newKit.originalPrice),
      stock_count: Number(newKit.stockCount),
      stockCount: Number(newKit.stockCount),
      in_stock: Number(newKit.stockCount) > 0,
      inStock: Number(newKit.stockCount) > 0,
      features: newKit.features.split(",").map(f => f.trim())
    };

    if (isRealSupabase) {
      try {
        const supabase = createBrowserClient() as any;
        await supabase.from("store_kits").upsert(kitPayload);
      } catch (err: any) {
        showToast("Error creating kit: " + err.message, "error");
        return;
      }
    }

    setKits(prev => [kitPayload, ...prev]);
    setShowKitModal(false);
    showToast("Hardware Starter Kit added to Store catalog!");
  };

  // 5. ISSUE CUSTOM VERIFIED CERTIFICATE
  const handleIssueCustomCert = async (e: React.FormEvent) => {
    e.preventDefault();
    const certPayload = {
      id: newCert.id,
      student_name: newCert.studentName,
      studentName: newCert.studentName,
      program_name: newCert.programName,
      programName: newCert.programName,
      achievement: newCert.achievement,
      issued_date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      issuedDate: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      skills_verified: newCert.skillsVerified.split(",").map(s => s.trim()),
      skillsVerified: newCert.skillsVerified.split(",").map(s => s.trim()),
      verification_hash: `HASH-${newCert.id}-${Date.now().toString(16).toUpperCase()}`
    };

    if (isRealSupabase) {
      try {
        const supabase = createBrowserClient() as any;
        await supabase.from("certificates").upsert(certPayload);
      } catch (err: any) {
        showToast("Error issuing certificate: " + err.message, "error");
        return;
      }
    }

    // Save to local registry so public /verify/[id] resolves immediately
    if (typeof window !== "undefined") {
      const existing = JSON.parse(localStorage.getItem("siksatech_issued_certificates") || "[]");
      existing.unshift(certPayload);
      localStorage.setItem("siksatech_issued_certificates", JSON.stringify(existing));
    }

    setCertificates(prev => [certPayload, ...prev]);
    setShowCertModal(false);
    showToast(`Verifiable Certificate ${newCert.id} minted and activated!`);
  };

  // 6. UPDATE SCHOOL CRM STATUS
  const handleUpdateInquiryStatus = async (inquiryId: string, nextStatus: string) => {
    if (isRealSupabase) {
      try {
        const supabase = createBrowserClient() as any;
        await supabase.from("institution_inquiries").update({ status: nextStatus }).eq("id", inquiryId);
      } catch (err) {
        console.error("Error updating inquiry:", err);
      }
    }

    setInquiries(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, status: nextStatus } : inq));
    showToast(`Inquiry status changed to "${nextStatus.replace(/_/g, " ").toUpperCase()}"`);
  };

  // 7. CHANGE USER ROLE
  const handleChangeUserRole = async (userId: string, nextRole: string) => {
    if (isRealSupabase) {
      try {
        const supabase = createBrowserClient() as any;
        await supabase.from("profiles").update({ role: nextRole }).eq("id", userId);
      } catch (err: any) {
        showToast("Error updating role: " + err.message, "error");
        return;
      }
    }

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: nextRole } : u));
    showToast(`User role updated to ${nextRole.toUpperCase()}`);
  };

  // Computed metrics for Overview
  const totalStudents = users.filter(u => u.role === "student").length || 42;
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total_amount_inr || 0), 0) || 124990;
  const pendingReviewsCount = projects.filter(p => p.status === "pending" || p.status === "submitted").length;
  const pendingShipmentsCount = orders.filter(o => o.status === "processing" || o.status === "pending").length;
  const newInquiriesCount = inquiries.filter(i => i.status === "new").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center space-x-2 font-sans">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
        <span className="text-xs text-slate-500 font-mono">LOADING ADMIN OPERATIONS REGISTRY...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top Operations Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <SiksaTechLogo className="text-xl" variant="dark" />
            </Link>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-mono font-bold text-blue-700 uppercase">
              Operations Admin Suite
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadPlatformData}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
              title="Refresh Registry Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5"
            >
              <span>Student Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Grid: Left Navigation Sidebar & Right Workspace Panel */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* Toast Notification */}
        {actionMsg && (
          <div className={`mb-6 p-4 rounded-2xl border flex items-center justify-between shadow-md animate-in fade-in ${
            actionMsg.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}>
            <div className="flex items-center gap-2 text-xs font-bold">
              {actionMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
              <span>{actionMsg.text}</span>
            </div>
            <button onClick={() => setActionMsg(null)} className="p-1"><X className="w-4 h-4" /></button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-6">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Logged In Identity</span>
              <p className="text-xs font-bold text-slate-900 truncate">Staff Council Administrator</p>
              <p className="text-[11px] text-blue-600 font-mono">admin@siksatech.in</p>
            </div>

            <nav className="flex flex-col space-y-1">
              {[
                { id: "overview", label: "Executive Overview", icon: LayoutDashboard },
                { id: "courses", label: "Course Batches", icon: BookOpen, count: courses.length },
                { id: "reviews", label: "Project Triage", icon: FolderGit2, count: pendingReviewsCount, alert: pendingReviewsCount > 0 },
                { id: "inventory", label: "Hardware & Kits", icon: ShoppingBag, count: kits.length },
                { id: "orders", label: "Orders & Dispatch", icon: Package, count: pendingShipmentsCount, alert: pendingShipmentsCount > 0 },
                { id: "certificates", label: "Verifiable Credentials", icon: Award, count: certificates.length },
                { id: "leads", label: "ATL & School CRM", icon: Building2, count: newInquiriesCount, alert: newInquiriesCount > 0 },
                { id: "users", label: "User Registry & Roles", icon: Users, count: users.length },
                { id: "competitions", label: "Hackathons & Sprints", icon: Trophy },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-xs"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <TabIcon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                      <span>{tab.label}</span>
                    </div>

                    {tab.count !== undefined && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        tab.alert
                          ? "bg-amber-100 text-amber-800 font-bold"
                          : isActive
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Operational Panel */}
          <main className="lg:col-span-9 space-y-6">

            {/* TAB 1: EXECUTIVE OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-blue-600">COMMAND CENTER</span>
                  <h1 className="text-2xl font-extrabold text-slate-900">SiksaTech Operations &amp; Academic Governance</h1>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    Real-time monitoring of enrolled student cohorts, hardware logistics, project reviews, and institutional partnerships.
                  </p>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">Active Learners</span>
                    <p className="text-2xl font-extrabold font-mono text-slate-900">{totalStudents}</p>
                    <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">✓ Across Bharat</span>
                  </div>

                  <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">Total Hardware Rev</span>
                    <p className="text-2xl font-extrabold font-mono text-blue-600">₹{totalRevenue.toLocaleString("en-IN")}</p>
                    <span className="text-[11px] text-slate-500 font-medium">Pan-India Dispatches</span>
                  </div>

                  <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">Pending Triage</span>
                    <p className="text-2xl font-extrabold font-mono text-amber-600">{pendingReviewsCount}</p>
                    <span className="text-[11px] text-amber-600 font-medium">Builds Awaiting Review</span>
                  </div>

                  <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">ATL School Leads</span>
                    <p className="text-2xl font-extrabold font-mono text-purple-600">{inquiries.length}</p>
                    <span className="text-[11px] text-purple-600 font-medium">{newInquiriesCount} New Inquiries</span>
                  </div>
                </div>

                {/* Quick Operational Shortcuts */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Direct Actions</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => setShowCourseModal(true)}
                      className="p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition-all cursor-pointer space-y-1"
                    >
                      <Plus className="w-5 h-5 text-blue-600" />
                      <span className="text-xs font-bold text-slate-900 block">Create Batch</span>
                      <span className="text-[10px] text-slate-500 block">Add new STEM syllabus</span>
                    </button>

                    <button
                      onClick={() => setShowKitModal(true)}
                      className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition-all cursor-pointer space-y-1"
                    >
                      <Package className="w-5 h-5 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900 block">Add Kit SKU</span>
                      <span className="text-[10px] text-slate-500 block">Update Store catalog</span>
                    </button>

                    <button
                      onClick={() => setShowCertModal(true)}
                      className="p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition-all cursor-pointer space-y-1"
                    >
                      <Award className="w-5 h-5 text-purple-600" />
                      <span className="text-xs font-bold text-slate-900 block">Issue Certificate</span>
                      <span className="text-[10px] text-slate-500 block">Mint public credential</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("reviews")}
                      className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-all cursor-pointer space-y-1"
                    >
                      <FolderGit2 className="w-5 h-5 text-amber-600" />
                      <span className="text-xs font-bold text-slate-900 block">Triage Projects</span>
                      <span className="text-[10px] text-slate-500 block">{pendingReviewsCount} items waiting</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: COURSES & BATCHES */}
            {activeTab === "courses" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Curriculum &amp; Batch Management</h2>
                    <p className="text-xs text-slate-500">Configure STEM batches, module counts, and hardware requirements.</p>
                  </div>
                  <button
                    onClick={() => setShowCourseModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add New Course
                  </button>
                </div>

                {/* Course Cards Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {courses.map((c) => (
                    <div key={c.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {c.difficulty || "Intermediate"} Level
                          </span>
                          <span className="text-xs font-mono text-slate-400">{c.duration || "8 Weeks"}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{c.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-500">{c.modulesCount || c.modules_count || 4} Modules</span>
                        <Link
                          href={`/learn/${c.id}`}
                          target="_blank"
                          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          View Curriculum &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PROJECT REVIEW & TRIAGE */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Student Maker Build Triage</h2>
                    <p className="text-xs text-slate-500">Review schematics, evaluate firmware code, write mentor notes, and issue credentials.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
                            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                              proj.status === "approved" || proj.status === "verified"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}>
                              {proj.status === "approved" || proj.status === "verified" ? "✓ Approved" : "⏳ Pending Review"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            By {proj.student_name || proj.creatorName || "Student"} • {proj.creatorSchool || "SiksaTech Academy"}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        {proj.description || proj.problemStatement}
                      </p>

                      {proj.code_snippet && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Firmware Code Snippet:</span>
                          <pre className="p-3 bg-slate-900 text-emerald-400 text-xs font-mono rounded-xl overflow-x-auto max-h-32">
                            <code>{proj.code_snippet}</code>
                          </pre>
                        </div>
                      )}

                      {/* Mentor Feedback & Rating Box */}
                      <div className="pt-2 border-t border-slate-100 grid sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-8">
                          <input
                            type="text"
                            placeholder="Write mentor feedback notes..."
                            defaultValue={proj.review_feedback || ""}
                            onChange={(e) => setFeedbackInputs(prev => ({ ...prev, [proj.id]: e.target.value }))}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <div className="sm:col-span-4 flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleTriageProject(proj.id, "approved")}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleTriageProject(proj.id, "rejected")}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                          >
                            Revise
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: HARDWARE INVENTORY & SKUS */}
            {activeTab === "inventory" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">STEM Kits &amp; Hardware Inventory</h2>
                    <p className="text-xs text-slate-500">Manage starter kit SKUs, live stock counts, and prices.</p>
                  </div>
                  <button
                    onClick={() => setShowKitModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Kit SKU
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {kits.map((kit) => (
                    <div key={kit.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {kit.category} KIT
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            (kit.stockCount || kit.stock_count || 50) > 10
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}>
                            Stock: {kit.stockCount || kit.stock_count || 50} units
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{kit.name}</h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{kit.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-lg font-extrabold font-mono text-slate-900">₹{kit.price}</span>
                        <span className="text-xs text-emerald-600 font-bold">In Store</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: ORDERS & DISPATCH LOGISTICS */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Customer Hardware Orders &amp; Logistics</h2>
                    <p className="text-xs text-slate-500">Track shipments, verify shipping addresses, and assign courier tracking numbers.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-600">{order.order_number || order.id}</span>
                            <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${
                              order.status === "delivered"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : order.status === "shipped"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-900 font-bold mt-1">
                            Customer: {order.shipping_address?.fullName || "Aarav Sharma"} (Phone: {order.shipping_address?.phone || "—"})
                          </p>
                          <p className="text-xs text-slate-500">
                            Ship to: {order.shipping_address?.addressLine}, {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.postalCode}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-lg font-extrabold font-mono text-slate-900">₹{order.total_amount_inr || order.total || 2999}</span>
                        </div>
                      </div>

                      {/* Items Ordered List */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                        <span className="font-bold text-slate-900 block">Package Items:</span>
                        {(order.items || []).map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between">
                            <span>• {item.product_name || item.name} (Qty: {item.quantity})</span>
                            <span className="font-mono font-semibold">₹{item.price_inr || item.price}</span>
                          </div>
                        ))}
                      </div>

                      {/* Dispatch Actions */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-mono">
                            AWB: <strong>{order.tracking_number || "Awaiting Dispatch"}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "shipped", `BLUEDART-${Math.floor(1000000 + Math.random() * 9000000)}`)}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5" /> Mark Shipped
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "delivered")}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Delivered
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: VERIFIABLE CERTIFICATES */}
            {activeTab === "certificates" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Cryptographic Credential Registry</h2>
                    <p className="text-xs text-slate-500">Issue, search, and verify tamper-proof STEM certificates.</p>
                  </div>
                  <button
                    onClick={() => setShowCertModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Issue Certificate
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-blue-600">{cert.id}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Issued: {cert.issuedDate || cert.issued_date}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{cert.studentName || cert.student_name}</h3>
                        <p className="text-xs text-blue-700 font-semibold">{cert.programName || cert.program_name}</p>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{cert.achievement}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Verified
                        </span>
                        <Link
                          href={`/verify/${cert.id}`}
                          target="_blank"
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                        >
                          Public Verification <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: SCHOOL CRM & LEADS */}
            {activeTab === "leads" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">ATL Lab &amp; Institutional Partner CRM</h2>
                    <p className="text-xs text-slate-500">Inbound inquiries from schools and colleges for turnkey STEM lab setups.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-base font-bold text-slate-900">{inq.institution_name}</h3>
                          <p className="text-xs text-slate-600">
                            Contact: <strong>{inq.contact_name}</strong> • Phone: <a href={`tel:${inq.contact_phone}`} className="text-blue-600 font-mono">{inq.contact_phone}</a> • Email: <a href={`mailto:${inq.contact_email}`} className="text-blue-600">{inq.contact_email}</a>
                          </p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">
                            City: {inq.city} • Est. Students: {inq.student_count || 300}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={inq.status || "new"}
                            onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:border-blue-600"
                          >
                            <option value="new">New Lead</option>
                            <option value="contacted">Contacted</option>
                            <option value="proposal_sent">Proposal Sent</option>
                            <option value="converted">Converted Partner</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      </div>

                      {inq.message && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 italic">
                          &quot;{inq.message}&quot;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 8: USER DIRECTORY & ROLES */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Platform User Registry &amp; Roles</h2>
                    <p className="text-xs text-slate-500">Manage user accounts and administrative role assignments.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {users.map((u) => (
                    <div key={u.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-slate-900">{u.full_name || "User"}</h4>
                        <p className="text-xs text-slate-500 font-mono">{u.email}</p>
                        <p className="text-[11px] text-slate-400">{u.school_college_name || "—"} {u.grade_level ? `• ${u.grade_level}` : ""}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Role:</span>
                        <select
                          value={u.role || "student"}
                          onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:border-blue-600"
                        >
                          <option value="student">Student Learner</option>
                          <option value="parent">Parent / Guardian</option>
                          <option value="school">School Coordinator</option>
                          <option value="college">College Innovator</option>
                          <option value="admin">Staff Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 9: HACKATHONS */}
            {activeTab === "competitions" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">National STEM Hackathons</h2>
                    <p className="text-xs text-slate-500">Configure hackathon challenges, deadlines, and prize pools.</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-xs font-bold uppercase">
                      ACTIVE SPRINT
                    </span>
                    <span className="text-sm font-extrabold font-mono text-blue-600">
                      ₹{DEMO_HACKATHON.prize_pool_inr.toLocaleString("en-IN")} Prize Pool
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{DEMO_HACKATHON.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{DEMO_HACKATHON.description}</p>

                  <div className="pt-4 border-t border-slate-100 grid md:grid-cols-3 gap-3">
                    {DEMO_HACKATHON.problem_statements.map((ps) => (
                      <div key={ps.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">Challenge {ps.id.toUpperCase()}</span>
                        <h4 className="text-xs font-bold text-slate-900">{ps.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{ps.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* MODAL 1: CREATE COURSE */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateCourse} className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New STEM Batch</h3>
              <button type="button" onClick={() => setShowCourseModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase">Batch Title</label>
                <input
                  type="text"
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="e.g. Autonomous ROS Robotics Pro Batch"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase">Description</label>
                <textarea
                  required
                  rows={3}
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Course overview and physical builds..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Class Stage</label>
                  <select
                    value={newCourse.learningPathId}
                    onChange={(e) => setNewCourse({ ...newCourse, learningPathId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="explorer">Class 5–7 (Explorer)</option>
                    <option value="builder">Class 8–10 (Builder)</option>
                    <option value="creator">Class 11–12 (Creator)</option>
                    <option value="engineer">College / B.Tech (Engineer)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Duration</label>
                  <input
                    type="text"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase">Skills Covered (comma separated)</label>
                <input
                  type="text"
                  value={newCourse.skills}
                  onChange={(e) => setNewCourse({ ...newCourse, skills: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCourseModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
              >
                Publish Batch
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: ADD HARDWARE KIT */}
      {showKitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateKit} className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Hardware Starter Kit</h3>
              <button type="button" onClick={() => setShowKitModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase">Kit Name</label>
                <input
                  type="text"
                  required
                  value={newKit.name}
                  onChange={(e) => setNewKit({ ...newKit, name: e.target.value })}
                  placeholder="e.g. Advanced ESP32 Drone Builder Kit"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase">Description</label>
                <textarea
                  required
                  rows={2}
                  value={newKit.description}
                  onChange={(e) => setNewKit({ ...newKit, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newKit.price}
                    onChange={(e) => setNewKit({ ...newKit, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={newKit.stockCount}
                    onChange={(e) => setNewKit({ ...newKit, stockCount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowKitModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
              >
                Add SKU to Catalog
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: ISSUE CERTIFICATE */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleIssueCustomCert} className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Issue Verifiable Certificate</h3>
              <button type="button" onClick={() => setShowCertModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Certificate ID</label>
                  <input
                    type="text"
                    required
                    value={newCert.id}
                    onChange={(e) => setNewCert({ ...newCert, id: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-blue-600 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Student Name</label>
                  <input
                    type="text"
                    required
                    value={newCert.studentName}
                    onChange={(e) => setNewCert({ ...newCert, studentName: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase">Program / Course Name</label>
                <input
                  type="text"
                  required
                  value={newCert.programName}
                  onChange={(e) => setNewCert({ ...newCert, programName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase">Achievement Summary</label>
                <textarea
                  required
                  rows={2}
                  value={newCert.achievement}
                  onChange={(e) => setNewCert({ ...newCert, achievement: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase">Verified Skills (comma separated)</label>
                <input
                  type="text"
                  value={newCert.skillsVerified}
                  onChange={(e) => setNewCert({ ...newCert, skillsVerified: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCertModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
              >
                Mint &amp; Activate
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
