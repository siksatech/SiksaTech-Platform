import Link from "next/link";
import { Mail } from "lucide-react";
import SiksaTechLogo from "./SiksaTechLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    learn: [
      { label: "Explorer (Class 5–7)", path: "/learn?path=explorer" },
      { label: "Builder (Class 8–10)", path: "/learn?path=builder" },
      { label: "Creator (Class 11–12)", path: "/learn?path=creator" },
      { label: "Engineer (College)", path: "/learn?path=engineer" }
    ],
    platform: [
      { label: "Project Showcase", path: "/build" },
      { label: "Submit Build", path: "/build/submit" },
      { label: "For Institutions", path: "/institutions" },
      { label: "Maker Community", path: "/community" },
      { label: "Hardware Store", path: "/store" },
      { label: "Certificate Verify", path: "/verify" }
    ],
    company: [
      { label: "About SiksaTech", path: "/about" },
      { label: "Privacy Policy", path: "/privacy-policy" },
      { label: "Terms of Service", path: "/terms" },
      { label: "Refund Policy", path: "/refund-policy" },
      { label: "Cookie Policy", path: "/cookie-policy" },
      { label: "Acceptable Use", path: "/acceptable-use" },
      { label: "Community Guidelines", path: "/community-guidelines" },
      { label: "Grievance Redressal", path: "/grievance" },
      { label: "Shipping Policy", path: "/shipping-policy" },
      { label: "Returns & Replacements", path: "/returns-replacements" }
    ]
  };

  return (
    <footer className="bg-[#0A0F1D] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-14">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <SiksaTechLogo size={36} />
              <span className="text-lg font-extrabold tracking-wide text-white">
                SIKSA<span className="text-blue-400">TECH</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              SiksaTech is a hands-on STEM technology learning ecosystem. We teach students to understand technology from its roots — moving from curiosity to creation.
            </p>
            <div className="flex items-center text-sm text-slate-400 gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              <a href="mailto:info@siksatech.in" className="hover:text-white transition-colors">
                info@siksatech.in
              </a>
            </div>
          </div>

          {/* Learning Paths */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-5">
              Learning Paths
            </h4>
            <ul className="space-y-3">
              {links.learn.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.path}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-5">
              Platform
            </h4>
            <ul className="space-y-3">
              {links.platform.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.path}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {links.company.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.path}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quote */}
        <div className="border-t border-slate-800 py-6 text-center">
          <p className="text-sm font-medium text-slate-500 italic">
            &ldquo;Technology is better understood when you build it.&rdquo;
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} SiksaTech India. All rights reserved.
          </p>
          <p className="text-xs text-blue-400 font-semibold tracking-wide">
            Knowledge · Technology · Wisdom
          </p>
        </div>
      </div>
    </footer>
  );
}
