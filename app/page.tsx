import { redirect } from "next/navigation";

// Redirect root URL to the dashboard
export default function RootPage() {
  redirect("/dashboard");
}
