"use server";

import { requireAuthOrRedirect, getUserRolesAndPermissions } from "@/features/auth/rbac";
import {
  getAdminNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/server/services/notifications";

export async function fetchNotificationsAction() {
  const { user } = await requireAuthOrRedirect();
  const roleInfo = await getUserRolesAndPermissions(user.id);

  return getAdminNotifications({
    userId: user.id,
    roles: roleInfo.roles,
    isSuperAdmin: roleInfo.isSuperAdmin,
    limit: 25,
  });
}

export async function markNotificationReadAction(notificationId: string) {
  await requireAuthOrRedirect();
  return markNotificationAsRead(notificationId);
}

export async function markAllNotificationsReadAction() {
  const { user } = await requireAuthOrRedirect();
  const roleInfo = await getUserRolesAndPermissions(user.id);

  return markAllNotificationsAsRead({
    userId: user.id,
    roles: roleInfo.roles,
    isSuperAdmin: roleInfo.isSuperAdmin,
  });
}
