import Link from "next/link";
import { Mail, Sparkles, ArrowUpRight, PhoneCall, Heart } from "lucide-react";
import SiksaTechLogo from "./SiksaTechLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigation = {
    learning: [
      { label: "Class 5–7 (Explorer)", path: "/learn?path=explorer" },
      { label: "Class 8–10 (Builder)", path: "/learn?path=builder" },
      { label: "Class 11–12 (Creator)", path: "/learn?path=creator" },
      { label: "College / B.Tech (Engineer)", path: "/learn?path=engineer" },
      { label: "Workshops & Webinars", path: "/programs" },
      { label: "National STEM Hackathons", path: "/programs" },
    ],
    platform: [
      { label: "How It Works", path: "/about" },
      { label: "Student Learner Portal", path: "/dashboard/student" },
      { label: "Parent Monitoring Hub", path: "/dashboard/parent" },
      { label: "Maker Project Showcase", path: "/build" },
      { label: "Community Q&A Forum", path: "/community" },
      { label: "Hardware Kits & Store", path: "/store" },
    ],
    institutions: [
      { label: "For Schools & Principals", path: "/institutions" },
      { label: "For Colleges & Universities", path: "/institutions" },
      { label: "Turnkey ATL & STEM Labs", path: "/institutions" },
      { label: "Experiential Curriculum", path: "/learn" },
      { label: "Faculty Development (FDP)", path: "/institutions" },
      { label: "Institutional Inquiries", path: "/enquiry" },
    ],
    company: [
      { label: "About SiksaTech", path: "/about" },
      { label: "Contact & Student Support", path: "/grievance" },
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
    <footer className="w-full bg-slate-50 text-slate-800 pt-16 sm:pt-20 pb-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        
        {/* Main Footer Grid: 12-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-slate-200">
          
          {/* Brand & Mission Column (Span 4 on Desktop) */}
          <div className="md:col-span-12 lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center group focus-visible:outline-none" aria-label="SiksaTech Home">
              <SiksaTechLogo className="text-2xl sm:text-[28px]" />
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
              🇮🇳 Bharat&apos;s leading hands-on STEM, Robotics, and Artificial Intelligence education platform helping students understand, build, and apply real engineering from Class 5 through College.
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Knowledge • Technology • Wisdom</span>
            </div>

            {/* Direct Helpline & Contact Cards */}
            <div className="pt-2 space-y-2.5">
              <a
                href="tel:18008907836"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 hover:text-emerald-700 hover:border-emerald-400 hover:shadow-xs transition-all group"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-mono text-slate-800 group-hover:text-emerald-700">Toll-Free Helpline: 1800-890-7836</span>
              </a>

              <a
                href="mailto:support@siksatech.in"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 hover:text-blue-700 hover:border-blue-400 hover:shadow-xs transition-all group"
              >
                <Mail className="w-4 h-4 text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-mono text-slate-800 group-hover:text-blue-700">support@siksatech.in</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors ml-auto" />
              </a>
            </div>
          </div>

          {/* Navigation Links (Span 8 on Desktop, 4 equal columns) */}
          <div className="md:col-span-12 lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6">
            
            {/* 1. Learning Column */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-wider text-slate-900 uppercase flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                STEM Batches
              </h4>
              <ul className="space-y-2.5">
                {navigation.learning.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.path}
                      className="text-xs text-slate-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Platform Column */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-wider text-slate-900 uppercase flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                Ecosystem
              </h4>
              <ul className="space-y-2.5">
                {navigation.platform.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.path}
                      className="text-xs text-slate-600 hover:text-emerald-700 hover:translate-x-1 transition-all inline-block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Institutions Column */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-wider text-slate-900 uppercase flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 inline-block" />
                Institutions
              </h4>
              <ul className="space-y-2.5">
                {navigation.institutions.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.path}
                      className="text-xs text-slate-600 hover:text-purple-700 hover:translate-x-1 transition-all inline-block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Company Column */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-wider text-slate-900 uppercase flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
                Company
              </h4>
              <ul className="space-y-2.5">
                {navigation.company.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.path}
                      className="text-xs text-slate-600 hover:text-amber-700 hover:translate-x-1 transition-all inline-block py-0.5"
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
        <div className="w-full flex items-center justify-center">
          <div className="px-6 py-3 rounded-2xl bg-white border border-slate-200 shadow-xs text-center max-w-xl">
            <p className="text-xs sm:text-sm font-medium text-slate-800 tracking-wide">
              Technology is better understood when you build it<span className="text-blue-600 font-bold">.</span>
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal Navigation */}
        <div className="w-full pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 border-t border-slate-200">
          <p className="text-center md:text-left text-slate-600">
            &copy; {currentYear} SiksaTech India. All rights reserved. Made with <Heart className="w-3 h-3 text-red-500 inline fill-red-500" /> for young innovators.
          </p>

          <nav className="flex flex-wrap items-center justify-center md:justify-end gap-x-2 gap-y-2 text-[11px] text-slate-600">
            {legalLinks.map((item, idx) => (
              <span key={idx} className="inline-flex items-center">
                <Link
                  href={item.path}
                  className="px-2 py-1 text-slate-600 hover:text-blue-600 rounded transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
                {idx < legalLinks.length - 1 && (
                  <span className="text-slate-300 select-none px-1">&bull;</span>
                )}
              </span>
            ))}
          </nav>
        </div>

      </div>
    </footer>
  );
}
