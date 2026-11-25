import { db } from "@/server/db";
import { ConversationStatus, Prisma } from "@prisma/client";
import { generateGroundedTonyReply, stripEmojis } from "./mock-provider";
import { getOrSeedCanonicalPrompt } from "./prompt";
import { retrieveGroundedContext } from "./retrieval";
import { classifyVisitorIntent, captureLeadFromChat } from "./intent";

export interface ActiveConversationResult {
  id: string;
  status: ConversationStatus;
  language: string;
  startedAt: Date;
  updatedAt: Date;
  messages: Array<{
    id: string;
    role: string;
    content: string;
    model: string | null;
    latencyMs: number | null;
    tokensUsed: number | null;
    createdAt: Date;
  }>;
}

/**
 * Retrieves the currently active conversation for a given visitor token hash.
 * If none exists, initializes a new conversation along with the introductory welcome message.
 */
export async function getOrCreateActiveConversation(
  visitorTokenHash: string,
  language: string = "en"
): Promise<ActiveConversationResult> {
  const normalizedLang = language.toLowerCase() === "sw" ? "sw" : "en";

  let conversation = await db.chatConversation.findFirst({
    where: {
      visitorTokenHash,
      status: {
        in: [ConversationStatus.ACTIVE, ConversationStatus.HANDOFF_REQUESTED],
      },
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conversation) {
    const welcomeText =
      normalizedLang === "sw"
        ? "Hujambo! Mimi ni Tony, msaidizi wa kidijitali wa MegaScript Digital. Ninawezaje kukusaidia leo kuhusu tovuti, mifumo ya wavuti, au makadirio ya bei?"
        : "Hello! I am Tony, the digital assistant for MegaScript Digital. How can I help you today with websites, custom web applications, or our pricing?";

    conversation = await db.chatConversation.create({
      data: {
        visitorTokenHash,
        language: normalizedLang,
        status: ConversationStatus.ACTIVE,
        messages: {
          create: {
            role: "assistant",
            content: stripEmojis(welcomeText),
            model: "mock-v1",
            latencyMs: 0,
            tokensUsed: 26,
          },
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  return {
    id: conversation.id,
    status: conversation.status,
    language: conversation.language,
    startedAt: conversation.startedAt,
    updatedAt: conversation.updatedAt,
    messages: conversation.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      model: m.model,
      latencyMs: m.latencyMs,
      tokensUsed: m.tokensUsed,
      createdAt: m.createdAt,
    })),
  };
}

/**
 * Retrieves conversation transcript strictly validating visitor ownership.
 */
export async function getConversationTranscript(
  conversationId: string,
  visitorTokenHash: string
): Promise<ActiveConversationResult | null> {
  const conversation = await db.chatConversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conversation) {
    return null;
  }

  // Strict session isolation check
  if (conversation.visitorTokenHash !== visitorTokenHash) {
    return null;
  }

  return {
    id: conversation.id,
    status: conversation.status,
    language: conversation.language,
    startedAt: conversation.startedAt,
    updatedAt: conversation.updatedAt,
    messages: conversation.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      model: m.model,
      latencyMs: m.latencyMs,
      tokensUsed: m.tokensUsed,
      createdAt: m.createdAt,
    })),
  };
}

/**
 * Handles incoming user chat message, verifies session ownership, stores the message,
 * generates the mock assistant reply, and returns the persisted messages.
 */
export async function postVisitorMessage(params: {
  conversationId: string;
  visitorTokenHash: string;
  content: string;
  language?: string;
  route?: string;
}) {
  const { conversationId, visitorTokenHash, content, language, route } = params;

  const conversation = await db.chatConversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 6,
      },
    },
  });

  if (!conversation) {
    return { success: false as const, error: "Conversation not found", status: 404 };
  }

  // Strict session isolation enforcement
  if (conversation.visitorTokenHash !== visitorTokenHash) {
    return { success: false as const, error: "Forbidden: Session access denied", status: 403 };
  }

  if (conversation.status === ConversationStatus.CLOSED) {
    return { success: false as const, error: "Conversation is closed", status: 400 };
  }

  const cleanUserContent = content.trim();
  if (!cleanUserContent) {
    return { success: false as const, error: "Message content cannot be empty", status: 400 };
  }

  // 1. Persist user message
  const userMessage = await db.chatMessage.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content: cleanUserContent,
    },
  });

  // 2. Fetch or seed canonical active prompt version
  const currentPrompt = await getOrSeedCanonicalPrompt();

  // 3. Classify visitor intent (Sheet 085)
  const historyForIntent = conversation.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  const intentResult = classifyVisitorIntent(cleanUserContent, historyForIntent);

  // 4. Handle Lead Qualification / Lead Capture (Sheet 085 & Sheet 087)
  let leadReferenceCode: string | undefined = undefined;
  if (intentResult.extractedContact?.hasContact) {
    const leadCaptureResult = await captureLeadFromChat({
      conversationId: conversation.id,
      contact: intentResult.extractedContact,
      lastVisitorMessage: cleanUserContent,
      route,
    });
    if (leadCaptureResult.success) {
      leadReferenceCode = leadCaptureResult.referenceCode;
    }
  }

  // 5. Retrieve Contextual Knowledge Pack (Sheet 083)
  const activeLang = language || conversation.language || "en";
  const contextPack = await retrieveGroundedContext({
    query: cleanUserContent,
    route,
    language: activeLang,
    limit: 4,
  });

  // 6. Generate Grounded Assistant Response
  const replyResult = generateGroundedTonyReply(cleanUserContent, {
    language: activeLang,
    route,
    contextSnippets: contextPack.formattedContext,
    intent: intentResult.intent,
    promptVersion: currentPrompt.version,
    leadReferenceCode,
    isDeclineOrSkip: intentResult.isDeclineOrSkip,
  });

  // 7. Update conversation status if handoff was triggered
  let updatedStatus = conversation.status;
  if (replyResult.isHandoffRequested && conversation.status !== ConversationStatus.HANDOFF_REQUESTED) {
    updatedStatus = ConversationStatus.HANDOFF_REQUESTED;
  }

  // 8. Persist assistant message and update conversation
  const [assistantMessage] = await db.$transaction([
    db.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: replyResult.content,
        model: replyResult.model,
        promptVersionId: currentPrompt.id,
        latencyMs: replyResult.latencyMs,
        tokensUsed: replyResult.tokensUsed,
      },
    }),
    db.chatConversation.update({
      where: { id: conversation.id },
      data: {
        status: updatedStatus,
        language: activeLang,
        updatedAt: new Date(),
      },
    }),
  ]);

  return {
    success: true as const,
    userMessage: {
      id: userMessage.id,
      role: userMessage.role,
      content: userMessage.content,
      createdAt: userMessage.createdAt,
    },
    assistantMessage: {
      id: assistantMessage.id,
      role: assistantMessage.role,
      content: assistantMessage.content,
      model: assistantMessage.model,
      promptVersionId: assistantMessage.promptVersionId,
      latencyMs: assistantMessage.latencyMs,
      tokensUsed: assistantMessage.tokensUsed,
      createdAt: assistantMessage.createdAt,
    },
    conversationStatus: updatedStatus,
    isHandoffRequested: replyResult.isHandoffRequested,
    intent: intentResult.intent,
    leadCaptured: replyResult.leadCaptured,
    leadReferenceCode,
  };
}

