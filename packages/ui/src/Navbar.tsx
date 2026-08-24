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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100"
          : "bg-white border-b border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <SiksaTechLogo size={38} />
            <div className="flex flex-col leading-none">
              <span className="text-[18px] font-extrabold tracking-wide text-slate-900">
                SIKSA<span className="text-blue-600">TECH</span>
              </span>
              <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase">
                BUILD &bull; LEARN &bull; CREATE
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative px-4 py-2 text-[13px] font-semibold tracking-wide rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
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

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/student"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-bold tracking-wider text-blue-600 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all"
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
                  className="px-4 py-2 text-[13px] font-semibold text-slate-600 hover:text-slate-900 transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2.5 text-[13px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile controls */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/store"
              className="p-2 text-slate-500 hover:text-blue-600 rounded-lg"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-[14px] font-semibold rounded-lg transition-all ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="border-t border-slate-100 pt-3 mt-3 space-y-2">
            {user ? (
              <>
                <Link
                  href="/dashboard/student"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 text-[13px] font-bold text-blue-600 border border-blue-200 rounded-lg bg-blue-50"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="w-full px-4 py-3 text-[13px] font-bold text-red-500 border border-red-200 rounded-lg bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 text-[13px] font-semibold text-slate-700 border border-slate-200 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 text-[13px] font-bold bg-blue-600 text-white rounded-lg"
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
