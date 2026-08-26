-- ============================================================
-- Migration 005: Store & Orders Schema
-- Products, Inventory, Orders, Order Items & Shipments
-- SiksaTech Platform
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- PRODUCTS & HARDWARE KITS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT UNIQUE NOT NULL,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  price_inr        NUMERIC(10, 2) NOT NULL CHECK (price_inr >= 0),
  compare_at_price NUMERIC(10, 2) CHECK (compare_at_price >= price_inr),
  category         TEXT NOT NULL CHECK (category IN ('explorer', 'builder', 'creator', 'engineer', 'component', 'tool', 'accessory')),
  images           TEXT[] DEFAULT '{}',
  features         TEXT[] DEFAULT '{}',
  components_list  TEXT[] DEFAULT '{}',
  sku              TEXT UNIQUE,
  stock_count      INT NOT NULL DEFAULT 0 CHECK (stock_count >= 0),
  is_in_stock      BOOLEAN NOT NULL DEFAULT true,
  is_published     BOOLEAN NOT NULL DEFAULT true,
  sort_order       INT NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     TEXT UNIQUE NOT NULL, -- e.g. 'ORD-2026-8941'
  user_id          UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status           TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status   TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_gateway  TEXT NOT NULL DEFAULT 'razorpay' CHECK (payment_gateway IN ('razorpay', 'upi_direct', 'manual')),
  payment_id       TEXT,
  total_amount_inr NUMERIC(10, 2) NOT NULL,
  subtotal_inr     NUMERIC(10, 2) NOT NULL,
  tax_inr          NUMERIC(10, 2) NOT NULL DEFAULT 0,
  shipping_fee_inr NUMERIC(10, 2) NOT NULL DEFAULT 0,
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb, -- { fullName, addressLine, city, state, postalCode, phone }
  billing_address  JSONB DEFAULT '{}'::jsonb,
  tracking_number  TEXT,
  courier_name     TEXT, -- e.g. 'Blue Dart', 'Delhivery', 'India Post'
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- ORDER ITEMS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id   UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  price_inr    NUMERIC(10, 2) NOT NULL,
  quantity     INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  subtotal_inr NUMERIC(10, 2) NOT NULL
);

-- ─────────────────────────────────────────────────────────────
-- SEED INITIAL PRODUCTS
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.products (slug, title, description, price_inr, compare_at_price, category, features, components_list, stock_count, is_in_stock)
VALUES
  (
    'explorer-starter-kit',
    'Explorer STEM Starter Kit',
    'Designed for Class 5–7 innovators. Learn physical circuit loops, switches, LEDs, buzzers, and basic light sensors without soldering.',
    1499.00,
    1999.00,
    'explorer',
    ARRAY['50+ Physical Components', 'Full-Color Illustrated Guidebook', '5 Guided Hands-On Builds', 'Durable Component Storage Box'],
    ARRAY['Breadboard Mini', '10x 5mm LEDs (Red/Green/Yellow)', '220Ω & 10kΩ Resistors', '9V Battery Clip & Switch', 'Photoresistor (LDR)', 'Piezo Buzzer'],
    50,
    true
  ),
  (
    'builder-arduino-kit',
    'Builder Embedded Arduino Kit',
    'Designed for Class 8–10 builders. Includes an Arduino Uno R3 microcomputer, servo motors, LCD display, and environmental telemetry sensors.',
    2999.00,
    3999.00,
    'builder',
    ARRAY['Original Atmega328P Microcontroller', '15+ Precision Sensor Modules', '16x2 I2C Character Display', 'Micro Servo & Stepper Motor', '12 Guided Firmware Projects'],
    ARRAY['Arduino Uno R3', 'I2C 1602 LCD', 'SG90 Micro Servo', 'DHT11 Humidity Sensor', 'Ultrasonic HC-SR04', 'USB-B Programming Cable'],
    35,
    true
  ),
  (
    'creator-iot-esp32-kit',
    'Creator Connected IoT ESP32 Kit',
    'For Class 11–12 & Engineering creators. Dual-core ESP32 with Wi-Fi & Bluetooth, OLED screen, relay modules, and cloud dashboard integration.',
    4499.00,
    5499.00,
    'creator',
    ARRAY['Dual-Core 240MHz ESP32 NodeMCU', '0.96 inch I2C OLED Display', 'Wi-Fi & BLE Telemetry Firmware', '5V Optocoupler Relay Module', 'Cloud REST API Guides'],
    ARRAY['ESP32 Dev Module', '0.96 inch OLED', 'Capacitive Soil Sensor', '2-Channel Relay Board', 'Jumper Wires Kit'],
    25,
    true
  ),
  (
    'engineer-robotics-vision-kit',
    'Engineer Autonomous Computer Vision Rover',
    'College-level autonomous rover with Raspberry Pi camera mount, dual DC gear motors, L298N motor driver, and Python edge processing scripts.',
    7999.00,
    9999.00,
    'engineer',
    ARRAY['2WD Robotic Chassis & Wheels', 'L298N High-Current Dual Motor Driver', '5MP Night Vision Camera Module', 'Ultrasonic Pan-Tilt Servo Mount', 'Complete Python OpenCV Codebase'],
    ARRAY['Laser-cut Acrylic Chassis', '2x Metal Gear DC Motors', 'L298N Driver', 'Pi Camera Cable', '18650 Battery Holder'],
    15,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Products: readable by everyone
CREATE POLICY "products_public_read" ON public.products FOR SELECT USING (is_published = true);

-- Orders: Users can read their own orders; can create new orders
CREATE POLICY "orders_user_read" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_user_insert" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "order_items_user_read" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND (o.user_id = auth.uid() OR auth.uid() IS NULL))
);
CREATE POLICY "order_items_user_insert" ON public.order_items FOR INSERT WITH CHECK (true);
