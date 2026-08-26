/**
 * Platform-wide role and permission definitions.
 *
 * These are the canonical definitions for the SiksaTech RBAC system.
 * They mirror what's seeded in the database (Migration 002).
 *
 * Use these constants for:
 * - hasPermission() checks in Server Components
 * - UI-level conditional rendering (guarded by server checks too)
 * - Middleware role guards
 */

// ─────────────────────────────────────────────────────────────
// ROLE NAMES
// ─────────────────────────────────────────────────────────────

export const ROLES = {
  SUPER_ADMIN:      "super_admin",
  OPS_MANAGER:      "ops_manager",
  CONTENT_MANAGER:  "content_manager",
  STORE_MANAGER:    "store_manager",
  ACCOUNTS_MANAGER: "accounts_manager",
  PR_MANAGER:       "pr_manager",
  SUPPORT_STAFF:    "support_staff",
} as const;

export type RoleName = typeof ROLES[keyof typeof ROLES];

/** All roles that grant access to team.siksatech.in */
export const INTERNAL_ROLES: RoleName[] = Object.values(ROLES);

// ─────────────────────────────────────────────────────────────
// PERMISSION NAMES
// ─────────────────────────────────────────────────────────────

export const PERMISSIONS = {
  // Users
  USERS_VIEW:           "users.view",
  USERS_CREATE:         "users.create",
  USERS_EDIT:           "users.edit",
  USERS_DELETE:         "users.delete",
  USERS_BULK_CREATE:    "users.bulk_create",
  ROLES_MANAGE:         "roles.manage",

  // Institutions
  INSTITUTIONS_VIEW:    "institutions.view",
  INSTITUTIONS_CREATE:  "institutions.create",
  INSTITUTIONS_EDIT:    "institutions.edit",
  INSTITUTIONS_MANAGE:  "institutions.manage",

  // Courses
  COURSES_VIEW:         "courses.view",
  COURSES_CREATE:       "courses.create",
  COURSES_EDIT:         "courses.edit",
  COURSES_PUBLISH:      "courses.publish",
  COURSES_DELETE:       "courses.delete",
  LESSONS_CREATE:       "lessons.create",
  LESSONS_EDIT:         "lessons.edit",
  ASSESSMENTS_CREATE:   "assessments.create",
  ASSESSMENTS_GRADE:    "assessments.grade",
  CERTIFICATES_ISSUE:   "certificates.issue",
  ENROLLMENTS_MANAGE:   "enrollments.manage",

  // Programs
  PROGRAMS_VIEW:        "programs.view",
  PROGRAMS_CREATE:      "programs.create",
  PROGRAMS_EDIT:        "programs.edit",
  PROGRAMS_MANAGE:      "programs.manage",
  PROGRAMS_SCORE:       "programs.score",

  // Content review
  PROJECTS_VIEW:        "projects.view",
  PROJECTS_REVIEW:      "projects.review",
  PROJECTS_PUBLISH:     "projects.publish",
  BLOGS_VIEW:           "blogs.view",
  BLOGS_REVIEW:         "blogs.review",
  BLOGS_PUBLISH:        "blogs.publish",

  // Community
  COMMUNITY_VIEW:       "community.view",
  COMMUNITY_MODERATE:   "community.moderate",
  COMMUNITY_MANAGE:     "community.manage",
  ANNOUNCEMENTS_CREATE: "announcements.create",

  // Store
  PRODUCTS_VIEW:        "products.view",
  PRODUCTS_CREATE:      "products.create",
  PRODUCTS_EDIT:        "products.edit",
  PRODUCTS_DELETE:      "products.delete",
  INVENTORY_VIEW:       "inventory.view",
  INVENTORY_MANAGE:     "inventory.manage",
  ORDERS_VIEW:          "orders.view",
  ORDERS_MANAGE:        "orders.manage",
  ORDERS_CANCEL:        "orders.cancel",

  // Accounts
  PAYMENTS_VIEW:        "payments.view",
  REFUNDS_MANAGE:       "refunds.manage",
  INVOICES_VIEW:        "invoices.view",
  INVOICES_CREATE:      "invoices.create",
  REPORTS_VIEW:         "reports.view",

  // Platform
  AUDIT_LOGS_VIEW:      "audit_logs.view",
  SETTINGS_MANAGE:      "settings.manage",
} as const;

