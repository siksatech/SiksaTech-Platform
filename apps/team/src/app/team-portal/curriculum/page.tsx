"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, isRealSupabase } from "@siksatech/database";
import { Navbar } from "@siksatech/ui";
import { Footer } from "@siksatech/ui";
import { 
  Users, 
  FolderOpen, 
  BookOpen, 
  Package, 
  LogOut, 
  Plus, 
  ChevronRight, 
  Compass, 
  Terminal,
  Loader2
} from "lucide-react";

export default function CurriculumEditor() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Lesson form state
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [newLessonId, setNewLessonId] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newKitSteps, setNewKitSteps] = useState("");
  const [newTemplate, setNewTemplate] = useState("");
  const [seqNumber, setSeqNumber] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCurriculumData = async () => {
    setLoading(true);
    if (isRealSupabase && supabase) {
      try {
        const { data: coursesList } = await supabase.from("courses").select("*");
        setCourses(coursesList || []);

        const { data: lessonsList } = await supabase
          .from("lessons")
          .select("*")
          .order("sequence_number", { ascending: true });
        setLessons(lessonsList || []);

        if (coursesList && coursesList.length > 0) {
          setSelectedCourseId(coursesList[0].id);
        }
      } catch (err) {
        console.error("Error loading curriculum:", err);
      }
    } else {
      setCourses([]);
      setLessons([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCurriculumData();
  }, []);

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonId || !newTitle || !selectedCourseId) return;
    setIsSubmitting(true);

    if (isRealSupabase && supabase) {
      try {
        const { error } = await supabase.from("lessons").insert({
          id: newLessonId,
          course_id: selectedCourseId,
          title: newTitle,
          content: newContent || "# Draft Lesson Content",
          kit_steps: newKitSteps || "Default wiring steps.",
          code_template: newTemplate,
          sequence_number: Number(seqNumber)
        });

        if (error) {
          alert("Error adding lesson: " + error.message);
        } else {
          alert("Lesson added successfully to database!");
          setNewLessonId("");
          setNewTitle("");
          setNewContent("");
          setNewKitSteps("");
          setNewTemplate("");
          await fetchCurriculumData();
        }
      } catch (err: any) {
        alert("Unexpected error: " + err.message);
      }
    } else {
      alert("Platform is not configured. Please contact support.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-rose-600 font-bold uppercase bg-rose-50 px-2 py-0.5 rounded">
                INTERNAL NETWORK
              </span>
              <h2 className="text-base font-extrabold tracking-tight text-slate-900">team.siksatech.in</h2>
              <span className="text-[10px] text-slate-400 block font-mono">Curriculum Desk</span>
            </div>

            <nav className="flex flex-col space-y-1">
              <Link
                href="/team-portal"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold text-slate-650 hover:bg-slate-50 text-left transition-technical"
              >
                <Users className="w-4 h-4 text-slate-400" />
                Leads Pipeline
              </Link>
              
              <Link
                href="/team-portal/reviews"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold text-slate-650 hover:bg-slate-50 text-left transition-technical"
              >
                <FolderOpen className="w-4 h-4 text-slate-400" />
                Portfolio Reviews
              </Link>

              <Link
                href="/team-portal/curriculum"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600 text-left transition-technical"
              >
                <BookOpen className="w-4 h-4" />
                Curriculum Editor
              </Link>

              <Link
                href="/team-portal/inventory"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold text-slate-650 hover:bg-slate-50 text-left transition-technical"
              >
                <Package className="w-4 h-4 text-slate-400" />
                Kits Stock Manager
              </Link>
            </nav>

            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 hover:border-rose-350 hover:bg-rose-50 text-xs font-bold text-slate-700 hover:text-rose-600 rounded-lg transition-technical cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              EXIT OPERATIONS
            </button>
          </div>

          {/* Curriculum Workspace */}
          <div className="lg:col-span-9 space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Syllabus List */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Active Curriculum Syllabus</h3>
                  <p className="text-xs text-slate-500 font-mono">Overview of live courses and associated lesson sequences.</p>
                </div>

                {loading ? (
                  <div className="text-center py-10 space-x-2 flex justify-center items-center">
                    <Loader2 className="w-4 h-4 text-indigo-655 animate-spin" />
                    <span className="text-xs text-slate-500 font-mono">LOADING SYLLABUS...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {courses.map((course) => (
                      <div key={course.id} className="border border-slate-100 p-5 rounded-lg bg-slate-50/50 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-slate-800 uppercase">{course.title}</h4>
                          <span className="text-[9px] font-mono text-slate-400 font-bold">{course.id}</span>
                        </div>
                        <div className="space-y-1">
                          {lessons.filter(l => l.course_id === course.id).length === 0 ? (
                            <span className="text-[10px] text-slate-450 italic block">No lessons added to this course node.</span>
                          ) : (
                            lessons.filter(l => l.course_id === course.id).map((less) => (
                              <div key={less.id} className="flex justify-between items-center text-xs bg-white p-2 rounded border border-slate-150 font-medium">
                                <span>{less.sequence_number}. {less.title}</span>
                                <span className="text-[9px] font-mono text-slate-400">{less.id}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Add Lesson Form */}
              <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-xl shadow-md space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Add Pathway Lesson</h3>

                <form onSubmit={handleAddLesson} className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-700 uppercase">Target Course</label>
                    <select
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-700 uppercase">Lesson Reference ID</label>
                      <input
                        type="text"
                        required
                        value={newLessonId}
                        onChange={(e) => setNewLessonId(e.target.value)}
                        placeholder="e.g. builder-l3"
                        className="px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-700 uppercase">Sequence Number</label>
                      <input
                        type="number"
                        required
                        value={seqNumber}
                        onChange={(e) => setSeqNumber(Number(e.target.value))}
                        className="px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-700 uppercase">Lesson Title</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. LCD display setup"
                      className="px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-700 uppercase">Lesson Content (Markdown)</label>
                    <textarea
                      rows={3}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="# Heading\nLesson guidelines..."
                      className="px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-700 uppercase">Unboxing & Hardware steps</label>
                    <textarea
                      rows={2}
                      value={newKitSteps}
                      onChange={(e) => setNewKitSteps(e.target.value)}
                      placeholder="Wire sensor pin A to Uno Pin 5..."
                      className="px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-700 uppercase">Code Template</label>
                    <textarea
                      rows={3}
                      value={newTemplate}
                      onChange={(e) => setNewTemplate(e.target.value)}
                      placeholder="void setup() {}"
                      className="px-3.5 py-2.5 bg-slate-900 font-mono text-emerald-450 text-xs rounded-lg focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 text-xs font-bold tracking-widest bg-indigo-600 hover:bg-indigo-750 text-white rounded-lg transition-technical shadow-md cursor-pointer"
                  >
                    {isSubmitting ? "ADDING LESSON..." : "PUBLISH LESSON"}
                  </button>
                </form>
              </div>

            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
