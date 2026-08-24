import Link from "next/link";
import { Mail } from "lucide-react";
import SiksaTechLogo from "./SiksaTechLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigation = {
    learning: [
      { label: "Learning Paths", path: "/learn" },
      { label: "Courses", path: "/learn" },
      { label: "Projects", path: "/build" },
      { label: "Challenges", path: "/programs" },
      { label: "Competitions", path: "/programs" },
      { label: "Certificates", path: "/verify" },
    ],
    platform: [
      { label: "How It Works", path: "/about" },
      { label: "Student Platform", path: "/dashboard/student" },
      { label: "Project Showcase", path: "/build" },
      { label: "Community", path: "/community" },
      { label: "Certificate Verification", path: "/verify" },
    ],
    institutions: [
      { label: "For Schools", path: "/institutions" },
      { label: "For Colleges", path: "/institutions" },
      { label: "STEM Lab Setup", path: "/institutions" },
      { label: "Workshops", path: "/programs" },
      { label: "Faculty Programs", path: "/institutions" },
      { label: "Partner With SiksaTech", path: "/institutions" },
    ],
    company: [
      { label: "About SiksaTech", path: "/about" },
      { label: "Contact", path: "/grievance" },
      { label: "Careers", path: "mailto:careers@siksatech.in" },
      { label: "Privacy Policy", path: "/privacy-policy" },
      { label: "Terms of Service", path: "/terms" },
      { label: "Grievance Redressal", path: "/grievance" },
    ],
  };

  const legalLinks = [
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms", path: "/terms" },
    { label: "Cookie Policy", path: "/cookie-policy" },
    { label: "Refund Policy", path: "/refund-policy" },
    { label: "Acceptable Use", path: "/acceptable-use" },
    { label: "Shipping", path: "/shipping-policy" },
    { label: "Returns", path: "/returns-replacements" },
  ];

  return (
    <footer className="w-full bg-[#0A0F1D] text-slate-300 pt-16 sm:pt-20 pb-12 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Main Footer: Brand Area (Left) + 4 Navigation Columns (Right) */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-14 pb-14 w-full">
          
          {/* Brand Column (Left) */}
          <div className="w-full lg:w-[35%] max-w-md space-y-5 flex-shrink-0">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <SiksaTechLogo size={42} className="h-10 w-auto object-contain flex-shrink-0" />
              <span className="text-[22px] font-black tracking-wider text-white leading-none">
                SIKSA<span className="text-blue-500">TECH</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed">
              SiksaTech is a hands-on STEM technology learning platform helping students understand, build and apply technology from Class 5 through college.
            </p>

            <div className="pt-1">
              <p className="text-xs font-mono font-medium tracking-widest text-blue-400 uppercase">
                Knowledge &bull; Technology &bull; Wisdom
              </p>
            </div>

            <div className="pt-1">
              <a
                href="mailto:info@siksatech.in"
                className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>info@siksatech.in</span>
              </a>
            </div>
          </div>

          {/* Navigation Link Groups (4 Distinct Columns) */}
          <div className="w-full lg:w-[62%] grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6 pt-2 lg:pt-0">
            
            {/* Learning Column */}
            <div className="flex flex-col space-y-4 min-w-[120px]">
              <h4 className="text-[11px] font-mono font-bold tracking-widest text-white uppercase">
                Learning
              </h4>
              <ul className="flex flex-col space-y-2.5">
                {navigation.learning.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.path}
                      className="text-xs text-slate-400 hover:text-white transition-colors block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform Column */}
            <div className="flex flex-col space-y-4 min-w-[120px]">
              <h4 className="text-[11px] font-mono font-bold tracking-widest text-white uppercase">
                Platform
              </h4>
              <ul className="flex flex-col space-y-2.5">
                {navigation.platform.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.path}
                      className="text-xs text-slate-400 hover:text-white transition-colors block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Institutions Column */}
            <div className="flex flex-col space-y-4 min-w-[120px]">
              <h4 className="text-[11px] font-mono font-bold tracking-widest text-white uppercase">
                Institutions
              </h4>
              <ul className="flex flex-col space-y-2.5">
                {navigation.institutions.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.path}
                      className="text-xs text-slate-400 hover:text-white transition-colors block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div className="flex flex-col space-y-4 min-w-[120px]">
              <h4 className="text-[11px] font-mono font-bold tracking-widest text-white uppercase">
                Company
              </h4>
              <ul className="flex flex-col space-y-2.5">
                {navigation.company.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.path}
                      className="text-xs text-slate-400 hover:text-white transition-colors block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Closing Brand Statement */}
        <div className="w-full border-t border-slate-800/80 py-7 flex items-center justify-center">
          <p className="text-xs sm:text-sm font-medium text-slate-400 tracking-wide text-center">
            Technology is better understood when you build it<span className="text-blue-500">.</span>
          </p>
        </div>

        {/* Bottom Bar: Copyright (Left) & Legal Navigation (Right) */}
        <div className="w-full border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center md:text-left">
            &copy; {currentYear} SiksaTech India. All rights reserved.
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px]">
            {legalLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.path}
                className="hover:text-slate-300 transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
