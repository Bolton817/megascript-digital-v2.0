import { db } from "@/server/db";
import { RoleName, UserStatus } from "@prisma/client";
import { hasPermission } from "./rbac";
import { revokeAllUserSessions } from "./session";
import { logAuditEvent } from "@/server/services/audit";

export class ProtectedAccountError extends Error {
  constructor(
    message = "The primary Super Administrator account (megascriptdigital@gmail.com) is immutable and cannot be deleted, deactivated, or demoted."
  ) {
    super(message);
    this.name = "ProtectedAccountError";
  }
}

export class UserManagementError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserManagementError";
  }
}

/**
 * Lists all administrative users, assigned roles, active status, and allowlist metadata.
 * Requires `users.read` permission.
 */
export async function listAdminUsers(actorId: string) {
  const allowed = await hasPermission(actorId, "users.read");
  if (!allowed) {
    throw new UserManagementError("Unauthorized: Missing 'users.read' permission");
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
      sessions: {
        select: {
          id: true,
          lastActivityAt: true,
          expiresAt: true,
        },
      },
    },
  });

  const allowlisted = await db.allowlistedEmail.findMany();
  const allowlistMap = new Map(allowlisted.map((a) => [a.normalizedEmail, a]));

  return users.map((u) => {
    const isAllowlisted = allowlistMap.has(u.normalizedEmail);
    const allowlistEntry = allowlistMap.get(u.normalizedEmail);

    return {
      id: u.id,
      email: u.email,
      displayName: u.displayName,
      status: u.status,
      isProtected: u.isProtected,
      lastLoginAt: u.lastLoginAt,
      createdAt: u.createdAt,
      roles: u.userRoles.map((ur) => ur.role.name),
      isAllowlisted,
      allowlistRoleId: allowlistEntry?.roleId,
      activeSessionCount: u.sessions.filter(
        (s) => s.expiresAt > new Date() && Date.now() - s.lastActivityAt.getTime() < 15 * 60 * 1000
      ).length,
    };
  });
}

/**
 * Updates a user's role.
 * Protects immutable Super Administrator from demotion.
 * Invalidates all active sessions for the target user so new permissions take effect immediately.
 */
export async function updateUserRole(actorId: string, targetUserId: string, newRole: RoleName) {
  const allowed = await hasPermission(actorId, "users.manage");
  if (!allowed) {
    throw new UserManagementError("Unauthorized: Missing 'users.manage' permission");
  }

  const targetUser = await db.user.findUnique({
    where: { id: targetUserId },
    include: { userRoles: { include: { role: true } } },
  });

  if (!targetUser) {
    throw new UserManagementError("Target user not found");
  }

  // Guard: Immutable Super Administrator cannot be demoted or changed
  if (targetUser.isProtected || targetUser.normalizedEmail === "megascriptdigital@gmail.com") {
    await logAuditEvent({
      actorId,
      action: "PROTECTED_ACCOUNT_MUTATION_REJECTED",
      targetType: "USER",
      targetId: targetUserId,
      metadata: {
        reason: "Attempted to change role on protected Super Admin",
        attemptedRole: newRole,
      },
    });
    throw new ProtectedAccountError();
  }

  const targetRoleRecord = await db.role.findUnique({
    where: { name: newRole },
  });

  if (!targetRoleRecord) {
    throw new UserManagementError(`Role ${newRole} does not exist`);
  }

  const priorRoles = targetUser.userRoles.map((r) => r.role.name);

  // Update UserRole
  await db.userRole.deleteMany({
    where: { userId: targetUserId },
  });

  await db.userRole.create({
    data: {
      userId: targetUserId,
      roleId: targetRoleRecord.id,
    },
  });

  // Update AllowlistedEmail role if present
  await db.allowlistedEmail.updateMany({
    where: { normalizedEmail: targetUser.normalizedEmail },
    data: { roleId: targetRoleRecord.id },
  });

  // Invalidate all active sessions for security
  await revokeAllUserSessions(targetUserId, actorId, `ROLE_CHANGED_TO_${newRole}`);

  await logAuditEvent({
    actorId,
    action: "ROLE_CHANGED",
    targetType: "USER",
    targetId: targetUserId,
    metadata: {
      priorRoles,
      newRole,
    },
  });

  return { success: true, targetUserId, newRole };
}

