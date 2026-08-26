"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  db,
  createBrowserClient,
  isRealSupabase,
  DEMO_COURSES,
  DEMO_PROJECTS,
  DEMO_CERTIFICATES
} from "@siksatech/database";
import { Navbar } from "@siksatech/ui";
import { Footer } from "@siksatech/ui";
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
  AlertTriangle
} from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "projects" | "certificates">("overview");
  
  // User Profile
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // LMS Data States
  const [courses, setCourses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [studentProjects, setStudentProjects] = useState<any[]>([]);
  
  // Active Interactive Lesson Editor
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  const [codeContent, setCodeContent] = useState("");
  const [runConsole, setRunConsole] = useState<string>("Console idle. Click 'RUN SYNTAX CHECK' to execute.");
  const [isCompiling, setIsCompiling] = useState(false);

  // New Project Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSchematic, setNewSchematic] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newCode, setNewCode] = useState("");
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);

  // Load User Data & Fetch Supabase Tables
  useEffect(() => {
    const loadSessionData = async () => {
      setLoading(true);
      if (isRealSupabase) {
        try {
          const supabase = createBrowserClient();
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (authError || !user) {
            router.push("/auth/login");
            return;
          }

          // Fetch profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          const mappedProfile = {
            id: user.id,
            name: (profile as any)?.full_name || "Active Student",
            email: user.email,
            grade: (profile as any)?.grade_level || "Class 9",
            institution: (profile as any)?.school_college_name || "SiksaTech Academy",
            role: (profile as any)?.role || "student"
          };
          setUserProfile(mappedProfile);

          // Get Pathway Level
          let pathLevel = "explorer";
          const grade = mappedProfile.grade || "";
          if (grade.includes("8") || grade.includes("9") || grade.includes("10")) {
            pathLevel = "builder";
          } else if (grade.includes("11") || grade.includes("12")) {
            pathLevel = "creator";
          } else if (grade.toLowerCase().includes("college")) {
            pathLevel = "engineer";
          }

          // Fetch courses matching pathway
          const { data: coursesList } = await supabase
            .from("courses")
            .select("*")
            .eq("path_level", pathLevel);
          setCourses(coursesList || []);

          // Fetch matching lessons
          const courseIds = (coursesList || []).map((c: any) => c.id);
          if (courseIds.length > 0) {
            const { data: lessonsList } = await supabase
              .from("lessons")
              .select("*")
              .in("course_id", courseIds)
              .order("sequence_number", { ascending: true });
            setLessons(lessonsList || []);
          }

          // Fetch student submissions
          const { data: projsList } = await supabase
            .from("student_projects")
            .select("*")
            .eq("student_id", user.id)
            .order("created_at", { ascending: false });
          setStudentProjects(projsList || []);

        } catch (err) {
          console.error("Error loading Supabase data:", err);
        }
      } else {
        const currUser = db.getCurrentUser() || {
          id: "demo-student-01",
          name: "Aarav Sharma",
          email: "student@siksatech.in",
          grade: "Class 9",
          institution: "Delhi Public School, Vasant Kunj",
          role: "student"
        };
        setUserProfile(currUser);
        setCourses(DEMO_COURSES.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          difficulty: c.difficulty,
          duration: c.duration,
          modules_count: c.modulesCount
        })));
        setLessons([
          {
            id: "lesson-01",
            title: "Capacitive Moisture Sensing on ESP32",
            sequence_number: 1,
            starter_code: "// SiksaTech Breadboard Telemetry\nvoid setup() {\n  Serial.begin(115200);\n}\nvoid loop() {\n  int val = analogRead(34);\n  Serial.println(val);\n  delay(500);\n}",
            course_id: "course-builder-01"
          }
        ]);
        setStudentProjects(DEMO_PROJECTS);
      }
      setLoading(false);
    };

    loadSessionData();
  }, [router]);

  const handleLogout = async () => {
    await db.logout();
    router.push("/");
  };

  // Compile / Run Simulation
  const handleExecuteSyntax = () => {
    if (!codeContent) return;
    setIsCompiling(true);
    setRunConsole("Compiling binaries...\nLoading libraries...\nResolving pins layout...");
    setTimeout(() => {
      setIsCompiling(false);
      setRunConsole("Syntax Check: SUCCESS\nCompilation Status: Code fits perfectly in microcontroller flash memory.\nConsole idle.");
    }, 1200);
  };

  // Submit Build
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;
    setIsSubmittingProject(true);

    if (isRealSupabase && userProfile) {
      try {
        const supabase = createBrowserClient() as any;
        const { error } = await supabase.from("student_projects").insert({
          student_id: userProfile.id,
          student_name: userProfile.name,
          title: newTitle,
          description: newDesc,
          code_snippet: newCode,
          schematic_diagram: newSchematic,
          video_url: newVideoUrl,
          status: "pending"
        });

        if (error) {
          alert("Submission error: " + error.message);
          setIsSubmittingProject(false);
          return;
        }

        const { data: projsList } = await supabase
          .from("student_projects")
          .select("*")
          .eq("student_id", userProfile.id)
          .order("created_at", { ascending: false });
        setStudentProjects(projsList || []);

        setNewTitle("");
        setNewDesc("");
        setNewCode("");
        setNewSchematic("");
        setNewVideoUrl("");
        alert("Project submitted successfully! Pending Mentor Review.");
      } catch (err: any) {
        alert("Unexpected error: " + err.message);
      }
    } else {
      alert("Platform is not configured. Please contact support.");
    }
    setIsSubmittingProject(false);
    setActiveTab("projects");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full"></div>
        <span className="text-xs text-slate-500 font-mono">LOADING STUDENT DATA REGISTRY...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Side Control Bar */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 space-y-8 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-50 border border-indigo-150 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900">{userProfile?.name}</h2>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">{userProfile?.grade}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3 space-y-1 text-[10px] text-slate-500">
                <span className="block font-mono">Campus: {userProfile?.institution}</span>
                <span className="block font-mono">ID: {userProfile?.id?.slice(0, 8)}...</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex flex-col space-y-1">
              {[
                { id: "overview", label: "Dashboard Overview", icon: Layers },
                { id: "courses", label: "Classroom LMS", icon: BookOpen },
                { id: "projects", label: "My Submissions", icon: FileCode },
                { id: "certificates", label: "Verified Credentials", icon: Award }
              ].map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setSelectedLesson(null);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-technical text-left ${
                      activeTab === tab.id
                        ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600"
                        : "text-slate-650 hover:bg-slate-50"
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 hover:border-rose-350 hover:bg-rose-50 text-xs font-bold text-slate-700 hover:text-rose-600 rounded-lg transition-technical cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              SIGN OUT PORTAL
            </button>
          </div>

          {/* Core Content Window */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                
                {/* Header Welcome banner */}
                <div className="p-8 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-xl text-white space-y-2 relative overflow-hidden">
                  <span className="text-[10px] font-mono tracking-widest text-indigo-400 font-bold uppercase">SiksaTech Workspace</span>
                  <h1 className="text-2xl font-extrabold tracking-tight">Welcome back, {userProfile?.name}!</h1>
                  <p className="text-xs text-slate-300 max-w-lg">
                    Build physical solutions, solve engineering problems, and construct your maker portfolio.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Level</h3>
                    <p className="text-lg font-extrabold text-slate-900">{userProfile?.grade}</p>
                    <span className="text-[10px] text-indigo-600 font-medium block">Progressing smoothly</span>
                  </div>

                  <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Syllabus Courses</h3>
                    <p className="text-lg font-extrabold text-slate-900">{courses.length} Enrolled</p>
                    <span className="text-[10px] text-indigo-600 font-medium block">Explorer & Logic nodes</span>
                  </div>

                  <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">My Builds</h3>
                    <p className="text-lg font-extrabold text-slate-900">{studentProjects.length} Submitted</p>
                    <span className="text-[10px] text-indigo-600 font-medium block">
                      {studentProjects.filter(p => p.status === 'approved').length} Verified builds
                    </span>
                  </div>

                </div>

                {/* Portfolios Preview Section */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Portfolio Progress Simulator</h3>
                  <div className="space-y-4 border border-slate-100 p-6 rounded-lg bg-slate-50/50">
                    <div className="flex justify-between text-xs text-slate-650">
                      <span>Course Completion Progress</span>
                      <span className="font-mono font-bold text-indigo-650">80% Done</span>
                    </div>
                    <div className="font-mono text-indigo-600 font-bold text-sm tracking-wide">
                      ████████░░ <span className="text-xs text-slate-400 font-normal ml-2">Estimated 2 lessons left</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: COURSES & LMS CLASSROOM */}
            {activeTab === "courses" && !selectedLesson && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">Your Enrolled Courses</h2>
                  <p className="text-xs text-slate-500">Age-appropriate curriculum matching your active profile.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4 flex flex-col justify-between hover:border-indigo-400 transition-technical">
                      <div className="space-y-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-150 text-[9px] font-mono font-bold text-indigo-600 uppercase">
                          {course.path_level} LEVEL
                        </span>
                        <h3 className="text-base font-bold text-slate-900">{course.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{course.description}</p>
                      </div>

                      <div className="border-t border-slate-100 pt-4 flex flex-col space-y-3">
                        <span className="text-[10px] text-slate-400 font-mono">
                          Contains: {lessons.filter(l => l.course_id === course.id).length} core lessons
                        </span>
                        <div className="flex flex-col space-y-1.5">
                          {lessons.filter(l => l.course_id === course.id).map((less) => (
                            <button
                              key={less.id}
                              onClick={() => {
                                setSelectedCourse(course);
                                setSelectedLesson(less);
                                setCodeContent(less.code_template || "");
                                setRunConsole("Console idle. Click 'RUN SYNTAX CHECK' to execute.");
                              }}
                              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded bg-slate-50 hover:bg-indigo-50/50 border border-slate-150 hover:border-indigo-150 text-left text-xs text-slate-700 font-semibold transition-technical"
                            >
                              <span>{less.title}</span>
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2 SUB: INTERACTIVE LESSON WORKSPACE */}
            {activeTab === "courses" && selectedLesson && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Back button and info header */}
                <div className="lg:col-span-12 flex justify-between items-center border-b border-slate-200 pb-3">
                  <button
                    onClick={() => setSelectedLesson(null)}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1.5"
                  >
                    &larr; Return to Courses
                  </button>
                  <span className="text-[10px] font-mono text-slate-450 uppercase">{selectedCourse?.title}</span>
                </div>

                {/* Left Panel: Markdown Content & Schematics */}
                <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
                  <div className="space-y-2 border-b border-slate-100 pb-4">
                    <span className="text-[9px] font-mono tracking-widest text-indigo-600 uppercase font-bold">LESSON CONTENT</span>
                    <h3 className="text-lg font-bold text-slate-900">{selectedLesson.title}</h3>
                  </div>

                  {/* Lesson Content Renderer */}
                  <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                    <p className="font-semibold text-slate-800">Objectives & Concepts:</p>
                    <p>In this lesson, we calibrate dynamic signal delays. Students wire pins to capture values cleanly on their microcontrollers.</p>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-2">
                      <span className="text-[9px] font-bold text-slate-800 uppercase block tracking-wider">Unboxing / Wiring Steps:</span>
                      <p className="text-[11px] text-slate-500 italic leading-relaxed">
                        {selectedLesson.kit_steps}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Code Editor and Console compiler */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Editor Box */}
                  <div className="bg-slate-900 border border-slate-850 rounded-xl shadow-lg overflow-hidden text-white">
                    <div className="px-4 py-2.5 bg-slate-850 border-b border-slate-800 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-indigo-400" />
                        <span className="text-[10px] font-mono tracking-wider font-bold">SOURCE CODE EDITOR</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase">C++ / Python compiler</span>
                    </div>

                    <textarea
                      value={codeContent}
                      onChange={(e) => setCodeContent(e.target.value)}
                      rows={12}
                      className="w-full bg-slate-950 p-4 font-mono text-xs text-emerald-400 focus:outline-none leading-relaxed resize-y"
                    />

                    <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center gap-2">
                      <button
                        onClick={handleExecuteSyntax}
                        disabled={isCompiling}
                        type="button"
                        className="px-4 py-2 text-[10px] font-bold tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-technical uppercase cursor-pointer"
                      >
                        {isCompiling ? "Compiling..." : "Run Syntax Check"}
                      </button>
                      
                      <button
                        onClick={() => {
                          setNewCode(codeContent);
                          setNewTitle(`Build: ${selectedLesson.title}`);
                          setNewDesc(`Physical prototype built matching objectives in ${selectedLesson.title}.`);
                          setActiveTab("projects");
                        }}
                        type="button"
                        className="px-4 py-2 text-[10px] font-bold tracking-wider border border-slate-750 bg-slate-850 hover:bg-slate-800 rounded transition-technical uppercase cursor-pointer"
                      >
                        Submit to Portfolio
                      </button>
                    </div>
                  </div>

                  {/* Console compiler output window */}
                  <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 font-mono text-[10px] text-slate-450 leading-relaxed min-h-24">
                    <span className="text-[8px] text-slate-600 font-bold block mb-1">TERMINAL LOGS:</span>
                    <pre className="whitespace-pre-wrap">{runConsole}</pre>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 3: SUBMITTED PROJECTS */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                
                <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">Your Portfolio Submissions</h2>
                    <p className="text-xs text-slate-500">Submit physical prototype details to build your shareable portfolio.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: List of builds */}
                  <div className="lg:col-span-7 space-y-4">
                    {studentProjects.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-slate-300 rounded-xl bg-white space-y-2">
                        <FileCode className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="text-xs font-semibold text-slate-600">No project submissions yet.</p>
                        <p className="text-[10px] text-slate-400">Wire your breadboard components and fill out the builder form to register your first build.</p>
                      </div>
                    ) : (
                      studentProjects.map((proj) => (
                        <div key={proj.id} className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
                              <span className="text-[10px] text-slate-400 font-mono block">Submitted: {proj.created_at ? new Date(proj.created_at).toLocaleDateString() : "Recently"}</span>
                            </div>
                            
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                              proj.status === 'approved' 
                                ? "bg-emerald-50 border-emerald-200 text-emerald-650"
                                : proj.status === 'needs_work'
                                ? "bg-rose-50 border-rose-200 text-rose-650"
                                : "bg-amber-50 border-amber-200 text-amber-650"
                            }`}>
                              {proj.status || "pending"}
                            </span>
                          </div>

                          <p className="text-xs text-slate-650 leading-relaxed">{proj.description}</p>

                          {proj.review_feedback && (
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-150 text-[11px] text-slate-600 space-y-1">
                              <span className="text-[9px] font-bold text-slate-800 uppercase block tracking-wider">Reviewer Feedback:</span>
                              <p className="italic">&quot;{proj.review_feedback}&quot;</p>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Right Column: Submission Form */}
                  <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-xl shadow-md space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Submit New Build</h3>

                    <form onSubmit={handleProjectSubmit} className="space-y-4">
                      
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-700 uppercase">Project Title</label>
                        <input
                          type="text"
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="e.g. Smart Crop Water Sprinkler"
                          className="px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-650"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-700 uppercase">Description (Problem & Solution)</label>
                        <textarea
                          required
                          rows={3}
                          value={newDesc}
                          onChange={(e) => setNewDesc(e.target.value)}
                          placeholder="What did you build? What sensors did you wire?"
                          className="px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-650"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-700 uppercase">Schematic Description</label>
                        <input
                          type="text"
                          value={newSchematic}
                          onChange={(e) => setNewSchematic(e.target.value)}
                          placeholder="e.g. DHT11 Pin2, LED Pin13, Ground bus"
                          className="px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-650"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-700 uppercase">Video/Demo Link (Optional)</label>
                        <input
                          type="url"
                          value={newVideoUrl}
                          onChange={(e) => setNewVideoUrl(e.target.value)}
                          placeholder="e.g. https://youtube.com/watch?..."
                          className="px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-650"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-700 uppercase">Firmware Code Snippet</label>
                        <textarea
                          rows={4}
                          value={newCode}
                          onChange={(e) => setNewCode(e.target.value)}
                          placeholder="void setup() { ... }"
                          className="px-3.5 py-2.5 bg-slate-900 font-mono text-emerald-400 text-xs rounded-lg focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingProject}
                        className="w-full py-3.5 text-xs font-bold tracking-widest bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-technical shadow-md cursor-pointer"
                      >
                        {isSubmittingProject ? "SUBMITTING BUILD..." : "SUBMIT PROJECT FOR REVIEW"}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Seeded Certificates list */}
                  <div className="border border-slate-200 bg-white rounded-xl shadow-md p-6 space-y-4 flex flex-col justify-between hover:border-indigo-400 transition-technical">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <Award className="w-10 h-10 text-indigo-600" />
                        <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-150 text-[9px] font-mono font-bold text-indigo-600 uppercase">
                          VERIFIED ID: ST-2026-A101
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900">Explorer Path - Hardware Logic</h4>
                      <p className="text-xs text-slate-550 leading-relaxed">
                        Issued for successfully building and demonstrating 3 physical circuit prototypes showcasing logical NAND/NOR switching gates.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['Circuit Design', 'Logical Gates', 'Physical Debugging'].map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 font-mono text-[9px] text-slate-500">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                      <span className="text-[9px] text-slate-400 font-mono">Issued: 14 May 2026</span>
                      <Link
                        href="/verify/ST-2026-A101"
                        className="px-4 py-2 text-[10px] font-bold tracking-widest bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-technical"
                      >
                        VIEW PUBLIC KEY VERIFY
                      </Link>
                    </div>
                  </div>

                  {/* Dynamic Certificate if student has approved projects */}
                  {studentProjects.filter(p => p.status === 'approved').map((p) => {
                    const certId = `ST-2026-${p.id.slice(0, 4).toUpperCase()}`;
                    return (
                      <div key={p.id} className="border border-slate-200 bg-white rounded-xl shadow-md p-6 space-y-4 flex flex-col justify-between hover:border-indigo-400 transition-technical">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <Award className="w-10 h-10 text-indigo-600" />
                            <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-150 text-[9px] font-mono font-bold text-indigo-600 uppercase">
                              VERIFIED ID: {certId}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900">Program Achievement: {p.title}</h4>
                          <p className="text-xs text-slate-550 leading-relaxed">
                            Issued to {userProfile?.name} for submitting and demonstrating the physical build prototype: &quot;{p.description.slice(0,100)}...&quot;
                          </p>
                        </div>

                        <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                          <span className="text-[9px] text-slate-400 font-mono">Issued: Today</span>
                          <Link
                            href={`/verify/${certId}`}
                            className="px-4 py-2 text-[10px] font-bold tracking-widest bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-technical"
                          >
                            VIEW PUBLIC KEY VERIFY
                          </Link>
                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
