import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@siksatech/auth";
import LandingPage from "./_components/LandingPage";

export default async function HomePage() {
  // Server-side auth check: redirect authenticated users straight to their dashboard
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      redirect("/dashboard");
    }
  } catch {
    // Supabase not configured (dev/demo mode) — fall through and show landing page
  }

  return <LandingPage />;
}
