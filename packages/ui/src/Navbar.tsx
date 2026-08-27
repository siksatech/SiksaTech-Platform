"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu, X, LogOut, LayoutDashboard, ShoppingBag,
  ChevronDown, Package, Award, FolderGit2,
  Users, School, Building2, BookOpen, Calendar,
  Sparkles, Presentation, ShieldCheck
} from "lucide-react";
import { db, createBrowserClient, isRealSupabase } from "@siksatech/database";
import SiksaTechLogo from "./SiksaTechLogo";
import { ThemeToggleCompact } from "./ThemeProvider";

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
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        btnColor: "text-emerald-700 bg-emerald-50/90 hover:bg-emerald-100/90 border-emerald-200",
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
        badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
        btnColor: "text-purple-700 bg-purple-50/90 hover:bg-purple-100/90 border-purple-200",
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
        badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
        btnColor: "text-amber-700 bg-amber-50/90 hover:bg-amber-100/90 border-amber-200",
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
        badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
        btnColor: "text-rose-700 bg-rose-50/90 hover:bg-rose-100/90 border-rose-200",
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
        badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
        btnColor: "text-blue-700 bg-blue-50/90 hover:bg-blue-100/90 border-blue-200",
        dashboardUrl: "/dashboard/student",
        dashboardLabel: "Student Dashboard",
        icon: LayoutDashboard,
        links: [
          { label: "Student Dashboard", href: "/dashboard/student", icon: LayoutDashboard, color: "text-blue-600" },
          { label: "My Courses & Tracks", href: "/dashboard/student?tab=courses", icon: BookOpen, color: "text-indigo-600" },
          { label: "My Orders & Kits", href: "/orders", icon: Package, color: "text-slate-500" },
          { label: "Verified Credentials", href: "/dashboard/student?tab=certificates", icon: Award, color: "text-emerald-600" },
          { label: "Submit Project Build", href: "/build/submit", icon: FolderGit2, color: "text-purple-600" },
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
            // Fetch extended profile if exists
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name, grade_level, role, avatar_url")
              .eq("id", authUser.id)
              .maybeSingle();

            setUser({
              id: authUser.id,
              name: (profile as any)?.full_name || authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Student",
              email: authUser.email || "",
              avatarUrl: (profile as any)?.avatar_url || authUser.user_metadata?.avatar_url,
              grade: (profile as any)?.grade_level || "Active Learner",
              role: (profile as any)?.role || authUser.user_metadata?.role || "student"
            });
          } else {
            // Check legacy fallback if demo mode
            const legacy: any = db.getCurrentUser();
            setUser(legacy ? {
              id: legacy.id || "demo-student",
              name: legacy.name || "Aarav Sharma",
              email: legacy.email || "student@siksatech.in",
              grade: legacy.grade || "Class 9",
              role: legacy.role || "student"
            } : null);
          }

          // Listen to realtime auth state changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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
                avatarUrl: (profile as any)?.avatar_url || session.user.user_metadata?.avatar_url,
                grade: (profile as any)?.grade_level || "Active Learner",
                role: (profile as any)?.role || session.user.user_metadata?.role || "student"
              });
            } else {
              setUser(null);
            }
          });

          unsubscribe = () => subscription.unsubscribe();
        } catch (err) {
          console.error("Supabase Navbar auth listener error:", err);
        }
      } else {
        const legacy: any = db.getCurrentUser();
        setUser(legacy ? {
          id: legacy.id || "demo-student",
          name: legacy.name || "Aarav Sharma",
          email: legacy.email || "student@siksatech.in",
          grade: legacy.grade || "Class 9",
          role: legacy.role || "student"
        } : null);
      }
    };

    syncAuthUser();

    return () => {
      unsubscribe();
    };
  }, [pathname]);

  // Close dropdowns on route changes or outside clicks
  useEffect(() => {
    setIsOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    if (isRealSupabase) {
      try {
        const supabase = createBrowserClient();
        await supabase.auth.signOut();
      } catch (e) {
        console.error("Sign out error:", e);
      }
    }
    db.logout();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  // Context-Aware Navigation Links based on Role
  const getNavLinksForRole = () => {
    const role = (user?.role || "").toLowerCase();

    if (!user) {
      // Unauthenticated / Guest Public Discovery
      return [
        { label: "Learn", path: "/learn" },
        { label: "Build", path: "/build" },
        { label: "Programs", path: "/programs" },
        { label: "For Institutions", path: "/institutions" },
        { label: "Community", path: "/community" },
        { label: "Store", path: "/store" },
      ];
    }

    if (role === "student") {
      // Student: Focused on learning, building, events, store, community (No B2B institutional lab links)
      return [
        { label: "My Dashboard", path: "/dashboard/student" },
        { label: "Courses", path: "/learn" },
        { label: "Workshops & Events", path: "/programs" },
        { label: "Maker Showcase", path: "/build" },
        { label: "Store Kits", path: "/store" },
        { label: "Community", path: "/community" },
      ];
    }

    if (role === "parent") {
      // Parent: Focused on child's journey, kits, events (No B2B institutional lab links)
      return [
        { label: "Parent Dashboard", path: "/dashboard/parent" },
        { label: "Courses & Tracks", path: "/learn" },
        { label: "Workshops & Events", path: "/programs" },
        { label: "STEM Kits", path: "/store" },
        { label: "Community", path: "/community" },
      ];
    }

    if (role === "school" || role === "college") {
      // Institution SPOC: Institution hub, lab setup, cohort workshops, curriculum
      return [
        { label: role === "school" ? "School Dashboard" : "College Hub", path: role === "school" ? "/dashboard/school" : "/dashboard/college" },
        { label: "ATL & STEM Lab Setup", path: "/institutions" },
        { label: "Institutional Programs", path: "/programs" },
        { label: "Curriculum & Tracks", path: "/learn" },
        { label: "Hardware Store", path: "/store" },
      ];
    }

    // Default Fallback
    return [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Learn", path: "/learn" },
      { label: "Build", path: "/build" },
      { label: "Programs", path: "/programs" },
      { label: "Community", path: "/community" },
      { label: "Store", path: "/store" },
    ];
  };

  const navLinks = getNavLinksForRole();

  const getInitials = (name: string) => {
    if (!name) return "S";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const roleInfo = getRoleInfo(user?.role);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200"
          : "bg-white border-b border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[80px]">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1" aria-label="SiksaTech Home">
            <SiksaTechLogo className="h-8 sm:h-9 w-auto text-slate-900 group-hover:text-blue-600 transition-colors" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative px-3.5 lg:px-4 py-2 text-[14px] font-semibold tracking-normal rounded-lg whitespace-nowrap transition-colors inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive
                      ? "text-blue-600 bg-blue-50/80 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop User CTAs / Profile Badge */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <ThemeToggleCompact />
            {user ? (
              <div className="flex items-center gap-2.5">
                {/* Contextual Role Dashboard Button */}
                <Link
                  href={roleInfo.dashboardUrl}
                  className={`hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border rounded-xl transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${roleInfo.btnColor}`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{roleInfo.dashboardLabel}</span>
                </Link>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-expanded={profileDropdownOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        getInitials(user.name)
                      )}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                        {user.name}
                      </p>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                        {roleInfo.label}
                      </span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-slate-100">
                      <div className="px-4 py-3 bg-slate-50/70">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono truncate">{user.email}</p>
                        <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-md border text-[9px] font-mono font-bold uppercase ${roleInfo.badgeBg}`}>
                          {roleInfo.label}
                        </span>
                      </div>

                      <div className="py-1">
                        {roleInfo.links.map((item, idx) => {
                          const IconComponent = item.icon;
                          return (
                            <Link
                              key={idx}
                              href={item.href}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                            >
                              <IconComponent className={`w-4 h-4 ${item.color}`} />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>

                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out Portal</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-5 py-2.5 text-[14px] font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm shadow-blue-600/20 hover:shadow-blue-600/30 whitespace-nowrap inline-flex items-center justify-center min-h-[42px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Login / Get Started
              </Link>
            )}
          </div>

          {/* Mobile Controls (< 768px) */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggleCompact />
            <Link
              href="/store"
              className="p-2.5 text-slate-600 hover:text-blue-600 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Store Cart"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (< 768px) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          {user && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-mono truncate">{user.email}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-md border text-[8px] font-mono font-bold uppercase ${roleInfo.badgeBg}`}>
                  {roleInfo.label}
                </span>
              </div>
            </div>
          )}

          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-[14px] font-semibold rounded-lg transition-colors min-h-[44px] flex items-center ${
                  isActive
                    ? "text-blue-600 bg-blue-50 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-100 space-y-2">
            {user ? (
              <>
                <Link
                  href={roleInfo.dashboardUrl}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 text-[14px] font-semibold border rounded-xl min-h-[44px] ${roleInfo.btnColor}`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{roleInfo.dashboardLabel}</span>
                </Link>
                {roleInfo.links.filter(l => l.href !== roleInfo.dashboardUrl).map((l, idx) => {
                  const IconC = l.icon;
                  return (
                    <Link
                      key={idx}
                      href={l.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-slate-700 border border-slate-200 rounded-xl bg-white min-h-[44px]"
                    >
                      <IconC className={`w-4 h-4 ${l.color}`} />
                      <span>{l.label}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 text-[14px] font-semibold text-red-600 border border-red-200 rounded-xl bg-red-50 cursor-pointer min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center py-3 text-[14px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm min-h-[44px]"
              >
                Login / Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
