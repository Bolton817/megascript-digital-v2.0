import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { ConnectionStatus } from "@prisma/client";
import { decryptFromPackedString } from "@/server/services/security/encryption";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Query active connections for public tracking IDs
    const ga4Conn = await db.integrationConnection.findUnique({
      where: { provider: "GA4" },
    });

    const metaConn = await db.integrationConnection.findUnique({
      where: { provider: "META" },
    });

    let ga4MeasurementId: string | null = null;
    let metaPixelId: string | null = null;

    if (ga4Conn && ga4Conn.status === ConnectionStatus.CONNECTED && ga4Conn.encryptedSecretRef) {
      const decrypted = decryptFromPackedString(ga4Conn.encryptedSecretRef);
      if (decrypted) {
        try {
          const parsed = JSON.parse(decrypted);
          ga4MeasurementId = parsed.measurementId || null;
        } catch {
          // not json
        }
      }
    }

    if (!ga4MeasurementId && process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID) {
      ga4MeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
    }

    if (metaConn && metaConn.status === ConnectionStatus.CONNECTED && metaConn.encryptedSecretRef) {
      const decrypted = decryptFromPackedString(metaConn.encryptedSecretRef);
      if (decrypted) {
        try {
          const parsed = JSON.parse(decrypted);
          metaPixelId = parsed.pixelId || null;
        } catch {
          // not json
        }
      }
    }

    if (!metaPixelId && process.env.NEXT_PUBLIC_META_PIXEL_ID) {
      metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    }

    return NextResponse.json(
      {
        ga4MeasurementId,
        metaPixelId,
        hasAnalyticsTracker: Boolean(ga4MeasurementId),
        hasMarketingTracker: Boolean(metaPixelId),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        ga4MeasurementId: null,
        metaPixelId: null,
        hasAnalyticsTracker: false,
        hasMarketingTracker: false,
      },
      { status: 200 }
    );
  }
}
