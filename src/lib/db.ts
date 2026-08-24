import { createClient } from "@supabase/supabase-js";

// Check if environment variables are available. If not, use local mock system.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isRealSupabase = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== "placeholder");

export const supabase = isRealSupabase 
  ? createClient(supabaseUrl!, supabaseAnonKey!) 
  : null;

// ========================================================
// INTERFACES
// ========================================================

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

// ========================================================
// DEMO SEED DATA
// ========================================================

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
    description: "A solar-powered IoT node that measures soil parameters and automatically triggers irrigation valves based on real-time needs.",
    problemStatement: "Traditional farming suffers from water waste and poor crop health monitoring due to lack of localized soil data.",
    studentLevel: "Builder (Class 8–10)",
    difficulty: "Medium",
    skills: ["Arduino programming", "Soil Physics", "IoT Dashboards"],
    technologies: ["Arduino C++", "ESP8266 WiFi", "Blynk IoT Platform"],
    components: ["Capacitive Moisture Sensor", "DHT22 Temperature Sensor", "5V Solenoid Valve", "ESP8266 Board"],
    learningObjectives: ["Understand capacitive sensing calibration", "Program low-power deep sleep cycles", "Implement remote server triggers"],
    creatorName: "Aarav Sharma",
    creatorSchool: "Delhi Public School, Vasant Kunj",
    creatorGrade: "Class 9",
    isFeatured: true,
    steps: [
      { stepNumber: 1, title: "Gather Components", description: "Collect all the sensors, the ESP8266 board, breadboard, and jumper wires." },
      { stepNumber: 2, title: "Wire the Soil Sensor", description: "Connect the capacitive moisture sensor to the analog input A0 on the ESP8266." },
      { stepNumber: 3, title: "Upload Code", description: "Flash the Arduino sketch to read sensor values and send them to the Blynk cloud." },
      { stepNumber: 4, title: "Test & Calibrate", description: "Place the sensor in dry and wet soil to calibrate the threshold values." }
    ],
    codeSnippet: `#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>

#define SOIL_PIN A0
#define VALVE_PIN D5

void setup() {
  Serial.begin(9600);
  Blynk.begin(auth, ssid, pass);
  pinMode(VALVE_PIN, OUTPUT);
}

void loop() {
  int moisture = analogRead(SOIL_PIN);
  Blynk.virtualWrite(V1, moisture);
  if (moisture > 700) {
    digitalWrite(VALVE_PIN, HIGH);
  } else {
    digitalWrite(VALVE_PIN, LOW);
  }
  Blynk.run();
  delay(2000);
}`
  },
  {
    id: "ai-vision-bot",
    title: "Autonomous Obstacle-Sorting Vehicle",
    description: "A mobile robot using edge computer vision to navigate terrain and sort objects based on color and material tags.",
    problemStatement: "Industrial warehouses require low-cost, smart sorting mechanisms that can operate dynamically without static paths.",
    studentLevel: "Engineer (College)",
    difficulty: "Hard",
    skills: ["Computer Vision", "Motor Control Loop", "System Tuning"],
    technologies: ["Python", "OpenCV", "Raspberry Pi OS", "ROS"],
    components: ["Raspberry Pi 4", "Pi Camera Module v2", "DC Gear Motors", "L298N Driver", "Li-Ion Battery Pack"],
    learningObjectives: ["Calibrate color masking filters", "Implement PID speed control loops", "Process multi-threaded camera feeds"],
    creatorName: "Priyanka Sen",
    creatorSchool: "Vellore Institute of Technology",
    creatorGrade: "B.Tech CSE, 3rd Year",
    isFeatured: true,
    steps: [
      { stepNumber: 1, title: "Assemble Chassis", description: "Mount the motors and wheels on the chassis platform, and wire the L298N motor driver." },
      { stepNumber: 2, title: "Connect Camera", description: "Attach the Pi Camera Module to the CSI port on the Raspberry Pi 4." },
      { stepNumber: 3, title: "Install Dependencies", description: "Install OpenCV, NumPy, and RPi.GPIO on the Raspberry Pi OS." },
      { stepNumber: 4, title: "Color Detection", description: "Write a Python script to detect red, blue, and green objects using HSV masking." },
      { stepNumber: 5, title: "Motor Control", description: "Implement PID control to navigate towards detected objects and sort them." }
    ],
    codeSnippet: `import cv2
import numpy as np
from gpiozero import Motor

camera = cv2.VideoCapture(0)
motor_left = Motor(forward=17, backward=18)
motor_right = Motor(forward=22, backward=23)

while True:
    ret, frame = camera.read()
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    
    # Red object mask
    mask = cv2.inRange(hsv, (0, 120, 70), (10, 255, 255))
    contours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    if contours:
        c = max(contours, key=cv2.contourArea)
        M = cv2.moments(c)
        cx = int(M["m10"] / M["m00"])
        # Steer towards object
        if cx < 200:
            motor_left.backward(0.3)
            motor_right.forward(0.5)
        elif cx > 440:
            motor_left.forward(0.5)
            motor_right.backward(0.3)
        else:
            motor_left.forward(0.5)
            motor_right.forward(0.5)`
  },
  {
    id: "energy-monitor",
    title: "Smart Home Energy Auditor",
    description: "A non-invasive clip-on current monitor that measures home electricity consumption and displays analytics on a local Web dashboard.",
    problemStatement: "Consumers have no visibility into which appliances waste energy, leading to massive electric bills.",
    studentLevel: "Creator (Class 11–12)",
    difficulty: "Medium",
    skills: ["Alternating Current Principles", "NodeJS Webserver", "ADC Sampling"],
    technologies: ["C++", "ESP32", "HTML/CSS Dashboard"],
    components: ["SCT-013 Current Transformer", "ESP32 DevKit v1", "OLED Display 0.96 inch"],
    learningObjectives: ["Calculate root-mean-square current", "Design and host a local ESP32 HTTP Server", "Build live telemetry charts"],
    creatorName: "Kabir Mehta",
    creatorSchool: "Amity International School, Noida",
    creatorGrade: "Class 12",
    isFeatured: true
  },
  {
    id: "weather-station",
    title: "IoT Environmental Weather Logger",
    description: "A mini meteorological station reporting temperature, humidity, pressure, and dust particles directly to a public website.",
    problemStatement: "Urban micro-climates vary wildly, making generic city weather apps inaccurate for localized farming or health checks.",
    studentLevel: "Builder (Class 8–10)",
    difficulty: "Easy",
    skills: ["Hardware Connections", "API integration", "Calibration"],
    technologies: ["C++", "ESP8266", "ThingSpeak Cloud"],
    components: ["DHT11 Sensor", "BMP280 Barometric Sensor", "GP2Y10 Dust Sensor", "NodeMCU Board"],
    learningObjectives: ["Wire I2C and Analog sensors simultaneously", "Send HTTP POST requests to API", "Calibrate dust sensor offsets"],
    creatorName: "Rohan Patel",
    creatorSchool: "Ryan International School, Gurgaon",
    creatorGrade: "Class 10",
    isFeatured: false
  }
];

