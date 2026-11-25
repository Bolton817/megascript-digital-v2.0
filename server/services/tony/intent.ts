import { db } from "@/server/db";
import { generateReferenceCode } from "@/server/services/crm/leads";
import { LeadStatus } from "@prisma/client";

export type TonyIntentState =
  | "INFORMATIONAL"
  | "CONSIDERING"
  | "HIGH_INTENT"
  | "HANDOFF_REQUESTED";

export interface ContactExtractionResult {
  hasContact: boolean;
  name?: string;
  email?: string;
  phone?: string;
  rawText: string;
}

export interface IntentAnalysisResult {
  intent: TonyIntentState;
  confidence: number;
  extractedContact?: ContactExtractionResult;
  isDeclineOrSkip: boolean;
  suggestedPromptResponse?: string;
}

/**
 * Extracts email, phone, and potential visitor name from message.
 */
export function extractContactDetails(text: string): ContactExtractionResult {
  const clean = text.trim();

  // 1. Email extraction
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = clean.match(emailRegex);
  const email = emailMatch ? emailMatch[1].toLowerCase() : undefined;

  // 2. Phone extraction (Kenyan local 07xx/01xx, +254..., or international format)
  const phoneRegex = /(?:(?:\+254|254|0)[17]\d{8})|(?:\+\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,9}/;
  const phoneMatch = clean.match(phoneRegex);
  // Ensure match is at least 9 numeric digits
  let phone: string | undefined = undefined;
  if (phoneMatch) {
    const digitsOnly = phoneMatch[0].replace(/\D/g, "");
    if (digitsOnly.length >= 9) {
      phone = phoneMatch[0].trim();
    }
  }

  // 3. Name extraction ("My name is John Doe", "I am Alice", "Naitwa Brian")
  const nameRegex = /(?:my name is|i am|this is|call me|naitwa)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i;
  const nameMatch = clean.match(nameRegex);
  const name = nameMatch ? nameMatch[1].trim() : undefined;

  const hasContact = Boolean(email || phone);

  return {
    hasContact,
    name,
    email,
    phone,
    rawText: clean,
  };
}

/**
 * Checks if the user is explicitly declining or skipping lead capture.
 */
export function isVisitorDecliningLeadCapture(text: string): boolean {
  const normalized = text.toLowerCase().trim();
  const declinePatterns = [
    /^no\b/,
    /^not now\b/,
    /^skip\b/,
    /^no thanks\b/,
    /^no thank you\b/,
    /^later\b/,
    /^hapana\b/,
    /^baadaye\b/,
    /^sitaki\b/,
    /^don't ask\b/,
    /^just answer\b/,
  ];

  return declinePatterns.some((pattern) => pattern.test(normalized));
}

/**
 * Classifies visitor message into one of four deterministic intent states (TDD Sheet 085):
 * 1. INFORMATIONAL: General questions, stack definitions, agency overview.
 * 2. CONSIDERING: Pricing exploration, comparing options, timeline inquiries.
 * 3. HIGH_INTENT: Direct quote requests, proposal requests, project initiation, callback bookings.
 * 4. HANDOFF_REQUESTED: Explicit human / agent request.
 */
export function classifyVisitorIntent(
  message: string,
  history: Array<{ role: string; content: string }> = []
): IntentAnalysisResult {
  const query = message.toLowerCase().trim();
  const extractedContact = extractContactDetails(message);
  const isDeclineOrSkip = isVisitorDecliningLeadCapture(message);

  // If visitor provided contact details directly, consider this HIGH_INTENT or HANDOFF response
  if (extractedContact.hasContact) {
    return {
      intent: "HIGH_INTENT",
      confidence: 1.0,
      extractedContact,
      isDeclineOrSkip: false,
    };
  }

  // 1. Check for Human Handoff / Escalation (Sheet 087)
  const handoffRegex = /\b(human|person|agent|real person|talk to someone|speak with|live chat|representative|specialist|mtu|mwanadamu|ongea na mtu|zungumza na mtu)\b/i;
  if (handoffRegex.test(query)) {
    return {
      intent: "HANDOFF_REQUESTED",
      confidence: 0.95,
      extractedContact,
      isDeclineOrSkip,
    };
  }

  // 2. Check for High Intent Commercial Actions (Sheet 085)
  // - Requesting a quote, proposal, project start, booking a call, formal scope
  const highIntentRegex = /\b(get a quote|send me a quote|formal quote|quotation|proposal|send proposal|start a project|hire you|build my|develop my|work with you|book a call|call me|schedule a demo|callback|demonstration|brief our project|tuma nukuu|anza mradi|taka kuanza|nipigie simu|tuma bei)\b/i;
  if (highIntentRegex.test(query)) {
    return {
      intent: "HIGH_INTENT",
      confidence: 0.9,
      extractedContact,
      isDeclineOrSkip,
    };
  }

  // 3. Check for Considering / Pricing Exploration (Sheet 086)
  // - Asking about rates, timeline, services, comparison without immediate purchase intent
  const consideringRegex = /\b(price|pricing|cost|how much|rates|budget|timeline|how long|process|compare|difference between|ksh|kes|gharama|bei gani|kiasi gani|inachukua muda gani)\b/i;
  if (consideringRegex.test(query)) {
    return {
      intent: "CONSIDERING",
      confidence: 0.85,
      extractedContact,
      isDeclineOrSkip,
    };
  }

  // 4. Default: Informational
  return {
    intent: "INFORMATIONAL",
    confidence: 0.8,
    extractedContact,
    isDeclineOrSkip,
  };
}

