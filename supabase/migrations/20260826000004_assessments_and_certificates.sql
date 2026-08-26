-- ============================================================
-- Migration 004: Assessments & Verifiable Certificates Schema
-- SiksaTech Platform
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- ASSESSMENTS
-- Quizzes and knowledge checks attached to courses or modules.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.assessments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id        TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  passing_score    INT NOT NULL DEFAULT 70, -- Minimum percentage to pass
  time_limit_mins  INT NOT NULL DEFAULT 30, -- 0 for unlimited
  max_attempts     INT NOT NULL DEFAULT 3,
  is_published     BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- ASSESSMENT QUESTIONS
-- Questions within an assessment (MCQ, code prediction, diagnostic).
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.assessment_questions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id  UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_text  TEXT NOT NULL,
  code_snippet   TEXT,
  question_type  TEXT NOT NULL DEFAULT 'mcq' CHECK (question_type IN ('mcq', 'code_output', 'boolean', 'multi_select')),
  options        JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { id, text }
  correct_answer JSONB NOT NULL, -- { id } or { ids: [] } or string
  explanation    TEXT,
  points         INT NOT NULL DEFAULT 10,
  sort_order     INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- ASSESSMENT SUBMISSIONS
-- Records of student attempts and grades.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.assessment_submissions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id  UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score          INT NOT NULL, -- Percentage achieved (0 - 100)
  total_points   INT NOT NULL,
  points_earned  INT NOT NULL,
  passed         BOOLEAN NOT NULL DEFAULT false,
  answers_json   JSONB NOT NULL DEFAULT '{}'::jsonb,
  attempt_number INT NOT NULL DEFAULT 1,
  submitted_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- CERTIFICATES
-- Verifiable credentials issued upon course completion and passing assessment.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.certificates (
  id                TEXT PRIMARY KEY, -- e.g. 'ST-2026-A101'
  user_id           UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  student_name      TEXT NOT NULL,
  program_name      TEXT NOT NULL,
  achievement       TEXT NOT NULL,
  course_id         TEXT REFERENCES public.courses(id) ON DELETE SET NULL,
  skills_verified   TEXT[] DEFAULT '{}',
  verification_hash TEXT UNIQUE NOT NULL,
  issued_date       DATE NOT NULL DEFAULT CURRENT_DATE,
  issuer_name       TEXT NOT NULL DEFAULT 'SiksaTech Academic Council',
  is_revoked        BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure columns exist if table pre-existed
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS student_name TEXT NOT NULL DEFAULT '';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS program_name TEXT NOT NULL DEFAULT '';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS achievement TEXT NOT NULL DEFAULT '';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS course_id TEXT;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS skills_verified TEXT[] DEFAULT '{}';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS verification_hash TEXT;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS issued_date DATE NOT NULL DEFAULT CURRENT_DATE;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS issuer_name TEXT NOT NULL DEFAULT 'SiksaTech Academic Council';
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS is_revoked BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();


-- ─────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_assessments_course ON public.assessments(course_id);
CREATE INDEX IF NOT EXISTS idx_questions_assessment ON public.assessment_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON public.assessment_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assessment ON public.assessment_submissions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_hash ON public.certificates(verification_hash);

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.assessments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates           ENABLE ROW LEVEL SECURITY;

-- Assessments & Questions: Publicly readable when published (correct answers omitted in client select if needed)
CREATE POLICY "assessments_public_read" ON public.assessments FOR SELECT USING (is_published = true);
CREATE POLICY "questions_public_read" ON public.assessment_questions FOR SELECT USING (true);

-- Submissions: User can see own submissions and insert new attempts
DROP POLICY IF EXISTS "submissions_user_read" ON public.assessment_submissions;
CREATE POLICY "submissions_user_read" ON public.assessment_submissions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "submissions_user_insert" ON public.assessment_submissions;
CREATE POLICY "submissions_user_insert" ON public.assessment_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Certificates: Publicly readable for instant credential verification at /verify/[id]
DROP POLICY IF EXISTS "certificates_public_read" ON public.certificates;
CREATE POLICY "certificates_public_read" ON public.certificates FOR SELECT USING (true);

