"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Send, Shield } from "lucide-react";

interface TonyComposerProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  language: string;
}

export function TonyComposer({
  onSendMessage,
  isLoading,
  language,
}: TonyComposerProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxLength = 1000;
  const isSwahili = language === "sw";

  const placeholderText = isSwahili
    ? "Uliza kuhusu tovuti, mifumo, bei..."
    : "Ask Tony about websites, systems, pricing...";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setContent("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // Auto-resize textarea height as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [content]);

  return (
    <div className="p-3 border-t border-surface-border bg-surface-subtle/40">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="relative flex items-end gap-2"
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          disabled={isLoading}
          rows={1}
          aria-label={isSwahili ? "Ujumbe kwa Tony" : "Message to Tony"}
          className="w-full resize-none rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 max-h-[120px] transition-colors leading-relaxed"
        />

        <button
          type="submit"
          disabled={!content.trim() || isLoading}
          aria-label={isSwahili ? "Tuma ujumbe" : "Send message"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm hover:bg-primary-hover active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      {/* Footer Meta & Explicit AI Disclosure (TDD Sheet 089 Task 69) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-1 mt-2 px-1 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <Shield className="h-3 w-3 text-muted-foreground shrink-0" />
          <span>
            {isSwahili ? "Tony ni msaidizi wa AI." : "Tony is an automated AI assistant."}{" "}
            <Link
              href="/privacy"
              className="text-primary hover:underline font-medium inline-block"
            >
              {isSwahili ? "Sera ya Faragha" : "Privacy Policy"}
            </Link>
          </span>
        </div>

        {content.length > 0 && (
          <span className="font-mono text-[9px] tabular-nums">
            {content.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
