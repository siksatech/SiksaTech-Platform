"use client";

import { useState, use } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { db } from "@/lib/db";
import { ShieldCheck, ArrowLeft, Send, Sparkles, Server } from "lucide-react";

export default function EnquiryPage({ params }: { params: Promise<{ type: string }> }) {
  const resolvedParams = use(params);
  const type = (resolvedParams.type || "student").toLowerCase() as any;

  // Form Fields State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Custom Metadata details fields based on type
  const [field1, setField1] = useState(""); // e.g. Age / Role / Dept
  const [field2, setField2] = useState(""); // e.g. Class / Student Count / Industry Type
  const [field3, setField3] = useState(""); // e.g. Location / Requirements
  const [field4, setField4] = useState(""); // e.g. Interest / Preferred mode
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Setup form labels and helper metadata dynamically
  const formConfigs: Record<string, {
    title: string;
    description: string;
    field1Label: string;
    field1Placeholder: string;
    field2Label: string;
    field2Placeholder: string;
    field3Label: string;
    field3Placeholder: string;
    field4Label: string;
    field4Placeholder: string;
    field4Type?: string;
  }> = {
    student: {
      title: "Student Enquiry Platform",
      description: "Express your interests in STEM, coding, robotics, or hardware setups.",
      field1Label: "Your Age",
      field1Placeholder: "e.g. 14",
      field2Label: "Your Current Class / Grade",
      field2Placeholder: "e.g. Class 9, CSE 2nd Year",
      field3Label: "Your School or College Name",
      field3Placeholder: "e.g. Kendriya Vidyalaya",
      field4Label: "Preferred Learning Mode",
      field4Placeholder: "Online / In-Person Labs / Bootcamps",
    },
    parent: {
      title: "Parent Consultation Call",
      description: "Request a custom curriculum walkthrough for your child's age group.",
      field1Label: "Child's Age",
      field1Placeholder: "e.g. 11",
      field2Label: "Child's Class / Grade",
      field2Placeholder: "e.g. Class 6",
      field3Label: "Your Location (City)",
      field3Placeholder: "e.g. Bengaluru",
      field4Label: "Primary STEM Interest",
      field4Placeholder: "Robotics / Programming / Game Design / Hardware",
    },
    school: {
      title: "School Partnership Register",
      description: "Coordinate with our program specialists to set up physical STEM labs or campuses workshops.",
      field1Label: "Your Role / Position",
      field1Placeholder: "e.g. Principal / Science HOD",
      field2Label: "Approximate Number of Students",
      field2Placeholder: "e.g. 400",
      field3Label: "School Location",
      field3Placeholder: "e.g. Mysore, Karnataka",
      field4Label: "Required Services",
      field4Placeholder: "STEM Lab setup / Robotics syllabus / Workshops",
    },
    college: {
      title: "College Tech Setup Request",
      description: "Propose high-end workshops on PCB Routing, Drones, OpenCV, or Placements integration.",
      field1Label: "Your Department",
      field1Placeholder: "e.g. Electronics & Communication",
      field2Label: "Expected Student Cohort Size",
      field2Placeholder: "e.g. 120",
      field3Label: "College Location",
      field3Placeholder: "e.g. Chennai, Tamil Nadu",
      field4Label: "Technical Workshop Focus",
      field4Placeholder: "PCB Design / Generative AI / Computer Vision / Drones",
    },
    industry: {
      title: "Industry Collaboration Proposal",
      description: "Sponsor student events, host technical challenges, or offer mentor support.",
      field1Label: "Your Designation",
      field1Placeholder: "e.g. HR Manager / Lead Architect",
      field2Label: "Industry Sector / Field",
      field2Placeholder: "e.g. Automotive IoT / Generative AI Software",
      field3Label: "Location",
      field3Placeholder: "e.g. Pune, Maharashtra",
      field4Label: "Proposed Engagement Mode",
      field4Placeholder: "Hackathon Sponsor / Project Mentorship / Placements",
    }
  };

  const currentConfig = formConfigs[type] || formConfigs.student;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Name and Phone number are required fields.");
      return;
    }
    
    setIsSubmitting(true);

    const details: Record<string, string> = {
      field1: field1,
      field2: field2,
      field3: field3,
      field4: field4,
    };

    // Submit lead directly to database engine
    const res = await db.submitLead(type, name, email, phone, details);

    setIsSubmitting(false);
    if (res.success) {
      setSubmissionResult(res.data);
    } else {
      alert("Failed to submit enquiry. Please check connectivity.");
    }
  };

  // Render confirmation screen if submitted successfully
  if (submissionResult) {
    return (
      <div className="flex flex-col min-h-screen bg-primary-navy text-secondary-white">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6">
          <div className="max-w-md w-full border border-border-slate bg-navy-light/40 p-8 rounded-lg text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-accent-cyan/15 border border-accent-cyan/35 rounded-full flex items-center justify-center mx-auto glow-cyan">
              <ShieldCheck className="w-8 h-8 text-accent-cyan" />
            </div>
            
            <div className="space-y-2">
              <span className="text-[9px] font-mono tracking-widest text-accent-cyan uppercase">Transmitted via SiksaDB</span>
              <h2 className="text-2xl font-bold tracking-tight">Enquiry Registered</h2>
              <p className="text-xs text-text-muted leading-relaxed">
                Thank you, **{name}**. Your STEM requirements have been queued in our leads CRM. Our program coordinator will review your specs and contact you.
              </p>
            </div>

            {/* Technical confirmation box */}
            <div className="p-4 rounded bg-navy-dark border border-border-slate/60 text-left font-mono text-[10px] space-y-2.5">
              <div className="flex justify-between">
                <span className="text-text-muted">Lead Reference ID:</span>
                <span className="text-accent-cyan font-semibold">{submissionResult.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Transmission Node:</span>
                <span className="text-secondary-white">V1 LocalFallback</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Response Target:</span>
                <span className="text-emerald-400 font-semibold">&lt; 24 Hours</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-bold text-accent-cyan tracking-widest hover:underline"
              >
                <ArrowLeft className="w-4 h-4" /> RETURN HOME
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-primary-navy text-secondary-white">
      <Navbar />

      <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto space-y-8">
          
          {/* Breadcrumb / Selector link */}
          <div className="flex items-center justify-between border-b border-border-slate/40 pb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent-cyan transition-technical"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="flex gap-2.5 flex-wrap">
              {["student", "parent", "school", "college", "industry"].map((t) => (
                <Link
                  key={t}
                  href={`/enquiry/${t}`}
                  className={`text-[9px] font-mono font-bold tracking-widest uppercase transition-technical hover:text-accent-cyan ${
                    type === t ? "text-accent-cyan underline" : "text-text-muted"
                  }`}
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>

          {/* Form Header copy */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-accent-cyan uppercase">SiksaTech Intake</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-secondary-white">{currentConfig.title}</h1>
            <p className="text-xs text-text-muted leading-relaxed">
              {currentConfig.description}
            </p>
          </div>

          {/* Form Layout */}
          <form onSubmit={handleSubmit} className="p-8 border border-border-slate bg-navy-light/20 rounded-lg space-y-6">
            
            {/* Core Info */}
            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-secondary-white uppercase">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Aditya"
                  className="px-4 py-3 rounded border border-border-slate bg-navy-dark text-xs text-secondary-white focus:outline-none focus:border-accent-cyan transition-technical"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-secondary-white uppercase">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@example.com"
                    className="px-4 py-3 rounded border border-border-slate bg-navy-dark text-xs text-secondary-white focus:outline-none focus:border-accent-cyan transition-technical"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-secondary-white uppercase">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="px-4 py-3 rounded border border-border-slate bg-navy-dark text-xs text-secondary-white focus:outline-none focus:border-accent-cyan transition-technical"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Metadata details fields */}
            <div className="border-t border-border-slate/40 pt-6 space-y-4">
              <span className="text-[9px] font-mono tracking-widest text-text-muted uppercase">Specific Requirements</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-secondary-white uppercase">{currentConfig.field1Label}</label>
                  <input
                    type="text"
                    value={field1}
                    onChange={(e) => setField1(e.target.value)}
                    placeholder={currentConfig.field1Placeholder}
                    className="px-4 py-3 rounded border border-border-slate bg-navy-dark text-xs text-secondary-white focus:outline-none focus:border-border-slate focus:border-accent-cyan transition-technical"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-secondary-white uppercase">{currentConfig.field2Label}</label>
                  <input
                    type="text"
                    value={field2}
                    onChange={(e) => setField2(e.target.value)}
                    placeholder={currentConfig.field2Placeholder}
                    className="px-4 py-3 rounded border border-border-slate bg-navy-dark text-xs text-secondary-white focus:outline-none focus:border-border-slate focus:border-accent-cyan transition-technical"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-secondary-white uppercase">{currentConfig.field3Label}</label>
                <input
                  type="text"
                  value={field3}
                  onChange={(e) => setField3(e.target.value)}
                  placeholder={currentConfig.field3Placeholder}
                  className="px-4 py-3 rounded border border-border-slate bg-navy-dark text-xs text-secondary-white focus:outline-none focus:border-accent-cyan transition-technical"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold tracking-wider text-secondary-white uppercase">{currentConfig.field4Label}</label>
                <input
                  type="text"
                  value={field4}
                  onChange={(e) => setField4(e.target.value)}
                  placeholder={currentConfig.field4Placeholder}
                  className="px-4 py-3 rounded border border-border-slate bg-navy-dark text-xs text-secondary-white focus:outline-none focus:border-accent-cyan transition-technical"
                />
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 text-xs font-bold tracking-widest bg-accent-cyan hover:bg-accent-cyan-hover text-navy-dark rounded transition-technical disabled:opacity-60 disabled:cursor-not-allowed glow-cyan-hover"
              >
                {isSubmitting ? (
                  <>
                    <Server className="w-4 h-4 animate-spin" /> SUBMITTING TO SIKSADB...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> TRANSMIT REQUIREMENT SPECIFICATIONS
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}
