"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/features/auth/client";
import { Button } from "@/components/ui/Button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut();
      router.push("/master/login");
    } catch {
      window.location.href = "/master/login";
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      isLoading={isLoading}
      className="gap-1.5"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span>Sign Out</span>
    </Button>
  );
}
