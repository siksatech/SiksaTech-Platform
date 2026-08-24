import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SiksaTech | STEM & Hands-On Engineering Platform",
  description: "SiksaTech is a hands-on STEM technology learning platform. We teach programming, electronics, IoT, robotics, and AI from the roots up to build a Build-First mindset.",
  keywords: [
    "STEM education",
    "Robotics education",
    "AI education",
    "IoT education",
    "STEM labs India",
    "Build First",
    "Hands-on technology learning"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-primary-navy text-secondary-white font-sans">
        {children}
      </body>
    </html>
  );
}
