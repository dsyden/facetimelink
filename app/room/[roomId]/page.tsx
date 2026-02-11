"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback } from "react";
import { useMediaStream } from "@/hooks/use-media-stream";
import { useWebRTC } from "@/hooks/use-webrtc";
import { useChat } from "@/hooks/use-chat";
import { VideoBox } from "@/components/video-box";
import { ChatOverlay } from "@/components/chat-overlay";
import { ChatInput } from "@/components/chat-input";
import { ConnectionStatus } from "@/components/connection-status";
import { MediaControls } from "@/components/media-controls";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const {
    localStream,
    error: mediaError,
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
  } = useMediaStream();
  const { remoteStream, dataChannel, connectionState, role, leave, kick } =
    useWebRTC(roomId, localStream);
  const { messages, sendMessage } = useChat(dataChannel);
  const router = useRouter();

  const handleLeave = useCallback(() => {
    leave();
    router.push("/");
  }, [leave, router]);

  if (mediaError) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-black p-4">
        <div className="text-center space-y-4">
          <p className="text-white text-lg">Camera access is required</p>
          <p className="text-zinc-400 text-sm">{mediaError}</p>
          <Link href="/" className="text-blue-400 underline text-sm">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-dvh bg-black">
      {/* Remote video */}
      <div className="flex-1 min-h-0 min-w-0 flex items-center justify-center">
        <div className="relative aspect-square h-full max-h-250 max-w-[min(100%,1000px)]">
          <VideoBox stream={remoteStream} label="Remote" />
          <ConnectionStatus state={connectionState} roomId={roomId} />
        </div>
      </div>

      {/* Local video */}
      <div className="flex-1 min-h-0 min-w-0 flex items-center justify-center">
        <div className="relative aspect-square h-full max-h-250 max-w-[min(100%,1000px)]">
          <VideoBox stream={localStream} muted mirrored label="You" isVideoEnabled={isVideoEnabled}>
            <ChatOverlay messages={messages} />
            <ChatInput
              onSend={sendMessage}
              disabled={connectionState !== "connected"}
            />
          </VideoBox>
          <MediaControls
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            onToggleVideo={toggleVideo}
            onToggleAudio={toggleAudio}
            onLeave={handleLeave}
            onKick={kick}
            isHost={role === "host"}
            isConnected={connectionState === "connected"}
          />
        </div>
      </div>
    </div>
  );
}
