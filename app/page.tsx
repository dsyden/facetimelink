"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateRoomId } from "@/lib/room-id";

export default function Home() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");

  function handleCreate() {
    const roomId = generateRoomId();
    router.push(`/room/${roomId}`);
  }

  function handleJoin() {
    const code = joinCode.trim();
    if (!code) return;

    // Support full URLs or just the room code
    const match = code.match(/\/room\/([a-z]+-[a-z]+-\d+)/);
    const roomId = match ? match[1] : code;
    router.push(`/room/${roomId}`);
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-zinc-950 border-zinc-800">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">
            FaceTimeLink
          </CardTitle>
          <p className="text-zinc-400 text-sm">
            Private video calls with a shareable link
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleCreate}
            className="w-full h-12 text-lg"
            size="lg"
          >
            Create Room
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-zinc-500 text-sm">or join a room</span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleJoin();
            }}
            className="flex gap-2"
          >
            <Input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="e.g. red-moon-12"
              className="flex-1 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
            />
            <Button type="submit" variant="secondary" disabled={!joinCode.trim()}>
              Join
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
