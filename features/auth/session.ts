import { db } from "@/server/db";
import { logAuditEvent } from "@/server/services/audit";
import { cookies } from "next/headers";

export const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
export const ACTIVITY_THROTTLE_MS = 60 * 1000;       // 1 minute throttle on DB writes

export interface SessionValidationResult {
  valid: boolean;
  reason?: "NOT_FOUND" | "EXPIRED" | "INACTIVITY_TIMEOUT" | "USER_INACTIVE";
  session?: {
    id: string;
    token: string;
    userId: string;
    lastActivityAt: Date;
    expiresAt: Date;
  };
  user?: {
    id: string;
    email: string;
    displayName: string;
    status: string;
    isProtected: boolean;
  };
}

/**
 * Validates a session token against absolute expiry, user status, and 15-minute inactivity policy.
 * Strictly enforced on the server for all protected requests and server actions.
 */
export async function validateSessionWithInactivity(
  token: string,
  options: { isQualifyingActivity?: boolean; ipAddress?: string | null } = {}
): Promise<SessionValidationResult> {
  if (!token) {
    return { valid: false, reason: "NOT_FOUND" };
  }

  const session = await db.session.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          displayName: true,
          status: true,
          isProtected: true,
        },
      },
    },
  });

  if (!session) {
    return { valid: false, reason: "NOT_FOUND" };
  }

  const now = new Date();

  // 1. Check user status: must be ACTIVE
  if (session.user.status !== "ACTIVE") {
    // Revoke session immediately
    await revokeSession(token, "USER_STATUS_NOT_ACTIVE");
    await logAuditEvent({
      actorId: session.userId,
      action: "SESSION_REVOKED_USER_INACTIVE",
      targetType: "AUTH_SESSION",
      targetId: session.id,
      ipAddress: options.ipAddress,
      metadata: { userStatus: session.user.status },
    });
    return { valid: false, reason: "USER_INACTIVE" };
  }

  // 2. Check absolute expiration
  if (now > session.expiresAt) {
    await revokeSession(token, "ABSOLUTE_EXPIRY");
    return { valid: false, reason: "EXPIRED" };
  }

  // 3. Check 15-minute inactivity policy
  const elapsedSinceActivity = now.getTime() - session.lastActivityAt.getTime();
  if (elapsedSinceActivity > INACTIVITY_TIMEOUT_MS) {
    // Session expired by inactivity: revoke and write audit log
    await revokeSession(token, "INACTIVITY_TIMEOUT");
    await logAuditEvent({
      actorId: session.userId,
      action: "SESSION_EXPIRED_INACTIVITY",
      targetType: "AUTH_SESSION",
      targetId: session.id,
      ipAddress: options.ipAddress,
      metadata: {
        lastActivityAt: session.lastActivityAt.toISOString(),
        elapsedMinutes: Math.round(elapsedSinceActivity / 60000),
      },
    });
    return { valid: false, reason: "INACTIVITY_TIMEOUT" };
  }

  // 4. Update lastActivityAt if this is a qualifying activity and throttle window has elapsed
  if (options.isQualifyingActivity && elapsedSinceActivity >= ACTIVITY_THROTTLE_MS) {
    try {
      await db.session.update({
        where: { id: session.id },
        data: { lastActivityAt: now },
      });
      session.lastActivityAt = now;
    } catch (err) {
      // In high-concurrency environments, ignore transient update conflicts
      console.warn("[SESSION] Throttled activity update skipped:", err);
    }
  }

  return {
    valid: true,
    session: {
      id: session.id,
      token: session.token,
      userId: session.userId,
      lastActivityAt: session.lastActivityAt,
      expiresAt: session.expiresAt,
    },
    user: session.user,
  };
}

/**
 * Revokes an individual session token by deleting it from the database.
 */
export async function revokeSession(token: string, reason?: string) {
  try {
    const deleted = await db.session.delete({
      where: { token },
    });
    return deleted;
  } catch {
    return null;
  }
}

/**
 * Revokes all sessions belonging to a specific user (e.g. upon role change, deactivation, or security reset).
 */
export async function revokeAllUserSessions(userId: string, actorId?: string, reason = "MANUAL_REVOCATION") {
  try {
    const result = await db.session.deleteMany({
      where: { userId },
    });

    await logAuditEvent({
      actorId: actorId || userId,
      action: "ALL_SESSIONS_REVOKED",
      targetType: "USER",
      targetId: userId,
      metadata: {
        revokedCount: result.count,
        reason,
      },
    });

    return result.count;
  } catch (err) {
    console.error("[SESSION] Failed to revoke user sessions:", err);
    return 0;
  }
}

/**
 * Extracts and validates the active session token from incoming Next.js request cookies.
 */
export async function getSessionFromRequestCookies(options: { isQualifyingActivity?: boolean } = {}) {
  const cookieStore = cookies();
  // Better Auth stores session token in either `better-auth.session_token` or `__Secure-better-auth.session_token`
  const tokenCookie =
    cookieStore.get("__Secure-better-auth.session_token") ||
    cookieStore.get("better-auth.session_token");

  if (!tokenCookie?.value) {
    return { valid: false, reason: "NOT_FOUND" } as const;
  }

  return await validateSessionWithInactivity(tokenCookie.value, options);
}
