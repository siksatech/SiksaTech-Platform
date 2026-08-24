"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, isRealSupabase } from "@/lib/db";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (isRealSupabase && supabase) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();

          if (error) {
            console.error("Auth callback error:", error.message);
            router.push("/auth/login?error=" + encodeURIComponent(error.message));
            return;
          }

          if (session?.user) {
            const user = session.user;

            // Check if user has an active profile in public.profiles table
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", user.id)
              .single();

            if (profileError || !profile) {
              // Create default profile for new OAuth signup
              const { error: insertError } = await supabase
                .from("profiles")
                .upsert({
                  id: user.id,
                  email: user.email!,
                  full_name: user.user_metadata?.full_name || user.user_metadata?.name || "OAuth Student",
                  role: "student",
                  school_college_name: "Google Signup",
                  grade_level: "Class 9",
                  created_at: new Date().toISOString()
                });

              if (insertError) {
                console.error("Failed to provision new user profile:", insertError.message);
              }
              
              router.push("/dashboard/student");
            } else {
              // Redirect based on existing role
              if (profile.role === "admin" || profile.role === "siksatech_admin") {
                router.push("/dashboard/admin");
              } else {
                router.push("/dashboard/student");
              }
            }
          } else {
            router.push("/auth/login");
          }
        } catch (err) {
          console.error("Unexpected error in OAuth callback:", err);
          router.push("/auth/login");
        }
      } else {
        // Fallback for mock sandbox environment
        router.push("/dashboard/student");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      <div className="text-center space-y-1">
        <h1 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Verifying Authentication</h1>
        <p className="text-xs text-slate-500">Synchronizing secure session parameters, please wait...</p>
      </div>
    </div>
  );
}
