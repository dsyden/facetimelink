"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ConnectionState } from "@/hooks/use-webrtc";

interface ConnectionStatusProps {
  state: ConnectionState;
  roomId: string;
}

export function ConnectionStatus({ state, roomId }: ConnectionStatusProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = useCallback(() => {
    const url = `${window.location.origin}/${roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [roomId]);

  if (state === "connected") return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
      <div className="text-center space-y-3">
        {state === "waiting" && (
          <>
            <p className="text-white text-lg font-medium">
              Waiting for someone to join...
            </p>
            <p className="text-zinc-400 text-sm">
              Share this room code: <span className="text-white font-mono">{roomId}</span>
            </p>
            <Button onClick={copyLink} variant="secondary" size="sm">
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </>
        )}

        {state === "connecting" && (
          <p className="text-white text-lg font-medium">Connecting...</p>
        )}

        {state === "disconnected" && (
          <>
            <p className="text-white text-lg font-medium">Peer disconnected</p>
            <Link href="/">
              <Button variant="secondary" size="sm">
                Back to Home
              </Button>
            </Link>
          </>
        )}

        {state === "room-closed" && (
          <>
            <p className="text-white text-lg font-medium">
              Room no longer exists
            </p>
            <p className="text-zinc-400 text-sm">
              The host has closed this room.
            </p>
            <Link href="/">
              <Button variant="secondary" size="sm">
                Back to Home
              </Button>
            </Link>
          </>
        )}

        {state === "room-full" && (
          <>
            <p className="text-white text-lg font-medium">Room is full</p>
            <p className="text-zinc-400 text-sm">
              This room already has two participants.
            </p>
            <Link href="/">
              <Button variant="secondary" size="sm">
                Back to Home
              </Button>
            </Link>
          </>
        )}

        {state === "kicked" && (
          <>
            <p className="text-white text-lg font-medium">
              You have been kicked from this chat
            </p>
            <Link href="/">
              <Button variant="secondary" size="sm">
                Back to Home
              </Button>
            </Link>
          </>
        )}

        {state === "error" && (
          <>
            <p className="text-white text-lg font-medium">
              Connection failed
            </p>
            <p className="text-zinc-400 text-sm">
              Could not establish a connection. Try a different network.
            </p>
            <Link href="/">
              <Button variant="secondary" size="sm">
                Back to Home
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
