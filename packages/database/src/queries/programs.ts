/**
 * Server-side Programs, Workshops, Hackathons & Competition queries
 */
import type { SupabaseClient } from "../client";

export interface ProgramItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  category: "fellowship" | "workshop" | "webinar" | "seminar";
  target_audience: string;
  duration: string;
  schedule?: string;
  instructor?: string;
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
    category: "fellowship",
    target_audience: "Class 8–12 Students",
    duration: "8 Weeks (Weekend Cohorts)",
    schedule: "Every Saturday & Sunday • 4:00 PM - 6:00 PM IST",
    instructor: "Er. Siddharth Verma, Ex-ISRO Systems Consultant",
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
    category: "fellowship",
    target_audience: "Engineering & College Students",
    duration: "12 Weeks",
    schedule: "Tri-weekly Evening Batches • 7:00 PM - 8:30 PM IST",
    instructor: "Dr. Rajeshwar Sharma, Robotics Lab Director",
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
  },
  {
    id: "prog-3",
    slug: "hands-on-iot-workshop",
    title: "Hands-On ESP32 IoT & Sensor Nodes Workshop",
    subtitle: "A fast-paced 2-day live interactive workshop building cloud-connected sensor arrays.",
    category: "workshop",
    target_audience: "Class 8 to College Students",
    duration: "2 Days (Weekend Workshop)",
    schedule: "Saturday & Sunday • 10:00 AM - 1:00 PM IST",
    instructor: "Pooja Hegde, Embedded IoT Lead",
    delivery_mode: "online_live",
    curriculum_highlights: [
      "Breadboard assembly of DHT22 & capacitive moisture sensors",
      "Writing FreeRTOS non-blocking firmware loops",
      "Posting real-time data to cloud telemetry APIs",
      "Setting up mobile push alerts for threshold breaches"
    ],
    outcomes: [
      "Deploy a working home automation node",
      "Workshop Participation Certificate",
      "Full source code & schematic repository access"
    ]
  },
  {
    id: "prog-4",
    slug: "edge-ai-vision-webinar",
    title: "Live Masterclass: Edge AI & TinyML on Microcontrollers",
    subtitle: "Explore how machine learning models run directly on micro-watt microcontrollers without internet access.",
    category: "webinar",
    target_audience: "College Innovators & High School Coders",
    duration: "90 Minutes Interactive",
    schedule: "Upcoming Wednesday • 6:30 PM - 8:00 PM IST",
    instructor: "Anand R., TinyML Research Fellow",
    delivery_mode: "online_live",
    curriculum_highlights: [
      "Quantization and pruning neural networks for ARM Cortex-M",
      "Keyword spotting and voice classification in 64KB RAM",
      "Live Q&A and architecture teardowns of smart cameras"
    ],
    outcomes: [
      "Understand edge model compression techniques",
      "Interactive Q&A with industry ML researchers",
      "Live Certificate of Attendance"
    ]
  },
  {
    id: "prog-5",
    slug: "nep2020-stem-pedagogy-seminar",
    title: "Institutional Seminar: Transforming School Labs under NEP 2020",
    subtitle: "Strategic symposium for school principals, ATL in-charges, and STEM educators on experiential learning frameworks.",
    category: "seminar",
    target_audience: "Educators, ATL Coordinators & School Leadership",
    duration: "Half-Day Symposium (4 Hours)",
    schedule: "Next Friday • 10:00 AM - 2:00 PM IST",
    instructor: "Prof. K. Sundaram, STEM Education Policy Advisor",
    delivery_mode: "hybrid",
    curriculum_highlights: [
      "Aligning maker education with NEP 2020 learning benchmarks",
      "Optimizing ATL equipment utilization and maintenance",
      "Evaluating project-based learning outcomes and student maker portfolios"
    ],
    outcomes: [
      "Institutional STEM Audit Framework Checklist",
      "Educator Masterclass CPD Credits",
      "Priority Access to SiksaTech Curriculum Grants"
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
