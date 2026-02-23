import { motion } from "framer-motion";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  SkipForward,
  Phone,
  MessageSquare,
  Send,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState, useCallback } from "react";
import { useStrangerMatch } from "@/hooks/useStrangerMatch";
import { useWebRTC } from "@/hooks/useWebRTC";

const Chat = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const hasInitiatedRef = useRef(false);

  const match = useStrangerMatch();
  const rtc = useWebRTC();

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

  const handleStart = async () => {
    if (!cameraReady) {
      // getUserMedia must be called directly from a user gesture
      await rtc.startLocalStream();
      setCameraReady(true);
    }
    match.startSearching();
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
    <div className="h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden">
      {/* Video area */}
      <div className="flex-1 flex flex-col md:flex-row gap-3 p-3 relative">
        {/* Your video */}
        <div className="flex-1 glass-card overflow-hidden relative">
          {rtc.localStream ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-background flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center mx-auto mb-3">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Starting camera...</p>
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass text-xs text-foreground z-10">
            You
          </div>
        </div>

        {/* Stranger video */}
        <div className="flex-1 glass-card overflow-hidden relative">
          {isConnected && rtc.remoteStream && rtc.remoteStream.getTracks().length > 0 ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-background flex items-center justify-center">
              <div className="text-center">
                {isSearching ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="w-20 h-20 rounded-full border-4 border-primary/30 border-t-primary animate-spin mx-auto mb-4" />
                    <p className="text-foreground font-display font-semibold text-lg">
                      Finding a stranger...
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Waiting for someone to connect
                    </p>
                  </motion.div>
                ) : isConnected ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-secondary" />
                    </div>
                    <p className="text-foreground font-display font-semibold">
                      Connected!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Waiting for video...
                    </p>
                  </motion.div>
                ) : (
                  <div>
                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                      <Video className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      No one connected yet
                    </p>
                    <Button
                      onClick={handleStart}
                      className="bg-gradient-to-r from-primary to-secondary glow-primary"
                    >
                      Find a Stranger
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass text-xs text-foreground z-10">
            Stranger
          </div>
        </div>

        {/* Chat panel */}
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-80 glass-card flex flex-col"
          >
            <div className="p-4 border-b border-border/30">
              <h3 className="font-display font-semibold">Chat</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto min-h-[200px]">
              <p className="text-xs text-muted-foreground text-center">
                Messages will appear here
              </p>
            </div>
            <div className="p-3 border-t border-border/30 flex gap-2">
              <Input
                placeholder="Type a message..."
                className="glass border-border/50 bg-muted/30 text-sm"
              />
              <Button
                size="icon"
                className="bg-gradient-to-r from-primary to-secondary shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4">
        <div className="glass-card p-4 flex items-center justify-center gap-3 max-w-lg mx-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={rtc.toggleMute}
            className={`rounded-full w-12 h-12 glass border-border/50 ${
              rtc.isMuted
                ? "bg-destructive/20 border-destructive/50 text-destructive"
                : ""
            }`}
          >
            {rtc.isMuted ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={rtc.toggleCamera}
            className={`rounded-full w-12 h-12 glass border-border/50 ${
              rtc.isCamOff
                ? "bg-destructive/20 border-destructive/50 text-destructive"
                : ""
            }`}
          >
            {rtc.isCamOff ? (
              <VideoOff className="w-5 h-5" />
            ) : (
              <Video className="w-5 h-5" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setChatOpen(!chatOpen)}
            className={`rounded-full w-12 h-12 glass border-border/50 ${
              chatOpen
                ? "bg-primary/20 border-primary/50 text-primary"
                : ""
            }`}
          >
            <MessageSquare className="w-5 h-5" />
          </Button>

          {!isConnected && !isSearching && (
            <Button
              onClick={handleStart}
              className="rounded-full h-12 px-6 bg-gradient-to-r from-primary to-secondary glow-primary"
            >
              <Users className="w-5 h-5 mr-2" /> Find Stranger
            </Button>
          )}

          {isConnected && (
            <Button
              onClick={handleSkip}
              className="rounded-full h-12 px-6 bg-gradient-to-r from-primary to-secondary glow-primary"
            >
              <SkipForward className="w-5 h-5 mr-2" /> Skip
            </Button>
          )}

          {(isConnected || isSearching) && (
            <Button
              onClick={handleEnd}
              className="rounded-full w-12 h-12 bg-destructive hover:bg-destructive/90"
              size="icon"
            >
              <Phone className="w-5 h-5 rotate-[135deg]" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
