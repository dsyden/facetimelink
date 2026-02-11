import { supabase } from "./supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type SignalingMessage =
  | { type: "user-joined" }
  | { type: "sdp-offer"; sdp: RTCSessionDescriptionInit }
  | { type: "sdp-answer"; sdp: RTCSessionDescriptionInit }
  | { type: "ice-candidate"; candidate: RTCIceCandidateInit }
  | { type: "room-full" }
  | { type: "user-left" }
  | { type: "host-left" }
  | { type: "kick" };

export function joinSignalingChannel(
  roomId: string,
  onMessage: (message: SignalingMessage) => void
): RealtimeChannel {
  const channel = supabase.channel(`room:${roomId}`);

  channel
    .on("broadcast", { event: "signal" }, ({ payload }) => {
      onMessage(payload as SignalingMessage);
    })
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.send({
          type: "broadcast",
          event: "signal",
          payload: { type: "user-joined" } satisfies SignalingMessage,
        });
      }
    });

  return channel;
}

export function sendSignal(
  channel: RealtimeChannel,
  message: SignalingMessage
): void {
  channel.send({
    type: "broadcast",
    event: "signal",
    payload: message,
  });
}

export function leaveSignalingChannel(channel: RealtimeChannel): void {
  supabase.removeChannel(channel);
}
