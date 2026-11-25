import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/features/auth/rbac";
import {
  getAdminConversationDetail,
  updateAdminConversationStatus,
} from "@/server/services/tony/conversation";
import { logAuditEvent } from "@/server/services/audit";
import { ConversationStatus } from "@prisma/client";
import { SessionInactivityGuard } from "@/components/admin/SessionInactivityGuard";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Bot,
  User,
  Clock,
  Shield,
  Phone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Cpu,
  Hash,
} from "lucide-react";
import { revalidatePath } from "next/cache";

interface ConversationDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ConversationDetailPage({
  params,
}: ConversationDetailPageProps) {
  const { user } = await requirePermission("chat.read", { isQualifyingActivity: true });
  const { id } = await params;

  const conversation = await getAdminConversationDetail(id);

  if (!conversation) {
    notFound();
  }

  // Audit transcript inspection
  await logAuditEvent({
    actorId: user.id,
    action: "VIEW_CONVERSATION_TRANSCRIPT",
    targetType: "ChatConversation",
    targetId: id,
    metadata: {
      messageCount: conversation.messages.length,
      status: conversation.status,
    },
  });

  // Server action to update status
  async function handleStatusChange(formData: FormData) {
    "use server";
    await requirePermission("chat.manage", { isQualifyingActivity: true });
    const targetStatus = formData.get("status") as ConversationStatus;
    if (Object.values(ConversationStatus).includes(targetStatus)) {
      await updateAdminConversationStatus(id, targetStatus);
      revalidatePath(`/master/conversations/${id}`);
      revalidatePath("/master/conversations");
    }
  }

  const isHandoff = conversation.status === ConversationStatus.HANDOFF_REQUESTED;
  const isActive = conversation.status === ConversationStatus.ACTIVE;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-12">
      <SessionInactivityGuard />

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Link
              href="/master/conversations"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface border border-border text-foreground hover:bg-surface-muted transition-colors"
              title="Return to conversations list"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Conversation Transcript
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isHandoff
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      : isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {isHandoff
                    ? "Handoff Requested"
                    : isActive
                    ? "Active Session"
                    : "Closed Session"}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-mono text-foreground mt-0.5">
                {conversation.id}
              </h1>
            </div>
          </div>

          {/* Status Change Form */}
          <form action={handleStatusChange} className="flex items-center gap-2">
            {isActive && (
              <Button
                variant="outline"
                size="sm"
                name="status"
                value={ConversationStatus.CLOSED}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Close Conversation
              </Button>
            )}
            {!isHandoff && (
              <Button
                variant="outline"
                size="sm"
                name="status"
                value={ConversationStatus.HANDOFF_REQUESTED}
                className="text-xs text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
              >
                Flag Human Handoff
              </Button>
            )}
            {conversation.status === ConversationStatus.CLOSED && (
              <Button
                variant="outline"
                size="sm"
                name="status"
                value={ConversationStatus.ACTIVE}
                className="text-xs text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
              >
                Reopen Session
              </Button>
            )}
          </form>
        </header>

        {/* Metadata Sidebar / Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl border border-border bg-surface text-xs shadow-sm">
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider mb-1">
              Visitor Token Hash
            </span>
            <div className="font-mono text-foreground truncate" title={conversation.visitorTokenHash}>
              {conversation.visitorTokenHash.slice(0, 16)}...
            </div>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider mb-1">
              Language
            </span>
            <span className="uppercase font-mono font-bold text-foreground">
              {conversation.language === "sw" ? "Kiswahili (SW)" : "English (EN)"}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider mb-1">
              Started At
            </span>
            <span className="text-foreground">
              {new Date(conversation.startedAt).toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider mb-1">
              Total Messages
            </span>
            <span className="font-bold text-foreground">
              {conversation.messages.length} messages
            </span>
          </div>
        </div>

        {/* Linked Lead banner if present */}
        {conversation.lead && (
          <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>
                Linked CRM Lead: <strong>{conversation.lead.name}</strong> ({conversation.lead.email}) • Reference:{" "}
                <code className="font-mono text-primary font-bold">
                  {conversation.lead.referenceCode}
                </code>
              </span>
            </div>
            <Link
              href={`/master/leads`}
              className="text-primary hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>View Lead Details</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        )}

        {/* Transcript Area */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-surface-subtle/50 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Audit Transcript (Chronological)
            </h2>
            <span className="text-[11px] text-muted-foreground">
              Immutable Visitor Audit Store
            </span>
          </div>

          <div className="p-6 space-y-6">
            {conversation.messages.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                No messages recorded in this conversation session.
              </p>
            ) : (
              conversation.messages.map((m, idx) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3 ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                        isUser
                          ? "bg-primary text-white shadow-sm"
                          : "bg-surface-muted border border-surface-border text-primary shadow-sm"
                      }`}
                    >
                      {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    <div
                      className={`flex flex-col ${
                        isUser ? "items-end" : "items-start"
                      } max-w-[85%]`}
                    >
                      <div className="flex items-center gap-2 mb-1 px-1 text-[10px] text-muted-foreground">
                        <span className="font-bold uppercase tracking-wide">
                          {isUser ? "Visitor" : "Tony Assistant"}
                        </span>
                        <span>•</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString()}</span>
                        {m.model && (
                          <span className="font-mono bg-surface-muted px-1 py-0.2 rounded border border-border">
                            {m.model}
                          </span>
                        )}
                        {m.latencyMs !== null && m.latencyMs !== undefined && (
                          <span>• {m.latencyMs}ms</span>
                        )}
                        {m.tokensUsed !== null && m.tokensUsed !== undefined && (
                          <span>• {m.tokensUsed} tokens</span>
                        )}
                      </div>

                      <div
                        className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                          isUser
                            ? "bg-primary text-white rounded-tr-xs shadow-sm"
                            : "bg-surface-subtle text-foreground border border-surface-border rounded-tl-xs shadow-sm"
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
