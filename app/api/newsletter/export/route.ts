import { NextResponse } from "next/server";
import { requirePermission } from "@/features/auth/rbac";
import { exportSubscribersCsv } from "@/server/services/newsletter/subscribers";

export async function GET() {
  try {
    await requirePermission("newsletter.read");

    const csvContent = await exportSubscribersCsv();

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="megascript-subscribers-${new Date()
          .toISOString()
          .slice(0, 10)}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unauthorized" },
      { status: 403 }
    );
  }
}
