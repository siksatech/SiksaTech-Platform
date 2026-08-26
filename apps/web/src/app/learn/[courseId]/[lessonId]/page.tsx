"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DEMO_COURSES,
  createBrowserClient,
  isRealSupabase,
  markLessonCompleted
} from "@siksatech/database";
import { SiksaTechLogo } from "@siksatech/ui";
import {
  ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Play, BookOpen,
  Code2, Wrench, Sparkles, Terminal, Check, Video, Copy, RotateCcw
} from "lucide-react";

interface LessonData {
  id: string;
  courseId: string;
  title: string;
  moduleTitle: string;
  lessonType: "theory" | "code" | "lab" | "video" | "project";
  videoUrl?: string;
  durationMinutes: number;
  contentMarkdown: string;
  starterCode?: string;
  solutionCode?: string;
  wiringInstructions?: string;
}

const DEFAULT_LESSONS: LessonData[] = [
  {
    id: "les-1",
    courseId: "builder-arduino-embedded",
    title: "1. Circuit Architecture & Pin Identification",
    moduleTitle: "Module 1: Foundations & Architecture",
    lessonType: "video",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // YouTube embed
    durationMinutes: 20,
    contentMarkdown: `## Circuit Architecture Fundamentals

In this module, you will master how voltage, current, and ground reference work on an embedded microcontroller board.

### Key Concepts:
1. **VCC (3.3V / 5V)**: Power source rails providing current to active ICs.
2. **GND (Ground)**: Common 0V return path for all circuit loops.
3. **GPIO (General Purpose Input/Output)**: Configurable digital pins capable of sinking or sourcing current.

> **Safety Warning**: Never bridge 5V directly to Ground without a current-limiting resistor, as this causes a direct short circuit.`,
    starterCode: `// Pin Definitions
const int LED_PIN = 13;

void setup() {
  // Initialize digital pin as an output
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);   // Turn the LED on
  delay(1000);                   // Wait 1 second
  digitalWrite(LED_PIN, LOW);    // Turn the LED off
  delay(1000);                   // Wait 1 second
}`,
    solutionCode: `// Optimized with non-blocking millis()
const int LED_PIN = 13;
unsigned long previousMillis = 0;
const long interval = 1000;
int ledState = LOW;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    ledState = (ledState == LOW) ? HIGH : LOW;
    digitalWrite(LED_PIN, ledState);
  }
}`,
    wiringInstructions: `1. Insert the LED onto the breadboard with the longer leg (Anode) on pin rail A12.
2. Connect a 220Ω resistor from rail B12 to digital pin D13.
3. Connect the shorter leg (Cathode) to the GND rail.`
  },
  {
    id: "les-2",
    courseId: "builder-arduino-embedded",
    title: "2. Analog Sensor Calibration & ADC Sampling",
    moduleTitle: "Module 2: Firmware & Sensor Interfacing",
    lessonType: "code",
    durationMinutes: 35,
    contentMarkdown: `## Reading Analog Telemetry

Analog-to-Digital Converters (ADCs) convert continuous physical voltages into discrete numeric values.

### The Math Behind ADC:
$$\\text{Voltage} = \\frac{\\text{Raw ADC Value}}{1023} \\times 5.0\\text{V}$$

Calibrating thresholds prevents false triggers in temperature, light, and soil moisture telemetry nodes.`,
    starterCode: `const int SENSOR_PIN = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int sensorValue = analogRead(SENSOR_PIN);
  float voltage = sensorValue * (5.0 / 1023.0);
  
  Serial.print("Raw: ");
  Serial.print(sensorValue);
  Serial.print(" | Voltage: ");
  Serial.println(voltage);
  delay(500);
}`,
    solutionCode: `const int SENSOR_PIN = A0;
const int SAMPLES = 10;

void setup() {
  Serial.begin(115200);
}

float readCalibratedAverage() {
  long sum = 0;
  for (int i = 0; i < SAMPLES; i++) {
    sum += analogRead(SENSOR_PIN);
    delay(10);
  }
  return (sum / (float)SAMPLES) * (5.0 / 1023.0);
}

void loop() {
  float avgVoltage = readCalibratedAverage();
  Serial.print("Filtered Voltage: ");
  Serial.println(avgVoltage, 3);
  delay(500);
}`
  }
];

