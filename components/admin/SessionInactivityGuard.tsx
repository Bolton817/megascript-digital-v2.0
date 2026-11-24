"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SessionInactivityGuardProps {
  /** Inactivity warning threshold in seconds (default: 14 minutes = 840s) */
  warningThresholdSeconds?: number;
  /** Inactivity expiry threshold in seconds (default: 15 minutes = 900s) */
  expiryThresholdSeconds?: number;
}

export function SessionInactivityGuard({
  warningThresholdSeconds = 14 * 60, // 14 minutes
  expiryThresholdSeconds = 15 * 60,  // 15 minutes
}: SessionInactivityGuardProps) {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(
    expiryThresholdSeconds - warningThresholdSeconds
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const lastActivityRef = useRef<number>(Date.now());
  const heartbeatDebounceRef = useRef<number>(0);

  // Extend session: send qualifying heartbeat to server and reset client timer
  const extendSession = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/auth/session/heartbeat", {
        method: "POST",
      });

      if (res.ok) {
        lastActivityRef.current = Date.now();
        setShowWarning(false);
        setSecondsRemaining(expiryThresholdSeconds - warningThresholdSeconds);
      } else {
        // Already expired on server: redirect to login
        router.push("/master/login?expired=1");
      }
    } catch {
      // In network error, allow user to retry
    } finally {
      setIsRefreshing(false);
    }
  }, [router, expiryThresholdSeconds, warningThresholdSeconds]);

  // Periodic timer check (runs every 1 second)
  useEffect(() => {
    const interval = setInterval(() => {
      const idleSeconds = Math.floor((Date.now() - lastActivityRef.current) / 1000);

      if (idleSeconds >= expiryThresholdSeconds) {
        // Inactivity limit reached: redirect to login
        setShowWarning(false);
        router.push("/master/login?expired=1");
      } else if (idleSeconds >= warningThresholdSeconds) {
        setShowWarning(true);
        setSecondsRemaining(expiryThresholdSeconds - idleSeconds);
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryThresholdSeconds, warningThresholdSeconds, router]);

  // Record user activity
  useEffect(() => {
    const handleActivity = () => {
      // Only reset activity timestamp if warning modal is not currently displayed
      if (!showWarning) {
        lastActivityRef.current = Date.now();

        // Background throttle: send heartbeat at most once every 5 minutes during routine active work
        const now = Date.now();
        if (now - heartbeatDebounceRef.current > 5 * 60 * 1000) {
          heartbeatDebounceRef.current = now;
          fetch("/api/auth/session/heartbeat", { method: "POST" }).catch(() => {});
        }
      }
    };

    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }));

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
    };
  }, [showWarning]);

  if (!showWarning) {
    return null;
  }

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="inactivity-dialog-title"
      aria-describedby="inactivity-dialog-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-surface text-foreground border border-border rounded-2xl p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 id="inactivity-dialog-title" className="text-lg font-bold text-foreground">
              Session Inactivity Warning
            </h2>
            <p id="inactivity-dialog-desc" className="mt-2 text-sm text-muted-foreground leading-relaxed">
              For security compliance, inactive administrator sessions are automatically expired after 15 minutes.
            </p>
            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-surface-muted border border-border text-sm font-medium">
              <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>
                Expiring in <strong className="text-foreground">{secondsRemaining}s</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/master/login?expired=1")}
          >
            Sign Out Now
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={extendSession}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              "Stay Signed In"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
