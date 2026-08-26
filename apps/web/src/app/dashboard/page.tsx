"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient, isRealSupabase, db } from "@siksatech/database";
import { Loader2 } from "lucide-react";

export default function DashboardRouter() {
  const router = useRouter();

  useEffect(() => {
    async function determineRoute() {
      if (!isRealSupabase) {
        const user: any = db.getCurrentUser();
        if (!user) {
          router.push("/auth/login?redirect=/dashboard");
          return;
        }
        if (user.role === "parent") {
          router.push("/dashboard/parent");
        } else if (user.role === "school") {
          router.push("/dashboard/school");
        } else if (user.role === "college") {
          router.push("/dashboard/college");
        } else {
          router.push("/dashboard/student");
        }
        return;
      }

      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login?redirect=/dashboard");
        return;
      }

      const { data: profile } = await (supabase as any)
        .from("profiles")
        .select("role, is_profile_complete")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile || !profile.is_profile_complete) {
        router.push("/onboarding");
        return;
      }

      if (profile.role === "parent") {
        router.push("/dashboard/parent");
      } else if (profile.role === "school") {
        router.push("/dashboard/school");
      } else if (profile.role === "college") {
        router.push("/dashboard/college");
      } else {
        router.push("/dashboard/student");
      }
    }

    determineRoute();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
      <p className="text-xs font-mono text-slate-400">Loading your personalized dashboard...</p>
    </div>
  );
}
