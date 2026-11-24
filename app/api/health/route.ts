import { NextResponse } from "next/server";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbStatus = "disconnected";
  try {
    const settings = await db.siteSettings.findUnique({
      where: { id: "singleton" },
      select: { brandName: true },
    });
    if (settings) {
      dbStatus = "connected";
    }
  } catch (error) {
    dbStatus = "error";
  }

  return NextResponse.json(
    {
      status: dbStatus === "connected" ? "healthy" : "degraded",
      database: dbStatus,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
