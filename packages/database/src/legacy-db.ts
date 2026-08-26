/**
 * Legacy `db` object — backwards compatibility shim.
 *
 * This re-exports the old `db.*` pattern so existing pages don't break
 * while we migrate them to Server Components + query helpers.
 *
 * MIGRATION GUIDE:
 * - Replace `db.getBanners()` → fetch in Server Component via supabase client
 * - Replace `db.login()` / `db.register()` → use Server Actions with createServerClient
 * - Replace `db.getCurrentUser()` → use getSessionUser(supabase) in Server Component
 *
 * @deprecated Migrate call sites away from this as pages are updated.
 */

import { createClient } from "@supabase/supabase-js";
import type {
  Banner, FAQ, LearningPath, Course, Project,
  Competition, StoreKit, Certificate, Lead
} from "./types";
import {
  DEMO_BANNERS, DEMO_FAQS, DEMO_PATHS, DEMO_COURSES,
  DEMO_PROJECTS, DEMO_COMPETITIONS, DEMO_STORE_KITS, DEMO_CERTIFICATES
} from "./mocks";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";

export const isRealSupabase =
  !!supabaseUrl && !!supabaseAnonKey && supabaseUrl !== "placeholder";

// Browser-side client for legacy usage only
const supabase = isRealSupabase
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const db = {
  // ─── Banners ───────────────────────────────────────────────
  getBanners: async (): Promise<Banner[]> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase
        .from("banners").select("*").eq("is_active", true).order("sort_order");
      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id, title: d.title, subtitle: d.subtitle,
          ctaText: d.cta_text, ctaLink: d.cta_link, bgColor: d.bg_color,
          imageUrl: d.image_url, isActive: d.is_active, sortOrder: d.sort_order
        }));
      }
    }
    return isRealSupabase ? [] : DEMO_BANNERS;
  },

  saveBanner: async (banner: Omit<Banner, "id">): Promise<{ success: boolean }> => {
    if (!isRealSupabase || !supabase) return { success: false };
    const { error } = await supabase.from("banners").insert([{
      title: banner.title, subtitle: banner.subtitle, cta_text: banner.ctaText,
      cta_link: banner.ctaLink, bg_color: banner.bgColor, image_url: banner.imageUrl,
      is_active: banner.isActive, sort_order: banner.sortOrder
    }]);
    return { success: !error };
  },

  deleteBanner: async (id: string): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase.from("banners").delete().eq("id", id);
    return !error;
  },

  // ─── FAQs ──────────────────────────────────────────────────
  getFAQs: async (category?: string): Promise<FAQ[]> => {
    if (isRealSupabase && supabase) {
      let query = supabase.from("faqs").select("*").order("sort_order");
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id, question: d.question, answer: d.answer,
          category: d.category, sortOrder: d.sort_order
        }));
      }
    }
    return isRealSupabase ? [] : (category ? DEMO_FAQS.filter(f => f.category === category) : DEMO_FAQS);
  },

  saveFAQ: async (faq: Omit<FAQ, "id">): Promise<{ success: boolean }> => {
    if (!isRealSupabase || !supabase) return { success: false };
    const { error } = await supabase.from("faqs").insert([{
      question: faq.question, answer: faq.answer,
      category: faq.category, sort_order: faq.sortOrder
    }]);
    return { success: !error };
  },

  deleteFAQ: async (id: string): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    return !error;
  },

  // ─── Learning ──────────────────────────────────────────────
  getLearningPaths: async (): Promise<LearningPath[]> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase.from("learning_paths").select("*").order("sort_order");
      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id, title: d.title, targetAges: d.target_ages,
          description: d.description, skills: d.skills || [], projectsCount: d.projects_count
        }));
      }
    }
    return isRealSupabase ? [] : DEMO_PATHS;
  },

  getCourses: async (pathId?: string): Promise<Course[]> => {
    if (isRealSupabase && supabase) {
      let query = supabase.from("courses").select("*").order("sort_order");
      if (pathId) query = query.eq("learning_path_id", pathId);
      const { data, error } = await query;
      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id, learningPathId: d.learning_path_id, title: d.title,
          description: d.description, difficulty: d.difficulty, duration: d.duration,
          modulesCount: d.modules_count, skills: d.skills || [], classLevels: d.class_levels
        }));
      }
    }
    return isRealSupabase ? [] : (pathId ? DEMO_COURSES.filter(c => c.learningPathId === pathId) : DEMO_COURSES);
  },

  saveCourse: async (course: Course): Promise<{ success: boolean }> => {
    if (!isRealSupabase || !supabase) return { success: false };
    const { error } = await supabase.from("courses").upsert([{
      id: course.id, learning_path_id: course.learningPathId, title: course.title,
      description: course.description, difficulty: course.difficulty, duration: course.duration,
      modules_count: course.modulesCount, skills: course.skills, class_levels: course.classLevels || []
    }]);
    return { success: !error };
  },

  deleteCourse: async (id: string): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    return !error;
  },

  // ─── Projects ──────────────────────────────────────────────
  getProjects: async (featuredOnly = false): Promise<Project[]> => {
    if (isRealSupabase && supabase) {
      let query = supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (featuredOnly) query = query.eq("is_featured", true);
      const { data, error } = await query;
      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id, title: d.title, description: d.description,
          problemStatement: d.problem_statement, studentLevel: d.student_level,
          difficulty: d.difficulty, skills: d.skills || [], technologies: d.technologies || [],
          components: d.components || [], learningObjectives: d.learning_objectives || [],
          creatorName: d.creator_name, creatorSchool: d.creator_school,
          creatorGrade: d.creator_grade, isFeatured: d.is_featured,
          steps: d.steps, codeSnippet: d.code_snippet, imageUrl: d.image_url
        }));
      }
    }
    return isRealSupabase ? [] : (featuredOnly ? DEMO_PROJECTS.filter(p => p.isFeatured) : DEMO_PROJECTS);
  },

  getProject: async (id: string): Promise<Project | null> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
      if (!error && data) {
        return {
          id: data.id, title: data.title, description: data.description,
          problemStatement: data.problem_statement, studentLevel: data.student_level,
          difficulty: data.difficulty, skills: data.skills || [], technologies: data.technologies || [],
          components: data.components || [], learningObjectives: data.learning_objectives || [],
          creatorName: data.creator_name, creatorSchool: data.creator_school,
          creatorGrade: data.creator_grade, isFeatured: data.is_featured,
          steps: data.steps, codeSnippet: data.code_snippet, imageUrl: data.image_url
        };
      }
    }
    return isRealSupabase ? null : (DEMO_PROJECTS.find(p => p.id === id) || null);
  },

  saveProject: async (project: Omit<Project, "id"> & { id?: string }): Promise<{ success: boolean; data?: Project }> => {
    const projId = project.id || `proj-${Date.now()}`;
    if (isRealSupabase && supabase) {
      const { error } = await supabase.from("projects").upsert([{
        id: projId, title: project.title, description: project.description,
        problem_statement: project.problemStatement, student_level: project.studentLevel,
        difficulty: project.difficulty, skills: project.skills, technologies: project.technologies,
        components: project.components, learning_objectives: project.learningObjectives,
        creator_name: project.creatorName, creator_school: project.creatorSchool,
        creator_grade: project.creatorGrade, is_featured: project.isFeatured ?? true,
        steps: project.steps || [], code_snippet: project.codeSnippet || "", image_url: project.imageUrl || ""
      }]);
      if (error) return { success: false };
    }
    return { success: true, data: { id: projId, ...project } as Project };
  },

  deleteProject: async (id: string): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    return !error;
  },

  // ─── Competitions ──────────────────────────────────────────
  getCompetitions: async (): Promise<Competition[]> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase.from("competitions").select("*").order("date");
      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id, title: d.title, description: d.description,
          date: d.date, endDate: d.end_date, location: d.location,
          type: d.type, status: d.status, registrationLink: d.registration_link, imageUrl: d.image_url
        }));
      }
    }
    return isRealSupabase ? [] : DEMO_COMPETITIONS;
  },

  saveCompetition: async (comp: Omit<Competition, "id">): Promise<{ success: boolean }> => {
    if (!isRealSupabase || !supabase) return { success: false };
    const { error } = await supabase.from("competitions").insert([{
      title: comp.title, description: comp.description, date: comp.date,
      end_date: comp.endDate, location: comp.location, type: comp.type,
      status: comp.status, registration_link: comp.registrationLink, image_url: comp.imageUrl
    }]);
    return { success: !error };
  },

  deleteCompetition: async (id: string): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase.from("competitions").delete().eq("id", id);
    return !error;
  },

  // ─── Store Kits ────────────────────────────────────────────
  getStoreKits: async (category?: string): Promise<StoreKit[]> => {
    if (isRealSupabase && supabase) {
      let query = supabase.from("store_kits").select("*").order("price");
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id, name: d.name, description: d.description, price: d.price,
          originalPrice: d.original_price, category: d.category, imageUrl: d.image_url,
          features: d.features || [], inStock: d.in_stock, stockCount: d.stock_count
        }));
      }
    }
    return isRealSupabase ? [] : (category ? DEMO_STORE_KITS.filter(k => k.category === category) : DEMO_STORE_KITS);
  },

  saveStoreKit: async (kit: Omit<StoreKit, "id">): Promise<{ success: boolean }> => {
    if (!isRealSupabase || !supabase) return { success: false };
    const { error } = await supabase.from("store_kits").insert([{
      name: kit.name, description: kit.description, price: kit.price,
      original_price: kit.originalPrice, category: kit.category, image_url: kit.imageUrl,
      features: kit.features, in_stock: kit.inStock, stock_count: kit.stockCount
    }]);
    return { success: !error };
  },

  updateStoreKit: async (id: string, updates: Partial<StoreKit>): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.stockCount !== undefined) dbUpdates.stock_count = updates.stockCount;
    if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
    const { error } = await supabase.from("store_kits").update(dbUpdates).eq("id", id);
    return !error;
  },

  deleteStoreKit: async (id: string): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase.from("store_kits").delete().eq("id", id);
    return !error;
  },

  // ─── Leads ─────────────────────────────────────────────────
  submitLead: async (
    leadType: Lead["leadType"],
    name: string, email: string, phone: string,
    details: Record<string, string>
  ): Promise<{ success: boolean; data?: Lead; error?: string }> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase
        .from("leads")
        .insert([{ lead_type: leadType, name, email, phone, details, status: "new" }])
        .select().single();
      if (error) return { success: false, error: error.message };
      return {
        success: true,
        data: { id: data.id, leadType: data.lead_type, name: data.name, email: data.email,
          phone: data.phone, details: data.details, status: data.status, createdAt: data.created_at }
      };
    }
    return { success: false, error: "Database not configured" };
  },

  getLeads: async (): Promise<Lead[]> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (error) return [];
      return data.map((d: any) => ({
        id: d.id, leadType: d.lead_type, name: d.name, email: d.email,
        phone: d.phone, details: d.details, status: d.status, createdAt: d.created_at
      }));
    }
    return [];
  },

  updateLeadStatus: async (id: string, status: Lead["status"]): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    return !error;
  },

  // ─── Certificates ──────────────────────────────────────────
  saveCertificate: async (cert: Certificate): Promise<{ success: boolean }> => {
    if (!isRealSupabase || !supabase) return { success: false };
    const { error } = await supabase.from("certificates").upsert([{
      id: cert.id, student_name: cert.studentName, program_name: cert.programName,
      achievement: cert.achievement, issued_date: cert.issuedDate,
      skills_verified: cert.skillsVerified,
      verification_hash: `ST-${cert.id}-${Date.now()}`
    }]);
    return { success: !error };
  },

  deleteCertificate: async (id: string): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase.from("certificates").delete().eq("id", id);
    return !error;
  },

  getCertificates: async (): Promise<Certificate[]> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase.from("certificates").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id, studentName: d.student_name, programName: d.program_name,
          achievement: d.achievement, issuedDate: d.issued_date, skillsVerified: d.skills_verified || []
        }));
      }
    }
    return isRealSupabase ? [] : Object.values(DEMO_CERTIFICATES);
  },

  verifyCertificate: async (id: string): Promise<Certificate | null> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase.from("certificates").select("*").eq("id", id).single();
      if (!error && data) {
        return {
          id: data.id, studentName: data.student_name, programName: data.program_name,
          achievement: data.achievement, issuedDate: data.issued_date, skillsVerified: data.skills_verified || []
        };
      }
    }
    return isRealSupabase ? null : (DEMO_CERTIFICATES[id] || null);
  },

  // ─── Auth (DEPRECATED — use Server Actions + createServerClient) ─────────
  /** @deprecated Use Server Actions with createServerClient instead */
  getCurrentUser: (): null => {
    // Removed localStorage usage — returns null to prevent SSR breaks.
    // Migrate to: const session = await getSessionUser(supabase) in Server Components
    return null;
  },

  /** @deprecated Use Server Action with createServerClient().auth.signInWithPassword() */
  login: async (email: string, password: string): Promise<{ success: boolean; user?: unknown; error?: string }> => {
    if (!isRealSupabase || !supabase) return { success: false, error: "Authentication not configured" };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true, user: { id: data.user.id, email: data.user.email } };
  },

  /** @deprecated Use Server Action with createServerClient().auth.signUp() */
  register: async (
    email: string, password: string, name: string, _role: string,
    details: { grade?: string; institution?: string }
  ): Promise<{ success: boolean; user?: unknown; error?: string }> => {
    if (!isRealSupabase || !supabase) return { success: false, error: "Registration not configured" };
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name, grade_level: details.grade, school_college_name: details.institution } }
    });
    if (error) return { success: false, error: error.message };
    return { success: true, user: { email, name } };
  },

  /** @deprecated Use Server Action with createServerClient().auth.signOut() */
  logout: async (): Promise<void> => {
    if (isRealSupabase && supabase) await supabase.auth.signOut();
  },
};

// Named legacy exports for files that import these directly
export const login = db.login;
export const register = db.register;
export const logout = db.logout;
/** @deprecated Use getSessionUser() in Server Components */
export const getCurrentUser = db.getCurrentUser;
