import { redirect } from "next/navigation";
import { getSessionFromRequestCookies } from "@/features/auth/session";

export const dynamic = "force-dynamic";

export default async function MasterRootPage() {
  const sessionResult = await getSessionFromRequestCookies();

  if (!sessionResult.valid || !sessionResult.user) {
    redirect("/master/login");
  }

  redirect("/master/overview");
}
