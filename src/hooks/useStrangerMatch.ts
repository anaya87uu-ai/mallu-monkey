import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

type MatchState = "idle" | "searching" | "matched" | "connected";

interface MatchHook {
  state: MatchState;
  strangerSessionId: string | null;
  channelName: string | null;
  startSearching: () => void;
  stopSearching: () => void;
  skip: () => void;
  onSignal: (callback: (signal: any) => void) => void;
  sendSignal: (signal: any) => void;
}

export function useStrangerMatch(): MatchHook {
  const [state, setState] = useState<MatchState>("idle");
  const [strangerSessionId, setStrangerSessionId] = useState<string | null>(null);
  const [channelName, setChannelName] = useState<string | null>(null);

  const sessionIdRef = useRef(crypto.randomUUID());
  const lobbyRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const signalingRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const signalCallbackRef = useRef<((signal: any) => void) | null>(null);
  const matchedRef = useRef(false);

  const cleanup = useCallback(() => {
    if (signalingRef.current) {
      supabase.removeChannel(signalingRef.current);
      signalingRef.current = null;
    }
    if (lobbyRef.current) {
      supabase.removeChannel(lobbyRef.current);
      lobbyRef.current = null;
    }
    matchedRef.current = false;
    setStrangerSessionId(null);
    setChannelName(null);
  }, []);

  const joinSignalingChannel = useCallback((name: string, strangerId: string) => {
    if (signalingRef.current) {
      supabase.removeChannel(signalingRef.current);
    }

    const ch = supabase.channel(name, {
      config: { broadcast: { self: false } },
    });

    ch.on("broadcast", { event: "signal" }, ({ payload }) => {
      if (payload.from !== sessionIdRef.current && signalCallbackRef.current) {
        signalCallbackRef.current(payload.signal);
      }
    });

    ch.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        setState("connected");
        setStrangerSessionId(strangerId);
        setChannelName(name);
      }
    });

    signalingRef.current = ch;
  }, []);

  const startSearching = useCallback(() => {
    cleanup();
    matchedRef.current = false;
    setState("searching");

    // Generate new session ID for fresh matching
    sessionIdRef.current = crypto.randomUUID();

    const lobby = supabase.channel("stranger-lobby", {
      config: { presence: { key: sessionIdRef.current } },
    });

    lobby.on("presence", { event: "sync" }, () => {
      if (matchedRef.current) return;

      const presenceState = lobby.presenceState();
      const allUsers = Object.keys(presenceState).filter(
        (id) => id !== sessionIdRef.current
      );

      if (allUsers.length > 0) {
        // Sort to ensure both sides agree on who initiates
        const sorted = [sessionIdRef.current, allUsers[0]].sort();
        const isInitiator = sorted[0] === sessionIdRef.current;
        const strangerId = allUsers[0];
        const chName = `match-${sorted[0]}-${sorted[1]}`;

        matchedRef.current = true;
        setState("matched");

        // Small delay for the non-initiator to ensure channel readiness
        setTimeout(
          () => {
            // Leave lobby
            supabase.removeChannel(lobby);
            lobbyRef.current = null;
            joinSignalingChannel(chName, strangerId);
          },
          isInitiator ? 200 : 600
        );
      }
    });

    lobby.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await lobby.track({ session_id: sessionIdRef.current, joined_at: Date.now() });
      }
    });

    lobbyRef.current = lobby;
  }, [cleanup, joinSignalingChannel]);

  const stopSearching = useCallback(() => {
    cleanup();
    setState("idle");
  }, [cleanup]);

  const skip = useCallback(() => {
    cleanup();
    setState("idle");
    // Auto-start searching again
    setTimeout(() => startSearching(), 300);
  }, [cleanup, startSearching]);

  const onSignal = useCallback((callback: (signal: any) => void) => {
    signalCallbackRef.current = callback;
  }, []);

  const sendSignal = useCallback(
    (signal: any) => {
      signalingRef.current?.send({
        type: "broadcast",
        event: "signal",
        payload: { from: sessionIdRef.current, signal },
      });
    },
    []
  );

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    state,
    strangerSessionId,
    channelName,
    startSearching,
    stopSearching,
    skip,
    onSignal,
    sendSignal,
  };
}
