/**
 * Demo/mock data for development and graceful fallback.
 * Used when Supabase credentials are not configured.
 */
import type { LearningPath, Course, Project, Banner, FAQ, Competition, StoreKit, Certificate } from "../types";

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
