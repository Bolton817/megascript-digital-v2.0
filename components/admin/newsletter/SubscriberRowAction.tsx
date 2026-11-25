"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { unsubscribeSubscriberAction } from "@/server/actions/newsletter";
import { SubscriberStatus } from "@prisma/client";
import { UserX, Check } from "lucide-react";

export function SubscriberRowAction({
  subscriberEmail,
  currentStatus,
}: {
  subscriberEmail: string;
  currentStatus: SubscriberStatus;
}) {
  const [isPending, setIsPending] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(
    currentStatus === SubscriberStatus.UNSUBSCRIBED
  );

  const handleUnsubscribe = async () => {
    if (
      !confirm(
        `Are you sure you want to manually unsubscribe ${subscriberEmail}? This will suppress them from all marketing broadcasts.`
      )
    ) {
      return;
    }

    setIsPending(true);
    try {
      const res = await unsubscribeSubscriberAction(subscriberEmail);
      if (res.success) {
        setUnsubscribed(true);
      } else {
        alert(res.error || "Failed to unsubscribe");
      }
    } catch {
      alert("Error processing action");
    } finally {
      setIsPending(false);
    }
  };

  if (unsubscribed) {
    return (
      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
        <Check className="h-3 w-3 text-muted-foreground" />
        Suppressed
      </span>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-7 text-xs px-2 gap-1 text-muted-foreground hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-800"
      onClick={handleUnsubscribe}
      isLoading={isPending}
    >
      <UserX className="h-3.5 w-3.5" />
      Unsubscribe
    </Button>
  );
}
