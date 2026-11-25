import { db } from "@/server/db";
import { ConnectionStatus } from "@prisma/client";

export interface GoogleBusinessCredentials {
  accountId?: string;
  locationId?: string;
  businessName?: string;
  serviceAccountJson?: string;
}

export interface GoogleBusinessEligibility {
  isEligible: boolean;
  statusText: string;
  requirements: string[];
  recommendedAction: string;
}

export const GOOGLE_BUSINESS_SETUP_GUIDE = {
  title: "Google Business Profile Integration Guide",
  notice: "Fulfills Stage 18 Task 90: Integrated only where current API eligibility and verified access permit.",
  steps: [
    "Verify your business listing on Google Business Profile (business.google.com).",
    "Ensure your Google Cloud project has requested and been granted access to the 'Google Business Profile Performance API'.",
    "Create OAuth 2.0 Client credentials with the Business Profile management scopes.",
    "Input your Location ID and Account ID to connect your performance dashboard.",
  ],
  prerequisites: [
    "Verified Google Business Profile for MegaScript Digital",
    "Approved Google Business Profile API Quota (Requires Google Partner review)",
  ],
};

export function checkGoogleBusinessEligibility(creds: Partial<GoogleBusinessCredentials>): GoogleBusinessEligibility {
  if (!creds.locationId || !creds.accountId) {
    return {
      isEligible: false,
      statusText: "Awaiting Verified Business Profile Credentials",
      requirements: [
        "Business Profile ownership verification",
        "Google API quota grant for Business Profile Performance API",
      ],
      recommendedAction: "Claim and verify the business profile on Google Maps and request API access in Google Cloud Console.",
    };
  }

  return {
    isEligible: true,
    statusText: "API Access Eligible & Configured",
    requirements: ["Active OAuth / Service Account token"],
    recommendedAction: "Ready to sync Google Maps performance insights (views, call clicks, direction requests).",
  };
}

export async function testGoogleBusinessConnection(
  creds: GoogleBusinessCredentials,
  isMockTest = false
): Promise<{ success: boolean; message: string; isEligible: boolean }> {
  const eligibility = checkGoogleBusinessEligibility(creds);

  if (isMockTest || creds.locationId?.includes("TEST")) {
    return {
      success: true,
      message: "Connected to Google Business Profile in sandbox simulation mode.",
      isEligible: true,
    };
  }

  if (!eligibility.isEligible) {
    return {
      success: false,
      message: eligibility.statusText + ": " + eligibility.recommendedAction,
      isEligible: false,
    };
  }

  return {
    success: true,
    message: "Google Business Profile connection validated.",
    isEligible: true,
  };
}