/**
 * Transactionally creates a Lead in the CRM when a visitor provides contact details
 * in chat, and links the lead to the active ChatConversation (TDD Sheet 085 & 087).
 */
export async function captureLeadFromChat(params: {
  conversationId: string;
  contact: ContactExtractionResult;
  lastVisitorMessage: string;
  route?: string;
}): Promise<{
  success: boolean;
  leadId?: string;
  referenceCode?: string;
  isDuplicate?: boolean;
}> {
  const { conversationId, contact, lastVisitorMessage, route } = params;

  if (!contact.email && !contact.phone) {
    return { success: false };
  }

  const rawEmail = contact.email || `visitor-${conversationId.slice(-6)}@chat.megascriptdigital.co.ke`;
  const normalizedEmail = rawEmail.toLowerCase();
  const name = contact.name || "Chat Visitor";
  const phone = contact.phone || null;

  // 5-minute deduplication check
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const existingLead = await db.lead.findFirst({
    where: {
      normalizedEmail,
      sourceChannel: "tony-chat",
      createdAt: { gte: fiveMinutesAgo },
    },
  });

  if (existingLead) {
    // Link to conversation if not already linked
    await db.chatConversation.update({
      where: { id: conversationId },
      data: { leadId: existingLead.id },
    });

    return {
      success: true,
      leadId: existingLead.id,
      referenceCode: existingLead.referenceCode,
      isDuplicate: true,
    };
  }

  const referenceCode = await generateReferenceCode();

  const newLead = await db.$transaction(async (tx) => {
    // 1. Create Lead record
    const lead = await tx.lead.create({
      data: {
        referenceCode,
        name,
        email: rawEmail,
        normalizedEmail,
        phone,
        topic: "Web Development & SEO", // Default topic for chat enquiries
        message: `Chat Inquiry: ${lastVisitorMessage}`,
        status: LeadStatus.NEW,
        sourceChannel: "tony-chat",
        landingPage: route || "/chat",
      },
    });

    // 2. Link to ChatConversation
    await tx.chatConversation.update({
      where: { id: conversationId },
      data: { leadId: lead.id },
    });

    // 3. Create Lead Event
    await tx.leadEvent.create({
      data: {
        leadId: lead.id,
        eventType: "CHAT_CONVERSATION_HANDOFF",
        description: `Lead qualified and captured via Tony AI chat assistant (Conversation ID: ${conversationId})`,
      },
    });

    // 4. Create UTM Attribution for chat lead (Sheet 073 & 121)
    await tx.uTMAttribution.create({
      data: {
        leadId: lead.id,
        utmSource: "tony-chat",
        utmMedium: "chat",
        landingPath: route || "/chat",
        firstTouchSource: "tony-chat",
        firstTouchMedium: "chat",
        firstTouchLanding: route || "/chat",
        firstTouchTimestamp: new Date(),
        lastTouchSource: "tony-chat",
        lastTouchMedium: "chat",
        lastTouchLanding: route || "/chat",
        lastTouchTimestamp: new Date(),
      },
    });

    return lead;
  });

  return {
    success: true,
    leadId: newLead.id,
    referenceCode: newLead.referenceCode,
    isDuplicate: false,
  };
}
