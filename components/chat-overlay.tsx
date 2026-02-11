"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/hooks/use-chat";

interface ChatOverlayProps {
  messages: ChatMessage[];
}

export function ChatOverlay({ messages }: ChatOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="absolute inset-0 bottom-12 overflow-hidden pointer-events-none">
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-y-auto scrollbar-none chat-fade-mask"
      >
        {/* Spacer pushes messages to the bottom */}
        <div className="min-h-full" />
        <div className="flex flex-col gap-1.5 px-4 pb-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="text-white text-sm font-medium max-w-[85%]"
              style={{
                textShadow:
                  "0 1px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)",
              }}
            >
              <span className="mr-1">{msg.emoji}</span>
              {msg.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
