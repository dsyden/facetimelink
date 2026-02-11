"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VideoBoxProps {
  stream: MediaStream | null;
  muted?: boolean;
  label?: string;
  mirrored?: boolean;
  isVideoEnabled?: boolean;
  children?: React.ReactNode;
}

export function VideoBox({
  stream,
  muted = false,
  label,
  mirrored = false,
  isVideoEnabled = true,
  children,
}: VideoBoxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative w-full h-full bg-zinc-900 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className={cn(
          "w-full h-full object-cover",
          mirrored && "scale-x-[-1]",
          !isVideoEnabled && "hidden"
        )}
      />
      {!isVideoEnabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
          <div className="w-20 h-20 rounded-full bg-zinc-700 flex items-center justify-center">
            <span className="text-zinc-400 text-2xl font-semibold">
              {label?.[0]?.toUpperCase() ?? "?"}
            </span>
          </div>
        </div>
      )}
      {label && (
        <span className="absolute top-2 left-2 text-white/70 text-xs bg-black/40 rounded px-1.5 py-0.5">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
