import { NextRequest, NextResponse } from "next/server";
import {
  VISITOR_TOKEN_COOKIE,
  DEFAULT_VISITOR_COOKIE_OPTIONS,
  generateVisitorToken,
  hashVisitorToken,
} from "@/lib/chat/session";
import { postVisitorMessage } from "@/server/services/tony/conversation";

export async function POST(req: NextRequest) {
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

    const body = await req.json().catch(() => ({}));
    const { message, conversationId, language } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Message content is required" },
        { status: 400 }
      );
    }

    const cleanMessage = message.trim();
    if (cleanMessage.length > 1000) {
      return NextResponse.json(
        { success: false, error: "Message exceeds maximum length of 1,000 characters" },
        { status: 400 }
      );
    }

    if (!conversationId || typeof conversationId !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid conversationId is required" },
        { status: 400 }
      );
    }

    const visitorTokenHash = hashVisitorToken(token);

    const result = await postVisitorMessage({
      conversationId,
      visitorTokenHash,
      content: cleanMessage,
      language: language || "en",
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status || 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      userMessage: result.userMessage,
      assistantMessage: result.assistantMessage,
      conversationStatus: result.conversationStatus,
      isHandoffRequested: result.isHandoffRequested,
    });

    if (isNewToken || !req.cookies.has(VISITOR_TOKEN_COOKIE)) {
      response.cookies.set(VISITOR_TOKEN_COOKIE, token, DEFAULT_VISITOR_COOKIE_OPTIONS);
    }

    return response;
  } catch (err: any) {
    console.error("[Tony Chat API Error]:", err);
    return NextResponse.json(
      { success: false, error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
