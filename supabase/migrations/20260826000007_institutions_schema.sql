-- ============================================================
-- Migration 007: Institutions & School Partnerships Schema
-- SiksaTech Platform
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- INSTITUTIONS & ATAL TINKERING LAB PARTNERS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.institutions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                 TEXT UNIQUE NOT NULL, -- e.g. 'INST-DPS-VK'
  name                 TEXT NOT NULL,
  institution_type     TEXT NOT NULL CHECK (institution_type IN ('k12_school', 'college', 'university', 'polytechnic', 'tinkering_lab')),
  city                 TEXT NOT NULL,
  state                TEXT NOT NULL,
  pincode              TEXT,
  contact_person_name  TEXT NOT NULL,
  contact_person_email TEXT NOT NULL,
  contact_person_phone TEXT NOT NULL,
  total_licenses       INT NOT NULL DEFAULT 50,
  active_students_count INT NOT NULL DEFAULT 0,
  status               TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  logo_url             TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- INSTITUTION COHORTS & BATCHES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.institution_cohorts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id   UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name             TEXT NOT NULL, -- e.g. 'Class 9 STEM Batch A'
  grade_or_year    TEXT NOT NULL, -- e.g. 'Class 9', '2nd Year B.Tech'
  academic_year    TEXT NOT NULL DEFAULT '2026-2027',
  target_track     TEXT NOT NULL CHECK (target_track IN ('explorer', 'builder', 'creator', 'engineer')),
  student_capacity INT NOT NULL DEFAULT 30,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- INSTITUTION STUDENT MEMBERSHIPS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.institution_students (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  cohort_id      UUID REFERENCES public.institution_cohorts(id) ON DELETE SET NULL,
  student_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  student_email  TEXT NOT NULL,
  student_name   TEXT NOT NULL,
  enrolled_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- INSTITUTIONAL INQUIRIES & LAB PROPOSALS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.institution_inquiries (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name  TEXT NOT NULL,
  institution_type  TEXT NOT NULL DEFAULT 'k12_school' CHECK (institution_type IN ('k12_school', 'college', 'university', 'polytechnic', 'tinkering_lab')),
  city              TEXT NOT NULL,
  state             TEXT NOT NULL,
  contact_name      TEXT NOT NULL,
  contact_email     TEXT NOT NULL,
  contact_phone     TEXT NOT NULL,
  student_count     INT NOT NULL DEFAULT 100,
  target_programs   TEXT[] DEFAULT '{}',
  message           TEXT,
  status            TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'proposal_sent', 'onboarded', 'closed')),
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- SEED INITIAL PARTNER INSTITUTION
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.institutions (
  code, name, institution_type, city, state, pincode,
  contact_person_name, contact_person_email, contact_person_phone,
  total_licenses, active_students_count, status
)
VALUES
  (
    'INST-DPS-VK',
    'Delhi Public School, Vasant Kunj',
    'k12_school',
    'New Delhi',
    'Delhi',
    '110070',
    'Dr. Rajeshwar Verma (HOD Science & ATL)',
    'rajeshwar.verma@dpsvasantkunj.edu.in',
    '+91 98101 23456',
    250,
    184,
    'active'
  ),
  (
    'INST-VIT-VEL',
    'Vellore Institute of Technology',
    'university',
    'Vellore',
    'Tamil Nadu',
    '632014',
    'Prof. K. Sundaram (Robotics Lab Coordinator)',
    'sundaram.k@vit.ac.in',
    '+91 94432 98765',
    500,
    340,
    'active'
  )
ON CONFLICT (code) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_institutions_code ON public.institutions(code);
CREATE INDEX IF NOT EXISTS idx_cohorts_institution ON public.institution_cohorts(institution_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.institution_inquiries(status);

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.institutions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_cohorts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_inquiries ENABLE ROW LEVEL SECURITY;

-- Public can query verified partner schools
CREATE POLICY "institutions_public_read" ON public.institutions FOR SELECT USING (status = 'active');

-- Inquiries: anyone can submit an inquiry
CREATE POLICY "inquiries_public_insert" ON public.institution_inquiries FOR INSERT WITH CHECK (true);
