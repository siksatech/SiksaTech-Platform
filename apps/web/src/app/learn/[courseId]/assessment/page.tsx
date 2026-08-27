"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DEMO_ASSESSMENT,
  DEMO_COURSES,
  gradeAssessment,
  createBrowserClient,
  isRealSupabase,
  type Assessment,
  type AssessmentSubmissionResult
} from "@siksatech/database";
import { Navbar, Footer } from "@siksatech/ui";
import {
  ArrowLeft, CheckCircle2, XCircle, Award, Timer, Sparkles,
  HelpCircle, ChevronRight, ChevronLeft, RotateCcw, AlertTriangle, Code2,
  Check, ExternalLink
} from "lucide-react";

export default function AssessmentPage({
  params
}: {
  params: Promise<{ courseId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { courseId } = resolvedParams;

  const assessment: Assessment = DEMO_ASSESSMENT;
  const course = DEMO_COURSES.find((c) => c.id === courseId) || {
    id: courseId,
    title: "Maker Embedded Track"
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(assessment.time_limit_mins * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentSubmissionResult | null>(null);
  const [studentName, setStudentName] = useState("Student Learner");

  useEffect(() => {
    const fetchUser = async () => {
      if (isRealSupabase) {
        try {
          const supabase = createBrowserClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: prof } = await (supabase as any)
              .from("profiles")
              .select("full_name")
              .eq("id", user.id)
              .maybeSingle();
            if (prof?.full_name) setStudentName(prof.full_name);
            else if (user.user_metadata?.full_name) setStudentName(user.user_metadata.full_name);
          }
        } catch {
          // ignore
        }
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let userId = "student-learner";
    let supabase;

    if (isRealSupabase) {
      try {
        supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) userId = user.id;
      } catch (e) {
        console.error("Auth context error:", e);
      }
    }

    const res = await gradeAssessment(supabase, userId, assessment.id, selectedAnswers, studentName, course.title);
    setResult(res);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  // Countdown timer
  useEffect(() => {
    if (isSubmitted || timeLeftSeconds <= 0) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeftSeconds]);

  const currentQuestion = assessment.questions?.[currentQuestionIndex] || assessment.questions?.[0];

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = assessment.questions?.length || 4;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb Navigation */}
        <Link
          href={`/learn/${courseId}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Course Curriculum
        </Link>

        {/* Assessment Banner Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-blue-600 font-bold uppercase tracking-wider">
                COMPREHENSIVE CERTIFICATION EXAM
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {course.title}: Final Certification Exam
              </h1>
              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                Score 75% or higher to earn an official, verifiable SiksaTech credential and digital certificate.
              </p>
            </div>

            {!isSubmitted && (
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl shrink-0">
                <Timer className="w-5 h-5 text-blue-600 animate-pulse" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Time Remaining</span>
                  <span className="text-base font-bold font-mono text-slate-900 tracking-widest">
                    {formatTime(timeLeftSeconds)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Progress Tracker Bar */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Progress: {answeredCount} of {totalQuestions} questions answered</span>
            <div className="w-40 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Submitted Results State */}
        {isSubmitted && result ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl space-y-8 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              {result.passed ? <Award className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10 text-amber-500" />}
            </div>

            <div className="space-y-2">
              <span className={`text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full border ${
                result.passed
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}>
                {result.passed ? "✓ ASSESSMENT PASSED (HIGH HONORS)" : "RE-ATTEMPT RECOMMENDED"}
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {result.passed ? "Congratulations, Master Builder!" : "Keep Practicing Your Circuits"}
              </h2>

              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {result.passed
                  ? `You achieved a score of ${result.score}%. Your verifiable SiksaTech credential has been minted and added to your portfolio.`
                  : `You scored ${result.score}%. A minimum score of 75% is required to earn the official credential. Review the modules and try again.`}
              </p>
            </div>

            {/* Score Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Final Score</span>
                <span className="text-2xl font-extrabold font-mono text-blue-600">{result.score}%</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Passing Mark</span>
                <span className="text-2xl font-extrabold font-mono text-slate-900">75%</span>
              </div>
              <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Status</span>
                <span className={`text-base font-extrabold ${result.passed ? "text-emerald-600" : "text-amber-600"}`}>
                  {result.passed ? "QUALIFIED" : "IN PROGRESS"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              {result.passed && result.certificateId && (
                <Link
                  href={`/verify/${result.certificateId}`}
                  className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> View &amp; Verify Certificate ({result.certificateId}) <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}

              <Link
                href="/dashboard/student?tab=certificates"
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Go to Student Dashboard
              </Link>
            </div>
          </div>
        ) : currentQuestion ? (
          /* Active Question Card */
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-xs font-mono font-bold text-blue-600">
                  QUESTION {currentQuestionIndex + 1} OF {totalQuestions}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {currentQuestion.points} Points
                </span>
              </div>

              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQuestion.question_text}
                </h3>

                {currentQuestion.code_snippet && (
                  <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl overflow-x-auto border border-slate-800 shadow-inner">
                    <code>{currentQuestion.code_snippet}</code>
                  </pre>
                )}

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedAnswers[currentQuestion.id] === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? "bg-blue-50/70 border-blue-600 text-slate-900 shadow-xs"
                            : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800"
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-slate-300 text-slate-600"
                        }`}>
                          {option.id.toUpperCase()}
                        </span>
                        <span className="text-xs sm:text-sm font-medium leading-relaxed">
                          {option.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    Next Question <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || answeredCount < totalQuestions}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> {isSubmitting ? "Grading Binary..." : "Submit & Grade Exam"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