/**
 * Updates an administrator's status (ACTIVE, SUSPENDED, DEACTIVATED).
 * Protects immutable Super Administrator from deactivation or suspension.
 */
export async function updateUserStatus(actorId: string, targetUserId: string, newStatus: UserStatus) {
  const allowed = await hasPermission(actorId, "users.manage");
  if (!allowed) {
    throw new UserManagementError("Unauthorized: Missing 'users.manage' permission");
  }

  const targetUser = await db.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    throw new UserManagementError("Target user not found");
  }

  // Guard: Immutable Super Administrator cannot be suspended or deactivated
  if (
    (targetUser.isProtected || targetUser.normalizedEmail === "megascriptdigital@gmail.com") &&
    newStatus !== UserStatus.ACTIVE
  ) {
    await logAuditEvent({
      actorId,
      action: "PROTECTED_ACCOUNT_MUTATION_REJECTED",
      targetType: "USER",
      targetId: targetUserId,
      metadata: {
        reason: "Attempted to deactivate or suspend protected Super Admin",
        attemptedStatus: newStatus,
      },
    });
    throw new ProtectedAccountError();
  }

  const priorStatus = targetUser.status;

  await db.user.update({
    where: { id: targetUserId },
    data: { status: newStatus },
  });

  // If suspended or deactivated, immediately revoke all active sessions
  if (newStatus !== UserStatus.ACTIVE) {
    await revokeAllUserSessions(targetUserId, actorId, `STATUS_CHANGED_TO_${newStatus}`);
  }

  await logAuditEvent({
    actorId,
    action: "USER_STATUS_CHANGED",
    targetType: "USER",
    targetId: targetUserId,
    metadata: {
      priorStatus,
      newStatus,
    },
  });

  return { success: true, targetUserId, newStatus };
}

/**
 * Removes an email from the allowlist.
 * Protects immutable Super Administrator from removal.
 */
export async function removeUserFromAllowlist(actorId: string, email: string) {
  const allowed = await hasPermission(actorId, "users.manage");
  if (!allowed) {
    throw new UserManagementError("Unauthorized: Missing 'users.manage' permission");
  }

  const normalized = email.toLowerCase().trim();

  // Guard: Immutable Super Administrator cannot be removed from allowlist
  if (normalized === "megascriptdigital@gmail.com") {
    await logAuditEvent({
      actorId,
      action: "PROTECTED_ACCOUNT_MUTATION_REJECTED",
      targetType: "ALLOWLIST",
      metadata: {
        reason: "Attempted to remove protected Super Admin from allowlist",
        attemptedEmail: email,
      },
    });
    throw new ProtectedAccountError();
  }

  const user = await db.user.findUnique({
    where: { normalizedEmail: normalized },
  });

  if (user?.isProtected) {
    throw new ProtectedAccountError();
  }

  // Delete from allowlist
  await db.allowlistedEmail.deleteMany({
    where: { normalizedEmail: normalized },
  });

  // If user account exists, deactivate and revoke sessions
  if (user) {
    await db.user.update({
      where: { id: user.id },
      data: { status: UserStatus.INACTIVE },
    });
    await revokeAllUserSessions(user.id, actorId, "REMOVED_FROM_ALLOWLIST");
  }

  await logAuditEvent({
    actorId,
    action: "ALLOWLIST_REMOVED",
    targetType: "ALLOWLIST",
    metadata: { email: normalized },
  });

  return { success: true, email: normalized };
}
