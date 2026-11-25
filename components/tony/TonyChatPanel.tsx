"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bot,
  X,
  RotateCcw,
  Globe,
  Phone,
  MessageSquare,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { TonyMessageList, MessageItem } from "./TonyMessageList";
import { TonyComposer } from "./TonyComposer";

interface TonyChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: MessageItem[];
  isLoading: boolean;
  language: string;
  isHandoffRequested: boolean;
  onSendMessage: (message: string) => void;
  onResetConversation: () => void;
  onToggleLanguage: () => void;
}

export function TonyChatPanel({
  isOpen,
  onClose,
  messages,
  isLoading,
  language,
  isHandoffRequested,
  onSendMessage,
  onResetConversation,
  onToggleLanguage,
}: TonyChatPanelProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const isSwahili = language === "sw";

  const handleConfirmReset = () => {
    setShowResetConfirm(false);
    onResetConversation();
  };

  return (
    <div
      role="dialog"
      aria-label="Tony AI Assistant Chat Window"
      className="fixed left-4 bottom-20 z-40 w-[360px] sm:w-[390px] max-w-[calc(100vw-32px)] h-[540px] max-h-[calc(100vh-100px)] rounded-3xl border border-surface-border bg-surface shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-150 print:hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-surface-subtle/50">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <Bot className="h-4 w-4" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm font-bold text-foreground">Tony</h2>
              <span className="rounded-full bg-primary/10 px-1.5 py-0.2 text-[9px] font-bold text-primary">
                Stage 14
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              MegaScript Digital Assistant
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={onToggleLanguage}
            title={isSwahili ? "Badilisha lugha iwe Kiingereza" : "Switch language to Kiswahili"}
            aria-label={isSwahili ? "Badilisha lugha iwe Kiingereza" : "Switch language to Kiswahili"}
            className="flex items-center gap-1 rounded-lg border border-surface-border bg-surface px-2 py-1 text-[11px] font-bold text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
          >
            <Globe className="h-3 w-3" />
            <span>{isSwahili ? "SW" : "EN"}</span>
          </button>

          {/* Reset Conversation */}
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            title={isSwahili ? "Futa mazungumzo" : "Reset conversation"}
            aria-label={isSwahili ? "Futa mazungumzo" : "Reset conversation"}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-surface-border bg-surface text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* Close Panel */}
          <button
            type="button"
            onClick={onClose}
            title={isSwahili ? "Funga dirisha" : "Close window"}
            aria-label={isSwahili ? "Funga dirisha" : "Close window"}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-surface-border bg-surface text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Reset Confirmation Overlay */}
      {showResetConfirm && (
        <div className="absolute inset-x-0 top-[57px] z-50 p-4 border-b border-surface-border bg-surface shadow-md animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-start gap-2.5 mb-3">
            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-foreground block font-bold">
                {isSwahili ? "Futa mazungumzo haya?" : "Reset this conversation?"}
              </strong>
              <p className="text-muted-foreground text-[11px] mt-0.5 leading-relaxed">
                {isSwahili
                  ? "Historia ya mazungumzo ya sasa itafungwa na kuanza kikao kipya."
                  : "This will archive current messages and start a fresh session."}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className="px-2.5 py-1 rounded-lg border border-surface-border text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSwahili ? "Ghairi" : "Cancel"}
            </button>
            <button
              type="button"
              onClick={handleConfirmReset}
              className="px-2.5 py-1 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              {isSwahili ? "Futa na Anza Upya" : "Reset & Restart"}
            </button>
          </div>
        </div>
      )}

      {/* Human Handoff Notice Banner */}
      {isHandoffRequested && (
        <div className="bg-primary/10 border-b border-primary/20 px-3.5 py-2 flex items-center justify-between text-xs text-primary">
          <div className="flex items-center gap-1.5 font-medium">
            <Phone className="h-3 w-3" />
            <span>
              {isSwahili ? "Usaidizi wa moja kwa moja:" : "Direct human assistance:"}{" "}
              <strong>+254 712 345 678</strong>
            </span>
          </div>
          <Link
            href="/contact"
            onClick={onClose}
            className="font-bold underline hover:opacity-80 inline-flex items-center gap-0.5 text-[11px]"
          >
            <span>{isSwahili ? "Fomu" : "Form"}</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </Link>
        </div>
      )}

      {/* Message Transcript */}
      <TonyMessageList
        messages={messages}
        isLoading={isLoading}
        language={language}
        onSelectPrompt={onSendMessage}
      />

      {/* Composer */}
      <TonyComposer
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        language={language}
      />
    </div>
  );
}
