-- ============================================================
-- Migration 013: Seed Standard Learning Paths
-- SiksaTech Platform
-- ============================================================

INSERT INTO public.learning_paths (id, title, target_ages, description, skills, sort_order)
VALUES
  (
    'explorer',
    'Explorer (Class 5–7)',
    'Ages 10–12',
    'Discover technology roots through visual block programming, simple electronics, and interactive gaming logic.',
    '["Block Coding", "Basic Circuits", "Sensors", "Problem Solving", "Logic Building"]'::jsonb,
    1
  ),
  (
    'builder',
    'Builder (Class 8–10)',
    'Ages 13–15',
    'Build physical systems using microcontrollers (Arduino), basic sensors, IoT modules, and Python coding.',
    '["Python Basics", "Arduino programming", "Sensors & Actuators", "IoT Protocols", "3D Printing"]'::jsonb,
    2
  ),
  (
    'creator',
    'Creator (Class 11–12)',
    'Ages 16–18',
    'Create complex integrated setups. Focus on Advanced embedded systems, PCB Design, Drones, and Generative AI.',
    '["C/C++", "ESP32", "Generative AI", "Drone Assembly", "CAD & 3D Modeling"]'::jsonb,
    3
  ),
  (
    'engineer',
    'Engineer (College)',
    'Ages 18+',
    'Design and implement industrial automation, Computer Vision, Machine Learning algorithms, and robotics control.',
    '["Machine Learning", "OpenCV", "PCB Layouts", "Embedded Linux", "ROS (Robot OS)"]'::jsonb,
    4
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  target_ages = EXCLUDED.target_ages,
  description = EXCLUDED.description,
  skills = EXCLUDED.skills,
  sort_order = EXCLUDED.sort_order;
