import { useState, useEffect, useRef, useCallback } from "react";

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
  ],
};

interface WebRTCHook {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startLocalStream: () => Promise<void>;
  stopLocalStream: () => void;
  createOffer: () => Promise<RTCSessionDescriptionInit | null>;
  handleSignal: (signal: any) => Promise<RTCSessionDescriptionInit | RTCIceCandidateInit | null>;
  closeConnection: () => void;
  isMuted: boolean;
  isCamOff: boolean;
  toggleMute: () => void;
  toggleCamera: () => void;
  onIceCandidate: (callback: (candidate: RTCIceCandidateInit) => void) => void;
}

export function useWebRTC(): WebRTCHook {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const iceCandidateCallbackRef = useRef<((c: RTCIceCandidateInit) => void) | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const remoteStreamRef = useRef<MediaStream>(new MediaStream());

  const ensurePC = useCallback(() => {
    if (pcRef.current && pcRef.current.signalingState !== "closed") {
      return pcRef.current;
    }

    // Close any stale connection
    if (pcRef.current) {
      pcRef.current.close();
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Reset remote stream
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
      // Avoid duplicate tracks
      const existing = remote.getTracks().find(t => t.id === e.track.id);
      if (!existing) {
        remote.addTrack(e.track);
      }
      // Force React state update with new MediaStream reference
      setRemoteStream(new MediaStream(remote.getTracks()));
    };

    // Add local tracks immediately
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    pcRef.current = pc;
    return pc;
  }, []);

  const startLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
    } catch (err) {
      console.error("Failed to get media devices:", err);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        localStreamRef.current = stream;
        setLocalStream(stream);
      } catch (err2) {
        console.error("Failed to get any media:", err2);
      }
    }
  }, []);

  const stopLocalStream = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    setLocalStream(null);
  }, []);

  const createOffer = useCallback(async () => {
    const pc = ensurePC();
    try {
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
  }, [ensurePC]);

  const handleSignal = useCallback(
    async (signal: any) => {
      const pc = ensurePC();
      try {
        if (signal.type === "offer") {
          // If we already have a local offer, use "rollback" to avoid collision
          if (pc.signalingState === "have-local-offer") {
            console.log("[WebRTC] Glare detected, rolling back local offer");
            await pc.setLocalDescription({ type: "rollback" });
          }
          await pc.setRemoteDescription(new RTCSessionDescription(signal));
          // Flush pending candidates
          for (const c of pendingCandidatesRef.current) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(c));
            } catch (e) {
              console.warn("[WebRTC] Failed to add buffered candidate:", e);
            }
          }
          pendingCandidatesRef.current = [];
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          return answer;
        } else if (signal.type === "answer") {
          if (pc.signalingState === "have-local-offer") {
            await pc.setRemoteDescription(new RTCSessionDescription(signal));
            // Flush pending candidates
            for (const c of pendingCandidatesRef.current) {
              try {
                await pc.addIceCandidate(new RTCIceCandidate(c));
              } catch (e) {
                console.warn("[WebRTC] Failed to add buffered candidate:", e);
              }
            }
            pendingCandidatesRef.current = [];
          } else {
            console.warn("[WebRTC] Ignoring answer in state:", pc.signalingState);
          }
          return null;
        } else if (signal.candidate) {
          if (pc.remoteDescription && pc.remoteDescription.type) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(signal));
            } catch (e) {
              console.warn("[WebRTC] Failed to add ICE candidate:", e);
            }
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
    pcRef.current?.close();
    pcRef.current = null;
    remoteStreamRef.current = new MediaStream();
    setRemoteStream(null);
    pendingCandidatesRef.current = [];
  }, []);

  const toggleMute = useCallback(() => {
    localStreamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsMuted((m) => !m);
  }, []);

  const toggleCamera = useCallback(() => {
    localStreamRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
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