/**
 * Closes the active conversation for a visitor and creates a fresh conversation.
 */
export async function resetVisitorConversation(
  conversationId: string,
  visitorTokenHash: string,
  language: string = "en"
) {
  const conversation = await db.chatConversation.findUnique({
    where: { id: conversationId },
  });

  if (conversation && conversation.visitorTokenHash === visitorTokenHash) {
    await db.chatConversation.update({
      where: { id: conversationId },
      data: {
        status: ConversationStatus.CLOSED,
        closedAt: new Date(),
      },
    });
  }

  // Initialize a fresh conversation
  return getOrCreateActiveConversation(visitorTokenHash, language);
}

/**
 * Triggers a human handoff request on a visitor's conversation.
 */
export async function markConversationHandoff(
  conversationId: string,
  visitorTokenHash: string
) {
  const conversation = await db.chatConversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation || conversation.visitorTokenHash !== visitorTokenHash) {
    return { success: false as const, error: "Forbidden or conversation not found" };
  }

  const updated = await db.chatConversation.update({
    where: { id: conversationId },
    data: {
      status: ConversationStatus.HANDOFF_REQUESTED,
      updatedAt: new Date(),
    },
  });

  return { success: true as const, status: updated.status };
}

// -----------------------------------------------------------------------------
// Operations Console (`/master/conversations`) Administration Methods
// -----------------------------------------------------------------------------

export interface AdminConversationFilter {
  status?: ConversationStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function listAdminConversations(filter: AdminConversationFilter = {}) {
  const { status, search, page = 1, pageSize = 15 } = filter;
  const skip = (page - 1) * pageSize;

  const where: Prisma.ChatConversationWhereInput = {};

  if (status) {
    where.status = status;
  }

  if (search && search.trim()) {
    const term = search.trim();
    where.OR = [
      { id: { contains: term, mode: "insensitive" } },
      { visitorTokenHash: { contains: term, mode: "insensitive" } },
      {
        messages: {
          some: {
            content: { contains: term, mode: "insensitive" },
          },
        },
      },
    ];
  }

  const [totalCount, conversations] = await Promise.all([
    db.chatConversation.count({ where }),
    db.chatConversation.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: pageSize,
      include: {
        _count: {
          select: { messages: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        lead: {
          select: {
            id: true,
            referenceCode: true,
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    conversations: conversations.map((c) => ({
      id: c.id,
      visitorTokenHash: c.visitorTokenHash,
      language: c.language,
      status: c.status,
      startedAt: c.startedAt,
      updatedAt: c.updatedAt,
      closedAt: c.closedAt,
      messageCount: c._count.messages,
      lastMessage: c.messages[0]
        ? {
            role: c.messages[0].role,
            content: c.messages[0].content,
            createdAt: c.messages[0].createdAt,
          }
        : null,
      lead: c.lead,
    })),
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
  };
}

export async function getAdminConversationMetrics() {
  const [total, active, handoff, closed, totalMessages] = await Promise.all([
    db.chatConversation.count(),
    db.chatConversation.count({ where: { status: ConversationStatus.ACTIVE } }),
    db.chatConversation.count({ where: { status: ConversationStatus.HANDOFF_REQUESTED } }),
    db.chatConversation.count({ where: { status: ConversationStatus.CLOSED } }),
    db.chatMessage.count(),
  ]);

  return {
    totalConversations: total,
    activeConversations: active,
    handoffConversations: handoff,
    closedConversations: closed,
    totalMessages,
  };
}

export async function getAdminConversationDetail(conversationId: string) {
  const conversation = await db.chatConversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
      lead: {
        select: {
          id: true,
          referenceCode: true,
          name: true,
          email: true,
          status: true,
        },
      },
    },
  });

  return conversation;
}

export async function updateAdminConversationStatus(
  conversationId: string,
  newStatus: ConversationStatus
) {
  return db.chatConversation.update({
    where: { id: conversationId },
    data: {
      status: newStatus,
      closedAt: newStatus === ConversationStatus.CLOSED ? new Date() : undefined,
      updatedAt: new Date(),
    },
  });
}
