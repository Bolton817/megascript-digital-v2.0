/**
 * UTM Attribution & Traffic Acquisition Engine
 * Authoritative Reference: TDD Sheets 073 & 121, Task 85
 * - Captures first-touch and last-touch UTM parameters (source, medium, campaign, term, content)
 * - Captures referrer domain and initial landing path
 * - Strict length-limiting, normalization, and PII protection
 * - First-touch data is immutable once stored; last-touch updates on new campaign visits
 */

export interface UTMData {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  referrer?: string;
  landingPath?: string;
  timestamp?: string;
}

export interface AttributionState {
  firstTouch: UTMData | null;
  lastTouch: UTMData | null;
}

export const FIRST_TOUCH_STORAGE_KEY = "megascript_utm_first_touch";
export const LAST_TOUCH_STORAGE_KEY = "megascript_utm_last_touch";

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(\+?[0-9]{7,15})/;

/**
 * Sanitizes untrusted UTM input: trims, caps length, and strips accidental PII.
 */
export function sanitizeUTMValue(val?: string | null, maxLength = 100): string | undefined {
  if (!val || typeof val !== "string") return undefined;

  const trimmed = val.trim();
  if (!trimmed) return undefined;

  // Strict PII Filter: never allow emails or phone numbers inside UTM values
  if (EMAIL_REGEX.test(trimmed) || PHONE_REGEX.test(trimmed)) {
    console.warn("[Attribution Guard] PII detected in UTM parameter. Parameter stripped.");
    return undefined;
  }

  // Remove unsafe characters, strip HTML, cap length
  return trimmed.replace(/[<>"'{}]/g, "").slice(0, maxLength);
}

/**
 * Extracts normalized UTM parameters from current URLSearchParams and window state.
 */
export function extractUTMFromSearchParams(
  searchParams: URLSearchParams,
  referrer: string = "",
  pathname: string = "/"
): UTMData | null {
  const source = sanitizeUTMValue(searchParams.get("utm_source"));
  const medium = sanitizeUTMValue(searchParams.get("utm_medium"));
  const campaign = sanitizeUTMValue(searchParams.get("utm_campaign"));
  const term = sanitizeUTMValue(searchParams.get("utm_term"));
  const content = sanitizeUTMValue(searchParams.get("utm_content"));

  const cleanReferrer = sanitizeUTMValue(referrer, 500);
  const cleanLandingPath = sanitizeUTMValue(pathname, 500);

  const hasUTM = Boolean(source || medium || campaign || term || content);
  const hasExternalReferrer = Boolean(
    cleanReferrer &&
      !cleanReferrer.includes("localhost") &&
      !cleanReferrer.includes("megascriptdigital.co.ke")
  );

  if (!hasUTM && !hasExternalReferrer) {
    return null;
  }

  return {
    source: source || (hasExternalReferrer ? deriveSourceFromReferrer(cleanReferrer) : "direct"),
    medium: medium || (hasExternalReferrer ? "referral" : "none"),
    campaign: campaign || undefined,
    term: term || undefined,
    content: content || undefined,
    referrer: cleanReferrer || undefined,
    landingPath: cleanLandingPath || "/",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Derives a human-readable source from external referrer URL.
 */
function deriveSourceFromReferrer(referrer?: string): string {
  if (!referrer) return "direct";
  try {
    const parsed = new URL(referrer);
    const host = parsed.hostname.toLowerCase();
    if (host.includes("google")) return "google";
    if (host.includes("bing")) return "bing";
    if (host.includes("linkedin")) return "linkedin";
    if (host.includes("twitter") || host.includes("x.com")) return "twitter";
    if (host.includes("facebook") || host.includes("instagram")) return "meta";
    return host.replace("www.", "");
  } catch {
    return "referral";
  }
}

/**
 * Reads stored first-touch and last-touch attribution from browser storage.
 */
export function getStoredAttribution(): AttributionState {
  if (typeof window === "undefined") {
    return { firstTouch: null, lastTouch: null };
  }

  let firstTouch: UTMData | null = null;
  let lastTouch: UTMData | null = null;

  try {
    const rawFirst = localStorage.getItem(FIRST_TOUCH_STORAGE_KEY);
    if (rawFirst) firstTouch = JSON.parse(rawFirst);

    const rawLast = localStorage.getItem(LAST_TOUCH_STORAGE_KEY);
    if (rawLast) lastTouch = JSON.parse(rawLast);
  } catch (err) {
    // Non-fatal storage reading error
  }

  return { firstTouch, lastTouch };
}

/**
 * Captures current visit attribution, enforcing first-touch immutability and updating last-touch.
 */
export function captureAndPersistAttribution(
  searchParams: URLSearchParams,
  referrer: string = "",
  pathname: string = "/"
): AttributionState {
  if (typeof window === "undefined") {
    return { firstTouch: null, lastTouch: null };
  }

  const currentVisitData = extractUTMFromSearchParams(searchParams, referrer, pathname);
  const { firstTouch: existingFirst, lastTouch: existingLast } = getStoredAttribution();

  let updatedFirst = existingFirst;
  let updatedLast = existingLast;

  if (currentVisitData) {
    // 1. First-touch: Immutable once written
    if (!existingFirst) {
      updatedFirst = currentVisitData;
      try {
        localStorage.setItem(FIRST_TOUCH_STORAGE_KEY, JSON.stringify(currentVisitData));
      } catch (err) {}
    }

    // 2. Last-touch: Always updates with newly detected campaign or external referral
    updatedLast = currentVisitData;
    try {
      localStorage.setItem(LAST_TOUCH_STORAGE_KEY, JSON.stringify(currentVisitData));
    } catch (err) {}
  } else if (!existingFirst) {
    // First visit without UTMs is recorded as organic/direct
    const directData: UTMData = {
      source: deriveSourceFromReferrer(referrer),
      medium: referrer ? "referral" : "direct",
      referrer: sanitizeUTMValue(referrer, 500),
      landingPath: sanitizeUTMValue(pathname, 500) || "/",
      timestamp: new Date().toISOString(),
    };
    updatedFirst = directData;
    updatedLast = directData;
    try {
      localStorage.setItem(FIRST_TOUCH_STORAGE_KEY, JSON.stringify(directData));
      localStorage.setItem(LAST_TOUCH_STORAGE_KEY, JSON.stringify(directData));
    } catch (err) {}
  }

  return {
    firstTouch: updatedFirst,
    lastTouch: updatedLast,
  };
}
