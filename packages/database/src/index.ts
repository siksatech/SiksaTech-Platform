/**
 * @siksatech/database — Main Entry Point
 *
 * This package provides:
 * 1. Supabase client factories (browser, server, admin)
 * 2. TypeScript types for all data models
 * 3. Server-side query helpers
 * 4. Legacy mock data for graceful fallbacks
 *
 * Usage:
 *   // In Server Components / Server Actions:
 *   import { createServerClient, getSessionUser } from "@siksatech/database";
 *
 *   // In Client Components:
 *   import { createBrowserClient } from "@siksatech/database";
 *
 *   // Types:
 *   import type { Profile, SessionUser, Course } from "@siksatech/database";
 *
 *   // Mock data (fallback when Supabase not configured):
 *   import { DEMO_BANNERS, DEMO_COURSES } from "@siksatech/database";
 */

// ─── Backwards-compatibility: legacy `supabase` singleton ───────────────────
// Some existing pages import `supabase` directly. They should migrate to
// createBrowserClient(), but we export null in the meantime so they don't crash.
/** @deprecated Use createBrowserClient() or createServerClient() instead */
export const supabase: null = null;

// ─── Backwards-compatibility: ADMIN_ROLES ────────────────────────────────────
/** @deprecated Use ROLES and PERMISSIONS from @siksatech/config instead */
export interface AdminRole {
  role: "super_admin" | "web_content_admin" | "course_admin" | "events_admin" | "store_admin";
  label: string;
  permissions: string[];
}

/** @deprecated Use ROLES and PERMISSIONS from @siksatech/config instead */
export const ADMIN_ROLES: AdminRole[] = [
  { role: "super_admin",      label: "Super Admin",        permissions: ["banners","faqs","courses","events","store","leads","users","settings"] },
  { role: "web_content_admin",label: "Web Content Admin",  permissions: ["banners","faqs"] },
  { role: "course_admin",     label: "Course Admin",       permissions: ["courses"] },
  { role: "events_admin",     label: "Events Admin",       permissions: ["events"] },
  { role: "store_admin",      label: "Store Admin",        permissions: ["store"] },
];


// ─── Client Factories ───────────────────────────────────────────────────────
export {
  createBrowserClient,
  createServerClient,
  createAdminClient,
  isRealSupabase,
} from "./client";
export type { SupabaseClient } from "./client";

// ─── TypeScript Types ────────────────────────────────────────────────────────
export type {
  // DB schema types
  Database,
  Profile,
  Role,
  Permission,
  UserRole,
  ParentChildLink,
  SessionUser,
  // Legacy / public types
  LearningPath,
  Course,
  Lesson,
  Project,
  ProjectStep,
  Lead,
  Certificate,
  Banner,
  FAQ,
  Competition,
  StoreKit,
} from "./types";

// ─── Server-Side Query Helpers ───────────────────────────────────────────────
export {
  getSessionUser,
  getProfile,
  upsertProfile,
  hasPermission,
  isInternalUser,
  getLearningPaths,
  getCourses,
  getCourseWithCurriculum,
  getUserEnrollment,
  enrollUserInCourse,
  getCourseProgress,
  markLessonCompleted,
  getAssessmentForCourse,
  gradeAssessment,
  verifyCertificate,
  issueCertificate,
  DEMO_ASSESSMENT,
} from "./queries";
export type { CourseModule, Enrollment, LessonProgress } from "./queries/learning";
export type { Assessment, AssessmentQuestion, AssessmentSubmissionResult } from "./queries/assessments";
export type { VerifiableCertificate } from "./queries/certificates";

// ─── Legacy Mock Data (Fallbacks) ────────────────────────────────────────────
// Used when Supabase credentials are not configured (development / demo mode)
export {
  DEMO_PATHS,
  DEMO_COURSES,
  DEMO_PROJECTS,
  DEMO_BANNERS,
  DEMO_FAQS,
  DEMO_COMPETITIONS,
  DEMO_STORE_KITS,
  DEMO_CERTIFICATES,
} from "./mocks";

// ─── Legacy db object (backwards compatibility) ──────────────────────────────
// Kept for pages that still import from "@siksatech/database" as `db`.
// Migrate these call sites to use Server Components + query helpers.
export { db } from "./legacy-db";
