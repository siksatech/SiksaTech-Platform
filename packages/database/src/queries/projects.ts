/**
 * Server-side Project Showcase & Student Build Submission queries
 */
import type { SupabaseClient } from "../client";
import type { Project } from "../types";
import { DEMO_PROJECTS } from "../mocks";

export interface StudentProjectSubmission {
  id?: string;
  student_id?: string | null;
  creator_name: string;
  creator_school?: string;
  creator_grade?: string;
  title: string;
  description: string;
  problem_statement?: string;
  student_level: string;
  difficulty: "Easy" | "Medium" | "Hard";
  skills?: string[];
  technologies?: string[];
  components?: string[];
  learning_objectives?: string[];
  code_snippet?: string;
  schematic_diagram?: string;
  video_url?: string;
  image_url?: string;
  status?: "pending" | "approved" | "rejected" | "draft";
}

/**
 * Fetch all approved projects for the public build gallery
 */
export async function getPublicProjects(
  supabase?: SupabaseClient,
  options?: { featuredOnly?: boolean; studentLevel?: string }
): Promise<Project[]> {
  if (supabase) {
    let query = (supabase as any)
      .from("student_projects")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (options?.featuredOnly) {
      query = query.eq("is_featured", true);
    }

    if (options?.studentLevel && options.studentLevel !== "all") {
      query = query.ilike("student_level", `%${options.studentLevel}%`);
    }

    const { data, error } = await query;
    if (!error && data) {
      return data.map((d: any) => ({
        id: d.slug || d.id,
        title: d.title,
        description: d.description,
        problemStatement: d.problem_statement || "",
        studentLevel: d.student_level,
        difficulty: d.difficulty,
        skills: d.skills || [],
        technologies: d.technologies || [],
        components: d.components || [],
        learningObjectives: d.learning_objectives || [],
        creatorName: d.creator_name,
        creatorSchool: d.creator_school,
        creatorGrade: d.creator_grade,
        isFeatured: d.is_featured,
        codeSnippet: d.code_snippet,
        schematic: d.schematic_diagram,
        imageUrl: d.image_url,
        videoUrl: d.video_url
      }));
    }
  }

  let list = DEMO_PROJECTS;
  if (options?.featuredOnly) {
    list = list.filter((p) => p.isFeatured);
  }
  if (options?.studentLevel && options.studentLevel !== "all") {
    list = list.filter((p) =>
      p.studentLevel.toLowerCase().includes(options.studentLevel!.toLowerCase())
    );
  }
  return list;
}

/**
 * Fetch a single project by ID or slug
 */
export async function getProjectBySlug(
  supabase: SupabaseClient | undefined,
  slugOrId: string
): Promise<Project | null> {
  if (supabase) {
    const { data, error } = await (supabase as any)
      .from("student_projects")
      .select("*")
      .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
      .single();

    if (!error && data) {
      return {
        id: data.slug || data.id,
        title: data.title,
        description: data.description,
        problemStatement: data.problem_statement || "",
        studentLevel: data.student_level,
        difficulty: data.difficulty,
        skills: data.skills || [],
        technologies: data.technologies || [],
        components: data.components || [],
        learningObjectives: data.learning_objectives || [],
        creatorName: data.creator_name,
        creatorSchool: data.creator_school,
        creatorGrade: data.creator_grade,
        isFeatured: data.is_featured,
        codeSnippet: data.code_snippet,
        schematic: data.schematic_diagram,
        imageUrl: data.image_url,
        videoUrl: data.video_url
      };
    }
  }

  return DEMO_PROJECTS.find((p) => p.id === slugOrId) || null;
}

/**
 * Submit a student hardware build for review
 */
export async function submitStudentBuild(
  supabase: SupabaseClient | undefined,
  payload: StudentProjectSubmission
): Promise<{ success: boolean; projectId?: string; error?: string }> {
  const slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  if (supabase) {
    const { data, error } = await (supabase as any)
      .from("student_projects")
      .insert({
        slug: `${slug}-${Date.now().toString(36)}`,
        student_id: payload.student_id || null,
        creator_name: payload.creator_name,
        creator_school: payload.creator_school || "",
        creator_grade: payload.creator_grade || "",
        title: payload.title,
        description: payload.description,
        problem_statement: payload.problem_statement || "",
        student_level: payload.student_level,
        difficulty: payload.difficulty,
        skills: payload.skills || [],
        technologies: payload.technologies || [],
        components: payload.components || [],
        learning_objectives: payload.learning_objectives || [],
        code_snippet: payload.code_snippet || "",
        schematic_diagram: payload.schematic_diagram || "",
        video_url: payload.video_url || "",
        status: "pending",
        is_featured: false
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, projectId: data.id };
  }

  return { success: true, projectId: `demo-${Date.now()}` };
}
