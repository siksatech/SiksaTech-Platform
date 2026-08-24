import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isRealSupabase = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== "placeholder");

export const supabase = isRealSupabase
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export interface LearningPath {
  id: string;
  title: string;
  targetAges: string;
  description: string;
  skills: string[];
  projectsCount: number;
}

export interface Course {
  id: string;
  learningPathId: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  modulesCount: number;
  skills: string[];
  classLevels?: string[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  moduleTitle: string;
  contentMarkdown: string;
  starterCode?: string;
  solutionCode?: string;
  lessonType: "theory" | "code" | "lab" | "project";
  durationMinutes: number;
  sortOrder: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  problemStatement: string;
  studentLevel: string;
  difficulty: "Easy" | "Medium" | "Hard";
  skills: string[];
  technologies: string[];
  components: string[];
  learningObjectives: string[];
  creatorName: string;
  creatorSchool?: string;
  creatorGrade?: string;
  isFeatured: boolean;
  steps?: ProjectStep[];
  codeSnippet?: string;
  schematic?: string;
  imageUrl?: string;
}

export interface ProjectStep {
  stepNumber: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface Lead {
  id: string;
  leadType: "student" | "parent" | "school" | "college" | "industry";
  name: string;
  email: string;
  phone: string;
  details: Record<string, string>;
  status: "new" | "contacted" | "converted";
  createdAt: string;
}

export interface Certificate {
  id: string;
  studentName: string;
  programName: string;
  achievement: string;
  issuedDate: string;
  skillsVerified: string[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  bgColor: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "general" | "student" | "institution" | "store";
  sortOrder: number;
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  type: "hackathon" | "competition" | "workshop" | "event";
  status: "upcoming" | "ongoing" | "completed";
  registrationLink?: string;
  imageUrl?: string;
}

export interface StoreKit {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: "explorer" | "builder" | "creator" | "engineer" | "component" | "accessory";
  imageUrl?: string;
  features: string[];
  inStock: boolean;
  stockCount: number;
}

export interface AdminRole {
  role: "super_admin" | "web_content_admin" | "course_admin" | "events_admin" | "store_admin";
  label: string;
  permissions: string[];
}

export const ADMIN_ROLES: AdminRole[] = [
  {
    role: "super_admin",
    label: "Super Admin",
    permissions: ["banners", "faqs", "courses", "events", "store", "leads", "users", "settings"]
  },
  {
    role: "web_content_admin",
    label: "Web Content Admin",
    permissions: ["banners", "faqs"]
  },
  {
    role: "course_admin",
    label: "Course Admin",
    permissions: ["courses"]
  },
  {
    role: "events_admin",
    label: "Events Admin",
    permissions: ["events"]
  },
  {
    role: "store_admin",
    label: "Store Admin",
    permissions: ["store"]
  }
];

export const DEMO_PATHS: LearningPath[] = [
  {
    id: "explorer",
    title: "Explorer (Class 5–7)",
    targetAges: "Ages 10–12",
    description: "Discover technology roots through visual block programming, simple electronics, and interactive gaming logic.",
    skills: ["Block Coding", "Basic Circuits", "Sensors", "Problem Solving", "Logic Building"],
    projectsCount: 12
  },
  {
    id: "builder",
    title: "Builder (Class 8–10)",
    targetAges: "Ages 13–15",
    description: "Build physical systems using microcontrollers (Arduino), basic sensors, IoT modules, and Python coding.",
    skills: ["Python Basics", "Arduino programming", "Sensors & Actuators", "IoT Protocols", "3D Printing"],
    projectsCount: 18
  },
  {
    id: "creator",
    title: "Creator (Class 11–12)",
    targetAges: "Ages 16–18",
    description: "Create complex integrated setups. Focus on Advanced embedded systems, PCB Design, Drones, and Generative AI.",
    skills: ["C/C++", "ESP32", "Generative AI", "Drone Assembly", "CAD & 3D Modeling"],
    projectsCount: 15
  },
  {
    id: "engineer",
    title: "Engineer (College)",
    targetAges: "Ages 18+",
    description: "Design and implement industrial automation, Computer Vision, Machine Learning algorithms, and robotics control.",
    skills: ["Machine Learning", "OpenCV", "PCB Layouts", "Embedded Linux", "ROS (Robot OS)"],
    projectsCount: 22
  }
];

export const DEMO_COURSES: Course[] = [
  {
    id: "explorer-visual-logic",
    learningPathId: "explorer",
    title: "Visual Logic & Block Coding",
    description: "Learn logical structures, loops, and conditions by creating interactive software modules and games without typing code.",
    difficulty: "Beginner",
    duration: "6 weeks",
    modulesCount: 4,
    skills: ["Block Coding", "Logic Building", "Sequences"],
    classLevels: ["5", "6", "7"]
  },
  {
    id: "explorer-circuits",
    learningPathId: "explorer",
    title: "Introduction to Circuits & Components",
    description: "Explore the physical flow of current. Connect LEDs, resistors, buttons, and buzzers to build your first electronics prototype.",
    difficulty: "Beginner",
    duration: "8 weeks",
    modulesCount: 5,
    skills: ["Basic Circuits", "LEDs", "Resistors", "Sensors"],
    classLevels: ["5", "6", "7"]
  },
  {
    id: "builder-python-sensors",
    learningPathId: "builder",
    title: "Python & Physical Sensors",
    description: "Connect the simplicity of Python coding with hardware inputs to parse and react to real-world measurements.",
    difficulty: "Intermediate",
    duration: "10 weeks",
    modulesCount: 6,
    skills: ["Python", "Sensors", "Data Processing"],
    classLevels: ["8", "9", "10"]
  },
  {
    id: "builder-arduino-embedded",
    learningPathId: "builder",
    title: "Arduino & Physical Computing",
    description: "Program microcontrollers to actuate motors, read environmental factors, and communicate using serial outputs.",
    difficulty: "Intermediate",
    duration: "12 weeks",
    modulesCount: 8,
    skills: ["Arduino C++", "Microcontrollers", "Motors", "Serial Comms"],
    classLevels: ["8", "9", "10"]
  },
  {
    id: "creator-iot-esp32",
    learningPathId: "creator",
    title: "Connected IoT with ESP32",
    description: "Build cloud-connected nodes. Write firmware to post sensor data to APIs and control systems remotely via mobile apps.",
    difficulty: "Advanced",
    duration: "12 weeks",
    modulesCount: 8,
    skills: ["ESP32", "WiFi/BLE Protocols", "APIs", "Cloud Integrations"],
    classLevels: ["11", "12"]
  },
  {
    id: "creator-genai-robotics",
    learningPathId: "creator",
    title: "Generative AI & Embedded Commands",
    description: "Leverage AI models to interpret voice, generate instructions, and design intuitive conversational physical interfaces.",
    difficulty: "Advanced",
    duration: "8 weeks",
    modulesCount: 5,
    skills: ["LLM API Configs", "Voice Control", "Hardware Automation"],
    classLevels: ["11", "12"]
  },
  {
    id: "engineer-computer-vision",
    learningPathId: "engineer",
    title: "Applied Computer Vision & OpenCV",
    description: "Process live video feeds on edge microcomputers to identify shapes, track colors, and recognize objects.",
    difficulty: "Advanced",
    duration: "14 weeks",
    modulesCount: 10,
    skills: ["OpenCV", "Image Processing", "Raspberry Pi", "Python"],
    classLevels: ["college"]
  },
  {
    id: "engineer-pcb-design",
    learningPathId: "engineer",
    title: "Professional PCB Layout & Production",
    description: "Convert breadboard designs into industrial printed circuit boards. Route copper traces and export manufacturing files.",
    difficulty: "Advanced",
    duration: "10 weeks",
    modulesCount: 6,
    skills: ["Schematic Design", "KiCad / EasyEDA", "Footprints", "Gerber Files"],
    classLevels: ["college"]
  }
];

export const DEMO_PROJECTS: Project[] = [
  {
    id: "smart-agri",
    title: "Smart Agriculture Monitor",
    description: "A solar-powered IoT node that measures soil parameters and automatically triggers irrigation valves based on real-time soil moisture thresholds.",
    problemStatement: "Traditional irrigation methods suffer from water waste and crop damage due to the lack of localized soil data.",
    studentLevel: "Builder (Class 8–10)",
    difficulty: "Medium",
    skills: ["Arduino programming", "Soil Physics", "IoT Dashboards"],
    technologies: ["Arduino C++", "ESP8266 WiFi", "Blynk IoT Platform"],
    components: ["Capacitive Moisture Sensor", "DHT22 Temperature Sensor", "5V Solenoid Valve", "ESP8266 Board"],
    learningObjectives: ["Understand capacitive sensing calibration", "Program low-power deep sleep cycles", "Implement remote server triggers"],
    creatorName: "Aarav Sharma",
    creatorSchool: "Delhi Public School, Vasant Kunj",
    creatorGrade: "Class 9",
    isFeatured: true
  },
  {
    id: "ai-vision-bot",
    title: "Autonomous Obstacle-Sorting Vehicle",
    description: "A mobile robotic rover utilizing edge computer vision to navigate terrain and sort objects based on color tags and optical flow.",
    problemStatement: "Industrial warehouse automation requires smart, agile sorting vehicles that navigate without static floor tracks.",
    studentLevel: "Engineer (College)",
    difficulty: "Hard",
    skills: ["Computer Vision", "Motor Control Loop", "System Tuning"],
    technologies: ["Python", "OpenCV", "Raspberry Pi OS", "ROS"],
    components: ["Raspberry Pi 4", "Pi Camera Module v2", "DC Gear Motors", "L298N Driver", "Li-Ion Battery Pack"],
    learningObjectives: ["Calibrate color masking filters", "Implement PID speed control loops", "Process multi-threaded camera feeds"],
    creatorName: "Priyanka Sen",
    creatorSchool: "Vellore Institute of Technology",
    creatorGrade: "B.Tech CSE",
    isFeatured: true
  },
  {
    id: "energy-monitor",
    title: "Smart Home Energy Auditor",
    description: "A non-invasive clip-on current monitor that measures home electricity consumption and displays live telemetry on a local web dashboard.",
    problemStatement: "Consumers lack visibility into device-level power draw, leading to unexpected utility costs.",
    studentLevel: "Creator (Class 11–12)",
    difficulty: "Medium",
    skills: ["Alternating Current Principles", "ESP32 Web Server", "ADC Sampling"],
    technologies: ["C++", "ESP32", "HTML/CSS Dashboard"],
    components: ["SCT-013 Current Transformer", "ESP32 DevKit v1", "OLED Display 0.96 inch"],
    learningObjectives: ["Calculate RMS current", "Host local ESP32 HTTP dashboard", "Display real-time kilowatt draw"],
    creatorName: "Kabir Mehta",
    creatorSchool: "Amity International School, Noida",
    creatorGrade: "Class 12",
    isFeatured: true
  }
];

export const DEMO_BANNERS: Banner[] = [
  {
    id: "banner-1",
    title: "Build the Future with Your Hands",
    subtitle: "STEM-based technology courses for Classes 5 to College — from physical circuits to AI.",
    ctaText: "Explore Pathways",
    ctaLink: "/learn",
    bgColor: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)",
    isActive: true,
    sortOrder: 1
  },
  {
    id: "banner-2",
    title: "SiksaTech STEM Lab Program for Schools",
    subtitle: "Partner with us to install fully equipped robotics, IoT, and electronics innovation labs on your campus.",
    ctaText: "Partner With Us",
    ctaLink: "/institutions",
    bgColor: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #064E3B 100%)",
    isActive: true,
    sortOrder: 2
  },
  {
    id: "banner-3",
    title: "Maker Sprint 2026 — Hardware Hackathon",
    subtitle: "A 48-hour prototype challenge for Class 8 to College innovators. Build, test, and showcase your hardware solutions.",
    ctaText: "View Event Details",
    ctaLink: "/programs",
    bgColor: "linear-gradient(135deg, #4C1D95 0%, #5B21B6 50%, #4C1D95 100%)",
    isActive: true,
    sortOrder: 3
  }
];

export const DEMO_FAQS: FAQ[] = [
  {
    id: "faq-1",
    question: "What age group is SiksaTech designed for?",
    answer: "SiksaTech offers structured STEM learning paths for students from Class 5 through College level. Our Explorer track starts at age 10, Builder at Class 8, Creator at Class 11, and Engineer for college students.",
    category: "general",
    sortOrder: 1
  },
  {
    id: "faq-2",
    question: "Do students need prior coding or electronics experience?",
    answer: "No prior experience is required. Each learning path begins with core fundamentals. Explorer starts with visual logic and physical circuits, gradually building towards advanced microcontrollers and Python in Builder and Creator.",
    category: "student",
    sortOrder: 2
  },
  {
    id: "faq-3",
    question: "How is SiksaTech different from video tutorial platforms?",
    answer: "SiksaTech is a hands-on building ecosystem, not just video lectures. Students work with physical hardware kits, assemble real circuits, write functional firmware, submit builds for mentor review, and earn verifiable skill credentials.",
    category: "general",
    sortOrder: 3
  },
  {
    id: "faq-4",
    question: "How can schools and colleges partner with SiksaTech?",
    answer: "We provide turnkey STEM lab setups, teacher training workshops, NEP 2020 aligned experiential curricula, and inter-school hackathons. Institutions can submit an inquiry through our For Institutions page.",
    category: "institution",
    sortOrder: 4
  }
];

export const DEMO_COMPETITIONS: Competition[] = [
  {
    id: "comp-1",
    title: "SiksaTech Maker Sprint 2026",
    description: "A 48-hour hardware hackathon where student teams design and build a working physical prototype to address a local sustainability challenge.",
    date: "2026-10-15",
    endDate: "2026-10-17",
    location: "Online + Regional Centers",
    type: "hackathon",
    status: "upcoming",
    registrationLink: "/enquiry/student"
  },
  {
    id: "comp-2",
    title: "National IoT Innovation Challenge",
    description: "Design and deploy an edge IoT device monitoring an environmental or agricultural parameter. Winners receive lab sponsorships.",
    date: "2026-11-01",
    endDate: "2026-11-30",
    location: "Online Submission",
    type: "competition",
    status: "upcoming",
    registrationLink: "/enquiry/student"
  }
];

export const DEMO_STORE_KITS: StoreKit[] = [
  {
    id: "kit-explorer",
    name: "Explorer Starter Kit",
    description: "Everything a Class 5–7 student needs to start their STEM journey — LEDs, resistors, breadboard, buzzer, switches, and a physical project guide.",
    price: 1499,
    originalPrice: 1999,
    category: "explorer",
    features: ["50+ Components", "Illustrated Guide", "5 Guided Builds", "Storage Box"],
    inStock: true,
    stockCount: 45
  },
  {
    id: "kit-builder",
    name: "Builder Arduino Kit",
    description: "Arduino Uno R3 board with environmental sensors, servo motors, LCD display, and a structured project workbook for Class 8–10 students.",
    price: 2999,
    originalPrice: 3999,
    category: "builder",
    features: ["Arduino Uno R3", "15+ Sensors", "LCD Display", "Motor Driver", "12 Projects"],
    inStock: true,
    stockCount: 30
  }
];

export const DEMO_CERTIFICATES: Record<string, Certificate> = {
  "ST-2026-A101": {
    id: "ST-2026-A101",
    studentName: "Aditya Roy",
    programName: "Explorer Path - Hardware Logic",
    achievement: "Successfully built and demonstrated 3 physical circuit prototypes showcasing logical NAND/NOR gates.",
    issuedDate: "2026-05-14",
    skillsVerified: ["Circuit Design", "Logical Gates", "Physical Debugging"]
  },
  "ST-2026-B202": {
    id: "ST-2026-B202",
    studentName: "Ananya Iyer",
    programName: "Builder Path - Embedded Python",
    achievement: "Developed the Smart Environment Logger with ESP8266 and Blynk dashboard reporting data continuously for 30 days.",
    issuedDate: "2026-07-22",
    skillsVerified: ["Python Scripting", "Microcontrollers", "Data Telemetry"]
  }
};

export const db = {
  getBanners: async (): Promise<Banner[]> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          title: d.title,
          subtitle: d.subtitle,
          ctaText: d.cta_text,
          ctaLink: d.cta_link,
          bgColor: d.bg_color,
          imageUrl: d.image_url,
          isActive: d.is_active,
          sortOrder: d.sort_order
        }));
      }
    }
    return DEMO_BANNERS;
  },

  saveBanner: async (banner: Omit<Banner, "id">): Promise<{ success: boolean; data?: Banner }> => {
    if (!isRealSupabase || !supabase) return { success: false };
    const { data, error } = await supabase
      .from("banners")
      .insert([{
        title: banner.title,
        subtitle: banner.subtitle,
        cta_text: banner.ctaText,
        cta_link: banner.ctaLink,
        bg_color: banner.bgColor,
        image_url: banner.imageUrl,
        is_active: banner.isActive,
        sort_order: banner.sortOrder
      }])
      .select()
      .single();
    if (error) return { success: false };
    return { success: true, data: { id: data.id, ...banner } };
  },

  deleteBanner: async (id: string): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase.from("banners").delete().eq("id", id);
    return !error;
  },

  getFAQs: async (category?: string): Promise<FAQ[]> => {
    if (isRealSupabase && supabase) {
      let query = supabase.from("faqs").select("*").order("sort_order", { ascending: true });
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          question: d.question,
          answer: d.answer,
          category: d.category,
          sortOrder: d.sort_order
        }));
      }
    }
    return category ? DEMO_FAQS.filter(f => f.category === category) : DEMO_FAQS;
  },

  saveFAQ: async (faq: Omit<FAQ, "id">): Promise<{ success: boolean }> => {
    if (!isRealSupabase || !supabase) return { success: false };
    const { error } = await supabase.from("faqs").insert([{
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      sort_order: faq.sortOrder
    }]);
    return { success: !error };
  },

  deleteFAQ: async (id: string): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    return !error;
  },

  getCompetitions: async (): Promise<Competition[]> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase.from("competitions").select("*").order("date", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          date: d.date,
          endDate: d.end_date,
          location: d.location,
          type: d.type,
          status: d.status,
          registrationLink: d.registration_link,
          imageUrl: d.image_url
        }));
      }
    }
    return DEMO_COMPETITIONS;
  },

  saveCompetition: async (comp: Omit<Competition, "id">): Promise<{ success: boolean }> => {
    if (!isRealSupabase || !supabase) return { success: false };
    const { error } = await supabase.from("competitions").insert([{
      title: comp.title,
      description: comp.description,
      date: comp.date,
      end_date: comp.endDate,
      location: comp.location,
      type: comp.type,
      status: comp.status,
      registration_link: comp.registrationLink,
      image_url: comp.imageUrl
    }]);
    return { success: !error };
  },

  deleteCompetition: async (id: string): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase.from("competitions").delete().eq("id", id);
    return !error;
  },

  getStoreKits: async (category?: string): Promise<StoreKit[]> => {
    if (isRealSupabase && supabase) {
      let query = supabase.from("store_kits").select("*").order("price", { ascending: true });
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          name: d.name,
          description: d.description,
          price: d.price,
          originalPrice: d.original_price,
          category: d.category,
          imageUrl: d.image_url,
          features: d.features || [],
          inStock: d.in_stock,
          stockCount: d.stock_count
        }));
      }
    }
    return category ? DEMO_STORE_KITS.filter(k => k.category === category) : DEMO_STORE_KITS;
  },

  saveStoreKit: async (kit: Omit<StoreKit, "id">): Promise<{ success: boolean }> => {
    if (!isRealSupabase || !supabase) return { success: false };
    const { error } = await supabase.from("store_kits").insert([{
      name: kit.name,
      description: kit.description,
      price: kit.price,
      original_price: kit.originalPrice,
      category: kit.category,
      image_url: kit.imageUrl,
      features: kit.features,
      in_stock: kit.inStock,
      stock_count: kit.stockCount
    }]);
    return { success: !error };
  },

  updateStoreKit: async (id: string, updates: Partial<StoreKit>): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.stockCount !== undefined) dbUpdates.stock_count = updates.stockCount;
    if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
    const { error } = await supabase.from("store_kits").update(dbUpdates).eq("id", id);
    return !error;
  },

  deleteStoreKit: async (id: string): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase.from("store_kits").delete().eq("id", id);
    return !error;
  },

  submitLead: async (
    leadType: Lead["leadType"],
    name: string,
    email: string,
    phone: string,
    details: Record<string, string>
  ): Promise<{ success: boolean; data?: Lead; error?: string }> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase
        .from("leads")
        .insert([{ lead_type: leadType, name, email, phone, details, status: "new" }])
        .select()
        .single();
      
      if (error) return { success: false, error: error.message };
      return { 
        success: true, 
        data: {
          id: data.id,
          leadType: data.lead_type,
          name: data.name,
          email: data.email,
          phone: data.phone,
          details: data.details,
          status: data.status,
          createdAt: data.created_at
        } 
      };
    }
    return { success: false, error: "Database not configured" };
  },

  getLeads: async (): Promise<Lead[]> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return [];
      return data.map((d: any) => ({
        id: d.id,
        leadType: d.lead_type,
        name: d.name,
        email: d.email,
        phone: d.phone,
        details: d.details,
        status: d.status,
        createdAt: d.created_at
      }));
    }
    return [];
  },

  updateLeadStatus: async (id: string, status: Lead["status"]): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);
    return !error;
  },

  getLearningPaths: async (): Promise<LearningPath[]> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase.from("learning_paths").select("*").order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          title: d.title,
          targetAges: d.target_ages,
          description: d.description,
          skills: d.skills || [],
          projectsCount: d.projects_count
        }));
      }
    }
    return DEMO_PATHS;
  },

  getCourses: async (pathId?: string): Promise<Course[]> => {
    if (isRealSupabase && supabase) {
      let query = supabase.from("courses").select("*").order("sort_order", { ascending: true });
      if (pathId) query = query.eq("learning_path_id", pathId);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          learningPathId: d.learning_path_id,
          title: d.title,
          description: d.description,
          difficulty: d.difficulty,
          duration: d.duration,
          modulesCount: d.modules_count,
          skills: d.skills || [],
          classLevels: d.class_levels
        }));
      }
    }
    if (pathId) {
      return DEMO_COURSES.filter(c => c.learningPathId === pathId);
    }
    return DEMO_COURSES;
  },

  getProjects: async (featuredOnly = false): Promise<Project[]> => {
    if (isRealSupabase && supabase) {
      let query = supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (featuredOnly) query = query.eq("is_featured", true);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          problemStatement: d.problem_statement,
          studentLevel: d.student_level,
          difficulty: d.difficulty,
          skills: d.skills || [],
          technologies: d.technologies || [],
          components: d.components || [],
          learningObjectives: d.learning_objectives || [],
          creatorName: d.creator_name,
          creatorSchool: d.creator_school,
          creatorGrade: d.creator_grade,
          isFeatured: d.is_featured,
          steps: d.steps,
          codeSnippet: d.code_snippet,
          schematic: d.schematic,
          imageUrl: d.image_url
        }));
      }
    }
    if (featuredOnly) {
      return DEMO_PROJECTS.filter(p => p.isFeatured);
    }
    return DEMO_PROJECTS;
  },

  getProject: async (id: string): Promise<Project | null> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          problemStatement: data.problem_statement,
          studentLevel: data.student_level,
          difficulty: data.difficulty,
          skills: data.skills || [],
          technologies: data.technologies || [],
          components: data.components || [],
          learningObjectives: data.learning_objectives || [],
          creatorName: data.creator_name,
          creatorSchool: data.creator_school,
          creatorGrade: data.creator_grade,
          isFeatured: data.is_featured,
          steps: data.steps,
          codeSnippet: data.code_snippet,
          schematic: data.schematic,
          imageUrl: data.image_url
        };
      }
    }
    return DEMO_PROJECTS.find(p => p.id === id) || null;
  },

  saveProject: async (project: Omit<Project, "id"> & { id?: string }): Promise<{ success: boolean; data?: Project }> => {
    const projId = project.id || `proj-${Date.now()}`;
    if (isRealSupabase && supabase) {
      const { error } = await supabase.from("projects").upsert([{
        id: projId,
        title: project.title,
        description: project.description,
        problem_statement: project.problemStatement,
        student_level: project.studentLevel,
        difficulty: project.difficulty,
        skills: project.skills,
        technologies: project.technologies,
        components: project.components,
        learning_objectives: project.learningObjectives,
        creator_name: project.creatorName,
        creator_school: project.creatorSchool,
        creator_grade: project.creatorGrade,
        is_featured: project.isFeatured ?? true,
        steps: project.steps || [],
        code_snippet: project.codeSnippet || "",
        schematic: project.schematic || "",
        image_url: project.imageUrl || ""
      }]);
      if (error) return { success: false };
    }
    const fullProject = { id: projId, ...project } as Project;
    return { success: true, data: fullProject };
  },

  deleteProject: async (id: string): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    return !error;
  },

  saveCourse: async (course: Course): Promise<{ success: boolean }> => {
    if (!isRealSupabase || !supabase) return { success: false };
    const { error } = await supabase.from("courses").upsert([{
      id: course.id,
      learning_path_id: course.learningPathId,
      title: course.title,
      description: course.description,
      difficulty: course.difficulty,
      duration: course.duration,
      modules_count: course.modulesCount,
      skills: course.skills,
      class_levels: course.classLevels || []
    }]);
    return { success: !error };
  },

  deleteCourse: async (id: string): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    return !error;
  },

  saveCertificate: async (cert: Certificate): Promise<{ success: boolean }> => {
    if (!isRealSupabase || !supabase) return { success: false };
    const { error } = await supabase.from("certificates").upsert([{
      id: cert.id,
      student_name: cert.studentName,
      program_name: cert.programName,
      achievement: cert.achievement,
      issued_date: cert.issuedDate,
      skills_verified: cert.skillsVerified,
      verification_hash: `0x${Math.random().toString(16).substring(2, 10)}`
    }]);
    return { success: !error };
  },

  deleteCertificate: async (id: string): Promise<boolean> => {
    if (!isRealSupabase || !supabase) return false;
    const { error } = await supabase.from("certificates").delete().eq("id", id);
    return !error;
  },

  getCertificates: async (): Promise<Certificate[]> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase.from("certificates").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          studentName: d.student_name,
          programName: d.program_name,
          achievement: d.achievement,
          issuedDate: d.issued_date,
          skillsVerified: d.skills_verified || []
        }));
      }
    }
    return Object.values(DEMO_CERTIFICATES);
  },

  verifyCertificate: async (id: string): Promise<Certificate | null> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase.from("certificates").select("*").eq("id", id).single();
      if (!error && data) {
        return {
          id: data.id,
          studentName: data.student_name,
          programName: data.program_name,
          achievement: data.achievement,
          issuedDate: data.issued_date,
          skillsVerified: data.skills_verified || []
        };
      }
    }
    return DEMO_CERTIFICATES[id] || null;
  },

  getCurrentUser: () => {
    if (typeof window === "undefined") return null;
    try {
      const item = window.localStorage.getItem("siksatech_user");
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  login: async (email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> => {
    if (!isRealSupabase || !supabase) {
      return { success: false, error: "Authentication not configured" };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      
      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: profile?.full_name || "User",
        role: profile?.role || "student",
        grade: profile?.grade_level,
        institution: profile?.school_college_name
      };
      return { success: true, user: userData };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  register: async (email: string, password: string, name: string, role: string, details: { grade?: string; institution?: string }): Promise<{ success: boolean; user?: any; error?: string }> => {
    if (!isRealSupabase || !supabase) {
      return { success: false, error: "Registration not configured" };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, grade_level: details.grade, school_college_name: details.institution } }
      });
      if (error) return { success: false, error: error.message };
      
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email,
          full_name: name,
          role: role || "student",
          school_college_name: details.institution,
          grade_level: details.grade,
          created_at: new Date().toISOString()
        });
      }
      return { success: true, user: { email, name, role } };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  logout: async () => {
    if (isRealSupabase && supabase) {
      await supabase.auth.signOut();
    }
  }
};

export const login = db.login;
export const register = db.register;
export const logout = db.logout;
export const getCurrentUser = db.getCurrentUser;

