import { db } from "@/server/db";
import { RoleName } from "@prisma/client";
import { getSessionFromRequestCookies } from "./session";
import { logAuditEvent } from "@/server/services/audit";

export interface UserRolesAndPermissions {
  userId: string;
  roles: RoleName[];
  permissions: Set<string>;
  isSuperAdmin: boolean;
}

/**
 * Resolves all assigned roles and their associated permissions for a given user.
 */
export async function getUserRolesAndPermissions(userId: string): Promise<UserRolesAndPermissions> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return {
      userId,
      roles: [],
      permissions: new Set<string>(),
      isSuperAdmin: false,
    };
  }

  const roles: RoleName[] = user.userRoles.map((ur) => ur.role.name);
  const permissions = new Set<string>();

  const isSuperAdmin = roles.includes(RoleName.SUPER_ADMIN);

  for (const ur of user.userRoles) {
    for (const rp of ur.role.rolePermissions) {
      permissions.add(rp.permission.key);
    }
  }

  return {
    userId,
    roles,
    permissions,
    isSuperAdmin,
  };
}

/**
 * Checks if a user has a specific permission key.
 * Super Administrator role bypasses checks and always returns true.
 */
export async function hasPermission(userId: string, permissionKey: string): Promise<boolean> {
  const info = await getUserRolesAndPermissions(userId);

  if (info.isSuperAdmin) {
    return true;
  }

  return info.permissions.has(permissionKey);
}

/**
 * Checks if a user has any of the specified permission keys.
 */
export async function hasAnyPermission(userId: string, permissionKeys: string[]): Promise<boolean> {
  const info = await getUserRolesAndPermissions(userId);

  if (info.isSuperAdmin) {
    return true;
  }

  return permissionKeys.some((k) => info.permissions.has(k));
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized: Active authenticated session required") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  public permissionKey: string;
  constructor(permissionKey: string, message = `Forbidden: Missing required permission [${permissionKey}]`) {
    super(message);
    this.name = "ForbiddenError";
    this.permissionKey = permissionKey;
  }
}

/**
 * Server guard: Validates that the caller has an active, valid session (enforcing 15-minute inactivity).
 * Throws UnauthorizedError if invalid or expired.
 */
export async function requireAuth(options: { isQualifyingActivity?: boolean } = {}) {
  const result = await getSessionFromRequestCookies(options);

  if (!result.valid || !result.user || !result.session) {
    throw new UnauthorizedError(
      result.reason === "INACTIVITY_TIMEOUT"
        ? "Session expired due to 15 minutes of inactivity"
        : "Valid administrator session required"
    );
  }

  return {
    session: result.session,
    user: result.user,
  };
}

/**
 * Server guard: Validates session and checks that the user possesses the required permission key.
 * Logs an audit event if the request is forbidden.
 */
export async function requirePermission(permissionKey: string, options: { isQualifyingActivity?: boolean } = {}) {
  const { session, user } = await requireAuth(options);

  const allowed = await hasPermission(user.id, permissionKey);

  if (!allowed) {
    await logAuditEvent({
      actorId: user.id,
      action: "UNAUTHORIZED_ACCESS_ATTEMPT",
      targetType: "RBAC_PERMISSION",
      targetId: permissionKey,
      metadata: {
        userEmail: user.email,
        missingPermission: permissionKey,
      },
    });

    throw new ForbiddenError(permissionKey);
  }

  return {
    session,
    user,
  };
}
