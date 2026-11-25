/**
 * Client-Side First-Party Analytics Event Dispatcher
 * Authoritative Reference: TDD Sheet 074 & Task 86
 * - Dispatches normalized taxonomy events asynchronously
 * - Manages anonymous session IDs without storing PII
 * - Uses navigator.sendBeacon or fetch with keepalive: true
 */

import { AnalyticsEventName } from "./taxonomy";

const SESSION_STORAGE_KEY = "megascript_anon_session_id";

/**
 * Returns or initializes a temporary anonymous session ID.
 */
export function getOrCreateAnonymousSessionId(): string {
  if (typeof window === "undefined") return "server-session";

  try {
    let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
      const randomSuffix = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      sessionId = `ses_${randomSuffix}`;
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return "ephemeral-session";
  }
}

export interface TrackEventOptions {
  component?: string;
  sourceChannel?: string;
  metadata?: Record<string, any>;
  route?: string;
}

/**
 * Dispatches an anonymous first-party analytics event. Non-blocking.
 */
export function trackEvent(
  eventName: AnalyticsEventName,
  options: TrackEventOptions = {}
) {
  if (typeof window === "undefined") return;

  const sessionId = getOrCreateAnonymousSessionId();
  const route = options.route || window.location.pathname;

  const payload = {
    eventName,
    route,
    component: options.component,
    sourceChannel: options.sourceChannel,
    sessionId,
    consentGiven: true, // Internal first-party operational analytics
    metadata: options.metadata || {},
  };

  const payloadString = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([payloadString], { type: "application/json" });
    const queued = navigator.sendBeacon("/api/analytics/event", blob);
    if (queued) return;
  }

  // Fallback to fetch with keepalive
  fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payloadString,
    keepalive: true,
  }).catch(() => {
    // Non-fatal telemetry dispatch error
  });
}
