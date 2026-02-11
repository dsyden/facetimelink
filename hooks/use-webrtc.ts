"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import {
  joinSignalingChannel,
  sendSignal,
  leaveSignalingChannel,
  type SignalingMessage,
} from "@/lib/signaling";
import {
  createPeerConnection,
  createOffer,
  handleOffer,
  handleAnswer,
  addIceCandidate,
  createDataChannel,
} from "@/lib/webrtc";

export type ConnectionState =
  | "waiting"
  | "connecting"
  | "connected"
  | "disconnected"
  | "room-closed"
  | "room-full"
  | "kicked"
  | "error";

export type Role = "host" | "guest";

function isKickedFromRoom(roomId: string): boolean {
  try {
    return localStorage.getItem(`kicked:${roomId}`) === "1";
  } catch {
    return false;
  }
}

function markKickedFromRoom(roomId: string): void {
  try {
    localStorage.setItem(`kicked:${roomId}`, "1");
  } catch {
    // localStorage unavailable
  }
}

export function useWebRTC(roomId: string, localStream: MediaStream | null) {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>(() =>
      isKickedFromRoom(roomId) ? "kicked" : "waiting"
    );
  const [role, setRole] = useState<Role>("host");

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const iceCandidateBuffer = useRef<RTCIceCandidateInit[]>([]);
  const remoteDescriptionSet = useRef(false);
  const hasCreatedOffer = useRef(false);
  const roleRef = useRef<Role>("host");

  const cleanupPeer = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    remoteDescriptionSet.current = false;
    iceCandidateBuffer.current = [];
    setRemoteStream(null);
    setDataChannel(null);
  }, []);

  const cleanupAll = useCallback(() => {
    cleanupPeer();
    if (channelRef.current) {
      leaveSignalingChannel(channelRef.current);
      channelRef.current = null;
    }
    hasCreatedOffer.current = false;
  }, [cleanupPeer]);

  const leave = useCallback(() => {
    if (channelRef.current) {
      const msgType = roleRef.current === "host" ? "host-left" : "user-left";
      sendSignal(channelRef.current, { type: msgType });
    }
    cleanupAll();
    setConnectionState("disconnected");
  }, [cleanupAll]);

  const kick = useCallback(() => {
    if (channelRef.current) {
      sendSignal(channelRef.current, { type: "kick" });
    }
    // Reset peer so host goes back to waiting for a new guest
    cleanupPeer();
    hasCreatedOffer.current = false;
    setConnectionState("waiting");
  }, [cleanupPeer]);

  useEffect(() => {
    if (!localStream || !roomId) return;

    // Don't connect if kicked from this room (state already initialized as "kicked")
    if (isKickedFromRoom(roomId)) return;

    function initPeerConnection() {
      const pc = createPeerConnection({
        onTrack: (stream) => setRemoteStream(stream),
        onIceCandidate: (candidate) => {
          if (channelRef.current) {
            sendSignal(channelRef.current, {
              type: "ice-candidate",
              candidate,
            });
          }
        },
        onDataChannel: (channel) => {
          setDataChannel(channel);
        },
        onConnectionStateChange: (state) => {
          if (state === "connected") {
            setConnectionState("connected");
          } else if (state === "disconnected" || state === "failed") {
            setConnectionState("disconnected");
          }
        },
      });

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
        });
      }

      pcRef.current = pc;
      return pc;
    }

    async function handleSignalingMessage(message: SignalingMessage) {
      switch (message.type) {
        case "user-joined": {
          if (hasCreatedOffer.current) {
            if (channelRef.current) {
              sendSignal(channelRef.current, { type: "room-full" });
            }
            return;
          }

          // We were here first — we are the host, they are the guest
          hasCreatedOffer.current = true;
          roleRef.current = "host";
          setRole("host");
          setConnectionState("connecting");

          const pc = pcRef.current ?? initPeerConnection();
          const dc = createDataChannel(pc, "chat");
          setDataChannel(dc);

          const offer = await createOffer(pc);
          if (channelRef.current) {
            sendSignal(channelRef.current, { type: "sdp-offer", sdp: offer });
          }
          break;
        }

        case "sdp-offer": {
          // We received an offer — we are the guest
          roleRef.current = "guest";
          setRole("guest");
          setConnectionState("connecting");

          const pc = pcRef.current ?? initPeerConnection();
          const answer = await handleOffer(pc, message.sdp);
          remoteDescriptionSet.current = true;

          for (const candidate of iceCandidateBuffer.current) {
            await addIceCandidate(pc, candidate);
          }
          iceCandidateBuffer.current = [];

          if (channelRef.current) {
            sendSignal(channelRef.current, {
              type: "sdp-answer",
              sdp: answer,
            });
          }
          break;
        }

        case "sdp-answer": {
          const pc = pcRef.current;
          if (!pc) return;
          await handleAnswer(pc, message.sdp);
          remoteDescriptionSet.current = true;

          for (const candidate of iceCandidateBuffer.current) {
            await addIceCandidate(pc, candidate);
          }
          iceCandidateBuffer.current = [];
          break;
        }

        case "ice-candidate": {
          const pc = pcRef.current;
          if (!pc) return;

          if (remoteDescriptionSet.current) {
            await addIceCandidate(pc, message.candidate);
          } else {
            iceCandidateBuffer.current.push(message.candidate);
          }
          break;
        }

        case "room-full": {
          setConnectionState("room-full");
          break;
        }

        case "user-left": {
          // Guest left — host resets to waiting
          cleanupPeer();
          hasCreatedOffer.current = false;
          setConnectionState("waiting");
          // Re-init peer connection so tracks are ready for next guest
          initPeerConnection();
          break;
        }

        case "host-left": {
          // Host left — room is destroyed
          cleanupPeer();
          hasCreatedOffer.current = false;
          setConnectionState("room-closed");
          break;
        }

        case "kick": {
          // We got kicked — store in localStorage so we can't rejoin
          markKickedFromRoom(roomId);
          cleanupPeer();
          hasCreatedOffer.current = false;
          setConnectionState("kicked");
          break;
        }
      }
    }

    initPeerConnection();

    const channel = joinSignalingChannel(roomId, handleSignalingMessage);
    channelRef.current = channel;

    const handleBeforeUnload = () => {
      if (channelRef.current) {
        const msgType =
          roleRef.current === "host" ? "host-left" : "user-left";
        sendSignal(channelRef.current, { type: msgType });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      cleanupAll();
    };
  }, [localStream, roomId, cleanupAll, cleanupPeer]);

  return { remoteStream, dataChannel, connectionState, role, leave, kick };
}