export default function LessonPlayerPage({
  params
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { courseId, lessonId } = resolvedParams;

  const [activeTab, setActiveTab] = useState<"video" | "theory" | "code" | "wiring">("video");
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [userCode, setUserCode] = useState("");

  const course = DEMO_COURSES.find((c) => c.id === courseId) || {
    id: courseId,
    title: "Maker Electronics & Firmware Engineering",
    description: "Hands-on engineering tracks."
  };

  const currentLesson = DEFAULT_LESSONS.find((l) => l.id === lessonId) || DEFAULT_LESSONS[0];

  useEffect(() => {
    setUserCode(currentLesson.starterCode || "// Write your firmware here");
  }, [currentLesson]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSimulation = () => {
    setSimulating(true);
    setConsoleOutput(["[Compiler] Initializing toolchain...", "[Compiler] Compiling source files..."]);
    setTimeout(() => {
      setConsoleOutput((prev) => [
        ...prev,
        "[Compiler] Binary generated: 4,120 bytes (12% flash used)",
        "[Runner] Flashing firmware to virtual target...",
        "[Serial @ 115200 baud] System booted cleanly.",
        "[Serial] Pin D13 -> HIGH (LED ON)",
        "[Serial] Pin D13 -> LOW (LED OFF)"
      ]);
      setSimulating(false);
    }, 1200);
  };

  const handleMarkComplete = async () => {
    setCompleted(true);
    if (isRealSupabase) {
      try {
        const supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await markLessonCompleted(supabase, user.id, courseId, currentLesson.id, true);
        }
      } catch (err) {
        console.error("Progress save error:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href={`/learn/${courseId}`}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <SiksaTechLogo className="h-5 w-auto brightness-0 invert" />
            <span className="text-slate-600">/</span>
            <span className="text-xs font-semibold text-slate-300 truncate max-w-[200px] sm:max-w-sm">
              {course.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkComplete}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 min-h-[36px] ${
              completed
                ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/40"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {completed ? "Completed" : "Mark Complete"}
          </button>
        </div>
      </header>

      {/* Main Player Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left / Center Content View */}
        <div className="flex-1 flex flex-col bg-slate-900 border-r border-slate-800 overflow-y-auto">
          {/* Lesson Header Navigation */}
          <div className="p-5 border-b border-slate-800 bg-slate-950/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-blue-400 tracking-wider uppercase">
                {currentLesson.moduleTitle}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Est. {currentLesson.durationMinutes} mins
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {currentLesson.title}
            </h1>

            {/* Tab Selector */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setActiveTab("video")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "video"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-800/80 text-slate-400 hover:text-white"
                }`}
              >
                <Video className="w-3.5 h-3.5" /> Video Lecture
              </button>
              <button
                onClick={() => setActiveTab("theory")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "theory"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-800/80 text-slate-400 hover:text-white"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Engineering Notes
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "code"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-800/80 text-slate-400 hover:text-white"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> Firmware Code
              </button>
              {currentLesson.wiringInstructions && (
                <button
                  onClick={() => setActiveTab("wiring")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "wiring"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-800/80 text-slate-400 hover:text-white"
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" /> Hardware Wiring
                </button>
              )}
            </div>
          </div>

          {/* Active Tab Panel */}
          <div className="p-6 flex-1">
            {activeTab === "video" && (
              <div className="space-y-4">
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                  {currentLesson.videoUrl ? (
                    <iframe
                      src={currentLesson.videoUrl}
                      title={currentLesson.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                      <Play className="w-12 h-12 mb-2 opacity-50" />
                      <p className="text-xs">No video lecture attached to this practical unit.</p>
                    </div>
                  )}
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <h3 className="text-xs font-bold text-slate-300 mb-1">Key Takeaway</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Watch the wiring and pin connections carefully before powering your development board with USB.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "theory" && (
              <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4 font-normal">
                <div className="whitespace-pre-line leading-7">
                  {currentLesson.contentMarkdown}
                </div>
              </div>
            )}

            {activeTab === "code" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">main.cpp (C++ / MicroPython)</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setUserCode(currentLesson.starterCode || "")}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-1.5 rounded hover:bg-slate-800"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset
                    </button>
                    <button
                      onClick={handleCopyCode}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-1.5 rounded hover:bg-slate-800"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copied" : "Copy Code"}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    rows={14}
                    className="w-full p-4 font-mono text-xs text-blue-300 bg-transparent resize-none focus:outline-none leading-5"
                    spellCheck={false}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleRunSimulation}
                    disabled={simulating}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-md shadow-emerald-950"
                  >
                    <Play className="w-3.5 h-3.5" /> {simulating ? "Verifying..." : "Run Syntax Check"}
                  </button>
                </div>

                {consoleOutput.length > 0 && (
                  <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs space-y-1">
                    <div className="flex items-center gap-2 text-slate-500 pb-2 border-b border-slate-900 mb-2">
                      <Terminal className="w-3.5 h-3.5" /> Virtual Serial Monitor
                    </div>
                    {consoleOutput.map((line, idx) => (
                      <p key={idx} className={line.includes("SUCCESS") ? "text-emerald-400" : "text-slate-400"}>
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "wiring" && currentLesson.wiringInstructions && (
              <div className="space-y-4">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-emerald-400" /> Physical Breadboard Connection Guide
                  </h3>
                  <div className="whitespace-pre-line text-xs text-slate-300 leading-6 font-mono bg-slate-900/60 p-4 rounded-lg border border-slate-800/60">
                    {currentLesson.wiringInstructions}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Syllabus Sidebar */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 border-slate-800 bg-slate-950 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Course Syllabus
            </h2>
          </div>

          <div className="p-3 space-y-1 overflow-y-auto flex-1">
            {DEFAULT_LESSONS.map((les, index) => {
              const isCurrent = les.id === currentLesson.id;
              return (
                <Link
                  key={les.id}
                  href={`/learn/${courseId}/${les.id}`}
                  className={`flex items-start gap-3 p-3 rounded-lg text-xs transition-all ${
                    isCurrent
                      ? "bg-blue-600/15 border border-blue-500/30 text-white font-bold"
                      : "hover:bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono ${
                      isCurrent
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs">{les.title}</p>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {les.durationMinutes} mins · {les.lessonType}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