export const DEMO_BANNERS: Banner[] = [
  {
    id: "banner-1",
    title: "Build the Future with Your Hands",
    subtitle: "STEM-based technology courses for Classes 5 to College — from circuits to AI.",
    ctaText: "Explore Courses",
    ctaLink: "/learn",
    bgColor: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)",
    isActive: true,
    sortOrder: 1
  },
  {
    id: "banner-2",
    title: "New Batch Starting Soon",
    subtitle: "Arduino & IoT Fundamentals — Weekend Workshops for Class 8–10 students.",
    ctaText: "Register Now",
    ctaLink: "/learn",
    bgColor: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #064E3B 100%)",
    isActive: true,
    sortOrder: 2
  },
  {
    id: "banner-3",
    title: "SiksaTech STEM Lab Program",
    subtitle: "Partner with us to set up fully equipped robotics & IoT labs in your school.",
    ctaText: "Learn More",
    ctaLink: "/institutions",
    bgColor: "linear-gradient(135deg, #4C1D95 0%, #5B21B6 50%, #4C1D95 100%)",
    isActive: true,
    sortOrder: 3
  }
];

export const DEMO_FAQS: FAQ[] = [
  {
    id: "faq-1",
    question: "What age group is SiksaTech designed for?",
    answer: "SiksaTech offers structured STEM learning paths for students from Class 5 through to College level. Our Explorer track starts at age 10, and our Engineer track is designed for college students and working professionals.",
    category: "general",
    sortOrder: 1
  },
  {
    id: "faq-2",
    question: "Do students need any prior coding or electronics experience?",
    answer: "No prior experience is required. Each learning path begins with fundamentals. The Explorer path starts with visual block coding and basic circuit concepts, gradually building towards advanced topics in later tracks.",
    category: "student",
    sortOrder: 2
  },
  {
    id: "faq-3",
    question: "How is SiksaTech different from YouTube tutorials?",
    answer: "SiksaTech is a structured, hands-on learning ecosystem — not just video content. Students receive physical hardware kits, work on guided real-world projects, submit builds for mentor review, and earn verified certificates. Learning happens by building, not just watching.",
    category: "general",
    sortOrder: 3
  },
  {
    id: "faq-4",
    question: "Can my school partner with SiksaTech?",
    answer: "Yes. We offer institutional partnership programs including turnkey STEM lab setups, faculty training workshops, curriculum integration support, and student competition hosting. Contact us through the For Institutions page.",
    category: "institution",
    sortOrder: 4
  },
  {
    id: "faq-5",
    question: "What hardware kits do students receive?",
    answer: "Each learning path has its own curated hardware kit. The Explorer Kit includes LEDs, resistors, breadboards, and basic sensors. The Builder Kit adds Arduino boards and actuators. Creator Kits include ESP32 modules and soldering equipment. All kits are available in our Store.",
    category: "student",
    sortOrder: 5
  },
  {
    id: "faq-6",
    question: "Are the certificates industry-recognized?",
    answer: "SiksaTech certificates are verifiable credentials with unique IDs that can be validated publicly on our platform. They document specific skills demonstrated through hands-on project builds, making them valuable for academic portfolios.",
    category: "general",
    sortOrder: 6
  },
  {
    id: "faq-7",
    question: "What is the fee structure?",
    answer: "Course fees vary by learning path and duration. We offer individual enrollment, group discounts for schools, and EMI options. Visit the Learn page and select your pathway to see current pricing, or contact us for institutional bulk pricing.",
    category: "general",
    sortOrder: 7
  }
];

