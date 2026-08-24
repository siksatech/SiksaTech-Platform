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
        <div className="flex items-center justify-between h-[72px] sm:h-[80px]">
          {/* Logo & Brand Name (Enlarged with natural proportions) */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <SiksaTechLogo size={52} className="h-11 sm:h-13 w-auto object-contain" />
            <span className="text-[22px] sm:text-[24px] font-black tracking-wider text-slate-900 leading-none">
              SIKSA<span className="text-blue-600">TECH</span>
            </span>
          </Link>

          {/* Desktop Navigation Links (Visible on Large Screens >= 1024px to prevent collision) */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative px-3 xl:px-4 py-2 text-xs xl:text-sm font-bold tracking-wide rounded-xl whitespace-nowrap transition-all ${
                    isActive
                      ? "text-blue-600 bg-blue-50/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop User CTAs (Visible on >= 1024px) */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-3.5 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/student"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-blue-600 border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all whitespace-nowrap"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-3.5 py-2 text-xs xl:text-sm font-bold text-slate-700 hover:text-slate-900 transition-all whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 xl:px-5 py-2.5 text-xs xl:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 whitespace-nowrap"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile & Tablet Controls (< 1024px) */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/store"
              className="p-2 text-slate-600 hover:text-blue-600 rounded-lg"
              aria-label="Store Cart"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (< 1024px) */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[520px] opacity-100 border-t border-slate-200" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-sm font-bold rounded-xl transition-all ${
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
                  className="flex items-center justify-center gap-1.5 py-3 text-xs font-bold text-blue-600 border border-blue-200 rounded-xl bg-blue-50"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1.5 py-3 text-xs font-bold text-red-600 border border-red-200 rounded-xl bg-red-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center py-3 text-xs font-bold text-slate-700 border border-slate-200 rounded-xl bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center py-3 text-xs font-bold text-white bg-blue-600 rounded-xl shadow"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
