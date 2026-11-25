"use client";

import React, { useEffect, useRef } from "react";
import { Bot, User, Clock, ArrowRight } from "lucide-react";

export interface MessageItem {
  id: string;
  role: "user" | "assistant" | "system" | string;
  content: string;
  createdAt: string | Date;
  model?: string | null;
  latencyMs?: number | null;
}

interface TonyMessageListProps {
  messages: MessageItem[];
  isLoading: boolean;
  language: string;
  onSelectPrompt: (prompt: string) => void;
}

const QUICK_PROMPTS_EN = [
  "What services do you offer?",
  "What is your pricing?",
  "Where is your office located?",
  "Speak with a human specialist",
];

const QUICK_PROMPTS_SW = [
  "Mnafanya huduma zipi?",
  "Bei zenu zikoje?",
  "Ofisi yenu iko wapi?",
  "Kuunganishwa na mtaalamu",
];

function formatTime(dateVal: string | Date): string {
  try {
    const d = new Date(dateVal);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function TonyMessageList({
  messages,
  isLoading,
  language,
  onSelectPrompt,
}: TonyMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 1 || isLoading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const quickPrompts = language === "sw" ? QUICK_PROMPTS_SW : QUICK_PROMPTS_EN;
  const showQuickPrompts = messages.length <= 1 && !isLoading;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Messages */}
      {messages.map((msg) => {
        const isUser = msg.role === "user";
        return (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              isUser ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                isUser
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-muted border border-surface-border text-primary shadow-sm"
              }`}
            >
              {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>

            {/* Bubble */}
            <div
              className={`flex flex-col ${
                isUser ? "items-end" : "items-start"
              } max-w-[82%]`}
            >
              <div
                className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  isUser
                    ? "bg-primary text-white rounded-tr-xs shadow-sm"
                    : "bg-surface-subtle text-foreground border border-surface-border rounded-tl-xs shadow-sm"
                }`}
              >
                {msg.content}
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-muted-foreground">
                <Clock className="h-2.5 w-2.5" />
                <span>{formatTime(msg.createdAt)}</span>
                {msg.latencyMs && msg.latencyMs > 0 && !isUser ? (
                  <span>• {msg.latencyMs}ms</span>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing Indicator */}
      {isLoading && (
        <div className="flex items-start gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-muted border border-surface-border text-primary text-xs font-bold shadow-sm">
            <Bot className="h-3.5 w-3.5" />
          </div>
          <div className="rounded-2xl rounded-tl-xs border border-surface-border bg-surface-subtle px-4 py-3 shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce" />
            </div>
          </div>
        </div>
      )}

      {/* Quick Prompts */}
      {showQuickPrompts && (
        <div className="pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2 px-1">
            {language === "sw" ? "Maswali Yanayoulizwa Sana" : "Suggested Topics"}
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onSelectPrompt(prompt)}
                className="flex items-center justify-between text-left px-3 py-2 rounded-xl border border-surface-border bg-surface-subtle text-xs text-foreground hover:bg-surface-muted hover:border-primary/40 hover:text-primary transition-colors group"
              >
                <span>{prompt}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
