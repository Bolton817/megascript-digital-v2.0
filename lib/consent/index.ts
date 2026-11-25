"use client";

export type ConsentCategory = "necessary" | "analytics" | "marketing";

export interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

const STORAGE_KEY = "megascript_cookie_consent";
const COOKIE_NAME = "megascript_cookie_consent";

const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  updatedAt: "",
};

export function getStoredConsent(): ConsentState {
  if (typeof window === "undefined") {
    return DEFAULT_CONSENT;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        necessary: true,
        analytics: Boolean(parsed.analytics),
        marketing: Boolean(parsed.marketing),
        updatedAt: parsed.updatedAt || "",
      };
    }
  } catch {
    // Fall back to default
  }

  return DEFAULT_CONSENT;
}

export function saveStoredConsent(consent: { analytics: boolean; marketing: boolean }): ConsentState {
  const fullConsent: ConsentState = {
    necessary: true,
    analytics: Boolean(consent.analytics),
    marketing: Boolean(consent.marketing),
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullConsent));
      // Also set 1-year first-party cookie
      const maxAge = 60 * 60 * 24 * 365;
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(fullConsent))}; path=/; max-age=${maxAge}; SameSite=Lax`;
      window.dispatchEvent(new CustomEvent("megascript_consent_changed", { detail: fullConsent }));
    } catch {
      // Storage unavailable
    }
  }

  return fullConsent;
}

export function hasConsent(category: ConsentCategory): boolean {
  if (category === "necessary") return true;
  const current = getStoredConsent();
  return Boolean(current[category]);
}