export const DEMO_COMPETITIONS: Competition[] = [
  {
    id: "comp-1",
    title: "SiksaTech Maker Sprint 2026",
    description: "A 48-hour hardware hackathon where teams of 2–4 students build a working prototype to solve a real community problem. Open to Class 8 and above.",
    date: "2026-10-15",
    endDate: "2026-10-17",
    location: "Online + Regional Centers",
    type: "hackathon",
    status: "upcoming",
    registrationLink: "/enquiry/student"
  },
  {
    id: "comp-2",
    title: "IoT Innovation Challenge",
    description: "Design and deploy an IoT system that monitors an environmental parameter. Best implementations win lab sponsorships and mentorship.",
    date: "2026-11-01",
    endDate: "2026-11-30",
    location: "Online Submission",
    type: "competition",
    status: "upcoming",
    registrationLink: "/enquiry/student"
  },
  {
    id: "comp-3",
    title: "Teacher Training Workshop — STEM Pedagogy",
    description: "A 2-day intensive workshop for school teachers on integrating hands-on STEM activities into existing science and computer science curriculum.",
    date: "2026-09-20",
    endDate: "2026-09-21",
    location: "Delhi NCR",
    type: "workshop",
    status: "upcoming",
    registrationLink: "/institutions"
  }
];

