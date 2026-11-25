import {
  generateVisitorToken,
  hashVisitorToken,
  verifyVisitorOwnership,
} from "../lib/chat/session";
import {
  getOrCreateActiveConversation,
  getConversationTranscript,
  postVisitorMessage,
  resetVisitorConversation,
  markConversationHandoff,
  listAdminConversations,
  getAdminConversationMetrics,
  getAdminConversationDetail,
} from "../server/services/tony/conversation";
import {
  generateMockTonyReply,
  EMOJI_REGEX,
} from "../server/services/tony/mock-provider";
import { db } from "../server/db";
import { ConversationStatus } from "@prisma/client";

async function runStage14Verification() {
  console.log("===============================================================");
  console.log("  MEGASCRIPT DIGITAL - STAGE 14 AUTOMATED VERIFICATION SUITE   ");
  console.log("  Tony Chatbot Interface & Conversation Persistence            ");
  console.log("===============================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}${details ? ` -> ${details}` : ""}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Visitor Session Cryptographic Security & Hashing
    // -------------------------------------------------------------------------
    console.log("--- 1. Visitor Token & Cryptographic Hashing ---");
    const rawTokenA = generateVisitorToken();
    assert(
      typeof rawTokenA === "string" && rawTokenA.length === 64,
      "Generate 32-byte hex visitor token (64 characters)"
    );

    const hashA = hashVisitorToken(rawTokenA);
    assert(
      typeof hashA === "string" && hashA.length === 64,
      "Compute SHA-256 hash of visitor token"
    );

    const hashA2 = hashVisitorToken(rawTokenA);
    assert(hashA === hashA2, "SHA-256 hashing is deterministic");

    const isMatchValid = verifyVisitorOwnership(hashA, rawTokenA);
    assert(isMatchValid, "Timing-safe ownership verification succeeds for authentic token");

    const tamperedToken = rawTokenA.slice(0, -1) + (rawTokenA.slice(-1) === "a" ? "b" : "a");
    const isMatchTampered = verifyVisitorOwnership(hashA, tamperedToken);
    assert(!isMatchTampered, "Timing-safe ownership verification rejects tampered token");

    // -------------------------------------------------------------------------
    // TEST 2: Active Conversation Lifecycle & Automatic Welcome Seeding
    // -------------------------------------------------------------------------
    console.log("\n--- 2. Active Conversation Lifecycle & Welcome Seeding ---");
    const convA = await getOrCreateActiveConversation(hashA, "en");
    assert(!!convA.id, "Active conversation created for Visitor A", `ID: ${convA.id}`);
    assert(convA.status === ConversationStatus.ACTIVE, "Conversation status is ACTIVE");
    assert(convA.language === "en", "Conversation language initialized to 'en'");
    assert(convA.messages.length >= 1, "Welcome message automatically seeded");
    assert(
      convA.messages[0].role === "assistant",
      "First message is from Tony assistant"
    );
    assert(
      !EMOJI_REGEX.test(convA.messages[0].content),
      "Welcome message complies with ZERO EMOJI rule"
    );

    // Calling again returns the exact same conversation (idempotence)
    const convA2 = await getOrCreateActiveConversation(hashA, "en");
    assert(convA2.id === convA.id, "Subsequent handshake returns existing active conversation");

    // -------------------------------------------------------------------------
    // TEST 3: Message Submission & Deterministic Mock Provider
    // -------------------------------------------------------------------------
    console.log("\n--- 3. Message Submission & Mock Provider Logic ---");
    const msgRes1 = await postVisitorMessage({
      conversationId: convA.id,
      visitorTokenHash: hashA,
      content: "What services do you offer?",
      language: "en",
    });

    assert(msgRes1.success, "Visitor message posted successfully");
    if (msgRes1.success) {
      assert(msgRes1.userMessage.role === "user", "User message persisted with role 'user'");
      assert(
        msgRes1.assistantMessage.role === "assistant",
        "Assistant message persisted with role 'assistant'"
      );
      assert(
        msgRes1.assistantMessage.model === "mock-v1",
        "Assistant message tagged with model 'mock-v1'"
      );
      assert(
        (msgRes1.assistantMessage.latencyMs || 0) > 0,
        "Simulated latency recorded",
        `${msgRes1.assistantMessage.latencyMs}ms`
      );
      assert(
        (msgRes1.assistantMessage.tokensUsed || 0) > 0,
        "Token consumption recorded",
        `${msgRes1.assistantMessage.tokensUsed} tokens`
      );
      assert(
        /websites|applications|systems/i.test(msgRes1.assistantMessage.content),
        "Assistant response accurately reflects MegaScript services scope"
      );
      assert(
        !EMOJI_REGEX.test(msgRes1.assistantMessage.content),
        "Assistant services response has 0 emojis"
      );
    }

    // Pricing query
    const msgRes2 = await postVisitorMessage({
      conversationId: convA.id,
      visitorTokenHash: hashA,
      content: "How much is a website?",
      language: "en",
    });
    if (msgRes2.success) {
      assert(
        /35,000|65,000|125,000/i.test(msgRes2.assistantMessage.content),
        "Pricing query returns accurate Kenyan rate ranges (KSh 35,000 - 125,000+)"
      );
      assert(
        !EMOJI_REGEX.test(msgRes2.assistantMessage.content),
        "Pricing response has 0 emojis"
      );
    }

    // Swahili query
    const msgRes3 = await postVisitorMessage({
      conversationId: convA.id,
      visitorTokenHash: hashA,
      content: "Ofisi yenu iko wapi?",
      language: "sw",
    });
    if (msgRes3.success) {
      assert(
        /Bihi Towers|Moi Avenue|Nairobi/i.test(msgRes3.assistantMessage.content),
        "Swahili office location query returns Bihi Towers, Moi Avenue"
      );
      assert(
        !EMOJI_REGEX.test(msgRes3.assistantMessage.content),
        "Swahili response has 0 emojis"
      );
    }

    // -------------------------------------------------------------------------
    // TEST 4: Strict Session Isolation Guarantee
    // -------------------------------------------------------------------------
    console.log("\n--- 4. Strict Visitor Session Isolation ---");
    const rawTokenB = generateVisitorToken();
    const hashB = hashVisitorToken(rawTokenB);

    // Visitor B attempts to read Visitor A's transcript
    const snoopedTranscript = await getConversationTranscript(convA.id, hashB);
    assert(
      snoopedTranscript === null,
      "Visitor B cannot inspect Visitor A's conversation transcript"
    );

    // Visitor B attempts to write a message into Visitor A's conversation
    const snoopedPost = await postVisitorMessage({
      conversationId: convA.id,
      visitorTokenHash: hashB,
      content: "Malicious cross-session message",
    });
    assert(
      !snoopedPost.success && snoopedPost.status === 403,
      "Visitor B rejected when attempting to post into Visitor A's conversation (HTTP 403 Forbidden)"
    );

    // -------------------------------------------------------------------------
    // TEST 5: Human Handoff Trigger
    // -------------------------------------------------------------------------
    console.log("\n--- 5. Human Handoff Triggers ---");
    const handoffMsgRes = await postVisitorMessage({
      conversationId: convA.id,
      visitorTokenHash: hashA,
      content: "I want to speak with a human specialist about a custom enterprise system",
    });

    assert(
      handoffMsgRes.success && handoffMsgRes.isHandoffRequested,
      "Human specialist keyword triggers handoff flag"
    );
    assert(
      handoffMsgRes.success &&
        handoffMsgRes.conversationStatus === ConversationStatus.HANDOFF_REQUESTED,
      "Conversation status transitions to HANDOFF_REQUESTED"
    );
    if (handoffMsgRes.success) {
      assert(
        /\+254 712 345 678/i.test(handoffMsgRes.assistantMessage.content),
        "Assistant provides direct human contact number (+254 712 345 678)"
      );
    }

    // -------------------------------------------------------------------------
    // TEST 6: Reset Conversation Flow
    // -------------------------------------------------------------------------
    console.log("\n--- 6. Conversation Reset & Archival ---");
    const freshConv = await resetVisitorConversation(convA.id, hashA, "en");
    assert(
      freshConv.id !== convA.id,
      "Reset creates a brand new conversation ID",
      `New: ${freshConv.id}`
    );
    assert(
      freshConv.status === ConversationStatus.ACTIVE,
      "New conversation status is ACTIVE"
    );

    const oldConvCheck = await db.chatConversation.findUnique({
      where: { id: convA.id },
    });
    assert(
      oldConvCheck?.status === ConversationStatus.CLOSED,
      "Old conversation status transitioned to CLOSED"
    );
    assert(
      !!oldConvCheck?.closedAt,
      "Old conversation recorded closedAt timestamp"
    );

    // -------------------------------------------------------------------------
    // TEST 7: Zero Emoji Exhaustive Validation
    // -------------------------------------------------------------------------
    console.log("\n--- 7. Exhaustive Zero-Emoji Compliance Check ---");
    const testQueries = [
      "Hello",
      "Habari za asubuhi",
      "What are your prices?",
      "Gharama ya tovuti ni ngapi?",
      "Tell me about your software services",
      "Where is your office located?",
      "Who are you?",
      "Can I talk to a person?",
      "Random technical inquiry",
    ];

    let emojiViolations = 0;
    for (const q of testQueries) {
      const repEn = generateMockTonyReply(q, "en");
      const repSw = generateMockTonyReply(q, "sw");
      if (EMOJI_REGEX.test(repEn.content)) emojiViolations++;
      if (EMOJI_REGEX.test(repSw.content)) emojiViolations++;
    }

    assert(
      emojiViolations === 0,
      `Exhaustive zero-emoji test passed across ${testQueries.length * 2} generated replies (0 violations)`
    );

    // -------------------------------------------------------------------------
    // TEST 8: Operations Console Administration Layer
    // -------------------------------------------------------------------------
    console.log("\n--- 8. Operations Console Admin Queries ---");
    const adminMetrics = await getAdminConversationMetrics();
    assert(
      adminMetrics.totalConversations >= 2,
      "Admin metrics correctly compute total conversations",
      `${adminMetrics.totalConversations} total`
    );
    assert(
      adminMetrics.closedConversations >= 1,
      "Admin metrics reflect closed conversation count",
      `${adminMetrics.closedConversations} closed`
    );
    assert(
      adminMetrics.totalMessages >= 4,
      "Admin metrics reflect total persisted messages count",
      `${adminMetrics.totalMessages} messages`
    );

    const adminList = await listAdminConversations({ pageSize: 10 });
    assert(
      adminList.conversations.length > 0,
      "Admin conversation listing returns paginated conversations"
    );

    const adminDetail = await getAdminConversationDetail(convA.id);
    assert(
      !!adminDetail && adminDetail.messages.length > 0,
      "Admin conversation detail returns full chronological messages"
    );

  } catch (err: any) {
    console.error("Fatal test exception:", err);
    failed++;
  } finally {
    await db.$disconnect();
  }

  console.log("\n===============================================================");
  console.log(`  STAGE 14 VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("===============================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runStage14Verification();
