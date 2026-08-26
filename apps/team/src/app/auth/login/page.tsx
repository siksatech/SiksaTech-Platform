/**
 * Legacy team auth/login — redirects to the main /login page.
 * The actual team login is at /login.
 */
import { redirect } from "next/navigation";

export default function TeamAuthLogin() {
  redirect("/login");
}