export const DEMO_STORE_KITS: StoreKit[] = [
  {
    id: "kit-explorer",
    name: "Explorer Starter Kit",
    description: "Everything a Class 5–7 student needs to start their STEM journey — LEDs, resistors, breadboard, buzzer, buttons, and a project guide booklet.",
    price: 1499,
    originalPrice: 1999,
    category: "explorer",
    features: ["50+ Components", "Illustrated Guide", "5 Guided Projects", "Storage Box"],
    inStock: true,
    stockCount: 45
  },
  {
    id: "kit-builder",
    name: "Builder Arduino Kit",
    description: "Arduino Uno R3 board with sensors, actuators, display modules, and a structured project workbook for Class 8–10 students.",
    price: 2999,
    originalPrice: 3999,
    category: "builder",
    features: ["Arduino Uno R3", "15+ Sensors", "LCD Display", "Motor Driver", "12 Projects"],
    inStock: true,
    stockCount: 30
  },
  {
    id: "kit-creator",
    name: "Creator IoT Kit",
    description: "ESP32 DevKit with WiFi/BLE modules, relay board, OLED display, and cloud integration guides for Class 11–12 students.",
    price: 4499,
    originalPrice: 5999,
    category: "creator",
    features: ["ESP32 DevKit V1", "WiFi + BLE", "OLED 0.96\"", "Relay Module", "8 IoT Projects"],
    inStock: true,
    stockCount: 20
  },
  {
    id: "kit-engineer",
    name: "Engineer Pro Kit",
    description: "Raspberry Pi 4 with camera module, motor drivers, battery pack, and a comprehensive computer vision project manual for college students.",
    price: 8999,
    originalPrice: 11999,
    category: "engineer",
    features: ["Raspberry Pi 4 (4GB)", "Pi Camera v2", "Motor Driver", "LiPo Battery", "6 Advanced Projects"],
    inStock: true,
    stockCount: 12
  },
  {
    id: "kit-soldering",
    name: "Soldering Station Kit",
    description: "Temperature-controlled soldering iron, solder wire, flux, desoldering pump, and practice PCBs for hands-on circuit assembly.",
    price: 1299,
    category: "accessory",
    features: ["60W Adjustable Iron", "Lead-Free Solder", "Flux Pen", "3 Practice PCBs"],
    inStock: true,
    stockCount: 50
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
    skillsVerified: ["Python scripting", "Microcontrollers", "Data Telemetry"]
  }
};

// ========================================================
// PERSISTENT DATA ENGINES (MOCK ENGINE FOR LOCALSTORAGE)
// ========================================================

const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error("Storage error:", e);
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error:", e);
  }
};

