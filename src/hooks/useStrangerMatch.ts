import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

type MatchState = "idle" | "searching" | "matched" | "connected";

export interface StrangerInfo {
  name: string;
  country: string;
  countryCode: string;
}

interface MatchHook {
  state: MatchState;
  strangerSessionId: string | null;
  strangerInfo: StrangerInfo | null;
  channelName: string | null;
  isInitiator: boolean;
  startSearching: (userInfo: { name: string; country: string; countryCode: string }) => void;
  stopSearching: () => void;
  skip: () => void;
  onSignal: (callback: (signal: any) => void) => void;
  sendSignal: (signal: any) => void;
  onStrangerLeft: (callback: () => void) => void;
}

export function useStrangerMatch(): MatchHook {
  const [state, setState] = useState<MatchState>("idle");
  const [strangerSessionId, setStrangerSessionId] = useState<string | null>(null);
  const [strangerInfo, setStrangerInfo] = useState<StrangerInfo | null>(null);
  const [channelName, setChannelName] = useState<string | null>(null);
  const [isInitiator, setIsInitiator] = useState(false);

  const sessionIdRef = useRef(crypto.randomUUID());
  const userInfoRef = useRef<{ name: string; country: string; countryCode: string } | null>(null);
  const lobbyRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const signalingRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const signalCallbackRef = useRef<((signal: any) => void) | null>(null);
  const strangerLeftCallbackRef = useRef<(() => void) | null>(null);
  const matchedRef = useRef(false);
  const retryIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (retryIntervalRef.current) {
      clearInterval(retryIntervalRef.current);
      retryIntervalRef.current = null;
    }
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
    setStrangerInfo(null);
    setChannelName(null);
  }, []);

  const joinSignalingChannel = useCallback(
    (name: string, strangerId: string, initiator: boolean) => {
      if (signalingRef.current) {
        supabase.removeChannel(signalingRef.current);
      }

      const ch = supabase.channel(name, {
        config: { broadcast: { self: false, ack: true } },
      });

      ch.on("broadcast", { event: "signal" }, ({ payload }) => {
        if (payload.from !== sessionIdRef.current && signalCallbackRef.current) {
          signalCallbackRef.current(payload.signal);
        }
      });

      ch.on("broadcast", { event: "leave" }, ({ payload }) => {
        if (payload.from !== sessionIdRef.current) {
          console.log("[Match] Stranger left the channel");
          if (strangerLeftCallbackRef.current) {
            strangerLeftCallbackRef.current();
          }
        }
      });

      ch.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setState("connected");
          setStrangerSessionId(strangerId);
          setChannelName(name);
          setIsInitiator(initiator);
        }
      });

      signalingRef.current = ch;
    },
    []
  );

  const startSearching = useCallback((userInfo: { name: string; country: string; countryCode: string }) => {
    cleanup();
    matchedRef.current = false;
    setState("searching");
    userInfoRef.current = userInfo;

    sessionIdRef.current = crypto.randomUUID();

    const lobby = supabase.channel("stranger-lobby", {
      config: { presence: { key: sessionIdRef.current } },
    });

    const tryMatch = () => {
      if (matchedRef.current) return;

      const presenceState = lobby.presenceState();
      const allUsers = Object.keys(presenceState).filter(
        (id) => id !== sessionIdRef.current
      );

      if (allUsers.length > 0) {
        const strangerId = allUsers[Math.floor(Math.random() * allUsers.length)];
        const sorted = [sessionIdRef.current, strangerId].sort();
        const chName = `match-${sorted[0]}-${sorted[1]}`;
        const initiator = sorted[0] === sessionIdRef.current;

        // Extract stranger's info from presence
        const strangerPresence = presenceState[strangerId];
        if (strangerPresence && strangerPresence.length > 0) {
          const sp = strangerPresence[0] as any;
          setStrangerInfo({
            name: sp.name || "Stranger",
            country: sp.country || "Unknown",
            countryCode: sp.country_code || "",
          });
        }

        matchedRef.current = true;
        setState("matched");

        supabase.removeChannel(lobby);
        lobbyRef.current = null;
        joinSignalingChannel(chName, strangerId, initiator);
      }
    };

    lobby.on("presence", { event: "sync" }, tryMatch);
    lobby.on("presence", { event: "join" }, tryMatch);

    lobby.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await lobby.track({
          session_id: sessionIdRef.current,
          joined_at: Date.now(),
          name: userInfo.name,
          country: userInfo.country,
          country_code: userInfo.countryCode,
        });
        setTimeout(tryMatch, 50);
        retryIntervalRef.current = setInterval(() => {
          if (!matchedRef.current) tryMatch();
        }, 2000);
      }
    });

    lobbyRef.current = lobby;
  }, [cleanup, joinSignalingChannel]);

  const sendLeave = useCallback(() => {
    signalingRef.current?.send({
      type: "broadcast",
      event: "leave",
      payload: { from: sessionIdRef.current },
    });
  }, []);

  const stopSearching = useCallback(() => {
    sendLeave();
    cleanup();
    setState("idle");
  }, [cleanup, sendLeave]);

  const skip = useCallback(() => {
    sendLeave();
    const savedInfo = userInfoRef.current;
    cleanup();
    setState("idle");
    if (savedInfo) {
      setTimeout(() => startSearching(savedInfo), 30);
    }
  }, [cleanup, startSearching, sendLeave]);

  const onSignal = useCallback((callback: (signal: any) => void) => {
    signalCallbackRef.current = callback;
  }, []);

  const sendSignal = useCallback((signal: any) => {
    signalingRef.current?.send({
      type: "broadcast",
      event: "signal",
      payload: { from: sessionIdRef.current, signal },
    });
  }, []);

  const onStrangerLeft = useCallback((callback: () => void) => {
    strangerLeftCallbackRef.current = callback;
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    state,
    strangerSessionId,
    strangerInfo,
    channelName,
    isInitiator,
    startSearching,
    stopSearching,
    skip,
    onSignal,
    sendSignal,
    onStrangerLeft,
  };
}
