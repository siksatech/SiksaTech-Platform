/**
 * Legacy/public-facing data types
 * These types are used by the public website (siksatech.in)
 * and will gradually be replaced by DB-backed types.
 */

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

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  moduleTitle: string;
  contentMarkdown: string;
  starterCode?: string;
  solutionCode?: string;
  lessonType: "theory" | "code" | "lab" | "project";
  durationMinutes: number;
  sortOrder: number;
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
  videoUrl?: string;
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
