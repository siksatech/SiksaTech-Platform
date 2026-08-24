"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, isRealSupabase } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Users, 
  FolderOpen, 
  BookOpen, 
  Package, 
  LogOut, 
  CheckCircle, 
  AlertTriangle, 
  FileCode, 
  Compass, 
  Terminal, 
  Award,
  Loader2
} from "lucide-react";

export default function PortfolioReviews() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("pending");
  const [feedbackInput, setFeedbackInput] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    if (isRealSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from("student_projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error) {
          setSubmissions(data || []);
        }
      } catch (err) {
        console.error("Error loading submissions:", err);
      }
    } else {
      // Mock submissions
      const mockSubmits = [
        { 
          id: "sub-101", 
          student_name: "Aditya Roy", 
          title: "Obstacle-Avoiding Robot Chassis", 
          description: "Wired an HC-SR04 ultrasonic distance sensor to trigger dual DC motor configurations.",
          code_snippet: "void loop() {\n  long d = getDistance();\n  if (d < 20) turnLeft();\n}",
          schematic_diagram: "Trig Pin 5, Echo Pin 6, Motor driver Pins 9-12",
          status: "pending",
          created_at: new Date().toISOString()
        }
      ];
      setSubmissions(mockSubmits);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleTriage = async (projId: string, name: string, title: string, status: string) => {
    const feedback = feedbackInput[projId] || "Build verified. Clean schematics alignment.";
    setProcessingId(projId);

    if (isRealSupabase && supabase) {
      try {
        // 1. Update Project Status
        const { error } = await supabase
          .from("student_projects")
          .update({ status: status, review_feedback: feedback })
          .eq("id", projId);

        if (error) {
          alert("Triage update failed: " + error.message);
          setProcessingId(null);
          return;
        }

        // 2. If approved, automatically create Certificate record
        if (status === "approved") {
          const certId = `ST-2026-${projId.slice(0, 4).toUpperCase()}`;
          const skills = ["Physical Engineering", "Firmware Calibration", "Sensors Interface"];
          
          const { error: certError } = await supabase
            .from("certificates")
            .upsert({
              id: certId,
              student_name: name,
              program_name: `Verification Path - ${title}`,
              achievement: `Issued for submitting and successfully demonstrating the build: "${title}".`,
              issued_date: new Date().toISOString().split('T')[0],
              skills_verified: skills
            });

          if (certError) {
            console.error("Certificate creation warning:", certError.message);
          } else {
            alert(`Project approved! Verifiable Certificate issued with ID: ${certId}`);
          }
        }

        await fetchSubmissions();
      } catch (err: any) {
        alert("Error triaging build: " + err.message);
      }
    } else {
      // Mock setup
      setSubmissions(submissions.map(s => s.id === projId ? { ...s, status: status, review_feedback: feedback } : s));
      alert(`[SANDBOX MODE] Build status updated to: ${status}`);
    }
    setProcessingId(null);
  };

  const filteredSubmits = activeFilter === "all"
    ? submissions
    : submissions.filter(s => s.status.toLowerCase() === activeFilter.toLowerCase());

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
              <span className="text-[10px] text-slate-400 block font-mono">Review Console</span>
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
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600 text-left transition-technical"
              >
                <FolderOpen className="w-4 h-4" />
                Portfolio Reviews
              </Link>

              <Link
                href="/team-portal/curriculum"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold text-slate-650 hover:bg-slate-50 text-left transition-technical"
              >
                <BookOpen className="w-4 h-4 text-slate-400" />
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

          {/* Reviews Desk */}
          <div className="lg:col-span-9 space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Student Portfolio Review Desk</h3>
                  <p className="text-xs text-slate-500 font-mono">Process student physical builds and issue verified certificates.</p>
                </div>

                <div className="flex gap-1.5">
                  {["pending", "approved", "needs_work", "all"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase border transition-technical ${
                        activeFilter === filter
                          ? "bg-indigo-50 border-indigo-200 text-indigo-650"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-350"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="p-16 text-center space-x-2 flex justify-center items-center">
                  <Loader2 className="w-5 h-5 text-indigo-650 animate-spin" />
                  <span className="text-xs text-slate-500 font-mono">LOADING PORTFOLIOS...</span>
                </div>
              ) : filteredSubmits.length === 0 ? (
                <div className="p-16 text-center space-y-2">
                  <FolderOpen className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-650">No submissions in this filter queue.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-150">
                  {filteredSubmits.map((sub) => (
                    <div key={sub.id} className="p-6 space-y-6 hover:bg-slate-50/50 transition-technical">
                      
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div>
                          <span className="text-[9px] font-mono tracking-widest text-indigo-650 uppercase font-bold">
                            STUDENT PORTFOLIO SUBMISSION
                          </span>
                          <h4 className="text-lg font-bold text-slate-900">{sub.title}</h4>
                          <span className="text-xs text-slate-500 block">Submitted By: <strong className="text-slate-800">{sub.student_name}</strong></span>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                          sub.status === 'approved' 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-650"
                            : sub.status === 'needs_work'
                            ? "bg-rose-50 border-rose-200 text-rose-650"
                            : "bg-amber-50 border-amber-200 text-amber-650"
                        }`}>
                          {sub.status || "pending"}
                        </span>
                      </div>

                      {/* Code and Specs details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-slate-700 tracking-wider uppercase block flex items-center gap-1">
                            <Compass className="w-4 h-4 text-indigo-600" /> Build Schematics:
                          </span>
                          <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-200 p-4 rounded-lg">
                            {sub.description}
                          </p>
                          {sub.schematic_diagram && (
                            <p className="text-[11px] text-slate-500 italic bg-white border border-slate-200 p-3 rounded-lg">
                              Wiring: "{sub.schematic_diagram}"
                            </p>
                          )}
                        </div>

                        {sub.code_snippet && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-700 tracking-wider uppercase block flex items-center gap-1">
                              <Terminal className="w-4 h-4 text-indigo-600" /> Firmware Code:
                            </span>
                            <pre className="bg-slate-950 p-4 font-mono text-[10px] text-emerald-400 rounded-lg overflow-x-auto">
                              <code>{sub.code_snippet}</code>
                            </pre>
                          </div>
                        )}
                      </div>

                      {/* Action forms for Triaging */}
                      {sub.status === 'pending' && (
                        <div className="border-t border-slate-100 pt-4 space-y-3">
                          <div className="flex flex-col space-y-1">
                            <label className="text-[10px] font-extrabold text-slate-700 uppercase">Review Feedback / Calibration Notes</label>
                            <input
                              type="text"
                              value={feedbackInput[sub.id] || ""}
                              onChange={(e) => setFeedbackInput({ ...feedbackInput, [sub.id]: e.target.value })}
                              placeholder="Provide technical feedback (e.g. wire layout correct, code validated)."
                              className="px-3 py-2 rounded border border-slate-200 bg-white text-xs focus:outline-none focus:border-indigo-600"
                            />
                          </div>

                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleTriage(sub.id, sub.student_name, sub.title, "needs_work")}
                              disabled={processingId === sub.id}
                              className="px-4 py-2 text-[10px] font-bold bg-white border border-slate-200 hover:border-rose-400 text-slate-700 hover:text-rose-600 rounded transition-technical cursor-pointer"
                            >
                              REQUEST CHANGES
                            </button>
                            <button
                              onClick={() => handleTriage(sub.id, sub.student_name, sub.title, "approved")}
                              disabled={processingId === sub.id}
                              className="px-4 py-2 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-750 text-white rounded transition-technical flex items-center gap-1.5 cursor-pointer"
                            >
                              <Award className="w-4 h-4" />
                              APPROVE & GENERATE CERTIFICATE
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