export type PermissionName = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// ─────────────────────────────────────────────────────────────
// ROLE → PERMISSIONS MAP (client-side reference)
// Source of truth is the DB seed, this is for UI hints only.
// ─────────────────────────────────────────────────────────────

export const ROLE_PERMISSION_MAP: Record<RoleName, PermissionName[]> = {
  super_admin: Object.values(PERMISSIONS) as PermissionName[],

  ops_manager: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.INSTITUTIONS_VIEW, PERMISSIONS.INSTITUTIONS_CREATE,
    PERMISSIONS.INSTITUTIONS_EDIT, PERMISSIONS.INSTITUTIONS_MANAGE,
    PERMISSIONS.USERS_BULK_CREATE,
    PERMISSIONS.PROGRAMS_VIEW, PERMISSIONS.PROGRAMS_CREATE,
    PERMISSIONS.PROGRAMS_EDIT, PERMISSIONS.PROGRAMS_MANAGE, PERMISSIONS.PROGRAMS_SCORE,
    PERMISSIONS.REPORTS_VIEW, PERMISSIONS.AUDIT_LOGS_VIEW,
  ],

  content_manager: [
    PERMISSIONS.COURSES_VIEW, PERMISSIONS.COURSES_CREATE, PERMISSIONS.COURSES_EDIT,
    PERMISSIONS.COURSES_PUBLISH, PERMISSIONS.LESSONS_CREATE, PERMISSIONS.LESSONS_EDIT,
    PERMISSIONS.ASSESSMENTS_CREATE, PERMISSIONS.ASSESSMENTS_GRADE,
    PERMISSIONS.CERTIFICATES_ISSUE, PERMISSIONS.ENROLLMENTS_MANAGE,
    PERMISSIONS.PROJECTS_VIEW, PERMISSIONS.PROJECTS_REVIEW, PERMISSIONS.PROJECTS_PUBLISH,
    PERMISSIONS.BLOGS_VIEW, PERMISSIONS.BLOGS_REVIEW, PERMISSIONS.BLOGS_PUBLISH,
    PERMISSIONS.REPORTS_VIEW,
  ],

  store_manager: [
    PERMISSIONS.PRODUCTS_VIEW, PERMISSIONS.PRODUCTS_CREATE, PERMISSIONS.PRODUCTS_EDIT,
    PERMISSIONS.PRODUCTS_DELETE, PERMISSIONS.INVENTORY_VIEW, PERMISSIONS.INVENTORY_MANAGE,
    PERMISSIONS.ORDERS_VIEW, PERMISSIONS.ORDERS_MANAGE, PERMISSIONS.ORDERS_CANCEL,
    PERMISSIONS.REPORTS_VIEW,
  ],

  accounts_manager: [
    PERMISSIONS.PAYMENTS_VIEW, PERMISSIONS.REFUNDS_MANAGE,
    PERMISSIONS.INVOICES_VIEW, PERMISSIONS.INVOICES_CREATE,
    PERMISSIONS.ORDERS_VIEW, PERMISSIONS.REPORTS_VIEW,
  ],

  pr_manager: [
    PERMISSIONS.COMMUNITY_VIEW, PERMISSIONS.COMMUNITY_MODERATE, PERMISSIONS.COMMUNITY_MANAGE,
    PERMISSIONS.ANNOUNCEMENTS_CREATE,
    PERMISSIONS.PROJECTS_VIEW, PERMISSIONS.PROJECTS_REVIEW,
    PERMISSIONS.BLOGS_VIEW, PERMISSIONS.BLOGS_REVIEW,
    PERMISSIONS.USERS_VIEW,
  ],

  support_staff: [
    PERMISSIONS.USERS_VIEW, PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.INSTITUTIONS_VIEW, PERMISSIONS.COURSES_VIEW, PERMISSIONS.PROGRAMS_VIEW,
  ],
};
