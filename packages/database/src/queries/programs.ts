/**
 * Server-side Programs, Workshops, Hackathons & Competition queries
 */
import type { SupabaseClient } from "../client";

export interface ProgramItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  target_audience: string;
  duration: string;
  delivery_mode: "hybrid" | "offline_lab" | "online_live";
  curriculum_highlights: string[];
  outcomes: string[];
}

export interface ProblemStatement {
  id: string;
  title: string;
  description: string;
}

export interface CompetitionItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  competition_type: "hackathon" | "robotics_sprint" | "innovation_cup" | "design_challenge";
  status: "upcoming" | "active" | "judging" | "completed";
  start_date: string;
  end_date: string;
  registration_deadline: string;
  prize_pool_inr: number;
  max_team_size: number;
  rules: string[];
  problem_statements: ProblemStatement[];
}

export interface TeamRegistrationPayload {
  competition_id: string;
  team_name: string;
  lead_user_id?: string | null;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  institution_name: string;
  team_members?: { name: string; email: string; role?: string }[];
  problem_statement_id?: string;
}

export const DEMO_PROGRAMS_LIST: ProgramItem[] = [
  {
    id: "prog-1",
    slug: "school-maker-fellowship",
    title: "National School Maker Fellowship",
    subtitle: "Intensive 8-week hardware fellowship for aspiring school engineers.",
    target_audience: "Class 8–12 Students",
    duration: "8 Weeks (Weekend Cohorts)",
    delivery_mode: "hybrid",
    curriculum_highlights: [
      "Electronic Circuit Analysis & PCB Design",
      "Arduino & ESP32 Firmware Development",
      "IoT Cloud Telemetry & Dashboards",
      "Capstone Hardware Demonstration"
    ],
    outcomes: [
      "Build 4 complete functional hardware prototypes",
      "Verifiable SiksaTech Fellow Credential",
      "Mentorship from Tier-1 Systems Architects"
    ]
  },
  {
    id: "prog-2",
    slug: "autonomous-robotics-bootcamp",
    title: "Autonomous Robotics & Edge AI Bootcamp",
    subtitle: "Master kinematics, motor drivers, OpenCV computer vision, and ROS.",
    target_audience: "Engineering & College Students",
    duration: "12 Weeks",
    delivery_mode: "hybrid",
    curriculum_highlights: [
      "Differential Drive Kinematics & PID Tuning",
      "OpenCV Edge Processing on Raspberry Pi",
      "Ultrasonic & LiDAR Obstacle Mapping",
      "Final Rover Navigation Challenge"
    ],
    outcomes: [
      "Design autonomous obstacle avoidance rover",
      "Industry-recognized Autonomous Systems Certificate",
      "Direct placement referrals in robotics startups"
    ]
  }
];

export const DEMO_HACKATHON: CompetitionItem = {
  id: "comp-1",
  slug: "national-stem-hackathon-2026",
  title: "National STEM Innovation Hackathon 2026",
  description: "India's premier hardware innovation sprint. Build tangible prototypes that solve critical challenges in clean energy, agriculture, and healthcare telemetry.",
  competition_type: "hackathon",
  status: "active",
  start_date: "2026-10-01",
  end_date: "2026-10-30",
  registration_deadline: "2026-09-25",
  prize_pool_inr: 100000,
  max_team_size: 4,
  rules: [
    "All prototypes must include physical microcontroller hardware",
    "Firmware code must be open-sourced on GitHub",
    "Teams must submit a 3-minute working video demonstration"
  ],
  problem_statements: [
    {
      id: "ps1",
      title: "Precision Agriculture & Soil Telemetry",
      description: "Design a solar-powered sensor node to optimize water usage across agricultural zones."
    },
    {
      id: "ps2",
      title: "Autonomous Indoor Medical Delivery",
      description: "Construct an agile obstacle-navigating rover for sterile hospital logistics."
    },
    {
      id: "ps3",
      title: "Grid Energy Monitoring & Leakage Detection",
      description: "Develop a non-invasive current measurement node with wireless alerts."
    }
  ]
};

/**
 * Fetch all programs
 */
export async function getEducationalPrograms(
  supabase?: SupabaseClient
): Promise<ProgramItem[]> {
  if (supabase) {
    const { data, error } = await (supabase as any)
      .from("programs")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (!error && data) {
      return data;
    }
  }

  return DEMO_PROGRAMS_LIST;
}

/**
 * Fetch active hackathons and competitions
 */
export async function getActiveCompetitions(
  supabase?: SupabaseClient
): Promise<CompetitionItem[]> {
  if (supabase) {
    const { data, error } = await (supabase as any)
      .from("competitions")
      .select("*")
      .eq("is_published", true)
      .order("start_date", { ascending: false });

    if (!error && data) {
      return data;
    }
  }

  return [DEMO_HACKATHON];
}

/**
 * Register a team for a competition
 */
export async function registerCompetitionTeam(
  supabase: SupabaseClient | undefined,
  payload: TeamRegistrationPayload
): Promise<{ success: boolean; teamId?: string; error?: string }> {
  if (supabase) {
    const { data, error } = await (supabase as any)
      .from("competition_teams")
      .insert({
        competition_id: payload.competition_id,
        team_name: payload.team_name,
        lead_user_id: payload.lead_user_id || null,
        leader_name: payload.leader_name,
        leader_email: payload.leader_email,
        leader_phone: payload.leader_phone,
        institution_name: payload.institution_name,
        team_members: payload.team_members || [],
        status: "registered"
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, teamId: data.id };
  }

  return { success: true, teamId: `demo-team-${Date.now()}` };
}
