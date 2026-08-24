"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, ShoppingBag } from "lucide-react";
import { db } from "@siksatech/database";
import SiksaTechLogo from "./SiksaTechLogo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setUser(db.getCurrentUser());
  }, [pathname]);

  // Close mobile menu on route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    db.logout();
    setUser(null);
    router.push("/");
  };

  const navLinks = [
    { label: "Learn", path: "/learn" },
    { label: "Build", path: "/build" },
    { label: "Programs", path: "/programs" },
    { label: "For Institutions", path: "/institutions" },
    { label: "Community", path: "/community" },
    { label: "Store", path: "/store" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200"
          : "bg-white border-b border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <SiksaTechLogo size={42} className="h-10 w-auto object-contain" />
            <span className="text-[20px] font-bold tracking-tight text-slate-900 leading-none">
              SIKSA<span className="text-blue-600">TECH</span>
            </span>
          </Link>

          {/* Desktop Navigation Links (Synchronized 14px Font & Sizing) */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative px-3.5 py-2 text-[14px] font-semibold tracking-normal rounded-lg whitespace-nowrap transition-colors ${
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

          {/* Desktop User CTAs (Synchronized 14px Font & Heights) */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-3 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/student"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-semibold text-blue-600 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all whitespace-nowrap"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-[14px] font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4.5 py-2 text-[14px] font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-sm shadow-blue-600/20 hover:shadow-blue-600/30 whitespace-nowrap"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Controls (< 768px) */}
          <div className="md:hidden flex items-center gap-1">
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
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
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

          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard/student"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 text-[14px] font-semibold text-blue-600 border border-blue-200 rounded-lg bg-blue-50"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1.5 py-2.5 text-[14px] font-semibold text-red-600 border border-red-200 rounded-lg bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center py-2.5 text-[14px] font-semibold text-slate-700 border border-slate-200 rounded-lg bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center py-2.5 text-[14px] font-semibold text-white bg-blue-600 rounded-lg shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
