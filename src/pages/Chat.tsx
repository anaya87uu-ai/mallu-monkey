import { motion, AnimatePresence } from "framer-motion";
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
  Clock,
} from "lucide-react";
import ReportDialog from "@/components/ReportDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState, useCallback } from "react";
import { useStrangerMatch } from "@/hooks/useStrangerMatch";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useNudityDetection } from "@/hooks/useNudityDetection";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatMessage {
  text: string;
  from: "you" | "stranger";
  time: Date;
}

const Chat = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const hasInitiatedRef = useRef(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  // Handle ICE candidates
  useEffect(() => {
    rtc.onIceCandidate((candidate) => {
      match.sendSignal(candidate);
    });
  }, [rtc, match]);

  // Auto-skip when stranger leaves
  useEffect(() => {
    match.onStrangerLeft(() => {
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

  // Elapsed time counter
  useEffect(() => {
    if (match.state === "connected") {
      setElapsedSeconds(0);
      const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
      return () => clearInterval(interval);
    } else {
      setElapsedSeconds(0);
    }
  }, [match.state]);

  // Reset messages on new connection
  useEffect(() => {
    if (match.state !== "connected") {
      setMessages([]);
    }
  }, [match.state]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSendMessage = () => {
    const trimmed = messageInput.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { text: trimmed, from: "you", time: new Date() }]);
    setMessageInput("");
  };

  const handleStart = async () => {
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
  const isIdle = !isConnected && !isSearching;

  return (
    <TooltipProvider delayDuration={300}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="h-[calc(100dvh-3.5rem)] md:h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden"
      >
        {/* Main video area */}
        <div className="flex-1 relative min-h-0 m-1.5 md:m-3">
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="absolute inset-0 glass-card overflow-hidden"
          >
            {/* Stranger video / states */}
            {isConnected && rtc.remoteStream && rtc.remoteStream.getTracks().length > 0 ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Animated gradient background for idle */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tl from-primary/10 to-transparent"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="text-center px-4 z-10">
                  {isSearching ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="relative w-20 h-20 md:w-28 md:h-28 mx-auto mb-4 md:mb-6">
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-primary/20"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                          className="absolute inset-1 rounded-full border-2 border-secondary/20"
                          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                        />
                        <div className="absolute inset-3 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Users className="w-7 h-7 md:w-10 md:h-10 text-primary" />
                        </motion.div>
                      </div>
                      <p className="text-foreground font-display font-semibold text-base md:text-xl">
                        Finding a stranger...
                      </p>
                      <motion.p
                        className="text-xs md:text-sm text-muted-foreground mt-1.5"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Scanning for available people
                      </motion.p>
                    </motion.div>
                  ) : isConnected ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                      <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 flex items-center justify-center mx-auto mb-3">
                        <Users className="w-7 h-7 md:w-10 md:h-10 text-secondary" />
                      </div>
                      <p className="text-foreground font-display font-semibold text-sm md:text-base">Connected!</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Waiting for video...</p>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                      <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <Video className="w-8 h-8 md:w-12 md:h-12 text-muted-foreground" />
                      </div>
                      <h2 className="text-foreground font-display font-bold text-lg md:text-2xl mb-2">
                        Meet someone new
                      </h2>
                      <p className="text-muted-foreground text-xs md:text-sm mb-5 md:mb-8 max-w-xs mx-auto">
                        Video chat with random strangers from around the world
                      </p>
                      <Button
                        onClick={handleStart}
                        size="lg"
                        className="bg-gradient-to-r from-primary to-secondary glow-primary text-sm md:text-base px-6 md:px-10 h-11 md:h-13 rounded-full"
                      >
                        <Users className="w-5 h-5 mr-2" /> Find a Stranger
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Stranger info badge */}
            <div className="absolute top-2 left-2 md:top-3 md:left-3 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full glass text-[10px] md:text-xs text-foreground z-10 flex items-center gap-1.5">
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

            {/* Watermark */}
            <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 px-2 py-0.5 md:px-3 md:py-1 rounded-md bg-background/40 backdrop-blur-sm text-[9px] md:text-[11px] text-foreground/50 z-10 font-medium tracking-wide select-none pointer-events-none">
              mallumonkey.xyz
            </div>

            {/* PiP local video */}
            {cameraReady && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-24 h-32 md:w-40 md:h-52 rounded-xl overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/10 z-20"
              >
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                />
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-background/60 backdrop-blur-sm text-[9px] md:text-[10px] text-foreground font-medium">
                  You
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Chat panel overlay */}
          <AnimatePresence>
            {chatOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-y-0 right-0 w-full md:w-80 glass-card flex flex-col z-30 bg-background/95 backdrop-blur-xl border-l border-border/30"
              >
                <div className="p-3 md:p-4 border-b border-border/30 flex items-center justify-between">
                  <h3 className="font-display font-semibold text-sm md:text-base flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" /> Chat
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setChatOpen(false)}
                    className="w-7 h-7 rounded-full text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </Button>
                </div>
                <div className="flex-1 p-3 md:p-4 overflow-y-auto space-y-2">
                  {messages.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center mt-8">
                      {isConnected ? "Say hi! 👋" : "Connect with someone to start chatting"}
                    </p>
                  ) : (
                    messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.from === "you" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] px-3 py-1.5 rounded-2xl text-xs md:text-sm ${
                            msg.from === "you"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p className={`text-[9px] mt-0.5 ${msg.from === "you" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                            {msg.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-2 md:p-3 border-t border-border/30 flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="glass border-border/50 bg-muted/30 text-xs md:text-sm h-9 md:h-10"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-primary to-secondary shrink-0 w-9 h-9 md:w-10 md:h-10"
                  >
                    <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status bar + Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="shrink-0 px-2 pb-2 md:px-4 md:pb-4"
        >
          {/* Connection status */}
          {(isConnected || isSearching) && (
            <div className="flex items-center justify-center gap-3 mb-1.5 md:mb-2 text-[10px] md:text-xs text-muted-foreground">
              {isConnected && (
                <>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-500 font-medium">Connected</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(elapsedSeconds)}
                  </span>
                  {match.strangerInfo && (
                    <span className="flex items-center gap-1">
                      {match.strangerInfo.countryCode && (
                        <img
                          src={`https://flagcdn.com/16x12/${match.strangerInfo.countryCode}.png`}
                          alt=""
                          className="w-3.5 h-2.5 rounded-sm"
                        />
                      )}
                      {match.strangerInfo.name}
                    </span>
                  )}
                </>
              )}
              {isSearching && !isConnected && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span className="text-yellow-500 font-medium">Searching...</span>
                </span>
              )}
            </div>
          )}

          {/* Controls pill */}
          <div className="glass-card p-2 md:p-3 flex items-center justify-center gap-1.5 md:gap-2.5 max-w-md mx-auto rounded-full shadow-lg shadow-background/50">
            {/* Left group */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={rtc.toggleMute}
                  className={`rounded-full w-9 h-9 md:w-11 md:h-11 glass border-border/50 ${
                    rtc.isMuted ? "bg-destructive/20 border-destructive/50 text-destructive" : ""
                  }`}
                >
                  {rtc.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{rtc.isMuted ? "Unmute" : "Mute"}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setChatOpen(!chatOpen)}
                  className={`rounded-full w-9 h-9 md:w-11 md:h-11 glass border-border/50 ${
                    chatOpen ? "bg-primary/20 border-primary/50 text-primary" : ""
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Chat</TooltipContent>
            </Tooltip>

            {/* Center group */}
            {isIdle && (
              <Button
                onClick={handleStart}
                className="rounded-full h-9 md:h-11 px-4 md:px-6 bg-gradient-to-r from-primary to-secondary glow-primary text-xs md:text-sm font-semibold"
              >
                <Users className="w-4 h-4 mr-1.5" /> Find Stranger
              </Button>
            )}

            {isConnected && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleSkip}
                    className="rounded-full h-9 md:h-11 px-4 md:px-6 bg-gradient-to-r from-primary to-secondary glow-primary text-xs md:text-sm font-semibold"
                  >
                    <SkipForward className="w-4 h-4 mr-1.5" /> Skip
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Skip to next person</TooltipContent>
              </Tooltip>
            )}

            {/* Right group */}
            {(isConnected || isSearching) && (
              <ReportDialog strangerSessionId={match.strangerSessionId} />
            )}

            {(isConnected || isSearching) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleEnd}
                    className="rounded-full w-9 h-9 md:w-11 md:h-11 bg-destructive hover:bg-destructive/90"
                    size="icon"
                  >
                    <Phone className="w-4 h-4 rotate-[135deg]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>End call</TooltipContent>
              </Tooltip>
            )}
          </div>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
};

export default Chat;
