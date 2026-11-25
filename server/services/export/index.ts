import { db } from "@/server/db";
import { logAuditEvent } from "@/server/services/audit";
import { ForbiddenError } from "@/features/auth/rbac";

export interface ExportLeadsOptions {
  actorId: string;
  hasExportPermission: boolean;
  format?: "csv" | "json";
  anonymize?: boolean;
  status?: string;
  timeframeDays?: number;
}

export async function exportLeadsData(options: ExportLeadsOptions) {
  const { actorId, hasExportPermission, format = "csv", anonymize = false, status, timeframeDays } = options;

  if (!hasExportPermission) {
    throw new ForbiddenError("Forbidden: leads.export permission required to export customer records");
  }

  const where: any = {};
  if (status && status !== "ALL") {
    where.status = status;
  }
  if (timeframeDays) {
    where.createdAt = { gte: new Date(Date.now() - timeframeDays * 24 * 60 * 60 * 1000) };
  }

  const leads = await db.lead.findMany({
    where,
    include: {
      utmAttribution: true,
      assignedUser: { select: { displayName: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Transform and mask based on KDPA data minimization
  const records = leads.map((l) => ({
    referenceCode: l.referenceCode,
    createdDate: l.createdAt.toISOString().split("T")[0],
    name: anonymize ? "REDACTED" : l.name,
    email: anonymize ? "REDACTED" : l.email,
    phone: anonymize ? "REDACTED" : l.phone || "",
    topic: l.topic,
    status: l.status,
    sourceChannel: l.sourceChannel,
    assignedTo: l.assignedUser?.displayName || "Unassigned",
    utmSource: l.utmAttribution?.utmSource || "",
    utmCampaign: l.utmAttribution?.utmCampaign || "",
  }));

  // Log to immutable AuditLog (Sheet 111 & 105)
  await logAuditEvent({
    actorId,
    action: "EXPORT_LEADS",
    targetType: "LEAD",
    targetId: null,
    metadata: {
      count: records.length,
      format,
      anonymized: anonymize,
    },
  });

  if (format === "json") {
    return {
      contentType: "application/json",
      filename: `megascript-leads-${new Date().toISOString().slice(0, 10)}.json`,
      content: JSON.stringify(records, null, 2),
      count: records.length,
    };
  }

  // Generate clean CSV
  const headers = [
    "Reference",
    "Date",
    "Name",
    "Email",
    "Phone",
    "Topic",
    "Status",
    "Channel",
    "Assignee",
    "UTM Source",
    "UTM Campaign",
  ];

  const escapeCsv = (val: string) => `"${(val || "").replace(/"/g, '""')}"`;

  const csvRows = [
    headers.join(","),
    ...records.map((r) =>
      [
        escapeCsv(r.referenceCode),
        escapeCsv(r.createdDate),
        escapeCsv(r.name),
        escapeCsv(r.email),
        escapeCsv(r.phone),
        escapeCsv(r.topic),
        escapeCsv(r.status),
        escapeCsv(r.sourceChannel),
        escapeCsv(r.assignedTo),
        escapeCsv(r.utmSource),
        escapeCsv(r.utmCampaign),
      ].join(",")
    ),
  ];

  return {
    contentType: "text/csv",
    filename: `megascript-leads-${new Date().toISOString().slice(0, 10)}.csv`,
    content: csvRows.join("\n"),
    count: records.length,
  };
}

export interface ExportAnalyticsOptions {
  actorId: string;
  hasExportPermission: boolean;
  format?: "csv" | "json";
  timeframeDays?: number;
}

export async function exportAnalyticsData(options: ExportAnalyticsOptions) {
  const { actorId, hasExportPermission, format = "csv", timeframeDays = 30 } = options;

  if (!hasExportPermission) {
    throw new ForbiddenError("Forbidden: analytics.export permission required to export analytics");
  }

  const since = new Date(Date.now() - timeframeDays * 24 * 60 * 60 * 1000);

  const [events, leadsCount, sessions] = await Promise.all([
    db.analyticsEvent.groupBy({
      by: ["eventName"],
      where: { createdAt: { gte: since } },
      _count: { eventName: true },
    }),
    db.lead.count({ where: { createdAt: { gte: since } } }),
    db.analyticsEvent.findMany({
      where: { createdAt: { gte: since }, sessionId: { not: null } },
      distinct: ["sessionId"],
      select: { sessionId: true },
    }),
  ]);

  const uniqueSessions = sessions.length;
  const totalEvents = events.reduce((acc, curr) => acc + curr._count.eventName, 0);

  const payload = {
    period: `Past ${timeframeDays} Days`,
    exportedAt: new Date().toISOString(),
    uniqueSessions,
    totalEvents,
    inboundLeads: leadsCount,
    conversionRatePct: uniqueSessions > 0 ? Number(((leadsCount / uniqueSessions) * 100).toFixed(2)) : 0,
    eventBreakdown: events.map((e) => ({ event: e.eventName, count: e._count.eventName })),
  };

  await logAuditEvent({
    actorId,
    action: "EXPORT_ANALYTICS",
    targetType: "ANALYTICS",
    targetId: null,
    metadata: {
      timeframeDays,
      format,
    },
  });

  if (format === "json") {
    return {
      contentType: "application/json",
      filename: `megascript-analytics-${new Date().toISOString().slice(0, 10)}.json`,
      content: JSON.stringify(payload, null, 2),
      count: totalEvents,
    };
  }

  const csvRows = [
    "Metric,Value",
    `"Period","${payload.period}"`,
    `"Export Date","${payload.exportedAt}"`,
    `"Unique Sessions",${payload.uniqueSessions}`,
    `"Total Telemetry Events",${payload.totalEvents}`,
    `"Inbound Leads",${payload.inboundLeads}`,
    `"Conversion Rate (%)",${payload.conversionRatePct}%`,
    "",
    "Event Name,Count",
    ...payload.eventBreakdown.map((e) => `"${e.event}",${e.count}`),
  ];

  return {
    contentType: "text/csv",
    filename: `megascript-analytics-${new Date().toISOString().slice(0, 10)}.csv`,
    content: csvRows.join("\n"),
    count: totalEvents,
  };
}
