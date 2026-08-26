/**
 * Server-side Learning & Course query functions
 */
import type { SupabaseClient } from "../client";
import type { Course, Lesson, LearningPath } from "../types";
import { DEMO_PATHS, DEMO_COURSES } from "../mocks";

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  lessons?: Lesson[];
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: "active" | "completed" | "dropped";
  enrolled_at: string;
  completed_at: string | null;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  is_completed: boolean;
  completed_at: string | null;
  notes: string | null;
}

/**
 * Fetch all learning paths
 */
export async function getLearningPaths(supabase?: SupabaseClient): Promise<LearningPath[]> {
  if (supabase) {
    const { data, error } = await (supabase as any)
      .from("learning_paths")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data) {
      return data;
    }
  }
  return DEMO_PATHS;
}

/**
 * Fetch courses with optional learning path filter
 */
export async function getCourses(
  supabase?: SupabaseClient,
  pathId?: string
): Promise<Course[]> {
  if (supabase) {
    let query = (supabase as any)
      .from("courses")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (pathId) query = query.eq("learning_path_id", pathId);
    const { data, error } = await query;
    if (!error && data) {
      return data.map((d: any) => ({
        id: d.id,
        learningPathId: d.learning_path_id,
        title: d.title,
        description: d.description,
        difficulty: d.difficulty,
        duration: d.duration,
        modulesCount: 0,
        skills: d.skills || [],
        classLevels: d.class_levels || []
      }));
    }
  }
  if (pathId) {
    return DEMO_COURSES.filter((c) => c.learningPathId === pathId);
  }
  return DEMO_COURSES;
}

/**
 * Fetch course details by ID including its modules and lessons
 */
export async function getCourseWithCurriculum(
  supabase: SupabaseClient | undefined,
  courseId: string
): Promise<{ course: Course | null; modules: CourseModule[]; lessons: Lesson[] }> {
  if (supabase) {
    const { data: courseData } = await (supabase as any)
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (courseData) {
      const { data: modulesData } = await (supabase as any)
        .from("course_modules")
        .select("*")
        .eq("course_id", courseId)
        .order("sort_order", { ascending: true });

      const { data: lessonsData } = await (supabase as any)
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      const course: Course = {
        id: courseData.id,
        learningPathId: courseData.learning_path_id,
        title: courseData.title,
        description: courseData.description,
        difficulty: courseData.difficulty,
        duration: courseData.duration,
        modulesCount: (modulesData || []).length,
        skills: courseData.skills || [],
        classLevels: courseData.class_levels || []
      };

      return {
        course,
        modules: modulesData || [],
        lessons: (lessonsData || []).map((l: any) => ({
          id: l.id,
          courseId: l.course_id,
          title: l.title,
          moduleTitle: l.module_id || "",
          contentMarkdown: l.content_markdown || "",
          starterCode: l.starter_code,
          solutionCode: l.solution_code,
          lessonType: l.lesson_type,
          durationMinutes: l.duration_minutes || 15,
          sortOrder: l.sort_order || 0
        }))
      };
    }
  }

  // Fallback to demo course
  const fallback = DEMO_COURSES.find((c) => c.id === courseId) || null;
  return {
    course: fallback,
    modules: [],
    lessons: []
  };
}

/**
 * Check if a user is enrolled in a course
 */
export async function getUserEnrollment(
  supabase: SupabaseClient,
  userId: string,
  courseId: string
): Promise<Enrollment | null> {
  const { data, error } = await (supabase as any)
    .from("enrollments")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Enroll user into a course
 */
export async function enrollUserInCourse(
  supabase: SupabaseClient,
  userId: string,
  courseId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await (supabase as any)
    .from("enrollments")
    .upsert({
      user_id: userId,
      course_id: courseId,
      status: "active",
      enrolled_at: new Date().toISOString()
    });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * Fetch lesson completion progress for a user in a course
 */
export async function getCourseProgress(
  supabase: SupabaseClient,
  userId: string,
  courseId: string
): Promise<LessonProgress[]> {
  const { data, error } = await (supabase as any)
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId);

  if (error || !data) return [];
  return data;
}

/**
 * Toggle or mark a lesson as completed
 */
export async function markLessonCompleted(
  supabase: SupabaseClient,
  userId: string,
  courseId: string,
  lessonId: string,
  isCompleted: boolean = true
): Promise<{ success: boolean; error?: string }> {
  const { error } = await (supabase as any)
    .from("lesson_progress")
    .upsert({
      user_id: userId,
      course_id: courseId,
      lesson_id: lessonId,
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null
    });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
