"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu, X, LogOut, LayoutDashboard, ShoppingBag, User,
  ChevronDown, Package, Award, Sparkles, FolderGit2
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
              role: (profile as any)?.role || "student"
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

          // Listen to realtime auth state changes (login, logout, token refresh)
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
                role: (profile as any)?.role || "student"
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

  const navLinks = [
    { label: "Learn", path: "/learn" },
    { label: "Build", path: "/build" },
    { label: "Programs", path: "/programs" },
    { label: "For Institutions", path: "/institutions" },
    { label: "Community", path: "/community" },
    { label: "Store", path: "/store" },
  ];

  const getInitials = (name: string) => {
    if (!name) return "S";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
          <Link href="/" className="flex items-center group flex-shrink-0" aria-label="SiksaTech Home">
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
                  className={`relative px-4 py-2 text-[14px] font-semibold tracking-normal rounded-lg whitespace-nowrap transition-colors inline-flex items-center ${
                    isActive
                      ? "text-blue-600 bg-blue-50/70"
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
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer"
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
                      {user.grade || "Student"}
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
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[9px] font-mono font-bold uppercase">
                        Verified Student
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard/student"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-blue-600" />
                        <span>Student Dashboard</span>
                      </Link>

                      <Link
                        href="/orders"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                      >
                        <Package className="w-4 h-4 text-slate-500" />
                        <span>My Orders &amp; Kits</span>
                      </Link>

                      <Link
                        href="/dashboard/student"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                      >
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>Verified Credentials</span>
                      </Link>

                      <Link
                        href="/build/submit"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                      >
                        <FolderGit2 className="w-4 h-4 text-purple-600" />
                        <span>Submit Project Build</span>
                      </Link>
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
            ) : (
              <Link
                href="/auth/login"
                className="px-5 py-2.5 text-[14px] font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm shadow-blue-600/20 hover:shadow-blue-600/30 whitespace-nowrap inline-flex items-center justify-center min-h-[42px]"
              >
                Login / Get Started
              </Link>
            )}
          </div>

          {/* Mobile Controls (< 768px) */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              href="/store"
              className="p-2 text-slate-600 hover:text-blue-600 rounded-lg"
              aria-label="Store Cart"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Rendered on mobile < 768px when isOpen is true) */}
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
                className={`block px-4 py-3 text-[14px] font-semibold rounded-lg transition-colors ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
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
                  href="/dashboard/student"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-[14px] font-semibold text-blue-600 border border-blue-200 rounded-xl bg-blue-50"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Student Dashboard</span>
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-[14px] font-semibold text-slate-700 border border-slate-200 rounded-xl bg-white"
                >
                  <Package className="w-4 h-4" />
                  <span>My Orders &amp; Shipments</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 text-[14px] font-semibold text-red-600 border border-red-200 rounded-xl bg-red-50"
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
