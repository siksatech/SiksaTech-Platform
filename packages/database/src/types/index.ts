/**
 * Barrel export for all database types
 */
export type { Database, Profile, Role, Permission, UserRole, ParentChildLink, SessionUser } from "./database";
export type {
  LearningPath, Course, Lesson, Project, ProjectStep,
  Lead, Certificate, Banner, FAQ, Competition, StoreKit
} from "./legacy";
