"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute bottom-0 left-0 right-0 p-2 pointer-events-auto"
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={disabled ? "Waiting for connection..." : "Type a message..."}
        disabled={disabled}
        className="bg-black/30 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30"
      />
    </form>
  );
}
