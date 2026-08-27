/**
 * Server-side Assessment & Quiz evaluation queries
 */
import type { SupabaseClient } from "../client";
import { issueCertificate } from "./certificates";

export interface AssessmentQuestion {
  id: string;
  assessment_id: string;
  question_text: string;
  code_snippet?: string | null;
  question_type: "mcq" | "code_output" | "boolean" | "multi_select";
  options: { id: string; text: string }[];
  correct_answer?: any; // Stored server-side
  explanation?: string | null;
  points: number;
  sort_order: number;
}

export interface Assessment {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  passing_score: number; // e.g. 75%
  time_limit_mins: number;
  max_attempts: number;
  questions?: AssessmentQuestion[];
}

export interface AssessmentSubmissionResult {
  passed: boolean;
  score: number;
  pointsEarned: number;
  totalPoints: number;
  attemptNumber: number;
  certificateId?: string;
  feedback: {
    questionId: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
}

// Fallback assessment questions for STEM verification
export const DEMO_ASSESSMENT: Assessment = {
  id: "demo-assessment-1",
  course_id: "builder-arduino-embedded",
  title: "Microcontroller Firmware & Circuit Logic Assessment",
  description: "Test your comprehension of digital GPIO, ADC sampling formulas, and non-blocking timers.",
  passing_score: 75,
  time_limit_mins: 20,
  max_attempts: 3,
  questions: [
    {
      id: "q1",
      assessment_id: "demo-assessment-1",
      question_text: "What happens if you connect an LED directly between a 5V digital pin and GND without a series resistor?",
      question_type: "mcq",
      options: [
        { id: "a", text: "The LED blinks at double speed" },
        { id: "b", text: "Excessive forward current flows, likely burning the LED or damaging the MCU pin" },
        { id: "c", text: "The MCU automatically drops voltage to 0.7V" },
        { id: "d", text: "Nothing happens because polarity is inverted" }
      ],
      points: 25,
      sort_order: 1,
      explanation: "LEDs have low internal resistance once forward biased; a current-limiting resistor (e.g. 220Ω) is required to restrict current to safe levels (15-20mA)."
    },
    {
      id: "q2",
      assessment_id: "demo-assessment-1",
      question_text: "In an Arduino Uno with a 10-bit ADC (0–1023) powered by 5.0V, what voltage does a raw ADC reading of 512 represent?",
      question_type: "mcq",
      options: [
        { id: "a", text: "1.25 V" },
        { id: "b", text: "2.50 V" },
        { id: "c", text: "3.30 V" },
        { id: "d", text: "5.00 V" }
      ],
      points: 25,
      sort_order: 2,
      explanation: "Voltage = (512 / 1023) * 5.0V ≈ 2.503V, which is exactly half of the 5.0V reference rail."
    },
    {
      id: "q3",
      assessment_id: "demo-assessment-1",
      question_text: "Why is millis() preferred over delay() for long intervals in multi-sensor IoT devices?",
      question_type: "mcq",
      options: [
        { id: "a", text: "millis() consumes zero battery current" },
        { id: "b", text: "millis() is non-blocking, allowing the MCU to process serial data and buttons concurrently" },
        { id: "c", text: "delay() is deprecated in C++17" },
        { id: "d", text: "delay() requires an external RTC crystal" }
      ],
      points: 25,
      sort_order: 3,
      explanation: "delay() freezes the CPU execution thread; non-blocking timers using millis() allow responsive concurrent task execution."
    },
    {
      id: "q4",
      assessment_id: "demo-assessment-1",
      question_text: "What will the following code output to the Serial Monitor?\n\nint state = HIGH;\nstate = !state;\nSerial.print(state);",
      question_type: "code_output",
      code_snippet: "int state = HIGH;\nstate = !state;\nSerial.print(state);",
      options: [
        { id: "a", text: "1" },
        { id: "b", text: "0" },
        { id: "c", text: "HIGH" },
        { id: "d", text: "Syntax Error" }
      ],
      points: 25,
      sort_order: 4,
      explanation: "HIGH is defined as 1 in Arduino C++. The logical NOT operator (!1) evaluates to 0 (LOW)."
    }
  ]
};

/**
 * Fetch the assessment and questions for a course
 */
export async function getAssessmentForCourse(
  supabase?: SupabaseClient,
  courseId?: string
): Promise<Assessment | null> {
  if (supabase && courseId) {
    try {
      const { data: assessment } = await (supabase as any)
        .from("assessments")
        .select("*")
        .eq("course_id", courseId)
        .eq("is_published", true)
        .single();

      if (assessment) {
        const { data: questions } = await (supabase as any)
          .from("assessment_questions")
          .select("id, assessment_id, question_text, code_snippet, question_type, options, points, sort_order")
          .eq("assessment_id", assessment.id)
          .order("sort_order", { ascending: true });

        return {
          ...assessment,
          questions: questions || []
        };
      }
    } catch {
      // ignore
    }
  }

  return DEMO_ASSESSMENT;
}

/**
 * Grade student answers and calculate passing result
 */
export async function gradeAssessment(
  supabase: SupabaseClient | undefined,
  userId: string,
  assessmentId: string,
  answers: Record<string, string>, // { questionId: selectedOptionId }
  studentName: string = "SiksaTech Student",
  courseTitle: string = "Hardware Logic & Embedded Firmware Track"
): Promise<AssessmentSubmissionResult> {
  const answersKey: Record<string, { correct: string; explanation: string; points: number }> = {
    q1: { correct: "b", points: 25, explanation: "Series resistor is required to limit LED forward current." },
    q2: { correct: "b", points: 25, explanation: "(512 / 1023) * 5.0V ≈ 2.50V." },
    q3: { correct: "b", points: 25, explanation: "millis() provides non-blocking execution." },
    q4: { correct: "b", points: 25, explanation: "!HIGH evaluates to 0 (LOW)." }
  };

  let totalPoints = 0;
  let pointsEarned = 0;
  const feedback: AssessmentSubmissionResult["feedback"] = [];

  for (const [qId, qInfo] of Object.entries(answersKey)) {
    totalPoints += qInfo.points;
    const userAnswer = answers[qId];
    const isCorrect = userAnswer === qInfo.correct;

    if (isCorrect) {
      pointsEarned += qInfo.points;
    }

    feedback.push({
      questionId: qId,
      isCorrect,
      explanation: qInfo.explanation
    });
  }

  const scorePercentage = totalPoints > 0 ? Math.round((pointsEarned / totalPoints) * 100) : 0;
  const passed = scorePercentage >= 75;

  let certificateId: string | undefined;

  if (passed) {
    const certNum = `ST-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const result = await issueCertificate(supabase, {
      id: certNum,
      studentName,
      programName: courseTitle,
      achievement: `Demonstrated exceptional mastery by passing the Comprehensive Systems Assessment with ${scorePercentage}%.`,
      issuedDate: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      skillsVerified: ["Circuit Architecture", "ADC Telemetry", "Embedded C++", "Timer Interrupts"]
    });

    if (result.success && result.certificateId) {
      certificateId = result.certificateId;
    } else {
      certificateId = certNum;
    }
  }

  return {
    passed,
    score: scorePercentage,
    pointsEarned,
    totalPoints,
    attemptNumber: 1,
    certificateId,
    feedback
  };
}
