import { db } from "@/server/db";
import { NotificationType, NotificationSeverity, RoleName, Prisma } from "@prisma/client";

export interface CreateNotificationInput {
  type: NotificationType;
  severity?: NotificationSeverity;
  title: string;
  message: string;
  linkUrl?: string;
  targetRole?: RoleName;
  recipientId?: string;
  idempotencyKey?: string;
}

/**
 * Creates an administrative notification with idempotency support and KDPA data minimization.
 * Prevents alert storms by checking existing unread alerts with the same idempotencyKey.
 */
export async function createAdminNotification(input: CreateNotificationInput) {
  if (input.idempotencyKey) {
    const existing = await db.notification.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (existing) {
      // If unread, return existing to avoid duplicate noise
      if (!existing.isRead) {
        return existing;
      }
      // If previously read, delete old so new one can be created
      await db.notification.delete({
        where: { id: existing.id },
      });
    }
  }

  return db.notification.create({
    data: {
      type: input.type,
      severity: input.severity || NotificationSeverity.INFO,
      title: input.title.slice(0, 150),
      message: input.message.slice(0, 500),
      linkUrl: input.linkUrl || null,
      targetRole: input.targetRole || null,
      recipientId: input.recipientId || null,
      idempotencyKey: input.idempotencyKey || null,
    },
  });
}

/**
 * Retrieves unread and recent notifications accessible to a user based on their roles.
 */
export async function getAdminNotifications(params: {
  userId: string;
  roles: RoleName[];
  isSuperAdmin: boolean;
  limit?: number;
  unreadOnly?: boolean;
}) {
  const { userId, roles, isSuperAdmin, limit = 20, unreadOnly = false } = params;

  const where: Prisma.NotificationWhereInput = {
    AND: [
      unreadOnly ? { isRead: false } : {},
      isSuperAdmin
        ? {}
        : {
            OR: [
              { recipientId: userId },
              { targetRole: { in: roles } },
              { AND: [{ recipientId: null }, { targetRole: null }] },
            ],
          },
    ],
  };

  const [notifications, unreadCount] = await Promise.all([
    db.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    db.notification.count({
      where: {
        AND: [
          { isRead: false },
          isSuperAdmin
            ? {}
            : {
                OR: [
                  { recipientId: userId },
                  { targetRole: { in: roles } },
                  { AND: [{ recipientId: null }, { targetRole: null }] },
                ],
              },
        ],
      },
    }),
  ]);

  return {
    notifications,
    unreadCount,
  };
}

/**
 * Marks a notification as read.
 */
export async function markNotificationAsRead(id: string) {
  return db.notification.update({
    where: { id },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}

/**
 * Marks all notifications accessible to a user/role as read.
 */
export async function markAllNotificationsAsRead(params: {
  userId: string;
  roles: RoleName[];
  isSuperAdmin: boolean;
}) {
  const { userId, roles, isSuperAdmin } = params;

  const where: Prisma.NotificationWhereInput = {
    isRead: false,
    ...(isSuperAdmin
      ? {}
      : {
          OR: [
            { recipientId: userId },
            { targetRole: { in: roles } },
            { AND: [{ recipientId: null }, { targetRole: null }] },
          ],
        }),
  };

  const result = await db.notification.updateMany({
    where,
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return { count: result.count };
}
