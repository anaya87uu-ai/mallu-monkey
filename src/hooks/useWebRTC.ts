import { useState, useEffect, useRef, useCallback } from "react";

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
  ],
  iceCandidatePoolSize: 10,
};

interface WebRTCHook {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startLocalStream: () => Promise<MediaStream | null>;
  stopLocalStream: () => void;
  createOffer: () => Promise<RTCSessionDescriptionInit | null>;
  handleSignal: (signal: any) => Promise<RTCSessionDescriptionInit | RTCIceCandidateInit | null>;
  closeConnection: () => void;
  isMuted: boolean;
  isCamOff: boolean;
  toggleMute: () => void;
  toggleCamera: () => void;
  onIceCandidate: (callback: (candidate: RTCIceCandidateInit) => void) => void;
  sendChatMessage: (text: string) => boolean;
  onChatMessage: (callback: (text: string) => void) => void;
  isDataChannelOpen: boolean;
}

export function useWebRTC(): WebRTCHook {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isDataChannelOpen, setIsDataChannelOpen] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const iceCandidateCallbackRef = useRef<((c: RTCIceCandidateInit) => void) | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const remoteStreamRef = useRef<MediaStream>(new MediaStream());
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const chatMessageCallbackRef = useRef<((text: string) => void) | null>(null);

  const setupDataChannel = useCallback((channel: RTCDataChannel) => {
    dataChannelRef.current = channel;
    channel.onopen = () => {
      console.log("[WebRTC] Data channel open");
      setIsDataChannelOpen(true);
    };
    channel.onclose = () => {
      console.log("[WebRTC] Data channel closed");
      setIsDataChannelOpen(false);
    };
    channel.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "chat" && typeof data.text === "string") {
          chatMessageCallbackRef.current?.(data.text);
        }
      } catch {
        // ignore malformed
      }
    };
  }, []);

  const addLocalTracksToPC = useCallback((pc: RTCPeerConnection) => {
    if (!localStreamRef.current) return;
    const existingSenders = pc.getSenders();
    localStreamRef.current.getTracks().forEach((track) => {
      const alreadyAdded = existingSenders.some((s) => s.track?.id === track.id);
      if (!alreadyAdded) {
        pc.addTrack(track, localStreamRef.current!);
      }
    });
  }, []);

  const ensurePC = useCallback(() => {
    if (pcRef.current && pcRef.current.signalingState !== "closed") {
      // Make sure local tracks are added even if PC was created before stream
      addLocalTracksToPC(pcRef.current);
      return pcRef.current;
    }

    if (pcRef.current) {
      pcRef.current.close();
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);

    remoteStreamRef.current = new MediaStream();
    setRemoteStream(null);

    pc.onicecandidate = (e) => {
      if (e.candidate && iceCandidateCallbackRef.current) {
        iceCandidateCallbackRef.current(e.candidate.toJSON());
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("[WebRTC] ICE state:", pc.iceConnectionState);
      if (pc.iceConnectionState === "failed") {
        console.warn("[WebRTC] ICE failed, restarting...");
        pc.restartIce();
      }
    };

    pc.ontrack = (e) => {
      console.log("[WebRTC] Got remote track:", e.track.kind);
      const remote = remoteStreamRef.current;
      const existing = remote.getTracks().find((t) => t.id === e.track.id);
      if (!existing) {
        remote.addTrack(e.track);
      }
      setRemoteStream(new MediaStream(remote.getTracks()));
    };

    // Incoming data channel (for the answerer)
    pc.ondatachannel = (e) => {
      console.log("[WebRTC] Received data channel");
      setupDataChannel(e.channel);
    };

    // Add local tracks immediately if available
    addLocalTracksToPC(pc);

    pcRef.current = pc;
    return pc;
  }, [addLocalTracksToPC, setupDataChannel]);

  const startLocalStream = useCallback(async (): Promise<MediaStream | null> => {
    // If we already have a stream, return it
    if (localStreamRef.current && localStreamRef.current.active) {
      return localStreamRef.current;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      localStreamRef.current = stream;
      setLocalStream(stream);

      // If PC already exists, add tracks to it now
      if (pcRef.current && pcRef.current.signalingState !== "closed") {
        addLocalTracksToPC(pcRef.current);
      }

      return stream;
    } catch (err) {
      console.error("Camera failed, trying audio only:", err);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
        localStreamRef.current = stream;
        setLocalStream(stream);
        return stream;
      } catch (err2) {
        console.error("Failed to get any media:", err2);
        return null;
      }
    }
  }, [addLocalTracksToPC]);

  const stopLocalStream = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    setLocalStream(null);
  }, []);

  const createOffer = useCallback(async () => {
    const pc = ensurePC();
    try {
      // Initiator creates the data channel BEFORE the offer
      if (!dataChannelRef.current || dataChannelRef.current.readyState === "closed") {
        const channel = pc.createDataChannel("chat", { ordered: true });
        setupDataChannel(channel);
      }
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await pc.setLocalDescription(offer);
      return offer;
    } catch (err) {
      console.error("Failed to create offer:", err);
      return null;
    }
  }, [ensurePC, setupDataChannel]);

  const handleSignal = useCallback(
    async (signal: any) => {
      const pc = ensurePC();
      try {
        if (signal.type === "offer") {
          if (pc.signalingState === "have-local-offer") {
            console.log("[WebRTC] Glare detected, rolling back");
            await pc.setLocalDescription({ type: "rollback" });
          }
          await pc.setRemoteDescription(new RTCSessionDescription(signal));
          for (const c of pendingCandidatesRef.current) {
            try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch (e) { /* skip */ }
          }
          pendingCandidatesRef.current = [];
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          return answer;
        } else if (signal.type === "answer") {
          if (pc.signalingState === "have-local-offer") {
            await pc.setRemoteDescription(new RTCSessionDescription(signal));
            for (const c of pendingCandidatesRef.current) {
              try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch (e) { /* skip */ }
            }
            pendingCandidatesRef.current = [];
          }
          return null;
        } else if (signal.candidate) {
          if (pc.remoteDescription && pc.remoteDescription.type) {
            try { await pc.addIceCandidate(new RTCIceCandidate(signal)); } catch (e) { /* skip */ }
          } else {
            pendingCandidatesRef.current.push(signal);
          }
          return null;
        }
      } catch (err) {
        console.error("Signal handling error:", err);
      }
      return null;
    },
    [ensurePC]
  );

  const closeConnection = useCallback(() => {
    try { dataChannelRef.current?.close(); } catch { /* ignore */ }
    dataChannelRef.current = null;
    setIsDataChannelOpen(false);
    pcRef.current?.close();
    pcRef.current = null;
    remoteStreamRef.current = new MediaStream();
    setRemoteStream(null);
    pendingCandidatesRef.current = [];
  }, []);

  const sendChatMessage = useCallback((text: string) => {
    const channel = dataChannelRef.current;
    if (!channel || channel.readyState !== "open") return false;
    try {
      channel.send(JSON.stringify({ type: "chat", text }));
      return true;
    } catch (err) {
      console.error("Failed to send chat message:", err);
      return false;
    }
  }, []);

  const onChatMessage = useCallback((callback: (text: string) => void) => {
    chatMessageCallbackRef.current = callback;
  }, []);

  const toggleMute = useCallback(() => {
    localStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
    setIsMuted((m) => !m);
  }, []);

  const toggleCamera = useCallback(() => {
    localStreamRef.current?.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; });
    setIsCamOff((c) => !c);
  }, []);

  const onIceCandidate = useCallback((callback: (c: RTCIceCandidateInit) => void) => {
    iceCandidateCallbackRef.current = callback;
  }, []);

  useEffect(() => {
    return () => {
      pcRef.current?.close();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return {
    localStream,
    remoteStream,
    startLocalStream,
    stopLocalStream,
    createOffer,
    handleSignal,
    closeConnection,
    isMuted,
    isCamOff,
    toggleMute,
    toggleCamera,
    onIceCandidate,
  };
}
