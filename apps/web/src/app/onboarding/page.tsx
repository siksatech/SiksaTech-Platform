"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar, Footer } from "@siksatech/ui";
import { createBrowserClient, isRealSupabase, db } from "@siksatech/database";
import {
  GraduationCap,
  Users,
  School,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Loader2,
  ShieldCheck,
} from "lucide-react";

type PersonaType = "student" | "parent" | "school" | "college";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  const [selectedPersona, setSelectedPersona] = useState<PersonaType>("student");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");

  // Student specific
  const [gradeLevel, setGradeLevel] = useState("Class 9–10 (Builder)");
  const [schoolCollegeName, setSchoolCollegeName] = useState("");

  // Parent specific
  const [childName, setChildName] = useState("");
  const [childGrade, setChildGrade] = useState("Class 8");

  // School specific
  const [schoolName, setSchoolName] = useState("");
  const [designation, setDesignation] = useState("ATL Lab Incharge / Science Coordinator");
  const [studentStrength, setStudentStrength] = useState("200+ Students");
  const [hasAtlLab, setHasAtlLab] = useState("Yes, active ATL Lab");

  // College specific
  const [collegeName, setCollegeName] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [collegeRole, setCollegeRole] = useState("Engineering Student / Club Member");

  const routeToDashboard = (role: string) => {
    if (redirectUrl) {
      router.push(redirectUrl);
      return;
    }
    switch (role) {
      case "parent":
        router.push("/dashboard/parent");
        break;
      case "school":
        router.push("/dashboard/school");
        break;
      case "college":
        router.push("/dashboard/college");
        break;
      case "student":
      default:
        router.push("/dashboard/student");
        break;
    }
  };

  useEffect(() => {
    async function checkAuth() {
      if (!isRealSupabase) {
        const localUser: any = db.getCurrentUser();
        if (!localUser) {
          router.push("/auth/login?redirect=/onboarding");
          return;
        }
        setUserId(localUser.id);
        setUserEmail(localUser.email);
        setFullName(localUser.name || "");
        setLoading(false);
        return;
      }

      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login?redirect=/onboarding");
        return;
      }

      setUserId(user.id);
      setUserEmail(user.email || "");

      // Check existing profile
      const { data: profile } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        if (profile.full_name) setFullName(profile.full_name);
        if (profile.role && ["student", "parent", "school", "college"].includes(profile.role)) {
          setSelectedPersona(profile.role as PersonaType);
        }
        if (profile.is_profile_complete && !redirectUrl) {
          // Profile already complete, route directly to persona dashboard
          routeToDashboard(profile.role || "student");
          return;
        }
      } else {
        const metadataName = user.user_metadata?.full_name || user.user_metadata?.name || "";
        if (metadataName) setFullName(metadataName);
      }

      setLoading(false);
    }

    checkAuth();
  }, [router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);

    let targetSchoolName = schoolCollegeName;
    if (selectedPersona === "school") targetSchoolName = schoolName;
    if (selectedPersona === "college") targetSchoolName = collegeName;

    const payload = {
      id: userId,
      email: userEmail,
      full_name: fullName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      state: stateName.trim(),
      role: selectedPersona,
      grade_level: selectedPersona === "student" ? gradeLevel : selectedPersona === "parent" ? childGrade : null,
      school_college_name: targetSchoolName.trim(),
      is_profile_complete: true,
      updated_at: new Date().toISOString(),
    };

    if (isRealSupabase) {
      const supabase = createBrowserClient();
      const { error } = await (supabase as any)
        .from("profiles")
        .upsert(payload, { onConflict: "id" });

      if (error) {
        alert("Failed to save profile: " + error.message);
        setSaving(false);
        return;
      }
    } else {
      if ((db as any).updateProfile) {
        await (db as any).updateProfile({
          name: fullName.trim(),
          role: selectedPersona,
          schoolCollege: targetSchoolName.trim(),
          grade: selectedPersona === "student" ? gradeLevel : childGrade,
        });
      }
    }

    setSaving(false);
    routeToDashboard(selectedPersona);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
        <p className="text-xs font-mono text-slate-400">Loading your profile preferences...</p>
      </div>
    );
  }

  const personas = [
    {
      id: "student" as PersonaType,
      title: "Student",
      tagline: "Class 6–12 & Engineering",
      desc: "Learn hands-on electronics, build IoT projects, and earn verified STEM credentials.",
      icon: GraduationCap,
      color: "border-blue-500 bg-blue-950/20 text-blue-400",
    },
    {
      id: "parent" as PersonaType,
      title: "Parent",
      tagline: "Parent / Guardian",
      desc: "Monitor your child's learning journey, track hardware kit shipments, and view progress.",
      icon: Users,
      color: "border-emerald-500 bg-emerald-950/20 text-emerald-400",
    },
    {
      id: "school" as PersonaType,
      title: "School / ATL",
      tagline: "Educators & Lab Incharges",
      desc: "Empower students with structured curriculum, ATL lab equipment, and regional workshops.",
      icon: School,
      color: "border-purple-500 bg-purple-950/20 text-purple-400",
    },
    {
      id: "college" as PersonaType,
      title: "College / Club",
      tagline: "Universities & Robotics Clubs",
      desc: "Participate in national hackathons, obtain engineering kits, and build industry prototypes.",
      icon: Building2,
      color: "border-amber-500 bg-amber-950/20 text-amber-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Welcome to SiksaTech Platform</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            How would you like to use SiksaTech?
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Choose your profile type so we can tailor your learning dashboard, hardware kits, and tools.
          </p>
        </div>

        {/* Step 1: Persona Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {personas.map((p) => {
            const Icon = p.icon;
            const isSelected = selectedPersona === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPersona(p.id)}
                className={`p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-blue-500 bg-slate-900 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/50"
                    : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-lg border ${p.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                    )}
                  </div>
                  <h3 className="font-bold text-white text-base">{p.title}</h3>
                  <p className="text-[11px] font-mono text-blue-400 mb-2">{p.tagline}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Step 2: Persona Details Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl"
        >
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Complete your {selectedPersona.toUpperCase()} profile</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Logged in as <span className="text-slate-200 font-mono">{userEmail}</span>
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-blue-400 capitalize">
              {selectedPersona} Role
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aditya Sharma"
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {selectedPersona === "parent" ? "Parent WhatsApp / Mobile *" : "Contact Phone Number"}
              </label>
              <input
                type="tel"
                value={phone}
                required={selectedPersona === "parent"}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Dynamic fields based on persona */}
            {selectedPersona === "student" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Class / Learning Track *
                  </label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Class 6–8 (Explorer)">Class 6–8 (Explorer Track - Electronics Basics)</option>
                    <option value="Class 9–10 (Builder)">Class 9–10 (Builder Track - Arduino & Sensors)</option>
                    <option value="Class 11–12 (Creator)">Class 11–12 (Creator Track - ESP32 IoT & Cloud)</option>
                    <option value="College / Graduate (Engineer)">College / Degree (Engineer Track - Robotics & Vision)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    School / College Name
                  </label>
                  <input
                    type="text"
                    value={schoolCollegeName}
                    onChange={(e) => setSchoolCollegeName(e.target.value)}
                    placeholder="e.g. Delhi Public School, R.K. Puram"
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </>
            )}

            {selectedPersona === "parent" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Child&apos;s Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Child&apos;s Grade / Standard *
                  </label>
                  <select
                    value={childGrade}
                    onChange={(e) => setChildGrade(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Class 6">Class 6 (Ages 11–12)</option>
                    <option value="Class 7">Class 7 (Ages 12–13)</option>
                    <option value="Class 8">Class 8 (Ages 13–14)</option>
                    <option value="Class 9">Class 9 (Ages 14–15)</option>
                    <option value="Class 10">Class 10 (Ages 15–16)</option>
                    <option value="Class 11">Class 11 (Ages 16–17)</option>
                    <option value="Class 12">Class 12 (Ages 17–18)</option>
                  </select>
                </div>
              </>
            )}

            {selectedPersona === "school" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    School Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. St. Xavier's Senior Secondary School"
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Designation / Department
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. ATL Lab Incharge / Head of Science"
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    ATL Lab Status
                  </label>
                  <select
                    value={hasAtlLab}
                    onChange={(e) => setHasAtlLab(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Yes, active ATL Lab">Yes, active ATL Lab in campus</option>
                    <option value="Planning to setup ATL Lab">Planning to establish ATL Lab</option>
                    <option value="Robotics & Innovation Club">Independent Robotics / STEM Lab</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Estimated Student Strength
                  </label>
                  <select
                    value={studentStrength}
                    onChange={(e) => setStudentStrength(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="50–100 Students">50–100 Students</option>
                    <option value="100–250 Students">100–250 Students</option>
                    <option value="250–500 Students">250–500 Students</option>
                    <option value="500+ Students">500+ Students</option>
                  </select>
                </div>
              </>
            )}

            {selectedPersona === "college" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    College / University Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. Vellore Institute of Technology (VIT)"
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Department / Engineering Branch
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Electronics & Communication / Robotics"
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Your Role in Campus
                  </label>
                  <select
                    value={collegeRole}
                    onChange={(e) => setCollegeRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Engineering Student / Club Member">Engineering Student / Club Member</option>
                    <option value="Robotics Club President / Technical Lead">Robotics Club President / Technical Lead</option>
                    <option value="Faculty Coordinator / Professor">Faculty Coordinator / Professor</option>
                    <option value="Incubation Center Lead">Incubation Center Lead</option>
                  </select>
                </div>
              </>
            )}

            {/* City */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru, New Delhi"
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Your profile can be modified anytime in Settings.</span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wider rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[44px]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  SAVING PROFILE...
                </>
              ) : (
                <>
                  ENTER SIKSA TECH DASHBOARD
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
