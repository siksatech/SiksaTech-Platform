import Link from "next/link";
import { Mail, Sparkles, ArrowUpRight } from "lucide-react";
import SiksaTechLogo from "./SiksaTechLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigation = {
    learning: [
      { label: "Learning Paths", path: "/learn" },
      { label: "Courses & Tracks", path: "/learn" },
      { label: "Student Projects", path: "/build" },
      { label: "Maker Challenges", path: "/programs" },
      { label: "Competitions", path: "/programs" },
      { label: "Public Certificates", path: "/verify" },
    ],
    platform: [
      { label: "How It Works", path: "/about" },
      { label: "Student Portal", path: "/dashboard/student" },
      { label: "Build Showcase", path: "/build" },
      { label: "Maker Community", path: "/community" },
      { label: "Registry Verification", path: "/verify" },
      { label: "Hardware Kits Store", path: "/store" },
    ],
    institutions: [
      { label: "For Schools (K-12)", path: "/institutions" },
      { label: "For Colleges & Poly", path: "/institutions" },
      { label: "Turnkey STEM Labs", path: "/institutions" },
      { label: "Experiential Workshops", path: "/programs" },
      { label: "Faculty Development", path: "/institutions" },
      { label: "Institutional Inquiries", path: "/enquiry" },
    ],
    company: [
      { label: "About SiksaTech", path: "/about" },
      { label: "Contact & Help", path: "/grievance" },
      { label: "Careers & Internships", path: "mailto:careers@siksatech.in" },
      { label: "Privacy Policy", path: "/privacy-policy" },
      { label: "Terms of Service", path: "/terms" },
      { label: "Grievance Redressal", path: "/grievance" },
    ],
  };

  const legalLinks = [
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Cookie Policy", path: "/cookie-policy" },
    { label: "Refund & Cancellation", path: "/refund-policy" },
    { label: "Acceptable Use", path: "/acceptable-use" },
    { label: "Shipping Policy", path: "/shipping-policy" },
    { label: "Returns & Warranty", path: "/returns-replacements" },
  ];

  return (
    <footer className="w-full bg-slate-950 text-slate-300 pt-16 sm:pt-20 pb-12 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Main Footer Grid: 12-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-16">
          
          {/* Brand & Mission Column (Span 4 on Desktop) */}
          <div className="md:col-span-12 lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center group" aria-label="SiksaTech Home">
              <SiksaTechLogo className="h-8 sm:h-9 w-auto text-white group-hover:text-blue-400 transition-colors" />
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Hands-on STEM and technology learning platform helping students understand, build, and apply engineering from Class 5 through college.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/50 text-blue-400 text-[11px] font-mono font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Knowledge &bull; Technology &bull; Wisdom</span>
            </div>

            {/* Direct Contact Card */}
            <div className="pt-2">
              <a
                href="mailto:info@siksatech.in"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-slate-900 transition-all group"
              >
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-mono text-slate-300 group-hover:text-white">info@siksatech.in</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors ml-1" />
              </a>
            </div>
          </div>

          {/* Navigation Links (Span 8 on Desktop, 4 equal 2-col groups) */}
          <div className="md:col-span-12 lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6">
            
            {/* 1. Learning Column */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-mono font-bold tracking-widest text-white uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                Learning
              </h4>
              <ul className="space-y-2.5">
                {navigation.learning.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.path}
                      className="text-xs text-slate-400 hover:text-white hover:translate-x-0.5 transition-all inline-block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Platform Column */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-mono font-bold tracking-widest text-white uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                Platform
              </h4>
              <ul className="space-y-2.5">
                {navigation.platform.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.path}
                      className="text-xs text-slate-400 hover:text-white hover:translate-x-0.5 transition-all inline-block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Institutions Column */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-mono font-bold tracking-widest text-white uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                Institutions
              </h4>
              <ul className="space-y-2.5">
                {navigation.institutions.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.path}
                      className="text-xs text-slate-400 hover:text-white hover:translate-x-0.5 transition-all inline-block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Company Column */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-mono font-bold tracking-widest text-white uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                Company
              </h4>
              <ul className="space-y-2.5">
                {navigation.company.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.path}
                      className="text-xs text-slate-400 hover:text-white hover:translate-x-0.5 transition-all inline-block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Closing Brand Statement Banner */}
        <div className="w-full border-t border-slate-800/80 py-8 flex items-center justify-center">
          <div className="px-6 py-3 rounded-full bg-slate-900/60 border border-slate-800 text-center">
            <p className="text-xs sm:text-sm font-medium text-slate-300 tracking-wide">
              Technology is better understood when you build it<span className="text-blue-500 font-bold">.</span>
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright (Left) & Legal Navigation (Right) */}
        <div className="w-full border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-5 text-xs text-slate-500">
          <p className="text-center md:text-left text-slate-400">
            &copy; {currentYear} SiksaTech India. All rights reserved.
          </p>

          <nav className="flex flex-wrap items-center justify-center md:justify-end gap-x-2 gap-y-2 text-[11px] text-slate-400">
            {legalLinks.map((item, idx) => (
              <span key={idx} className="inline-flex items-center">
                <Link
                  href={item.path}
                  className="px-2 py-1 text-slate-400 hover:text-white rounded transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
                {idx < legalLinks.length - 1 && (
                  <span className="text-slate-700 select-none px-1">&bull;</span>
                )}
              </span>
            ))}
          </nav>
        </div>

      </div>
    </footer>
  );
}
