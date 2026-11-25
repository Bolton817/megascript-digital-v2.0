import React, { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionFromRequestCookies } from "@/features/auth/session";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administrator Sign-In | MegaScript Master Console",
  description: "Secure administrator sign-in with single-use 6-digit OTP and 15-minute inactivity protection.",
};

export default async function AdminLoginPage() {
  // Only redirect if the session is genuinely valid in the database
  const sessionResult = await getSessionFromRequestCookies();
  if (sessionResult.valid && sessionResult.user) {
    redirect("/master/overview");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-surface-subtle">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 text-center text-sm text-muted-foreground">
            Loading authentication console...
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
