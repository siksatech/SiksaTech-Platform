-- ============================================================
-- Migration 003: Learning Schema
-- Courses, Learning Paths, Modules, Lessons, Enrollments & Progress
-- SiksaTech Platform
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- LEARNING PATHS (e.g. Explorer, Builder, Creator, Engineer)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id           TEXT PRIMARY KEY, -- 'explorer', 'builder', 'creator', 'engineer'
  title        TEXT NOT NULL,
  target_ages  TEXT NOT NULL,
  description  TEXT NOT NULL,
  skills       TEXT[] DEFAULT '{}',
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- COURSES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courses (
  id               TEXT PRIMARY KEY, -- slug or UUID
  learning_path_id TEXT REFERENCES public.learning_paths(id) ON DELETE SET NULL,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  difficulty       TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  duration         TEXT NOT NULL,
  skills           TEXT[] DEFAULT '{}',
  class_levels     TEXT[] DEFAULT '{}',
  thumbnail_url    TEXT,
  is_published     BOOLEAN NOT NULL DEFAULT true,
  sort_order       INT NOT NULL DEFAULT 0,
  created_by       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- COURSE MODULES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.course_modules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- LESSONS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lessons (
  id               TEXT PRIMARY KEY, -- slug or UUID
  course_id        TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  module_id        UUID REFERENCES public.course_modules(id) ON DELETE SET NULL,
  title            TEXT NOT NULL,
  lesson_type      TEXT NOT NULL DEFAULT 'theory' CHECK (lesson_type IN ('theory', 'code', 'lab', 'video', 'project')),
  content_markdown TEXT NOT NULL DEFAULT '',
  video_url        TEXT, -- YouTube Unlisted / Video URL
  starter_code     TEXT,
  solution_code    TEXT,
  duration_minutes INT NOT NULL DEFAULT 15,
  sort_order       INT NOT NULL DEFAULT 0,
  is_published     BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- ENROLLMENTS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enrollments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id    TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  enrolled_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE (user_id, course_id)
);

-- ─────────────────────────────────────────────────────────────
-- LESSON PROGRESS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id    TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id    TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  notes        TEXT,
  UNIQUE (user_id, lesson_id)
);

-- Ensure columns exist if tables pre-existed
ALTER TABLE public.learning_paths ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '';
ALTER TABLE public.learning_paths ADD COLUMN IF NOT EXISTS target_ages TEXT NOT NULL DEFAULT '';
ALTER TABLE public.learning_paths ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
ALTER TABLE public.learning_paths ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
ALTER TABLE public.learning_paths ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;

ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS learning_path_id TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS difficulty TEXT NOT NULL DEFAULT 'Beginner';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS duration TEXT NOT NULL DEFAULT '';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS class_levels TEXT[] DEFAULT '{}';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS created_by UUID;

ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS course_id TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS module_id UUID;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '';
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS lesson_type TEXT NOT NULL DEFAULT 'theory';
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS content_markdown TEXT NOT NULL DEFAULT '';
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS starter_code TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS solution_code TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS duration_minutes INT NOT NULL DEFAULT 15;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS course_id TEXT;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS lesson_id TEXT;
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS course_id TEXT;
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS is_completed BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS notes TEXT;



-- ─────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_courses_path ON public.courses(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_modules_course ON public.course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_course ON public.lesson_progress(user_id, course_id);

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Public read access to published courses & content
DROP POLICY IF EXISTS "paths_public_read" ON public.learning_paths;
CREATE POLICY "paths_public_read" ON public.learning_paths FOR SELECT USING (true);

DROP POLICY IF EXISTS "courses_public_read" ON public.courses;
CREATE POLICY "courses_public_read" ON public.courses FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "modules_public_read" ON public.course_modules;
CREATE POLICY "modules_public_read" ON public.course_modules FOR SELECT USING (true);

DROP POLICY IF EXISTS "lessons_public_read" ON public.lessons;
CREATE POLICY "lessons_public_read" ON public.lessons FOR SELECT USING (is_published = true);

-- User can manage their own enrollments & progress
DROP POLICY IF EXISTS "enrollments_user_read" ON public.enrollments;
CREATE POLICY "enrollments_user_read" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "enrollments_user_insert" ON public.enrollments;
CREATE POLICY "enrollments_user_insert" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "enrollments_user_update" ON public.enrollments;
CREATE POLICY "enrollments_user_update" ON public.enrollments FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "progress_user_read" ON public.lesson_progress;
CREATE POLICY "progress_user_read" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "progress_user_all" ON public.lesson_progress;
CREATE POLICY "progress_user_all" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);

