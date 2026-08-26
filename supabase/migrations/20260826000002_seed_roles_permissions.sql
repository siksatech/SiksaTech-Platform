-- ============================================================
-- Migration 002: Seed Roles & Permissions
-- SiksaTech Platform
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- INSERT INTERNAL ROLES
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.roles (name, label, description) VALUES
  ('super_admin',      'Super Admin',          'Full access to all platform features and settings'),
  ('ops_manager',      'Operations Manager',   'Manages institutions, programs, workshops, competitions'),
  ('content_manager',  'Content Manager',      'Manages courses, lessons, assessments, certificates'),
  ('store_manager',    'Store Manager',         'Manages products, inventory, orders, shipments'),
  ('accounts_manager', 'Accounts Manager',     'Manages payments, refunds, invoices, financial reports'),
  ('pr_manager',       'PR / Community Manager','Manages announcements, community moderation, PR'),
  ('support_staff',    'Support Staff',        'Limited read access for operational support')
ON CONFLICT (name) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- INSERT PERMISSIONS
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.permissions (name, description, module) VALUES
  -- User management
  ('users.view',              'View user profiles and account info',     'users'),
  ('users.create',            'Create new user accounts',                'users'),
  ('users.edit',              'Edit user profile data',                  'users'),
  ('users.delete',            'Delete or deactivate user accounts',      'users'),
  ('users.bulk_create',       'Bulk create institution student accounts','users'),
  ('roles.manage',            'Assign and modify user roles',            'users'),

  -- Institution management
  ('institutions.view',       'View institution details',                'institutions'),
  ('institutions.create',     'Create new institutions',                 'institutions'),
  ('institutions.edit',       'Edit institution details',                'institutions'),
  ('institutions.manage',     'Full institution management',             'institutions'),

  -- Course / curriculum management
  ('courses.view',            'View course catalog and details',         'courses'),
  ('courses.create',          'Create new courses',                      'courses'),
  ('courses.edit',            'Edit course content and metadata',        'courses'),
  ('courses.publish',         'Publish or unpublish courses',            'courses'),
  ('courses.delete',          'Delete courses',                          'courses'),
  ('lessons.create',          'Create modules and lessons',              'courses'),
  ('lessons.edit',            'Edit lesson content',                     'courses'),
  ('assessments.create',      'Create quizzes and assignments',          'courses'),
  ('assessments.grade',       'Grade student submissions',               'courses'),
  ('certificates.issue',      'Issue certificates to students',          'courses'),
  ('enrollments.manage',      'Manage course enrollments',               'courses'),

  -- Programs management
  ('programs.view',           'View program details',                    'programs'),
  ('programs.create',         'Create programs (workshops, competitions)','programs'),
  ('programs.edit',           'Edit program details',                    'programs'),
  ('programs.manage',         'Full program management',                 'programs'),
  ('programs.score',          'Score competition/hackathon submissions',  'programs'),

  -- Content review
  ('projects.view',           'View submitted projects',                 'content'),
  ('projects.review',         'Review and approve/reject projects',      'content'),
  ('projects.publish',        'Publish projects to public gallery',      'content'),
  ('blogs.view',              'View submitted blogs',                    'content'),
  ('blogs.review',            'Review and approve/reject blogs',         'content'),
  ('blogs.publish',           'Publish blogs',                           'content'),

  -- Community
  ('community.view',          'View community content',                  'community'),
  ('community.moderate',      'Moderate posts, comments, reports',       'community'),
  ('community.manage',        'Full community management',               'community'),
  ('announcements.create',    'Create platform announcements',           'community'),

  -- Store
  ('products.view',           'View product catalog',                    'store'),
  ('products.create',         'Create new products',                     'store'),
  ('products.edit',           'Edit product details and pricing',        'store'),
  ('products.delete',         'Delete products',                         'store'),
  ('inventory.view',          'View inventory levels',                   'store'),
  ('inventory.manage',        'Update inventory and stock movements',    'store'),
  ('orders.view',             'View orders',                             'store'),
  ('orders.manage',           'Process and update order status',         'store'),
  ('orders.cancel',           'Cancel orders',                           'store'),

  -- Accounts / Finance
  ('payments.view',           'View payment records',                    'accounts'),
  ('refunds.manage',          'Process refunds',                         'accounts'),
  ('invoices.view',           'View invoices',                           'accounts'),
  ('invoices.create',         'Generate invoices',                       'accounts'),
  ('reports.view',            'View financial and platform reports',     'accounts'),

  -- Platform / System
  ('audit_logs.view',         'View audit log entries',                  'platform'),
  ('settings.manage',         'Manage platform settings',               'platform')

ON CONFLICT (name) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- ASSIGN PERMISSIONS TO ROLES
-- ─────────────────────────────────────────────────────────────

-- Helper: assign all permissions to super_admin
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'super_admin'
ON CONFLICT DO NOTHING;

-- ops_manager
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
JOIN public.permissions p ON p.name IN (
  'users.view',
  'institutions.view', 'institutions.create', 'institutions.edit', 'institutions.manage',
  'users.bulk_create',
  'programs.view', 'programs.create', 'programs.edit', 'programs.manage', 'programs.score',
  'reports.view',
  'audit_logs.view'
)
WHERE r.name = 'ops_manager'
ON CONFLICT DO NOTHING;

-- content_manager
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
JOIN public.permissions p ON p.name IN (
  'courses.view', 'courses.create', 'courses.edit', 'courses.publish',
  'lessons.create', 'lessons.edit',
  'assessments.create', 'assessments.grade',
  'certificates.issue',
  'enrollments.manage',
  'projects.view', 'projects.review', 'projects.publish',
  'blogs.view', 'blogs.review', 'blogs.publish',
  'reports.view'
)
WHERE r.name = 'content_manager'
ON CONFLICT DO NOTHING;

-- store_manager
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
JOIN public.permissions p ON p.name IN (
  'products.view', 'products.create', 'products.edit', 'products.delete',
  'inventory.view', 'inventory.manage',
  'orders.view', 'orders.manage', 'orders.cancel',
  'reports.view'
)
WHERE r.name = 'store_manager'
ON CONFLICT DO NOTHING;

-- accounts_manager
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
JOIN public.permissions p ON p.name IN (
  'payments.view',
  'refunds.manage',
  'invoices.view', 'invoices.create',
  'orders.view',
  'reports.view'
)
WHERE r.name = 'accounts_manager'
ON CONFLICT DO NOTHING;

-- pr_manager
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
JOIN public.permissions p ON p.name IN (
  'community.view', 'community.moderate', 'community.manage',
  'announcements.create',
  'projects.view', 'projects.review',
  'blogs.view', 'blogs.review',
  'users.view'
)
WHERE r.name = 'pr_manager'
ON CONFLICT DO NOTHING;

-- support_staff
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
JOIN public.permissions p ON p.name IN (
  'users.view',
  'orders.view',
  'institutions.view',
  'courses.view',
  'programs.view'
)
WHERE r.name = 'support_staff'
ON CONFLICT DO NOTHING;
