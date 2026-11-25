import { NextRequest, NextResponse } from "next/server";
import {
  VISITOR_TOKEN_COOKIE,
  DEFAULT_VISITOR_COOKIE_OPTIONS,
  generateVisitorToken,
  hashVisitorToken,
} from "@/lib/chat/session";
import {
  getOrCreateActiveConversation,
  resetVisitorConversation,
  markConversationHandoff,
} from "@/server/services/tony/conversation";

export async function GET(req: NextRequest) {
  try {
    let token =
      req.cookies.get(VISITOR_TOKEN_COOKIE)?.value ||
      req.headers.get("x-visitor-token") ||
      null;

    let isNewToken = false;

    if (!token) {
      token = generateVisitorToken();
      isNewToken = true;
    }

    const visitorTokenHash = hashVisitorToken(token);
    const lang = req.nextUrl.searchParams.get("lang") || "en";

    const conversation = await getOrCreateActiveConversation(visitorTokenHash, lang);

    const response = NextResponse.json({
      success: true,
      conversation,
    });

    if (isNewToken || !req.cookies.has(VISITOR_TOKEN_COOKIE)) {
      response.cookies.set(VISITOR_TOKEN_COOKIE, token, DEFAULT_VISITOR_COOKIE_OPTIONS);
    }

    return response;
  } catch (err: any) {
    console.error("[Tony Conversation API Error]:", err);
    return NextResponse.json(
      { success: false, error: "Failed to initialize conversation" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token =
      req.cookies.get(VISITOR_TOKEN_COOKIE)?.value ||
      req.headers.get("x-visitor-token") ||
      null;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Visitor token required" },
        { status: 401 }
      );
    }

    const visitorTokenHash = hashVisitorToken(token);
    const body = await req.json().catch(() => ({}));
    const { action, conversationId, language } = body;

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: "conversationId is required" },
        { status: 400 }
      );
    }

    if (action === "reset") {
      const freshConversation = await resetVisitorConversation(
        conversationId,
        visitorTokenHash,
        language || "en"
      );
      return NextResponse.json({
        success: true,
        conversation: freshConversation,
      });
    }

    if (action === "handoff") {
      const handoffResult = await markConversationHandoff(
        conversationId,
        visitorTokenHash
      );
      return NextResponse.json(handoffResult);
    }

    return NextResponse.json(
      { success: false, error: "Invalid action specified" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("[Tony Conversation Action Error]:", err);
    return NextResponse.json(
      { success: false, error: "Failed to process conversation action" },
      { status: 500 }
    );
  }
}
