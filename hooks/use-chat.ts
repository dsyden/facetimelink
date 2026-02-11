"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "local" | "remote";
  emoji: string;
  timestamp: number;
}

const CHAT_EMOJIS = [
  "🐶", "🐱", "🐻", "🦊", "🐸", "🐵", "🐧", "🐷",
  "🦁", "🐮", "🐰", "🐼", "🐨", "🦄", "🐙", "🐢",
  "🦋", "🐬", "🦜", "🐝", "🦀", "🐳", "🦉", "🐺",
];

function pickEmoji(): string {
  return CHAT_EMOJIS[Math.floor(Math.random() * CHAT_EMOJIS.length)];
}

export function useChat(dataChannel: RTCDataChannel | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const idCounter = useRef(0);

  // Stable emoji for local user and remote user for the session
  const localEmoji = useMemo(() => pickEmoji(), []);
  const remoteEmoji = useRef<string>("");

  useEffect(() => {
    if (!dataChannel) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        // Use the emoji the remote user picked for themselves
        if (remoteEmoji.current === "") {
          remoteEmoji.current = data.emoji || pickEmoji();
        }
        const msg: ChatMessage = {
          id: `remote-${++idCounter.current}`,
          text: data.text,
          sender: "remote",
          emoji: remoteEmoji.current,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, msg]);
      } catch {
        // Ignore malformed messages
      }
    };

    dataChannel.addEventListener("message", handleMessage);
    return () => {
      dataChannel.removeEventListener("message", handleMessage);
    };
  }, [dataChannel]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!dataChannel || dataChannel.readyState !== "open" || !text.trim())
        return;

      dataChannel.send(JSON.stringify({ text: text.trim(), emoji: localEmoji }));

      const msg: ChatMessage = {
        id: `local-${++idCounter.current}`,
        text: text.trim(),
        sender: "local",
        emoji: localEmoji,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, msg]);
    },
    [dataChannel, localEmoji]
  );

  return { messages, sendMessage };
}
