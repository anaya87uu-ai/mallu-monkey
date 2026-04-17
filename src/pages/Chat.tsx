import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Video,
  Mic,
  MicOff,
  SkipForward,
  Phone,
  MessageSquare,
  Send,
  Users,
} from "lucide-react";
import ReportDialog from "@/components/ReportDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState, useCallback } from "react";
import { useStrangerMatch } from "@/hooks/useStrangerMatch";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useNudityDetection } from "@/hooks/useNudityDetection";
import { useGeoLocation } from "@/hooks/useGeoLocation";

interface ChatMessage {
  id: string;
  text: string;
  from: "you" | "stranger";
  time: Date;
}

const Chat = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitiatedRef = useRef(false);

  const geoInfo = useGeoLocation();
  const match = useStrangerMatch();
  const rtc = useWebRTC();

  const handleNudityDetected = useCallback(() => {
    rtc.closeConnection();
    match.skip();
  }, [rtc, match]);

  useNudityDetection({
    remoteVideoRef,
    strangerSessionId: match.strangerSessionId,
    isConnected: match.state === "connected",
    onNudityDetected: handleNudityDetected,
  });

  // Cleanup on unmount only
  useEffect(() => {
    return () => rtc.stopLocalStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Attach local stream to video element
  useEffect(() => {
    if (localVideoRef.current && rtc.localStream) {
      localVideoRef.current.srcObject = rtc.localStream;
    }
  }, [rtc.localStream]);

  // Attach remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && rtc.remoteStream) {
      remoteVideoRef.current.srcObject = rtc.remoteStream;
    }
  }, [rtc.remoteStream]);

  // Handle ICE candidates — send via signaling
  useEffect(() => {
    rtc.onIceCandidate((candidate) => {
      match.sendSignal(candidate);
    });
  }, [rtc, match]);

  // Auto-skip when stranger leaves
  useEffect(() => {
    match.onStrangerLeft(() => {
      console.log("[Chat] Stranger left, auto-skipping...");
      rtc.closeConnection();
      match.skip();
    });
  }, [match, rtc]);

  // Handle incoming signals
  useEffect(() => {
    match.onSignal(async (signal) => {
      const response = await rtc.handleSignal(signal);
      if (response && (response as RTCSessionDescriptionInit).type === "answer") {
        match.sendSignal(response);
      }
    });
  }, [match, rtc]);

  // Register incoming chat message handler
  useEffect(() => {
    rtc.onChatMessage((text) => {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random()}`, text, from: "stranger", time: new Date() },
      ]);
    });
  }, [rtc]);

  // Clear messages when starting a new match / disconnecting
  useEffect(() => {
    if (match.state === "searching" || match.state === "idle") {
      setMessages([]);
    }
  }, [match.state]);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen]);

  // When connected, only the initiator creates the offer
  useEffect(() => {
    if (match.state === "connected" && match.isInitiator && !hasInitiatedRef.current) {
      hasInitiatedRef.current = true;
      (async () => {
        const offer = await rtc.createOffer();
        if (offer) {
          match.sendSignal(offer);
        }
      })();
    }

    if (match.state !== "connected") {
      hasInitiatedRef.current = false;
    }
  }, [match.state, match.isInitiator, rtc, match]);

  const handleSendMessage = () => {
    const text = messageInput.trim();
    if (!text) return;
    if (!rtc.isDataChannelOpen) {
      toast.error("Chat not connected yet");
      return;
    }
    const sent = rtc.sendChatMessage(text);
    if (sent) {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random()}`, text, from: "you", time: new Date() },
      ]);
      setMessageInput("");
    } else {
      toast.error("Failed to send message");
    }
  };

  const handleStart = async () => {
    // CRITICAL: Get camera FIRST, directly in click handler
    if (!cameraReady) {
      try {
        const stream = await rtc.startLocalStream();
        if (!stream) {
          toast.error("Camera/mic access failed. Please allow permissions and try again.");
          return;
        }
        setCameraReady(true);
      } catch (err) {
        console.error("Media access error:", err);
        toast.error("Could not access camera or microphone.");
        return;
      }
    }
    // Only start matching after camera is ready
    match.startSearching({
      name: geoInfo.anonymousName,
      country: geoInfo.country,
      countryCode: geoInfo.countryCode,
    });
  };

  const handleSkip = () => {
    rtc.closeConnection();
    match.skip();
  };

  const handleEnd = () => {
    rtc.closeConnection();
    match.stopSearching();
  };

  const isSearching = match.state === "searching" || match.state === "matched";
  const isConnected = match.state === "connected";

  return (
    <div className="h-[calc(100dvh-3.5rem)] md:h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden">
      {/* Video area */}
      <div className="flex-1 flex flex-col md:flex-row gap-1.5 md:gap-3 p-1.5 md:p-3 relative min-h-0">
        {/* Stranger video */}
        <div className="flex-1 glass-card overflow-hidden relative min-h-0">
          {isConnected && rtc.remoteStream && rtc.remoteStream.getTracks().length > 0 ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-background flex items-center justify-center">
              <div className="text-center px-4">
                {isSearching ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="relative w-16 h-16 md:w-24 md:h-24 mx-auto mb-3 md:mb-5">
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/20"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="absolute inset-1 rounded-full border-2 border-secondary/20"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                      />
                      <div className="absolute inset-2 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Users className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                      </motion.div>
                    </div>
                    <p className="text-foreground font-display font-semibold text-sm md:text-lg">
                      Finding a stranger...
                    </p>
                    <motion.p
                      className="text-xs md:text-sm text-muted-foreground mt-1"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Scanning for available people
                    </motion.p>
                  </motion.div>
                ) : isConnected ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 flex items-center justify-center mx-auto mb-2 md:mb-3">
                      <Users className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
                    </div>
                    <p className="text-foreground font-display font-semibold text-sm md:text-base">
                      Connected!
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Waiting for video...
                    </p>
                  </motion.div>
                ) : (
                  <div>
                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-2 md:mb-3">
                      <Video className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-xs md:text-sm mb-3 md:mb-4">
                      No one connected yet
                    </p>
                    <Button
                      onClick={handleStart}
                      size="sm"
                      className="bg-gradient-to-r from-primary to-secondary glow-primary text-xs md:text-sm"
                    >
                      Find a Stranger
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 px-2 py-0.5 md:px-3 md:py-1 rounded-full glass text-[10px] md:text-xs text-foreground z-10 flex items-center gap-1.5">
            {match.strangerInfo ? (
              <>
                {match.strangerInfo.countryCode && (
                  <img
                    src={`https://flagcdn.com/16x12/${match.strangerInfo.countryCode}.png`}
                    alt={match.strangerInfo.country}
                    className="w-4 h-3 rounded-sm object-cover"
                  />
                )}
                <span>{match.strangerInfo.name}</span>
                <span className="text-muted-foreground">· {match.strangerInfo.country}</span>
              </>
            ) : (
              "Stranger"
            )}
          </div>
          <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 px-2 py-0.5 md:px-3 md:py-1 rounded-md bg-background/40 backdrop-blur-sm text-[9px] md:text-[11px] text-foreground/50 z-10 font-medium tracking-wide select-none pointer-events-none">
            mallumonkey.xyz
          </div>
        </div>

        {/* Your video */}
        <div className="flex-1 glass-card overflow-hidden relative min-h-0">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
          />
          <div className="absolute top-2 left-2 md:top-3 md:left-3 px-2 py-0.5 md:px-3 md:py-1 rounded-full glass text-[10px] md:text-xs text-foreground z-10">
            You
          </div>
        </div>

        {/* Chat panel */}
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-x-1.5 bottom-1.5 top-1.5 md:relative md:inset-auto md:w-80 glass-card flex flex-col z-30 bg-background/95 backdrop-blur-xl"
          >
            <div className="p-3 md:p-4 border-b border-border/30 flex items-center justify-between">
              <h3 className="font-display font-semibold text-sm md:text-base">Chat</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setChatOpen(false)}
                className="md:hidden w-8 h-8 rounded-full"
              >
                ✕
              </Button>
            </div>
            <div className="flex-1 p-3 md:p-4 overflow-y-auto">
              <p className="text-xs text-muted-foreground text-center">
                Messages will appear here
              </p>
            </div>
            <div className="p-2 md:p-3 border-t border-border/30 flex gap-2">
              <Input
                placeholder="Type a message..."
                className="glass border-border/50 bg-muted/30 text-xs md:text-sm h-9 md:h-10"
              />
              <Button
                size="icon"
                className="bg-gradient-to-r from-primary to-secondary shrink-0 w-9 h-9 md:w-10 md:h-10"
              >
                <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="p-1.5 md:p-4 shrink-0">
        <div className="glass-card p-2 md:p-4 flex items-center justify-center gap-1.5 md:gap-3 max-w-lg mx-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={rtc.toggleMute}
            className={`rounded-full w-9 h-9 md:w-12 md:h-12 glass border-border/50 ${
              rtc.isMuted
                ? "bg-destructive/20 border-destructive/50 text-destructive"
                : ""
            }`}
          >
            {rtc.isMuted ? (
              <MicOff className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <Mic className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </Button>


          <Button
            variant="outline"
            size="icon"
            onClick={() => setChatOpen(!chatOpen)}
            className={`rounded-full w-9 h-9 md:w-12 md:h-12 glass border-border/50 ${
              chatOpen
                ? "bg-primary/20 border-primary/50 text-primary"
                : ""
            }`}
          >
            <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
          </Button>

          {!isConnected && !isSearching && (
            <Button
              onClick={handleStart}
              className="rounded-full h-9 md:h-12 px-3 md:px-6 bg-gradient-to-r from-primary to-secondary glow-primary text-xs md:text-base"
            >
              <Users className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" /> Find Stranger
            </Button>
          )}

          {(isConnected || isSearching) && (
            <ReportDialog strangerSessionId={match.strangerSessionId} />
          )}

          {isConnected && (
            <Button
              onClick={handleSkip}
              className="rounded-full h-9 md:h-12 px-3 md:px-6 bg-gradient-to-r from-primary to-secondary glow-primary text-xs md:text-base"
            >
              <SkipForward className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" /> Skip
            </Button>
          )}

          {(isConnected || isSearching) && (
            <Button
              onClick={handleEnd}
              className="rounded-full w-9 h-9 md:w-12 md:h-12 bg-destructive hover:bg-destructive/90"
              size="icon"
            >
              <Phone className="w-4 h-4 md:w-5 md:h-5 rotate-[135deg]" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
