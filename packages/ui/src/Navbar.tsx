"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu, X, LogOut, LayoutDashboard, ShoppingBag,
  ChevronDown, Package, Award, FolderGit2,
  Users, School, Building2, BookOpen, Calendar,
  Sparkles, Presentation, ShieldCheck, PhoneCall, Star
} from "lucide-react";
import { db, createBrowserClient, isRealSupabase } from "@siksatech/database";
import SiksaTechLogo from "./SiksaTechLogo";

export interface NavUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  grade?: string;
  role?: string;
}

export function getRoleInfo(role?: string) {
  const r = (role || "student").toLowerCase();
  switch (r) {
    case "parent":
      return {
        label: "Parent / Guardian",
        badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        btnColor: "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200",
        dashboardUrl: "/dashboard/parent",
        dashboardLabel: "Parent Dashboard",
        icon: Users,
        links: [
          { label: "Parent Dashboard", href: "/dashboard/parent", icon: LayoutDashboard, color: "text-emerald-600" },
          { label: "Child Learning Journey", href: "/dashboard/parent", icon: Award, color: "text-blue-600" },
          { label: "STEM Kit Orders", href: "/orders", icon: Package, color: "text-amber-600" },
          { label: "Browse Recommended Kits", href: "/store", icon: ShoppingBag, color: "text-purple-600" },
        ]
      };
    case "school":
      return {
        label: "School / ATL Coordinator",
        badgeBg: "bg-purple-50 text-purple-800 border-purple-200",
        btnColor: "text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200",
        dashboardUrl: "/dashboard/school",
        dashboardLabel: "ATL & School Hub",
        icon: School,
        links: [
          { label: "School & ATL Dashboard", href: "/dashboard/school", icon: LayoutDashboard, color: "text-purple-600" },
          { label: "ATL Programs & Workshops", href: "/institutions", icon: Calendar, color: "text-blue-600" },
          { label: "Lab Kit Orders & Invoices", href: "/orders", icon: Package, color: "text-amber-600" },
          { label: "Curriculum & Lesson Plans", href: "/learn", icon: BookOpen, color: "text-emerald-600" },
        ]
      };
    case "college":
      return {
        label: "College Innovator",
        badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
        btnColor: "text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200",
        dashboardUrl: "/dashboard/college",
        dashboardLabel: "Innovation Hub",
        icon: Building2,
        links: [
          { label: "College Innovation Hub", href: "/dashboard/college", icon: LayoutDashboard, color: "text-amber-600" },
          { label: "Submit Project / Research", href: "/build/submit", icon: FolderGit2, color: "text-blue-600" },
          { label: "Hardware Kits & Parts", href: "/orders", icon: Package, color: "text-emerald-600" },
          { label: "Club Programs & Competitions", href: "/programs", icon: Award, color: "text-purple-600" },
        ]
      };
    case "super_admin":
    case "admin":
    case "curriculum_editor":
    case "triage_agent":
      return {
        label: "Staff / Team Admin",
        badgeBg: "bg-rose-50 text-rose-800 border-rose-200",
        btnColor: "text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200",
        dashboardUrl: "/dashboard",
        dashboardLabel: "Staff Portal",
        icon: LayoutDashboard,
        links: [
          { label: "Team Operations Portal", href: "/dashboard", icon: LayoutDashboard, color: "text-rose-600" },
          { label: "Platform Curriculum", href: "/learn", icon: BookOpen, color: "text-blue-600" },
          { label: "All Store Kits", href: "/store", icon: ShoppingBag, color: "text-amber-600" },
          { label: "Community Forum", href: "/community", icon: Users, color: "text-purple-600" },
        ]
      };
    case "student":
    default:
      return {
        label: "Student Learner",
        badgeBg: "bg-blue-50 text-blue-800 border-blue-200",
        btnColor: "text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200",
        dashboardUrl: "/dashboard/student",
        dashboardLabel: "Student Dashboard",
        icon: LayoutDashboard,
        links: [
          { label: "Student Dashboard", href: "/dashboard/student", icon: LayoutDashboard, color: "text-blue-600" },
          { label: "My Enrolled Batches", href: "/dashboard/student?tab=courses", icon: BookOpen, color: "text-indigo-600" },
          { label: "My Orders & STEM Kits", href: "/orders", icon: Package, color: "text-slate-500" },
          { label: "Verified Certificates", href: "/dashboard/student?tab=certificates", icon: Award, color: "text-emerald-600" },
          { label: "Submit Maker Project", href: "/build/submit", icon: FolderGit2, color: "text-purple-600" },
        ]
      };
  }
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState<NavUser | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Load and subscribe to real auth state
  useEffect(() => {
    let unsubscribe = () => {};

    const syncAuthUser = async () => {
      if (isRealSupabase) {
        try {
          const supabase = createBrowserClient();

          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name, grade_level, role, avatar_url")
              .eq("id", authUser.id)
              .maybeSingle();

            setUser({
              id: authUser.id,
              name: (profile as any)?.full_name || authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Student",
              email: authUser.email || "",
              grade: (profile as any)?.grade_level || "Class 9",
              role: (profile as any)?.role || "student",
              avatarUrl: (profile as any)?.avatar_url
            });
          } else {
            setUser(null);
          }

          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
              const { data: profile } = await supabase
                .from("profiles")
                .select("full_name, grade_level, role, avatar_url")
                .eq("id", session.user.id)
                .maybeSingle();

              setUser({
                id: session.user.id,
                name: (profile as any)?.full_name || session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Student",
                email: session.user.email || "",
                grade: (profile as any)?.grade_level || "Class 9",
                role: (profile as any)?.role || "student",
                avatarUrl: (profile as any)?.avatar_url
              });
            } else {
              setUser(null);
            }
          });

          unsubscribe = () => subscription.unsubscribe();
        } catch (e) {
          console.error("Auth subscription error in Navbar:", e);
        }
      } else {
        const u = db.getCurrentUser() as any;
        if (u) {
          setUser({
            id: u.id || "student-1",
            name: u.name || "Student",
            email: u.email || "",
            grade: u.grade || "Class 9",
            role: u.role || "student"
          });
        }
      }
    };

    syncAuthUser();
    return () => unsubscribe();
  }, [pathname]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    if (isRealSupabase) {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
    }
    await db.logout();
    setUser(null);
    router.push("/auth/login");
  };

  const roleInfo = getRoleInfo(user?.role);

  const getNavLinks = () => {
    if (!user) {
      return [
        { label: "Explore Batches", href: "/learn", badge: "Class 5–12" },
        { label: "Hardware Store", href: "/store", badge: "Fast Delivery" },
        { label: "Maker Gallery", href: "/build", badge: "Student Projects" },
        { label: "Community", href: "/community" },
        { label: "For Institutions", href: "/institutions", badge: "ATL Labs" },
      ];
    }

    const role = (user.role || "student").toLowerCase();

    if (role === "student") {
      return [
        { label: "Batches & Courses", href: "/learn", badge: "Class 5–12" },
        { label: "Hardware Store", href: "/store" },
        { label: "Maker Gallery", href: "/build" },
        { label: "Community", href: "/community" },
        { label: "My Dashboard", href: "/dashboard/student", highlight: true },
      ];
    }

    if (role === "parent") {
      return [
        { label: "Parent Dashboard", href: "/dashboard/parent", highlight: true },
        { label: "Browse Batches", href: "/learn" },
        { label: "STEM Kit Store", href: "/store" },
        { label: "Maker Gallery", href: "/build" },
      ];
    }

    if (role === "school") {
      return [
        { label: "ATL Lab Dashboard", href: "/dashboard/school", highlight: true },
        { label: "ATL Lab Programs", href: "/institutions" },
        { label: "Curriculum Hub", href: "/learn" },
        { label: "Hardware & Kits", href: "/store" },
      ];
    }

    if (role === "college") {
      return [
        { label: "Innovation Hub", href: "/dashboard/college", highlight: true },
        { label: "Submit Build", href: "/build/submit" },
        { label: "Hardware Components", href: "/store" },
        { label: "Club Programs", href: "/programs" },
      ];
    }

    return [
      { label: "Admin Portal", href: "/dashboard", highlight: true },
      { label: "Curriculum", href: "/learn" },
      { label: "Store", href: "/store" },
      { label: "Community", href: "/community" },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <nav className={`sticky top-0 z-50 transition-all font-sans bg-white border-b border-slate-200 ${scrolled ? "shadow-sm" : ""}`}>
      {/* 🇮🇳 Top Announcement Bar */}
      <div className="bg-slate-900 text-white text-[11px] font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-600/80 text-white text-[10px] font-bold">
              🇮🇳 BHARAT&apos;S #1 STEM PLATFORM
            </span>
            <span className="hidden sm:inline text-slate-300">
              Admission Open for 2026 Batch • Complete Hardware Kits Delivered to Doorstep
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <a href="tel:18008907836" className="flex items-center gap-1.5 hover:text-white transition-colors font-mono">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span className="hidden md:inline font-sans">Toll-Free Helpline:</span> 1800-890-7836
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <SiksaTechLogo className="text-xl sm:text-2xl" variant="dark" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    item.highlight
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-xs hover:bg-blue-100"
                      : isActive
                      ? "text-blue-600 bg-slate-50 font-extrabold"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-normal">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action / Profile Button */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen((v) => !v)}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all text-left cursor-pointer ${roleInfo.btnColor}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-tight max-w-[120px] truncate">{user.name}</div>
                    <div className="text-[10px] font-mono text-slate-500 capitalize">{roleInfo.label.split(" ")[0]}</div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-3 bg-slate-50 rounded-xl mb-2">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono truncate">{user.email}</p>
                      <span className={`inline-block mt-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${roleInfo.badgeBg}`}>
                        {roleInfo.label}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {roleInfo.links.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                          >
                            <Icon className={`w-4 h-4 ${link.color}`} />
                            <span>{link.label}</span>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="border-t border-slate-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all border border-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-600/20"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3">
          <div className="space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3">
            {user ? (
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 text-center text-xs font-bold text-rose-600 bg-rose-50 rounded-xl"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 text-center text-xs font-bold text-slate-700 border border-slate-200 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 text-center text-xs font-bold bg-blue-600 text-white rounded-xl shadow-md"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
