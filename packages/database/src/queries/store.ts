/**
 * Server-side Store, Products, Cart & Orders queries
 */
import type { SupabaseClient } from "../client";

export interface ProductItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  price_inr: number;
  compare_at_price?: number | null;
  category: "explorer" | "builder" | "creator" | "engineer" | "component" | "tool" | "accessory";
  images: string[];
  features: string[];
  components_list: string[];
  stock_count: number;
  is_in_stock: boolean;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface OrderItemPayload {
  product_id?: string;
  product_name: string;
  price_inr: number;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  user_id?: string | null;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  payment_gateway: "razorpay" | "upi_direct" | "manual";
  payment_id?: string | null;
  total_amount_inr: number;
  subtotal_inr: number;
  tax_inr: number;
  shipping_fee_inr: number;
  shipping_address: ShippingAddress;
  tracking_number?: string | null;
  courier_name?: string | null;
  created_at: string;
  order_items?: {
    id: string;
    product_name: string;
    price_inr: number;
    quantity: number;
    subtotal_inr: number;
  }[];
}

export const DEMO_PRODUCTS: ProductItem[] = [
  {
    id: "prod-1",
    slug: "explorer-starter-kit",
    title: "Explorer STEM Starter Kit",
    description: "Designed for Class 5–7 innovators. Learn physical circuit loops, switches, LEDs, buzzers, and basic light sensors without soldering.",
    price_inr: 1499,
    compare_at_price: 1999,
    category: "explorer",
    images: ["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80"],
    features: ["50+ Physical Components", "Full-Color Illustrated Guidebook", "5 Guided Builds", "Durable Storage Box"],
    components_list: ["Breadboard Mini", "10x 5mm LEDs", "220Ω & 10kΩ Resistors", "9V Battery Clip", "Photoresistor (LDR)", "Piezo Buzzer"],
    stock_count: 50,
    is_in_stock: true
  },
  {
    id: "prod-2",
    slug: "builder-arduino-kit",
    title: "Builder Embedded Arduino Kit",
    description: "Designed for Class 8–10 builders. Includes an Arduino Uno R3 microcomputer, servo motors, LCD display, and environmental sensors.",
    price_inr: 2999,
    compare_at_price: 3999,
    category: "builder",
    images: ["https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80"],
    features: ["Original Atmega328P MCU", "15+ Precision Sensors", "16x2 I2C Display", "Servo & Stepper Motor", "12 Projects Guide"],
    components_list: ["Arduino Uno R3", "I2C 1602 LCD", "SG90 Micro Servo", "DHT11 Humidity Sensor", "Ultrasonic HC-SR04"],
    stock_count: 35,
    is_in_stock: true
  },
  {
    id: "prod-3",
    slug: "creator-iot-esp32-kit",
    title: "Creator Connected IoT ESP32 Kit",
    description: "For Class 11–12 & Engineering creators. Dual-core ESP32 with Wi-Fi & Bluetooth, OLED screen, relay modules, and cloud API integration.",
    price_inr: 4499,
    compare_at_price: 5499,
    category: "creator",
    images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80"],
    features: ["Dual-Core 240MHz ESP32", "0.96 inch I2C OLED", "Wi-Fi & BLE Telemetry", "5V Relay Board", "Cloud REST API Guides"],
    components_list: ["ESP32 Dev Module", "0.96 inch OLED", "Capacitive Soil Sensor", "2-Channel Relay", "Jumper Wires"],
    stock_count: 25,
    is_in_stock: true
  },
  {
    id: "prod-4",
    slug: "engineer-robotics-vision-kit",
    title: "Engineer Autonomous Vision Rover",
    description: "College-level autonomous rover with Raspberry Pi camera mount, dual DC gear motors, L298N motor driver, and Python edge processing scripts.",
    price_inr: 7999,
    compare_at_price: 9999,
    category: "engineer",
    images: ["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80"],
    features: ["2WD Robotic Chassis", "L298N High-Current Driver", "5MP Camera Module", "Pan-Tilt Mount", "Python OpenCV Codebase"],
    components_list: ["Laser-cut Acrylic Chassis", "2x DC Motors", "L298N Driver", "Pi Camera Cable", "18650 Battery Holder"],
    stock_count: 15,
    is_in_stock: true
  }
];

/**
 * Fetch all store products with optional category filter
 */
export async function getStoreProducts(
  supabase?: SupabaseClient,
  category?: string
): Promise<ProductItem[]> {
  if (supabase) {
    let query = (supabase as any)
      .from("products")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (!error && data) {
      return data;
    }
  }

  if (category && category !== "all") {
    return DEMO_PRODUCTS.filter((p) => p.category === category);
  }
  return DEMO_PRODUCTS;
}

/**
 * Fetch a single product by slug or ID
 */
export async function getStoreProductBySlug(
  supabase: SupabaseClient | undefined,
  slugOrId: string
): Promise<ProductItem | null> {
  if (supabase) {
    const { data, error } = await (supabase as any)
      .from("products")
      .select("*")
      .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
      .single();

    if (!error && data) {
      return data;
    }
  }

  return DEMO_PRODUCTS.find((p) => p.slug === slugOrId || p.id === slugOrId) || null;
}

/**
 * Create a new Order in the database
 */
export async function createOrder(
  supabase: SupabaseClient | undefined,
  orderData: {
    user_id?: string | null;
    items: OrderItemPayload[];
    shipping_address: ShippingAddress;
    payment_gateway: "razorpay" | "upi_direct" | "manual";
    payment_id?: string;
  }
): Promise<{ success: boolean; orderNumber?: string; orderId?: string; error?: string }> {
  const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  let subtotal = 0;
  orderData.items.forEach((item) => {
    subtotal += item.price_inr * item.quantity;
  });

  const shippingFee = subtotal >= 999 ? 0 : 99; // Free shipping over ₹999
  const tax = Math.round(subtotal * 0.18); // 18% GST estimate
  const totalAmount = subtotal + shippingFee;

  if (supabase) {
    try {
      const { data: order, error: orderError } = await (supabase as any)
        .from("orders")
        .insert({
          order_number: orderNumber,
          user_id: orderData.user_id || null,
          status: "processing",
          payment_status: "paid",
          payment_gateway: orderData.payment_gateway,
          payment_id: orderData.payment_id || `PAY-${Date.now()}`,
          subtotal_inr: subtotal,
          tax_inr: tax,
          shipping_fee_inr: shippingFee,
          total_amount_inr: totalAmount,
          shipping_address: orderData.shipping_address
        })
        .select()
        .single();

      if (orderError) return { success: false, error: orderError.message };

      // Insert Order Items
      const orderItems = orderData.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id || null,
        product_name: item.product_name,
        price_inr: item.price_inr,
        quantity: item.quantity,
        subtotal_inr: item.price_inr * item.quantity
      }));

      await (supabase as any).from("order_items").insert(orderItems);

      return { success: true, orderNumber, orderId: order.id };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // Fallback demo order creation
  return { success: true, orderNumber, orderId: `demo-order-${Date.now()}` };
}

/**
 * Fetch orders for a user
 */
export async function getUserOrders(
  supabase: SupabaseClient | undefined,
  userId: string
): Promise<OrderRecord[]> {
  if (supabase) {
    const { data, error } = await (supabase as any)
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data;
    }
  }

  return [];
}
