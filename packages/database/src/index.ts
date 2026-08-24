import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isRealSupabase = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== "placeholder");

export const supabase = isRealSupabase
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export interface LearningPath {
  id: string;
  title: string;
  targetAges: string;
  description: string;
  skills: string[];
  projectsCount: number;
}

export interface Course {
  id: string;
  learningPathId: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  modulesCount: number;
  skills: string[];
  classLevels?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  problemStatement: string;
  studentLevel: string;
  difficulty: "Easy" | "Medium" | "Hard";
  skills: string[];
  technologies: string[];
  components: string[];
  learningObjectives: string[];
  creatorName: string;
  creatorSchool?: string;
  creatorGrade?: string;
  isFeatured: boolean;
  steps?: ProjectStep[];
  codeSnippet?: string;
  schematic?: string;
  imageUrl?: string;
}

export interface ProjectStep {
  stepNumber: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface Lead {
  id: string;
  leadType: "student" | "parent" | "school" | "college" | "industry";
  name: string;
  email: string;
  phone: string;
  details: Record<string, string>;
  status: "new" | "contacted" | "converted";
  createdAt: string;
}

export interface Certificate {
  id: string;
  studentName: string;
  programName: string;
  achievement: string;
  issuedDate: string;
  skillsVerified: string[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  bgColor: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "general" | "student" | "institution" | "store";
  sortOrder: number;
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  type: "hackathon" | "competition" | "workshop" | "event";
  status: "upcoming" | "ongoing" | "completed";
  registrationLink?: string;
  imageUrl?: string;
}

export interface StoreKit {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: "explorer" | "builder" | "creator" | "engineer" | "component" | "accessory";
  imageUrl?: string;
  features: string[];
  inStock: boolean;
  stockCount: number;
}

export interface AdminRole {
  role: "super_admin" | "web_content_admin" | "course_admin" | "events_admin" | "store_admin";
  label: string;
  permissions: string[];
}

export const ADMIN_ROLES: AdminRole[] = [
  {
    role: "super_admin",
    label: "Super Admin",
    permissions: ["banners", "faqs", "courses", "events", "store", "leads", "users", "settings"]
  },
  {
    role: "web_content_admin",
    label: "Web Content Admin",
    permissions: ["banners", "faqs"]
  },
  {
    role: "course_admin",
    label: "Course Admin",
    permissions: ["courses"]
  },
  {
    role: "events_admin",
    label: "Events Admin",
    permissions: ["events"]
  },
  {
    role: "store_admin",
    label: "Store Admin",
    permissions: ["store"]
  }
];

export const db = {
  getBanners: async (): Promise<Banner[]> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          title: d.title,
          subtitle: d.subtitle,
          ctaText: d.cta_text,
          ctaLink: d.cta_link,
          bgColor: d.bg_color,
          imageUrl: d.image_url,
          isActive: d.is_active,
          sortOrder: d.sort_order
        }));
      }
    }
    return DEMO_BANNERS;
  },

  saveBanner: async (banner: Omit<Banner, "id">): Promise<{ success: boolean; data?: Banner }> => {
    if (!isRealSupabase || !supabase) return { success: false };
    const { data, error } = await supabase
      .from("banners")
      .insert([{
        title: banner.title,
        subtitle: banner.subtitle,
        cta_text: banner.ctaText,
        cta_link: banner.ctaLink,
        bg_color: banner.bgColor,
        image_url: banner.imageUrl,
        is_active: banner.isActive,
        sort_order: banner.sortOrder
      }])
      .select()
      .single();
    if (error) return { success: false };
    return { success: true, data: { id: data.id, ...banner } };
  },

  deleteBanner: async (id: string): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase.from("banners").delete().eq("id", id);
    return !error;
  },

  getFAQs: async (category?: string): Promise<FAQ[]> => {
    if (isRealSupabase && supabase) {
      let query = supabase.from("faqs").select("*").order("sort_order", { ascending: true });
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          question: d.question,
          answer: d.answer,
          category: d.category,
          sortOrder: d.sort_order
        }));
      }
    }
    return category ? DEMO_FAQS.filter(f => f.category === category) : DEMO_FAQS;
  },

  saveFAQ: async (faq: Omit<FAQ, "id">): Promise<{ success: boolean }> => {
    if (!isRealSupabase || !supabase) return { success: false };
    const { error } = await supabase.from("faqs").insert([{
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      sort_order: faq.sortOrder
    }]);
    return { success: !error };
  },

  deleteFAQ: async (id: string): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    return !error;
  },

  getCompetitions: async (): Promise<Competition[]> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase.from("competitions").select("*").order("date", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          date: d.date,
          endDate: d.end_date,
          location: d.location,
          type: d.type,
          status: d.status,
          registrationLink: d.registration_link,
          imageUrl: d.image_url
        }));
      }
    }
    return DEMO_COMPETITIONS;
  },

  saveCompetition: async (comp: Omit<Competition, "id">): Promise<{ success: boolean }> => {
    if (!isRealSupabase || !supabase) return { success: false };
    const { error } = await supabase.from("competitions").insert([{
      title: comp.title,
      description: comp.description,
      date: comp.date,
      end_date: comp.endDate,
      location: comp.location,
      type: comp.type,
      status: comp.status,
      registration_link: comp.registrationLink,
      image_url: comp.imageUrl
    }]);
    return { success: !error };
  },

  deleteCompetition: async (id: string): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase.from("competitions").delete().eq("id", id);
    return !error;
  },

  getStoreKits: async (category?: string): Promise<StoreKit[]> => {
    if (isRealSupabase && supabase) {
      let query = supabase.from("store_kits").select("*").order("price", { ascending: true });
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          name: d.name,
          description: d.description,
          price: d.price,
          originalPrice: d.original_price,
          category: d.category,
          imageUrl: d.image_url,
          features: d.features || [],
          inStock: d.in_stock,
          stockCount: d.stock_count
        }));
      }
    }
    return category ? DEMO_STORE_KITS.filter(k => k.category === category) : DEMO_STORE_KITS;
  },

  saveStoreKit: async (kit: Omit<StoreKit, "id">): Promise<{ success: boolean }> => {
    if (!isRealSupabase || !supabase) return { success: false };
    const { error } = await supabase.from("store_kits").insert([{
      name: kit.name,
      description: kit.description,
      price: kit.price,
      original_price: kit.originalPrice,
      category: kit.category,
      image_url: kit.imageUrl,
      features: kit.features,
      in_stock: kit.inStock,
      stock_count: kit.stockCount
    }]);
    return { success: !error };
  },

  updateStoreKit: async (id: string, updates: Partial<StoreKit>): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const dbUpdates: any = {};
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

  submitLead: async (
    leadType: Lead["leadType"],
    name: string,
    email: string,
    phone: string,
    details: Record<string, string>
  ): Promise<{ success: boolean; data?: Lead; error?: string }> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase
        .from("leads")
        .insert([{ lead_type: leadType, name, email, phone, details, status: "new" }])
        .select()
        .single();
      
      if (error) return { success: false, error: error.message };
      return { 
        success: true, 
        data: {
          id: data.id,
          leadType: data.lead_type,
          name: data.name,
          email: data.email,
          phone: data.phone,
          details: data.details,
          status: data.status,
          createdAt: data.created_at
        } 
      };
    }
    return { success: false, error: "Database not configured" };
  },

  getLeads: async (): Promise<Lead[]> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return [];
      return data.map((d: any) => ({
        id: d.id,
        leadType: d.lead_type,
        name: d.name,
        email: d.email,
        phone: d.phone,
        details: d.details,
        status: d.status,
        createdAt: d.created_at
      }));
    }
    return [];
  },

  updateLeadStatus: async (id: string, status: Lead["status"]): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);
    return !error;
  },

  getLearningPaths: async (): Promise<LearningPath[]> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase.from("learning_paths").select("*").order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          title: d.title,
          targetAges: d.target_ages,
          description: d.description,
          skills: d.skills || [],
          projectsCount: d.projects_count
        }));
      }
    }
    return DEMO_PATHS;
  },

  getCourses: async (pathId?: string): Promise<Course[]> => {
    if (isRealSupabase && supabase) {
      let query = supabase.from("courses").select("*").order("sort_order", { ascending: true });
      if (pathId) query = query.eq("learning_path_id", pathId);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          learningPathId: d.learning_path_id,
          title: d.title,
          description: d.description,
          difficulty: d.difficulty,
          duration: d.duration,
          modulesCount: d.modules_count,
          skills: d.skills || [],
          classLevels: d.class_levels
        }));
      }
    }
    if (pathId) {
      return DEMO_COURSES.filter(c => c.learningPathId === pathId);
    }
    return DEMO_COURSES;
  },

  getProjects: async (featuredOnly = false): Promise<Project[]> => {
    if (isRealSupabase && supabase) {
      let query = supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (featuredOnly) query = query.eq("is_featured", true);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          problemStatement: d.problem_statement,
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
          steps: d.steps,
          codeSnippet: d.code_snippet,
          schematic: d.schematic,
          imageUrl: d.image_url
        }));
      }
    }
    if (featuredOnly) {
      return DEMO_PROJECTS.filter(p => p.isFeatured);
    }
    return DEMO_PROJECTS;
  },

  getProject: async (id: string): Promise<Project | null> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          problemStatement: data.problem_statement,
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
          steps: data.steps,
          codeSnippet: data.code_snippet,
          schematic: data.schematic,
          imageUrl: data.image_url
        };
      }
    }
    return DEMO_PROJECTS.find(p => p.id === id) || null;
  },

  verifyCertificate: async (id: string): Promise<Certificate | null> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase.from("certificates").select("*").eq("id", id).single();
      if (!error && data) {
        return {
          id: data.id,
          studentName: data.student_name,
          programName: data.program_name,
          achievement: data.achievement,
          issuedDate: data.issued_date,
          skillsVerified: data.skills_verified || []
        };
      }
    }
    return DEMO_CERTIFICATES[id] || null;
  },

  getCurrentUser: () => {
    if (typeof window === "undefined") return null;
    try {
      const item = window.localStorage.getItem("siksatech_user");
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  login: async (email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> => {
    if (!isRealSupabase || !supabase) {
      return { success: false, error: "Authentication not configured" };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      
      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: profile?.full_name || "User",
        role: profile?.role || "student",
        grade: profile?.grade_level,
        institution: profile?.school_college_name
      };
      return { success: true, user: userData };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  register: async (email: string, password: string, name: string, role: string, details: { grade?: string; institution?: string }): Promise<{ success: boolean; user?: any; error?: string }> => {
    if (!isRealSupabase || !supabase) {
      return { success: false, error: "Registration not configured" };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, grade_level: details.grade, school_college_name: details.institution } }
      });
      if (error) return { success: false, error: error.message };
      
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email,
          full_name: name,
          role: role || "student",
          school_college_name: details.institution,
          grade_level: details.grade,
          created_at: new Date().toISOString()
        });
      }
      return { success: true, user: { email, name, role } };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  logout: async () => {
    if (isRealSupabase && supabase) {
      await supabase.auth.signOut();
    }
  }
};

export const login = db.login;
export const register = db.register;
export const logout = db.logout;
export const getCurrentUser = db.getCurrentUser;

