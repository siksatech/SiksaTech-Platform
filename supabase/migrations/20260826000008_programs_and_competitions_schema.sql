-- ============================================================
-- Migration 008: Programs & National Hackathons Schema
-- SiksaTech Platform
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- DROP PRE-EXISTING TABLES IF EMPTY TO ENSURE CLEAN SCHEMA
-- ─────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS public.competition_teams CASCADE;
DROP TABLE IF EXISTS public.competitions CASCADE;
DROP TABLE IF EXISTS public.programs CASCADE;

-- ─────────────────────────────────────────────────────────────
-- EDUCATIONAL PROGRAMS & BOOTCAMPS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.programs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  TEXT UNIQUE NOT NULL,
  title                 TEXT NOT NULL,
  subtitle              TEXT,
  target_audience       TEXT NOT NULL,
  duration              TEXT NOT NULL,
  delivery_mode         TEXT NOT NULL DEFAULT 'hybrid' CHECK (delivery_mode IN ('hybrid', 'offline_lab', 'online_live')),
  curriculum_highlights TEXT[] DEFAULT '{}',
  outcomes              TEXT[] DEFAULT '{}',
  prerequisites         TEXT[] DEFAULT '{}',
  is_active             BOOLEAN NOT NULL DEFAULT true,
  sort_order            INT NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- COMPETITIONS & NATIONAL HACKATHONS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.competitions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  TEXT UNIQUE NOT NULL,
  title                 TEXT NOT NULL,
  description           TEXT NOT NULL,
  competition_type      TEXT NOT NULL DEFAULT 'hackathon' CHECK (competition_type IN ('hackathon', 'robotics_sprint', 'innovation_cup', 'design_challenge')),
  status                TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'judging', 'completed')),
  start_date            DATE NOT NULL,
  end_date              DATE NOT NULL,
  registration_deadline DATE NOT NULL,
  prize_pool_inr        NUMERIC(10, 2) NOT NULL DEFAULT 50000,
  max_team_size         INT NOT NULL DEFAULT 4,
  rules                 TEXT[] DEFAULT '{}',
  problem_statements    JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { id, title, description, theme }
  banner_url            TEXT,
  is_published          BOOLEAN NOT NULL DEFAULT true,
  sort_order            INT NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- COMPETITION TEAMS & SUBMISSIONS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.competition_teams (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id     UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  team_name          TEXT NOT NULL,
  lead_user_id       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  leader_name        TEXT NOT NULL,
  leader_email       TEXT NOT NULL,
  leader_phone       TEXT NOT NULL,
  institution_name   TEXT NOT NULL,
  team_members       JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { name, email, role }
  submission_title   TEXT,
  submission_url     TEXT,
  submission_video   TEXT,
  score              INT DEFAULT 0,
  rank               INT,
  status             TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'shortlisted', 'winner', 'disqualified')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- SEED INITIAL PROGRAMS & HACKATHONS
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.programs (slug, title, subtitle, target_audience, duration, delivery_mode, curriculum_highlights, outcomes)
VALUES
  (
    'school-maker-fellowship',
    'National School Maker Fellowship',
    'Intensive hands-on cohort in hardware prototyping, embedded C++, and sensor telemetry.',
    'Class 8–12 Students',
    '8 Weeks (Weekend Cohorts)',
    'hybrid',
    ARRAY['Electronic Circuit Analysis & PCB Design', 'Arduino & ESP32 Firmware Development', 'IoT Cloud Telemetry & Dashboards', 'Capstone Hardware Demonstration'],
    ARRAY['Build 4 complete functional hardware prototypes', 'Verifiable SiksaTech Fellow Credential', 'Mentorship from Tier-1 Systems Architects']
  ),
  (
    'autonomous-robotics-bootcamp',
    'Autonomous Robotics & Edge AI Bootcamp',
    'Deep-dive robotics program covering kinematics, motor drivers, OpenCV computer vision, and ROS.',
    'Engineering & College Students',
    '12 Weeks',
    'hybrid',
    ARRAY['Differential Drive Kinematics & PID Tuning', 'OpenCV Edge Processing on Raspberry Pi', 'Ultrasonic & LiDAR Obstacle Mapping', 'Final Rover Navigation Challenge'],
    ARRAY['Design autonomous obstacle avoidance rover', 'Industry-recognized Autonomous Systems Certificate', 'Direct placement referrals in robotics startups']
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.competitions (
  slug, title, description, competition_type, status, start_date, end_date,
  registration_deadline, prize_pool_inr, max_team_size, rules, problem_statements
)
VALUES
  (
    'national-stem-hackathon-2026',
    'National STEM Innovation Hackathon 2026',
    'India''s premier hardware innovation sprint. Build tangible prototypes that solve critical challenges in clean energy, agriculture, and healthcare telemetry.',
    'hackathon',
    'active',
    '2026-10-01',
    '2026-10-30',
    '2026-09-25',
    100000.00,
    4,
    ARRAY['All prototypes must include physical microcontroller hardware', 'Firmware code must be open-sourced on GitHub', 'Teams must submit a 3-minute working video demonstration'],
    '[
      {"id": "ps1", "title": "Precision Agriculture & Soil Telemetry", "description": "Design a solar-powered sensor node to optimize water usage across agricultural zones."},
      {"id": "ps2", "title": "Autonomous Indoor Medical Delivery", "description": "Construct an agile obstacle-navigating rover for sterile hospital logistics."},
      {"id": "ps3", "title": "Grid Energy Monitoring & Leakage Detection", "description": "Develop a non-invasive current measurement node with wireless alerts."}
    ]'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_competitions_slug ON public.competitions(slug);
CREATE INDEX IF NOT EXISTS idx_competitions_status ON public.competitions(status);
CREATE INDEX IF NOT EXISTS idx_comp_teams_comp ON public.competition_teams(competition_id);

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.programs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_teams ENABLE ROW LEVEL SECURITY;

-- Public read access to active programs & competitions
DROP POLICY IF EXISTS "programs_public_read" ON public.programs;
CREATE POLICY "programs_public_read" ON public.programs FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "competitions_public_read" ON public.competitions;
CREATE POLICY "competitions_public_read" ON public.competitions FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "comp_teams_public_read" ON public.competition_teams;
CREATE POLICY "comp_teams_public_read" ON public.competition_teams FOR SELECT USING (true);

-- Anyone can register a team
DROP POLICY IF EXISTS "comp_teams_insert" ON public.competition_teams;
CREATE POLICY "comp_teams_insert" ON public.competition_teams FOR INSERT WITH CHECK (true);

