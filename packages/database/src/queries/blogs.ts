/**
 * Server-side Blogs & Community queries
 */
import type { SupabaseClient } from "../client";

export interface BlogItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_markdown: string;
  author_name: string;
  author_role: string;
  cover_image?: string | null;
  category: "tutorial" | "guide" | "showcase" | "announcement" | "industry";
  tags: string[];
  read_time_mins: number;
  published_at: string;
}

export const DEMO_BLOGS: BlogItem[] = [
  {
    id: "blog-1",
    slug: "esp32-freertos-multitasking-guide",
    title: "Mastering Dual-Core FreeRTOS Multitasking on ESP32",
    excerpt: "How to pin telemetry acquisition tasks to Core 0 while serving responsive WebSocket dashboards on Core 1.",
    content_markdown: `## Introduction to Dual-Core Processing on ESP32

The ESP32 microcontroller features two 32-bit Xtensa LX6 CPU cores: **Protocol Core (Core 0)** and **Application Core (Core 1)**.

### Creating a Pinned Task:
\`\`\`cpp
void telemetryTask(void * pvParameters) {
  for(;;) {
    float temp = readSensors();
    vTaskDelay(100 / portTICK_PERIOD_MS);
  }
}

void setup() {
  xTaskCreatePinnedToCore(
    telemetryTask,   /* Function to implement the task */
    "Telemetry",     /* Name of the task */
    10000,           /* Stack size in words */
    NULL,            /* Task input parameter */
    1,               /* Priority of the task */
    NULL,            /* Task handle */
    0                /* Core where the task should run (Core 0) */
  );
}
\`\`\`

By separating time-critical sensing loops from network stacks, you prevent watchdog timeouts and sensor latency jitter.`,
    author_name: "Dr. Vikram Sethi",
    author_role: "Principal Systems Architect, SiksaTech",
    category: "tutorial",
    tags: ["ESP32", "FreeRTOS", "Embedded C++", "Multitasking"],
    read_time_mins: 8,
    published_at: "2026-08-20"
  },
  {
    id: "blog-2",
    slug: "debugging-ground-loops-in-analog-sensors",
    title: "Eliminating Ground Loops & 50Hz AC Hum in Sensor Breadboards",
    excerpt: "Practical decoupling, star grounding, and low-pass RC filtering techniques for clean analog telemetry.",
    content_markdown: `## The Physics of Ground Potential Differences

When microcontrollers switch high-current inductive loads (e.g. DC motors or relay coils), ground bounce introduces spurious analog offsets.

### Best Practices:
1. **Star Topology Grounding**: Route heavy motor return paths directly to the battery negative terminal before joining the MCU ground rail.
2. **0.1µF Ceramic Bypass Capacitors**: Place bypass caps across VCC and GND directly next to sensitive IC supply pins.
3. **Hardware RC Low-Pass Filter**: A 10kΩ resistor and 100nF capacitor create a cut-off frequency of $f_c = \\frac{1}{2\\pi RC} \\approx 159\\text{Hz}$, filtering line noise effectively.`,
    author_name: "Ananya Deshmukh",
    author_role: "Lead Hardware Engineer",
    category: "guide",
    tags: ["Circuits", "Noise Filtering", "Analog Telemetry", "Hardware"],
    read_time_mins: 6,
    published_at: "2026-08-15"
  }
];

/**
 * Fetch all published blogs
 */
export async function getBlogs(
  supabase?: SupabaseClient,
  category?: string
): Promise<BlogItem[]> {
  if (supabase) {
    let query = (supabase as any)
      .from("blogs")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data;
    }
  }

  if (category && category !== "all") {
    return DEMO_BLOGS.filter((b) => b.category === category);
  }
  return DEMO_BLOGS;
}

/**
 * Fetch a single blog post by slug
 */
export async function getBlogBySlug(
  supabase: SupabaseClient | undefined,
  slug: string
): Promise<BlogItem | null> {
  if (supabase) {
    const { data, error } = await (supabase as any)
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!error && data) {
      return data;
    }
  }

  return DEMO_BLOGS.find((b) => b.slug === slug) || null;
}
