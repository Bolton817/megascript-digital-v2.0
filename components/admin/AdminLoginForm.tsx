"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Mail, ArrowLeft, RefreshCw, KeyRound, Zap, CheckCircle2 } from "lucide-react";
import { authClient } from "@/features/auth/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/master/overview";

  // Steps: 1 = Email Input, 2 = 6-digit OTP verification
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuickLoggingIn, setIsQuickLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Countdown & Resend Cooldown
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 minutes
  const [resendCooldown, setResendCooldown] = useState(0);

  // Dev helper state
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const isDev = process.env.NODE_ENV !== "production";

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, secondsRemaining]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Dev mode: fetch latest OTP when on step 2
  useEffect(() => {
    if (!isDev || step !== 2 || !email) return;

    const checkDevOtp = async () => {
      try {
        const res = await fetch(`/api/dev/auth/latest-otp?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.success && data.otp) {
          setDevOtp(data.otp);
        }
      } catch (err) {
        console.error("Failed to fetch dev OTP:", err);
      }
    };

    checkDevOtp();
    const interval = setInterval(checkDevOtp, 2000);
    return () => clearInterval(interval);
  }, [isDev, step, email]);

  // Handle Step 1: Request 6-digit OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await authClient.emailOtp.sendVerificationOtp({
        email: email.trim().toLowerCase(),
        type: "sign-in",
      });

      if (res.error) {
        setErrorMessage(res.error.message || "Failed to issue verification code");
      } else {
        setStep(2);
        setSecondsRemaining(300);
        setResendCooldown(30);
        setSuccessNotice(
          "If this address is registered on the administrator allowlist, a 6-digit code has been dispatched."
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = cleaned.slice(-1);
    setOtp(newOtp);

    if (cleaned && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const focusTarget = Math.min(pasted.length, 5);
    otpInputsRef.current[focusTarget]?.focus();
  };

  // Handle Step 2: Verify 6-digit OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the verification code.");
      return;
    }

    if (secondsRemaining <= 0) {
      setErrorMessage("This verification code has expired. Please request a new code.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await authClient.signIn.emailOtp({
        email: email.trim().toLowerCase(),
        otp: code,
      });

      if (res.error) {
        setErrorMessage(res.error.message || "Invalid verification code or attempt limit exceeded.");
      } else {
        router.push(redirectTarget);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Localhost Dev Quick-Login
  const handleDevQuickLogin = async (targetEmail: string) => {
    setIsQuickLoggingIn(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/dev/auth/quick-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, redirectUrl: redirectTarget }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(data.redirectUrl || redirectTarget);
      } else {
        setErrorMessage(data.error || "Quick login failed");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Dev quick-login failed");
    } finally {
      setIsQuickLoggingIn(false);
    }
  };

  // Auto-fill dev OTP
  const handleApplyDevOtp = () => {
    if (!devOtp || devOtp.length !== 6) return;
    setOtp(devOtp.split(""));
  };

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
        >
          <Image
            src="/logos/logo.png"
            alt="MegaScript Digital"
            width={120}
            height={55}
            className="h-11 w-auto object-contain"
            priority
          />
          <span className="text-lg font-bold tracking-tight text-foreground">
            MegaScript <span className="text-primary font-normal">Digital</span>
          </span>
        </Link>
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface border border-surface-border text-foreground shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>/master Operations Console</span>
          </span>
        </div>
      </div>

      {/* Card Surface */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 sm:p-8 shadow-xl">
        {step === 1 ? (
          /* Step 1: Email Form */
          <form onSubmit={handleRequestOtp} className="space-y-5 text-left">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Administrator Sign-In
              </h2>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Enter your allowlisted administrator email to receive a single-use
                six-digit verification code.
              </p>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/50 p-3 text-xs text-rose-800 dark:text-rose-200">
                {errorMessage}
              </div>
            )}

            <Input
              label="Administrator Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@megascriptdigital.co.ke"
              required
              autoFocus
              autoComplete="email"
              helperText="Access is restricted to authorized personnel. Zero public signup."
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              loadingText="Verifying Allowlist..."
            >
              Send Verification Code
            </Button>

            <div className="pt-2 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Return to Public Website</span>
              </Link>
            </div>
          </form>
        ) : (
          /* Step 2: 6-Digit OTP Form */
          <form onSubmit={handleVerifyOtp} className="space-y-6 text-left">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Enter Verification Code
                </h2>
                <span
                  className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                    secondsRemaining > 60
                      ? "bg-primary-subtle text-primary"
                      : "bg-rose-50 dark:bg-rose-950 text-rose-600"
                  }`}
                >
                  {formatTime(secondsRemaining)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Enter the 6-digit code sent to{" "}
                <strong className="text-foreground">{email}</strong>.
              </p>
            </div>

            {successNotice && (
              <div className="rounded-xl border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/50 p-3 text-xs text-sky-800 dark:text-sky-200">
                {successNotice}
              </div>
            )}

            {/* Local dev detected OTP helper */}
            {isDev && devOtp && (
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/50 p-3 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    Dev Code Detected: <strong className="font-mono tracking-wider">{devOtp}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleApplyDevOtp}
                  className="px-2 py-1 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700 transition-colors"
                >
                  Auto-Fill
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/50 p-3 text-xs text-rose-800 dark:text-rose-200">
                {errorMessage}
              </div>
            )}

            {/* 6 Digit Inputs */}
            <div className="flex justify-between gap-2 on-paste" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpInputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  aria-label={`Digit ${index + 1}`}
                  className="h-12 w-11 sm:w-12 text-center text-xl font-mono font-bold rounded-xl border border-surface-border bg-surface text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              ))}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              loadingText="Verifying Session..."
            >
              Sign In to /master
            </Button>

            {/* Resend & Back controls */}
            <div className="flex items-center justify-between pt-2 text-xs border-t border-surface-border">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp(["", "", "", "", "", ""]);
                  setErrorMessage(null);
                }}
                className="text-muted hover:text-foreground transition-colors"
              >
                Change Email
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0 || isLoading}
                onClick={handleRequestOtp}
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline disabled:opacity-50 disabled:pointer-events-none"
              >
                <RefreshCw
                  className={`h-3 w-3 ${resendCooldown > 0 ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                <span>
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* Localhost Dev Quick-Login Section */}
        {isDev && (
          <div className="mt-6 pt-5 border-t border-dashed border-surface-border space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Zap className="h-3.5 w-3.5" />
              <span>Local Dev Quick-Login</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              One-click authentication for seeded allowlisted accounts in local environment:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                disabled={isQuickLoggingIn}
                onClick={() => handleDevQuickLogin("megascriptdigital@gmail.com")}
                className="flex items-center justify-between p-2.5 rounded-xl border border-surface-border bg-surface-muted hover:bg-surface-border/50 text-left text-xs transition-colors disabled:opacity-50"
              >
                <div>
                  <span className="font-semibold text-foreground block">
                    Super Admin
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    megascriptdigital@gmail.com
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary text-white">
                  1-Click
                </span>
              </button>

              <button
                type="button"
                disabled={isQuickLoggingIn}
                onClick={() => handleDevQuickLogin("boltonmoseti78@gmail.com")}
                className="flex items-center justify-between p-2.5 rounded-xl border border-surface-border bg-surface-muted hover:bg-surface-border/50 text-left text-xs transition-colors disabled:opacity-50"
              >
                <div>
                  <span className="font-semibold text-foreground block">
                    Administrator
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    boltonmoseti78@gmail.com
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-border text-foreground">
                  1-Click
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <p className="text-center text-xs text-muted-foreground">
        Protected by server-side allowlist, rate limiting, and 15-minute idle expiry.
      </p>
    </div>
  );
}
