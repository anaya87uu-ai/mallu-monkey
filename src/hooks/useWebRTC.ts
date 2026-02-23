import { useState, useEffect, useRef, useCallback } from "react";

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
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

  const ensurePC = useCallback(() => {
    if (pcRef.current) return pcRef.current;

    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (e) => {
      if (e.candidate && iceCandidateCallbackRef.current) {
        iceCandidateCallbackRef.current(e.candidate.toJSON());
      }
    };

    const remote = new MediaStream();
    setRemoteStream(remote);

    pc.ontrack = (e) => {
      e.streams[0]?.getTracks().forEach((track) => {
        remote.addTrack(track);
      });
      setRemoteStream(new MediaStream(remote.getTracks()));
    };

    // Add local tracks
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
        audio: true,
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
    } catch (err) {
      console.error("Failed to get media devices:", err);
      // Try audio only
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
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
      const offer = await pc.createOffer();
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
          await pc.setRemoteDescription(new RTCSessionDescription(signal));
          // Flush pending candidates
          for (const c of pendingCandidatesRef.current) {
            await pc.addIceCandidate(new RTCIceCandidate(c));
          }
          pendingCandidatesRef.current = [];
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          return answer;
        } else if (signal.type === "answer") {
          await pc.setRemoteDescription(new RTCSessionDescription(signal));
          // Flush pending candidates
          for (const c of pendingCandidatesRef.current) {
            await pc.addIceCandidate(new RTCIceCandidate(c));
          }
          pendingCandidatesRef.current = [];
          return null;
        } else if (signal.candidate) {
          if (pc.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(signal));
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
