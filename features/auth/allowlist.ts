import { db } from "@/server/db";

export async function checkEmailAllowlisted(email: string) {
  const normalized = email.toLowerCase().trim();

  const allowlisted = await db.allowlistedEmail.findUnique({
    where: { normalizedEmail: normalized },
    include: { role: true },
  });

  if (!allowlisted) {
    return { isAllowed: false, role: null, user: null };
  }

  const user = await db.user.findUnique({
    where: { normalizedEmail: normalized },
  });

  if (!user || user.status !== "ACTIVE") {
    return { isAllowed: false, role: null, user: null };
  }

  return {
    isAllowed: true,
    role: allowlisted.role.name,
    user,
  };
}
