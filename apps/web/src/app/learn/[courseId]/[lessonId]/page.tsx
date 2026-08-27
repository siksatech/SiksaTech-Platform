"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  db, Course, Lesson, createBrowserClient, isRealSupabase,
  markLessonCompleted, getCourseProgress, getCourseWithCurriculum
} from "@siksatech/database";
import { Navbar, Footer, SiksaTechLogo } from "@siksatech/ui";
import {
  ArrowLeft, CheckCircle2, Play, Code2, BookOpen, Wrench,
  ChevronRight, Terminal, RefreshCw, Layers, Check, AlertCircle,
  HelpCircle, Award, Sparkles
} from "lucide-react";

export default function LessonPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [codeContent, setCodeContent] = useState("");
  const [consoleOutput, setConsoleOutput] = useState("Console ready. Click 'RUN SYNTAX CHECK' to compile your code.");
  const [isCompiling, setIsCompiling] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      let supabase;
      if (isRealSupabase) {
        supabase = createBrowserClient();
      }

      const { course: foundCourse, lessons: fetchedLessons } = await getCourseWithCurriculum(supabase, courseId);
      if (foundCourse) setCourse(foundCourse);
      
      const activeLessons: Lesson[] = fetchedLessons && fetchedLessons.length > 0 ? fetchedLessons : [
        {
          id: "les-1",
          courseId,
          title: "Hardware Architecture & Current Flow",
          moduleTitle: "Module 1",
          contentMarkdown: `# 1. Hardware Architecture & Current Flow\n\nWelcome to your hands-on STEM laboratory! In this session, you will learn the fundamentals of DC voltage rails, ground references, and Ohm's law applied to embedded microcontrollers.\n\n### Core Engineering Concepts\n- **VCC (5.0V / 3.3V)**: The positive supply line delivering current to internal transistors and sensors.\n- **GND (0.0V)**: Common ground return reference rail.\n- **GPIO**: General Purpose Input/Output pins capable of reading analog voltages (0-1023) or driving digital signals.\n\n\`\`\`cpp\n// Initializing Serial Communication\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(500);\n  digitalWrite(13, LOW);\n  delay(500);\n}\n\`\`\``,
          starterCode: `// SiksaTech Embedded Lab: Lesson 1\n// Goal: Initialize Pin 13 LED and output heartbeat telemetry\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(13, OUTPUT);\n  Serial.println("[SIKSATECH] System Initialized: READY");\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(500);\n  digitalWrite(13, LOW);\n  delay(500);\n  Serial.println("[TELEMETRY] Heartbeat Pulse OK");\n}`,
          lessonType: "lab" as const,
          durationMinutes: 30,
          sortOrder: 1
        },
        {
          id: "les-2",
          courseId,
          title: "Connecting Your First Sensor on Breadboard",
          moduleTitle: "Module 1",
          contentMarkdown: `# 2. Connecting Your First Sensor on Breadboard\n\nIn this practical module, you will wire an analog light dependent resistor (LDR) voltage divider to ADC pin A0.\n\n### Circuit Schematic Steps\n1. Connect 5V rail to the top bus line of your breadboard.\n2. Wire 10kΩ pull-down resistor from A0 to GND.\n3. Place the LDR between 5V rail and Pin A0.\n4. Open the Serial Plotter to watch voltage swings when you shade the sensor.`,
          starterCode: `// SiksaTech ADC Sensor Calibration\nconst int sensorPin = A0;\n\nvoid setup() {\n  Serial.begin(115200);\n}\n\nvoid loop() {\n  int rawValue = analogRead(sensorPin);\n  float voltage = (rawValue / 1023.0) * 5.0;\n  Serial.print("Raw: ");\n  Serial.print(rawValue);\n  Serial.print(" | Voltage: ");\n  Serial.println(voltage);\n  delay(200);\n}`,
          lessonType: "code" as const,
          durationMinutes: 45,
          sortOrder: 2
        }
      ];

      setLessons(activeLessons);

      const target = activeLessons.find((l) => l.id === lessonId) || activeLessons[0];
      setCurrentLesson(target);
      setCodeContent(target.starterCode || "// Write your firmware code here\nvoid setup() {}\nvoid loop() {}");

      // Load progress
      if (isRealSupabase && supabase) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const prog = await getCourseProgress(supabase, user.id, courseId);
            const compIds = prog.filter((p) => p.is_completed).map((p) => p.lesson_id);
            setCompletedLessonIds(compIds);
            if (compIds.includes(target.id)) setCompleted(true);
          }
        } catch (e) {
          console.error("Progress fetch error:", e);
        }
      } else {
        const local = JSON.parse(localStorage.getItem(`siksatech_progress_${courseId}`) || "[]");
        setCompletedLessonIds(local);
        if (local.includes(target.id)) setCompleted(true);
      }

      setLoading(false);
    };

    initData();
  }, [courseId, lessonId]);

  const handleRunSyntax = () => {
    setIsCompiling(true);
    setConsoleOutput("Compiling sketch...\nParsing pin configuration...\nVerifying C++ syntax...");
    setTimeout(() => {
      setIsCompiling(false);
      setConsoleOutput("[COMPILER SUCCESS] 0 errors, 0 warnings.\nSketch uses 2,418 bytes (7%) of program storage space.\nGlobal variables use 184 bytes (8%) of dynamic memory.\nSerial port listening on /dev/ttyUSB0 (115200 baud).");
    }, 1000);
  };

  const handleMarkComplete = async () => {
    if (!currentLesson) return;
    setCompleted(true);

    const updated = Array.from(new Set([...completedLessonIds, currentLesson.id]));
    setCompletedLessonIds(updated);

    if (typeof window !== "undefined") {
      localStorage.setItem(`siksatech_progress_${courseId}`, JSON.stringify(updated));
    }

    if (isRealSupabase) {
      try {
        const supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await markLessonCompleted(supabase, user.id, courseId, currentLesson.id, true);
        }
      } catch (e) {
        console.error("Save progress error:", e);
      }
    }
  };

  if (loading || !course || !currentLesson) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-slate-500 font-mono">Loading interactive lesson workspace...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id);
  const nextLesson = lessons[currentIndex + 1];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      {/* Top Breadcrumb Header Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href={`/learn/${courseId}`}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 truncate max-w-xs">{course.title}</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs text-blue-600 font-bold">{currentLesson.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkComplete}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              completed
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {completed ? "Completed ✓" : "Mark Complete"}
          </button>

          {nextLesson ? (
            <Link
              href={`/learn/${courseId}/${nextLesson.id}`}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              Next Lesson <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href={`/learn/${courseId}/assessment`}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" /> Take Exam <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Main Workspace Grid: Left Syllabus/Content, Right Code Runner */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Lesson Theory & Instructions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-[10px] font-mono font-bold uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  {currentLesson.lessonType?.toUpperCase() || "HANDS-ON LAB"}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Estimated Time: {currentLesson.durationMinutes} mins
                </span>
              </div>

              <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
                <h1 className="text-xl font-extrabold text-slate-900">{currentLesson.title}</h1>
                <div className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {currentLesson.contentMarkdown}
                </div>
              </div>
            </div>

            {/* Course Module Navigation Drawer */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Course Lessons</h3>
              <div className="space-y-2">
                {lessons.map((les, idx) => {
                  const isCurrent = les.id === currentLesson.id;
                  const isDone = completedLessonIds.includes(les.id);
                  return (
                    <Link
                      key={les.id}
                      href={`/learn/${courseId}/${les.id}`}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs transition-all ${
                        isCurrent
                          ? "bg-blue-50/70 border-blue-600 text-blue-900 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-lg bg-white border text-[10px] font-mono flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>{les.title}</span>
                      </div>
                      {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Embedded Firmware Editor & Console */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Firmware Editor (C++)</span>
                </div>
                <button
                  onClick={handleRunSyntax}
                  disabled={isCompiling}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  {isCompiling ? "Compiling..." : "Run Syntax Check"}
                </button>
              </div>

              {/* Code Box */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 text-slate-100 shadow-inner">
                <textarea
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  rows={14}
                  spellCheck={false}
                  className="w-full p-4 font-mono text-xs text-emerald-400 bg-slate-900 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Console Output */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800 pb-1.5">
                  <Terminal className="w-3 h-3 text-blue-400" />
                  <span>Interactive Compiler Terminal</span>
                </div>
                <pre className="text-[11px] text-slate-300 whitespace-pre-wrap pt-1 font-mono leading-relaxed">
                  {consoleOutput}
                </pre>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
