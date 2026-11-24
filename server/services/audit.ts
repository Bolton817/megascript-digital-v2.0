import { db } from "@/server/db";
import { Prisma } from "@prisma/client";

export interface LogAuditOptions {
  actorId?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  metadata?: Prisma.InputJsonValue;
  ipAddress?: string | null;
}

export async function logAuditEvent({
  actorId,
  action,
  targetType,
  targetId,
  metadata,
  ipAddress,
}: LogAuditOptions) {
  try {
    return await db.auditLog.create({
      data: {
        actorId: actorId || null,
        action,
        targetType,
        targetId: targetId || null,
        metadata: metadata || Prisma.JsonNull,
        ipAddress: ipAddress || null,
      },
    });
  } catch (error) {
    // Fail safely in logging to never break the main operation
    console.error("Failed to write audit log:", error);
    return null;
  }
}