// Data Layer functions
export const db = {
  // --- Banners ---
  getBanners: async (): Promise<Banner[]> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error || !data) return DEMO_BANNERS;
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
    return getStorageItem<Banner[]>("siksatech_banners", DEMO_BANNERS);
  },

  saveBanner: async (banner: Omit<Banner, "id">): Promise<{ success: boolean; data?: Banner }> => {
    const id = `banner-${Date.now()}`;
    const newBanner: Banner = { id, ...banner };
    if (isRealSupabase && supabase) {
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
      return { success: true, data: { ...newBanner, id: data.id } };
    }
    const banners = getStorageItem<Banner[]>("siksatech_banners", DEMO_BANNERS);
    banners.push(newBanner);
    setStorageItem("siksatech_banners", banners);
    return { success: true, data: newBanner };
  },

  deleteBanner: async (id: string): Promise<boolean> => {
    if (isRealSupabase && supabase) {
      const { error } = await supabase.from("banners").delete().eq("id", id);
      return !error;
    }
    const banners = getStorageItem<Banner[]>("siksatech_banners", DEMO_BANNERS);
    setStorageItem("siksatech_banners", banners.filter(b => b.id !== id));
    return true;
  },

  // --- FAQs ---
  getFAQs: async (category?: string): Promise<FAQ[]> => {
    if (isRealSupabase && supabase) {
      let query = supabase.from("faqs").select("*").order("sort_order", { ascending: true });
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (error || !data) return category ? DEMO_FAQS.filter(f => f.category === category) : DEMO_FAQS;
      return data.map((d: any) => ({
        id: d.id,
        question: d.question,
        answer: d.answer,
        category: d.category,
        sortOrder: d.sort_order
      }));
    }
    const faqs = getStorageItem<FAQ[]>("siksatech_faqs", DEMO_FAQS);
    return category ? faqs.filter(f => f.category === category) : faqs;
  },

  saveFAQ: async (faq: Omit<FAQ, "id">): Promise<{ success: boolean }> => {
    const id = `faq-${Date.now()}`;
    if (isRealSupabase && supabase) {
      const { error } = await supabase.from("faqs").insert([{
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        sort_order: faq.sortOrder
      }]);
      return { success: !error };
    }
    const faqs = getStorageItem<FAQ[]>("siksatech_faqs", DEMO_FAQS);
    faqs.push({ id, ...faq });
    setStorageItem("siksatech_faqs", faqs);
    return { success: true };
  },

  deleteFAQ: async (id: string): Promise<boolean> => {
    if (isRealSupabase && supabase) {
      const { error } = await supabase.from("faqs").delete().eq("id", id);
      return !error;
    }
    const faqs = getStorageItem<FAQ[]>("siksatech_faqs", DEMO_FAQS);
    setStorageItem("siksatech_faqs", faqs.filter(f => f.id !== id));
    return true;
  },

  // --- Competitions ---
  getCompetitions: async (): Promise<Competition[]> => {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase.from("competitions").select("*").order("date", { ascending: true });
      if (error || !data) return DEMO_COMPETITIONS;
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
    return getStorageItem<Competition[]>("siksatech_competitions", DEMO_COMPETITIONS);
  },

  saveCompetition: async (comp: Omit<Competition, "id">): Promise<{ success: boolean }> => {
    const id = `comp-${Date.now()}`;
    if (isRealSupabase && supabase) {
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
    }
    const comps = getStorageItem<Competition[]>("siksatech_competitions", DEMO_COMPETITIONS);
    comps.push({ id, ...comp });
    setStorageItem("siksatech_competitions", comps);
    return { success: true };
  },

  deleteCompetition: async (id: string): Promise<boolean> => {
    if (isRealSupabase && supabase) {
      const { error } = await supabase.from("competitions").delete().eq("id", id);
      return !error;
    }
    const comps = getStorageItem<Competition[]>("siksatech_competitions", DEMO_COMPETITIONS);
    setStorageItem("siksatech_competitions", comps.filter(c => c.id !== id));
    return true;
  },

  // --- Store Kits ---
  getStoreKits: async (category?: string): Promise<StoreKit[]> => {
    if (isRealSupabase && supabase) {
      let query = supabase.from("store_kits").select("*").order("price", { ascending: true });
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (error || !data) return category ? DEMO_STORE_KITS.filter(k => k.category === category) : DEMO_STORE_KITS;
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
    const kits = getStorageItem<StoreKit[]>("siksatech_store_kits", DEMO_STORE_KITS);
    return category ? kits.filter(k => k.category === category) : kits;
  },

  saveStoreKit: async (kit: Omit<StoreKit, "id">): Promise<{ success: boolean }> => {
    const id = `kit-${Date.now()}`;
    if (isRealSupabase && supabase) {
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
    }
    const kits = getStorageItem<StoreKit[]>("siksatech_store_kits", DEMO_STORE_KITS);
    kits.push({ id, ...kit });
    setStorageItem("siksatech_store_kits", kits);
    return { success: true };
  },

  updateStoreKit: async (id: string, updates: Partial<StoreKit>): Promise<boolean> => {
    if (isRealSupabase && supabase) {
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.stockCount !== undefined) dbUpdates.stock_count = updates.stockCount;
      if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
      const { error } = await supabase.from("store_kits").update(dbUpdates).eq("id", id);
      return !error;
    }
    const kits = getStorageItem<StoreKit[]>("siksatech_store_kits", DEMO_STORE_KITS);
    const idx = kits.findIndex(k => k.id === id);
    if (idx !== -1) {
      kits[idx] = { ...kits[idx], ...updates };
      setStorageItem("siksatech_store_kits", kits);
      return true;
    }
    return false;
  },

  deleteStoreKit: async (id: string): Promise<boolean> => {
    if (isRealSupabase && supabase) {
      const { error } = await supabase.from("store_kits").delete().eq("id", id);
      return !error;
    }
    const kits = getStorageItem<StoreKit[]>("siksatech_store_kits", DEMO_STORE_KITS);
    setStorageItem("siksatech_store_kits", kits.filter(k => k.id !== id));
    return true;
  },

  // --- Leads CRM ---
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
    } else {
      const leads = getStorageItem<Lead[]>("siksatech_leads", []);
      const newLead: Lead = {
        id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
        leadType,
        name,
        email,
        phone,
        details,
        status: "new",
        createdAt: new Date().toISOString()
      };
      leads.push(newLead);
      setStorageItem("siksatech_leads", leads);
      return { success: true, data: newLead };
    }
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
    } else {
      return getStorageItem<Lead[]>("siksatech_leads", []);
    }
  },

  updateLeadStatus: async (id: string, status: Lead["status"]): Promise<boolean> => {
    if (isRealSupabase && supabase) {
      const { error } = await supabase
        .from("leads")
        .update({ status })
        .eq("id", id);
      return !error;
    } else {
      const leads = getStorageItem<Lead[]>("siksatech_leads", []);
      const idx = leads.findIndex(l => l.id === id);
      if (idx !== -1) {
        leads[idx].status = status;
        setStorageItem("siksatech_leads", leads);
        return true;
      }
      return false;
    }
  },

  // --- Curriculum ---
  getLearningPaths: async (): Promise<LearningPath[]> => {
    return DEMO_PATHS;
  },

  getCourses: async (pathId?: string): Promise<Course[]> => {
    if (pathId) {
      return DEMO_COURSES.filter(c => c.learningPathId === pathId);
    }
    return DEMO_COURSES;
  },

  // --- Projects ---
  getProjects: async (featuredOnly = false): Promise<Project[]> => {
    if (featuredOnly) {
      return DEMO_PROJECTS.filter(p => p.isFeatured);
    }
    return DEMO_PROJECTS;
  },

  getProject: async (id: string): Promise<Project | null> => {
    return DEMO_PROJECTS.find(p => p.id === id) || null;
  },

  // --- Verification ---
  verifyCertificate: async (id: string): Promise<Certificate | null> => {
    return DEMO_CERTIFICATES[id] || null;
  },

  // --- Authentication ---
  getCurrentUser: () => {
    if (typeof window === "undefined") return null;
    return getStorageItem<{ email: string; name: string; role: string; grade?: string; institution?: string } | null>("siksatech_user", null);
  },

  login: async (email: string): Promise<{ success: boolean; user?: any; error?: string }> => {
    let role = "student";
    let name = "Aditya Roy";
    let grade = "Class 9";
    let institution = "Delhi Public School";

    if (email.includes("admin")) {
      role = "super_admin";
      name = "Vikram Aditya (Admin)";
      grade = "";
      institution = "SiksaTech HQ";
    } else if (email.includes("content")) {
      role = "web_content_admin";
      name = "Content Manager";
      grade = "";
      institution = "SiksaTech";
    } else if (email.includes("course")) {
      role = "course_admin";
      name = "Course Manager";
      grade = "";
      institution = "SiksaTech";
    } else if (email.includes("events")) {
      role = "events_admin";
      name = "Events Manager";
      grade = "";
      institution = "SiksaTech";
    } else if (email.includes("store")) {
      role = "store_admin";
      name = "Store Manager";
      grade = "";
      institution = "SiksaTech";
    }

    const userData = { email, name, role, grade, institution };
    setStorageItem("siksatech_user", userData);
    return { success: true, user: userData };
  },

  register: async (email: string, name: string, role: string, details: { grade?: string; institution?: string }): Promise<{ success: boolean; user?: any }> => {
    const userData = { email, name, role, ...details };
    setStorageItem("siksatech_user", userData);
    return { success: true, user: userData };
  },

  logout: () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem("siksatech_user");
  }
};
