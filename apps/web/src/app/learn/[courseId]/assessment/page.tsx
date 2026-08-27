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
  HelpCircle, ChevronRight, ChevronLeft, RotateCcw, AlertTriangle, Code2
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let userId = "demo-user";
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

    const res = await gradeAssessment(supabase, userId, assessment.id, selectedAnswers);
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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb Navigation */}
        <Link
          href={`/learn/${courseId}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Course Overview
        </Link>

        {/* Assessment Banner Header */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                Comprehensive Verification Exam
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {assessment.title}
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                {assessment.description}
              </p>
            </div>

            {!isSubmitted && (
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl shrink-0">
                <Timer className="w-5 h-5 text-blue-400 animate-pulse" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Time Remaining</span>
                  <span className="text-base font-bold font-mono text-white tracking-widest">
                    {formatTime(timeLeftSeconds)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Progress Tracker Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Questions answered: <strong className="text-white">{answeredCount}</strong> / {totalQuestions}
            </span>
            <span className="text-slate-400 font-mono">
              Passing threshold: <strong className="text-emerald-400">{assessment.passing_score}%</strong>
            </span>
          </div>
        </div>

        {/* Result Card (When Submitted) */}
        {isSubmitted && result && (
          <div className={`p-6 sm:p-8 rounded-2xl border mb-8 shadow-2xl ${
            result.passed
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-100"
              : "bg-rose-950/40 border-rose-500/40 text-rose-100"
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  result.passed ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                }`}>
                  {result.passed ? <Award className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {result.passed ? "Assessment Passed! Congratulations" : "Assessment Not Cleared"}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-md">
                    {result.passed
                      ? "You have demonstrated mastery in firmware logic and circuit fundamentals. Your official credential has been issued."
                      : `You achieved ${result.score}%, but the passing threshold is ${assessment.passing_score}%. Review the questions below and try again.`}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-4xl font-extrabold text-white font-mono">
                  {result.score}%
                </div>
                <span className="text-[10px] uppercase tracking-widest text-slate-400">
                  {result.pointsEarned} / {result.totalPoints} Points
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap gap-3">
              {result.passed && result.certificateId && (
                <Link
                  href={`/verify/${result.certificateId}`}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> View Verifiable Certificate
                </Link>
              )}
              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setIsSubmitted(false);
                  setResult(null);
                  setCurrentQuestionIndex(0);
                  setTimeLeftSeconds(assessment.time_limit_mins * 60);
                }}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Retake Exam
              </button>
            </div>
          </div>
        )}

        {/* Active Question Box */}
        {currentQuestion && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="text-xs font-mono text-slate-500">
                {currentQuestion.points} Points
              </span>
            </div>

            <h3 className="text-lg font-bold text-white leading-relaxed">
              {currentQuestion.question_text}
            </h3>

            {/* Optional Code Snippet */}
            {currentQuestion.code_snippet && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-blue-300 whitespace-pre leading-5">
                <div className="flex items-center gap-1.5 text-slate-500 pb-2 mb-2 border-b border-slate-800 text-[10px]">
                  <Code2 className="w-3.5 h-3.5" /> Source Code Snippet
                </div>
                {currentQuestion.code_snippet}
              </div>
            )}

            {/* Multiple Choice Options */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswers[currentQuestion.id] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-4 rounded-xl border text-xs font-medium transition-all flex items-start gap-3 cursor-pointer min-h-[44px] ${
                      isSelected
                        ? "bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-900/20"
                        : "bg-slate-900/80 border-slate-800/90 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-mono font-bold uppercase ${
                      isSelected ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}>
                      {option.id}
                    </span>
                    <span className="leading-5 flex-1">{option.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Post-submission feedback for current question */}
            {isSubmitted && result && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <p className="font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-400" /> Explanation & Insight:
                </p>
                <p className="text-slate-300 leading-relaxed pl-6">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Question Navigation Controls */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 min-h-[44px]"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 min-h-[44px]"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : !isSubmitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-emerald-950 flex items-center gap-2 min-h-[44px]"
                >
                  <CheckCircle2 className="w-4 h-4" /> {isSubmitting ? "Submitting..." : "Submit Exam"}
                </button>
              ) : null}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
