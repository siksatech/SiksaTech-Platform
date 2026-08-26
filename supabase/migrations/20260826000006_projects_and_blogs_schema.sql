-- ============================================================
-- Migration 006: Projects, Blogs & Community Schema
-- SiksaTech Platform
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- STUDENT PROJECTS & HARDWARE BUILDS
-- ─────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS public.student_projects CASCADE;

CREATE TABLE public.student_projects (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               TEXT UNIQUE,
  student_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  creator_name       TEXT NOT NULL,
  creator_school     TEXT,
  creator_grade      TEXT,
  title              TEXT NOT NULL,
  description        TEXT NOT NULL,
  problem_statement  TEXT,
  student_level      TEXT NOT NULL DEFAULT 'Builder (Class 8–10)',
  difficulty         TEXT NOT NULL DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  skills             TEXT[] DEFAULT '{}',
  technologies       TEXT[] DEFAULT '{}',
  components         TEXT[] DEFAULT '{}',
  learning_objectives TEXT[] DEFAULT '{}',
  code_snippet       TEXT,
  schematic_diagram  TEXT,
  video_url          TEXT,
  image_url          TEXT,
  status             TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'draft')),
  review_feedback    TEXT,
  reviewer_id        UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_featured        BOOLEAN NOT NULL DEFAULT false,
  likes_count        INT NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ─────────────────────────────────────────────────────────────
-- COMMUNITY BLOGS & TUTORIALS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blogs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT UNIQUE NOT NULL,
  title            TEXT NOT NULL,
  excerpt          TEXT,
  content_markdown TEXT NOT NULL,
  author_id        UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name      TEXT NOT NULL,
  author_role      TEXT DEFAULT 'SiksaTech Mentor',
  cover_image      TEXT,
  category         TEXT NOT NULL DEFAULT 'tutorial' CHECK (category IN ('tutorial', 'guide', 'showcase', 'announcement', 'industry')),
  tags             TEXT[] DEFAULT '{}',
  read_time_mins   INT NOT NULL DEFAULT 5,
  is_published     BOOLEAN NOT NULL DEFAULT true,
  published_at     TIMESTAMPTZ DEFAULT now(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure columns exist if blogs table pre-existed
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '';
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS content_markdown TEXT NOT NULL DEFAULT '';
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS author_id UUID;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS author_name TEXT NOT NULL DEFAULT '';
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS author_role TEXT DEFAULT 'SiksaTech Mentor';
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'tutorial';
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS read_time_mins INT NOT NULL DEFAULT 5;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT now();


-- ─────────────────────────────────────────────────────────────
-- COMMUNITY POSTS & DISCUSSIONS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.community_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'hardware_help', 'code_review', 'showcase', 'competitions')),
  likes_count INT NOT NULL DEFAULT 0,
  is_pinned   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- SEED INITIAL FEATURED PROJECTS
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.student_projects (
  slug, creator_name, creator_school, creator_grade, title, description,
  problem_statement, student_level, difficulty, skills, technologies, components,
  learning_objectives, status, is_featured
)
VALUES
  (
    'smart-agri-node',
    'Aarav Sharma',
    'Delhi Public School, Vasant Kunj',
    'Class 9',
    'Smart Solar-Powered Agriculture Monitor',
    'A solar-powered IoT node that measures soil parameters and automatically triggers irrigation valves based on real-time capacitive moisture thresholds.',
    'Traditional irrigation methods suffer from water waste and crop damage due to the lack of localized soil telemetry.',
    'Builder (Class 8–10)',
    'Medium',
    ARRAY['Arduino C++', 'Capacitive Sensing', 'IoT Dashboards', 'Soil Physics'],
    ARRAY['Arduino Uno', 'ESP8266 Wi-Fi', 'Blynk IoT Platform'],
    ARRAY['Capacitive Moisture Sensor v1.2', 'DHT22 Temp Sensor', '5V Solenoid Valve', '10W Mini Solar Panel'],
    ARRAY['Calibrate capacitive moisture readings', 'Program low-power sleep routines', 'Trigger remote HTTP webhooks'],
    'approved',
    true
  ),
  (
    'ai-vision-bot',
    'Priyanka Sen',
    'Vellore Institute of Technology',
    'B.Tech CSE',
    'Autonomous Obstacle-Sorting Rover',
    'A mobile robotic rover utilizing edge computer vision to navigate complex indoor terrain and sort objects based on color tags and optical flow.',
    'Warehouse automation requires agile sorting rovers that navigate dynamically without fixed magnetic ground tracks.',
    'Engineer (College)',
    'Hard',
    ARRAY['Computer Vision', 'PID Speed Loops', 'OpenCV Python', 'Embedded Linux'],
    ARRAY['Python 3', 'OpenCV', 'Raspberry Pi OS', 'L298N Motor Driver'],
    ARRAY['Raspberry Pi 4', 'Pi Camera Module v2', '2x Metal Gear DC Motors', 'L298N Driver', 'Li-Ion 18650 Battery Pack'],
    ARRAY['Calibrate color masking filters', 'Implement PID speed control loops', 'Process multi-threaded camera feeds'],
    'approved',
    true
  ),
  (
    'smart-home-energy-auditor',
    'Kabir Mehta',
    'Amity International School, Noida',
    'Class 12',
    'Smart Home Non-Invasive Energy Auditor',
    'A clip-on current transformer node that measures home electricity consumption and displays live telemetry on a local ESP32 web server.',
    'Consumers lack real-time visibility into high-load appliances, leading to unexpected utility spikes.',
    'Creator (Class 11–12)',
    'Medium',
    ARRAY['AC Physics', 'ESP32 Web Server', 'ADC Calibration', 'Embedded C++'],
    ARRAY['C++', 'ESP32', 'Chart.js Telemetry Dashboard'],
    ARRAY['SCT-013-000 Current Sensor', 'ESP32 NodeMCU', '0.96 inch I2C OLED', 'Burden Resistor 33Ω'],
    ARRAY['Calculate True RMS current', 'Host local responsive web dashboards on microcontrollers', 'Display real-time kilowatt draw'],
    'approved',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_student_projects_status ON public.student_projects(status);
CREATE INDEX IF NOT EXISTS idx_student_projects_level ON public.student_projects(student_level);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_community_category ON public.community_posts(category);

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts  ENABLE ROW LEVEL SECURITY;

-- Projects: approved builds are visible to all; users can see own drafts/pending
DROP POLICY IF EXISTS "projects_public_read" ON public.student_projects;
CREATE POLICY "projects_public_read" ON public.student_projects FOR SELECT USING (status = 'approved' OR auth.uid() = student_id);

DROP POLICY IF EXISTS "projects_user_insert" ON public.student_projects;
CREATE POLICY "projects_user_insert" ON public.student_projects FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "projects_user_update" ON public.student_projects;
CREATE POLICY "projects_user_update" ON public.student_projects FOR UPDATE USING (auth.uid() = student_id);

-- Blogs & Community
DROP POLICY IF EXISTS "blogs_public_read" ON public.blogs;
CREATE POLICY "blogs_public_read" ON public.blogs FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "community_public_read" ON public.community_posts;
CREATE POLICY "community_public_read" ON public.community_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "community_user_insert" ON public.community_posts;
CREATE POLICY "community_user_insert" ON public.community_posts FOR INSERT WITH CHECK (true);

