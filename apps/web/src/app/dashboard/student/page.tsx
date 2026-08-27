"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  db,
  createBrowserClient,
  isRealSupabase,
  DEMO_COURSES,
  DEMO_PROJECTS,
  type Course
} from "@siksatech/database";
import { Navbar, Footer } from "@siksatech/ui";
import { 
  User, 
  BookOpen, 
  Terminal, 
  LogOut, 
  Layers, 
  Trophy, 
  Send, 
  CheckCircle,
  Play,
  Award,
  ChevronRight,
  Plus,
  ShieldCheck,
  FileCode,
  AlertTriangle,
  Edit3,
  Check,
  Sparkles,
  Save,
  X,
  Users,
  KeyRound,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  ExternalLink,
  Loader2
} from "lucide-react";
import { getStudentPendingParentLinks, approveParentLink, rejectParentLink } from "../../auth/actions";

interface EnrolledCourseCardData {
  id: string;
  title: string;
  difficulty: string;
  duration: string;
  modulesCount: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  progressPct: number;
}

interface IssuedCertificateData {
  id: string;
  studentName: string;
  programName: string;
  achievement: string;
  issuedDate: string;
  skillsVerified: string[];
}

function StudentDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "projects" | "certificates">("overview");
  
  // User Profile
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editGrade, setEditGrade] = useState("");
  const [editSchool, setEditSchool] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // LMS Data States
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourseCardData[]>([]);
  const [studentProjects, setStudentProjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<IssuedCertificateData[]>([]);
  const [pendingParentLinks, setPendingParentLinks] = useState<any[]>([]);
  const [processingLinkId, setProcessingLinkId] = useState<string | null>(null);
  const [linkActionMsg, setLinkActionMsg] = useState<string | null>(null);

  // New Project Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSchematic, setNewSchematic] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newCode, setNewCode] = useState("");
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);

  // Sync tab from search param if present
  useEffect(() => {
    if (tabParam && ["overview", "courses", "projects", "certificates"].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  // Load User Data & Fetch Real Enrolled Courses, Certificates & Submissions
  useEffect(() => {
    const loadSessionData = async () => {
      setLoading(true);
      let studentId = "student-1";
      let studentName = "Aarav Sharma";
      let grade = "Class 9";
      let school = "Delhi Public School";
      let siksaId = "ST-88219";

      if (isRealSupabase) {
        try {
          const supabase = createBrowserClient();
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (user) {
            studentId = user.id;
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", user.id)
              .maybeSingle();

            studentName = (profile as any)?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";
            grade = (profile as any)?.grade_level || "Class 9";
            school = (profile as any)?.school_college_name || "SiksaTech Academy";
            siksaId = (profile as any)?.siksa_id || "ST-88219";

            // Fetch Real Enrollments
            const { data: dbEnrollments } = await (supabase as any)
              .from("enrollments")
              .select("course_id, status, enrolled_at")
              .eq("user_id", user.id);

            // Fetch Real Lesson Progress
            const { data: dbProgress } = await (supabase as any)
              .from("lesson_progress")
              .select("course_id, lesson_id, is_completed")
              .eq("user_id", user.id)
              .eq("is_completed", true);

            // Fetch Real Projects
            const { data: projsList } = await supabase
              .from("student_projects")
              .select("*")
              .eq("student_id", user.id)
              .order("created_at", { ascending: false });
            if (projsList) setStudentProjects(projsList);

            // Fetch Real Certificates
            const { data: dbCerts } = await (supabase as any)
              .from("certificates")
              .select("*")
              .or(`user_id.eq.${user.id},student_name.eq.${studentName}`);
            
            if (dbCerts) {
              setCertificates(dbCerts.map((c: any) => ({
                id: c.id,
                studentName: c.student_name,
                programName: c.program_name,
                achievement: c.achievement,
                issuedDate: c.issued_date,
                skillsVerified: c.skills_verified || []
              })));
            }

            // Build enrolled courses list
            const activeCourseIds = (dbEnrollments || []).map((e: any) => e.course_id);
            const coursesData: EnrolledCourseCardData[] = activeCourseIds.map((cid: string) => {
              const meta = DEMO_COURSES.find((c) => c.id === cid) || {
                id: cid,
                title: cid.replace(/-/g, " ").toUpperCase(),
                difficulty: "Intermediate",
                duration: "8 Weeks",
                modulesCount: 3
              };
              const completedCount = (dbProgress || []).filter((p: any) => p.course_id === cid).length;
              const totalLessons = 6;
              const pct = Math.min(100, Math.round((completedCount / totalLessons) * 100));

              return {
                id: cid,
                title: meta.title,
                difficulty: meta.difficulty,
                duration: meta.duration,
                modulesCount: meta.modulesCount || 3,
                completedLessonsCount: completedCount,
                totalLessonsCount: totalLessons,
                progressPct: pct
              };
            });

            setEnrolledCourses(coursesData);

            // Load pending parent link requests
            try {
              const requests = await getStudentPendingParentLinks();
              setPendingParentLinks(requests || []);
            } catch (linkErr) {
              console.warn("Could not load pending parent links:", linkErr);
            }
          }
        } catch (err) {
          console.error("Error loading Supabase data:", err);
        }
      } else {
        // Local Client Storage Fallback
        const localEnrolledIds: string[] = JSON.parse(localStorage.getItem("siksatech_enrolled_courses") || "[]");
        
        // If local user has enrolled courses
        const coursesData: EnrolledCourseCardData[] = (localEnrolledIds.length > 0 ? localEnrolledIds : ["builder-arduino-embedded"]).map((cid) => {
          const meta = DEMO_COURSES.find((c) => c.id === cid) || {
            id: cid,
            title: cid.replace(/-/g, " ").toUpperCase(),
            difficulty: "Intermediate",
            duration: "8 Weeks",
            modulesCount: 3
          };
          const localDone: string[] = JSON.parse(localStorage.getItem(`siksatech_progress_${cid}`) || "[]");
          const totalLessons = 6;
          const completedCount = localDone.length;
          const pct = Math.min(100, Math.round((completedCount / totalLessons) * 100));

          return {
            id: cid,
            title: meta.title,
            difficulty: meta.difficulty,
            duration: meta.duration,
            modulesCount: meta.modulesCount || 3,
            completedLessonsCount: completedCount,
            totalLessonsCount: totalLessons,
            progressPct: pct > 0 ? pct : 35
          };
        });

        setEnrolledCourses(coursesData);

        // Local Certificates
        const locallyIssued: IssuedCertificateData[] = JSON.parse(
          localStorage.getItem("siksatech_issued_certificates") || "[]"
        );
        setCertificates(locallyIssued);

        // Local Projects
        setStudentProjects(DEMO_PROJECTS);
      }

      setUserProfile({
        id: studentId,
        name: studentName,
        email: "student@siksatech.in",
        grade,
        institution: school,
        siksa_id: siksaId
      });
      setEditName(studentName);
      setEditGrade(grade);
      setEditSchool(school);
      setLoading(false);
    };

    loadSessionData();
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    if (isRealSupabase && userProfile?.id) {
      try {
        const supabase = createBrowserClient() as any;
        await supabase
          .from("profiles")
          .update({
            full_name: editName,
            grade_level: editGrade,
            school_college_name: editSchool,
            updated_at: new Date().toISOString()
          })
          .eq("id", userProfile.id);
      } catch (err) {
        console.error("Profile update error:", err);
      }
    }
    setUserProfile((prev: any) => ({
      ...prev,
      name: editName,
      grade: editGrade,
      institution: editSchool
    }));
    setEditingProfile(false);
    setIsSavingProfile(false);
  };

  const handleLogout = async () => {
    if (isRealSupabase) {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
    }
    await db.logout();
    router.push("/");
  };

  // Submit Project Build
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;
    setIsSubmittingProject(true);

    const newProjItem = {
      id: `proj-${Date.now()}`,
      student_id: userProfile?.id || "student-1",
      student_name: userProfile?.name || "Aarav Sharma",
      title: newTitle,
      description: newDesc,
      code_snippet: newCode,
      schematic_diagram: newSchematic,
      video_url: newVideoUrl,
      status: "pending",
      created_at: new Date().toISOString()
    };

    if (isRealSupabase && userProfile) {
      try {
        const supabase = createBrowserClient() as any;
        await supabase.from("student_projects").insert(newProjItem);
      } catch (err) {
        console.error("Project submit error:", err);
      }
    }

    setStudentProjects((prev) => [newProjItem, ...prev]);
    setNewTitle("");
    setNewDesc("");
    setNewCode("");
    setNewSchematic("");
    setNewVideoUrl("");
    setIsSubmittingProject(false);
  };

  const handleApproveParent = async (linkId: string) => {
    setProcessingLinkId(linkId);
    setLinkActionMsg(null);
    const res = await approveParentLink(linkId);
    if (res.success) {
      setPendingParentLinks((prev) => prev.filter((p) => p.id !== linkId));
      setLinkActionMsg("Parent link approved successfully! Your parent can now view your learning progress.");
    } else {
      setLinkActionMsg("Failed to approve link: " + (res.error || "Unknown error"));
    }
    setProcessingLinkId(null);
  };

  const handleRejectParent = async (linkId: string) => {
    setProcessingLinkId(linkId);
    setLinkActionMsg(null);
    const res = await rejectParentLink(linkId);
    if (res.success) {
      setPendingParentLinks((prev) => prev.filter((p) => p.id !== linkId));
      setLinkActionMsg("Parent link request declined.");
    } else {
      setLinkActionMsg("Failed to decline link: " + (res.error || "Unknown error"));
    }
    setProcessingLinkId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center space-x-2">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
        <span className="text-xs text-slate-500 font-mono">LOADING STUDENT WORKSPACE...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Side Control Bar */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-lg">
                  {userProfile?.name?.charAt(0) || "S"}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 leading-tight">{userProfile?.name}</h2>
                  <span className="text-[10px] text-blue-600 font-mono font-bold tracking-wider uppercase block">{userProfile?.grade}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3 space-y-1 text-xs text-slate-500">
                <span className="block font-sans">{userProfile?.institution}</span>
                <span className="block font-mono text-[11px]">Siksa ID: <strong className="text-blue-600 font-bold">{userProfile?.siksa_id}</strong></span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex flex-col space-y-1">
              {[
                { id: "overview", label: "Dashboard Overview", icon: Layers },
                { id: "courses", label: "Enrolled Batches", icon: BookOpen, count: enrolledCourses.length },
                { id: "projects", label: "My Maker Builds", icon: FileCode, count: studentProjects.length },
                { id: "certificates", label: "Verified Credentials", icon: Award, count: certificates.length }
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-xs"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <TabIcon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-xs font-bold text-slate-700 hover:text-rose-600 rounded-2xl transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Core Content Window */}
          <div className="lg:col-span-9 space-y-6">

            {/* Pending Parent Link Requests Notification Banner */}
            {linkActionMsg && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
                <span>{linkActionMsg}</span>
              </div>
            )}

            {pendingParentLinks.map((req) => (
              <div
                key={req.id}
                className="p-6 rounded-3xl border-2 border-blue-500/40 bg-white shadow-sm space-y-4 animate-in fade-in"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-blue-600 font-bold uppercase block">
                        Parent / Guardian Link Request
                      </span>
                      <h3 className="font-bold text-sm text-slate-900">
                        {req.parentName} {req.parentSiksaId ? `(ID: ${req.parentSiksaId})` : ""}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Requested to link with your student account to monitor your course progress and certificates.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center self-start sm:self-center shrink-0">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Your 6-Digit Code</span>
                    <span className="text-lg font-mono font-extrabold text-blue-600 tracking-widest">{req.otpCode}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleApproveParent(req.id)}
                    disabled={processingLinkId === req.id}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-60 cursor-pointer shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {processingLinkId === req.id ? "Approving..." : "Approve & Link Parent"}
                  </button>
                  <button
                    onClick={() => handleRejectParent(req.id)}
                    disabled={processingLinkId === req.id}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all disabled:opacity-60 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    Decline Request
                  </button>
                </div>
              </div>
            ))}
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                
                {/* Header Welcome banner */}
                <div className="p-8 bg-white border border-slate-200 rounded-3xl text-slate-900 space-y-3 relative shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest text-blue-600 font-bold uppercase">
                        STUDENT MAKER WORKSPACE
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        Welcome back, {userProfile?.name}!
                      </h1>
                      <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
                        Track your hands-on circuit builds, complete lesson modules, and prepare for your verifiable certification exam.
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingProfile((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all self-start sm:self-center cursor-pointer shrink-0"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      {editingProfile ? "Close Editor" : "Edit Profile"}
                    </button>
                  </div>
                </div>

                {/* Profile Edit Card (Conditional) */}
                {editingProfile && (
                  <form onSubmit={handleSaveProfile} className="bg-white border border-blue-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-blue-600" />
                        Update Profile Information
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingProfile(false)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-slate-700">Full Name</label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-slate-700">Academic Grade</label>
                        <select
                          value={editGrade}
                          onChange={(e) => setEditGrade(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-600"
                        >
                          <option value="Class 5">Class 5</option>
                          <option value="Class 6">Class 6</option>
                          <option value="Class 7">Class 7</option>
                          <option value="Class 8">Class 8</option>
                          <option value="Class 9">Class 9</option>
                          <option value="Class 10">Class 10</option>
                          <option value="Class 11">Class 11</option>
                          <option value="Class 12">Class 12</option>
                          <option value="College">College / Engineering</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-slate-700">School / College</label>
                        <input
                          type="text"
                          value={editSchool}
                          onChange={(e) => setEditSchool(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingProfile(false)}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {isSavingProfile ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                )}

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-1">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Level</h3>
                    <p className="text-xl font-extrabold text-slate-900">{userProfile?.grade}</p>
                    <span className="text-xs text-emerald-600 font-medium block">✓ Active Student Enrollment</span>
                  </div>

                  <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-1">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrolled Batches</h3>
                    <p className="text-xl font-extrabold text-blue-600">{enrolledCourses.length} Active Tracks</p>
                    <span className="text-xs text-slate-500 font-medium block">Hardware + Live Labs</span>
                  </div>

                  <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-1">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Credentials</h3>
                    <p className="text-xl font-extrabold text-purple-600">{certificates.length} Issued</p>
                    <span className="text-xs text-slate-500 font-medium block">Cryptographically Verified</span>
                  </div>
                </div>

                {/* Active Courses Quick List */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Your Active Courses</h3>
                    <button
                      onClick={() => setActiveTab("courses")}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      View All Batches &rarr;
                    </button>
                  </div>

                  {enrolledCourses.length > 0 ? (
                    <div className="space-y-3">
                      {enrolledCourses.map((c) => (
                        <div key={c.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                            <p className="text-xs text-slate-500">{c.duration} • {c.difficulty} Level</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-xs font-bold font-mono text-blue-600">{c.progressPct}% Done</span>
                              <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${c.progressPct}%` }} />
                              </div>
                            </div>
                            <Link
                              href={`/learn/${c.id}/les-1`}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
                            >
                              Continue &rarr;
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                      <p className="text-xs text-slate-500">You haven&apos;t enrolled in any tracks yet.</p>
                      <Link
                        href="/learn"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
                      >
                        Explore STEM Batches for {userProfile?.grade} &rarr;
                      </Link>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: ENROLLED COURSES */}
            {activeTab === "courses" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Enrolled Batches &amp; Curriculum</h2>
                    <p className="text-xs text-slate-500">Continue your interactive lessons and practical circuit tests.</p>
                  </div>
                  <Link
                    href="/learn"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md"
                  >
                    + Enroll More Batches
                  </Link>
                </div>

                {enrolledCourses.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {enrolledCourses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                              {course.difficulty}
                            </span>
                            <span className="text-xs font-mono font-bold text-blue-600">{course.progressPct}%</span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900">{course.title}</h3>
                          
                          {/* Progress Bar */}
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all duration-500"
                              style={{ width: `${course.progressPct}%` }}
                            />
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs text-slate-500 font-mono">{course.duration}</span>
                          <Link
                            href={`/learn/${course.id}/les-1`}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
                          >
                            Open Lab &rarr;
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-900">No Batches Enrolled Yet</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Enroll in your first hardware track to receive your physical STEM lab kit and start learning.
                      </p>
                    </div>
                    <Link
                      href="/learn"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md"
                    >
                      Browse All Batches &rarr;
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PROJECTS / SUBMISSIONS */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">My Maker Submissions</h2>
                    <p className="text-xs text-slate-500">Showcase your working prototypes and receive mentor reviews.</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-6">
                  {/* Left: Project List */}
                  <div className="lg:col-span-7 space-y-4">
                    {studentProjects.length > 0 ? (
                      studentProjects.map((p) => (
                        <div key={p.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                            <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${
                              p.status === "verified" || p.status === "approved"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}>
                              {p.status === "verified" || p.status === "approved" ? "✓ Verified" : "⏳ Review Pending"}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>

                          {p.mentor_feedback && (
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                              <span className="font-bold text-slate-900 block">Mentor Feedback:</span>
                              <p className="italic">&quot;{p.mentor_feedback}&quot;</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
                        <FileCode className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="text-xs text-slate-500">No project builds submitted yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Submission Form */}
                  <div className="lg:col-span-5 bg-white border border-slate-200 p-6 sm:p-7 rounded-3xl shadow-sm space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Submit New Build</h3>

                    <form onSubmit={handleProjectSubmit} className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-700 uppercase">Project Title</label>
                        <input
                          type="text"
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="e.g. Smart Crop Water Sprinkler"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-700 uppercase">Description (Problem &amp; Solution)</label>
                        <textarea
                          required
                          rows={3}
                          value={newDesc}
                          onChange={(e) => setNewDesc(e.target.value)}
                          placeholder="What did you build? What sensors did you wire?"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-700 uppercase">Schematic Description</label>
                        <input
                          type="text"
                          value={newSchematic}
                          onChange={(e) => setNewSchematic(e.target.value)}
                          placeholder="e.g. DHT11 Pin 2, LED Pin 13"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingProject}
                        className="w-full py-3 text-xs font-bold tracking-wider uppercase bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        {isSubmittingProject ? "Submitting..." : "Submit Project for Review"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CERTIFICATES & CREDENTIALS */}
            {activeTab === "certificates" && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">Your Verified Credentials</h2>
                  <p className="text-xs text-slate-500">Cryptographically verifiable evidence of your hardware build achievements.</p>
                </div>

                {certificates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="border border-slate-200 bg-white rounded-3xl shadow-sm p-6 sm:p-7 space-y-4 flex flex-col justify-between hover:border-blue-300 transition-all"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                              <Award className="w-6 h-6" />
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-mono font-bold text-emerald-700 uppercase">
                              {cert.id}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900">{cert.programName}</h3>
                          
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {cert.achievement}
                          </p>

                          {cert.skillsVerified && cert.skillsVerified.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {cert.skillsVerified.map((s, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 font-mono text-[10px] text-slate-600">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-mono">Issued: {cert.issuedDate}</span>
                          <Link
                            href={`/verify/${cert.id}`}
                            className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-xs flex items-center gap-1"
                          >
                            Verify &amp; Print <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
                    <Award className="w-12 h-12 text-slate-300 mx-auto" />
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-900">No Certificates Earned Yet</h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                        Complete all lesson modules in an enrolled track and pass the final assessment with a score of 75% or higher to earn your verifiable SiksaTech credential.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("courses")}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
                    >
                      Go to Enrolled Batches &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center space-x-2">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
        <span className="text-xs text-slate-500 font-mono">LOADING STUDENT DATA REGISTRY...</span>
      </div>
    }>
      <StudentDashboardContent />
    </Suspense>
  );
}
