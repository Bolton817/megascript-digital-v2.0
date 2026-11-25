"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { TonyLauncher } from "./TonyLauncher";
import { TonyChatPanel } from "./TonyChatPanel";
import { MessageItem } from "./TonyMessageList";

export function TonyWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [language, setLanguage] = useState<string>("en");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHandoffRequested, setIsHandoffRequested] = useState<boolean>(false);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);

  // Initialize language from localStorage on client mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("megascript_chat_lang");
      if (savedLang === "sw" || savedLang === "en") {
        setLanguage(savedLang);
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  // Fetch or create conversation on first open or mount
  const initializeConversation = useCallback(async (langToUse: string) => {
    try {
      const res = await fetch(`/api/tony/conversation?lang=${langToUse}`);
      const data = await res.json();

      if (data.success && data.conversation) {
        setConversationId(data.conversation.id);
        setMessages(data.conversation.messages || []);
        setIsHandoffRequested(data.conversation.status === "HANDOFF_REQUESTED");
        setHasInitialized(true);
      }
    } catch (err) {
      console.error("[TonyWidget] Failed to initialize conversation:", err);
    }
  }, []);

  useEffect(() => {
    if (!hasInitialized) {
      initializeConversation(language);
    }
  }, [hasInitialized, language, initializeConversation]);

  // Handle escape key to close widget
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleToggleLanguage = () => {
    const nextLang = language === "en" ? "sw" : "en";
    setLanguage(nextLang);
    try {
      localStorage.setItem("megascript_chat_lang", nextLang);
    } catch {
      // Ignore localStorage write errors
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // If conversation ID is not yet ready, initialize first
    let activeConvId = conversationId;
    if (!activeConvId) {
      try {
        const res = await fetch(`/api/tony/conversation?lang=${language}`);
        const data = await res.json();
        if (data.success && data.conversation) {
          activeConvId = data.conversation.id;
          setConversationId(activeConvId);
        }
      } catch {
        return;
      }
    }

    if (!activeConvId) return;

    // Optimistic user message append
    const tempId = `temp-${Date.now()}`;
    const optimisticUserMsg: MessageItem = {
      id: tempId,
      role: "user",
      content: text.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUserMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/tony/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConvId,
          message: text.trim(),
          language,
          route: pathname,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => {
          // Replace temp user message with persisted one and append assistant reply
          const filtered = prev.filter((m) => m.id !== tempId);
          return [
            ...filtered,
            {
              id: data.userMessage.id,
              role: data.userMessage.role,
              content: data.userMessage.content,
              createdAt: data.userMessage.createdAt,
            },
            {
              id: data.assistantMessage.id,
              role: data.assistantMessage.role,
              content: data.assistantMessage.content,
              createdAt: data.assistantMessage.createdAt,
              model: data.assistantMessage.model,
              latencyMs: data.assistantMessage.latencyMs,
            },
          ];
        });

        if (data.isHandoffRequested) {
          setIsHandoffRequested(true);
        }
      } else {
        // Show error message
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content:
              language === "sw"
                ? "Samahani, kulikuwa na tatizo la kuwasiliana na mfumo. Tafadhali jaribu tena."
                : "Apologies, there was an error processing your message. Please try again.",
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error("[TonyWidget] Message send exception:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content:
            language === "sw"
              ? "Hitilafu ya mtandao. Tafadhali angalia muunganisho wako."
              : "Network connection error. Please check your connection and try again.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = async () => {
    if (!conversationId) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/tony/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset",
          conversationId,
          language,
        }),
      });

      const data = await res.json();
      if (data.success && data.conversation) {
        setConversationId(data.conversation.id);
        setMessages(data.conversation.messages || []);
        setIsHandoffRequested(false);
      }
    } catch (err) {
      console.error("[TonyWidget] Reset error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TonyLauncher isOpen={isOpen} onToggle={toggleOpen} />
      <TonyChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isLoading={isLoading}
        language={language}
        isHandoffRequested={isHandoffRequested}
        onSendMessage={handleSendMessage}
        onResetConversation={handleResetConversation}
        onToggleLanguage={handleToggleLanguage}
      />
    </>
  );
}
