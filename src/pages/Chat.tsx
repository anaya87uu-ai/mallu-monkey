import { motion } from "framer-motion";
import { Video, Mic, MicOff, VideoOff, SkipForward, Phone, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Chat = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const startSearching = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setIsConnected(true);
    }, 3000);
  };

  const handleSkip = () => {
    setIsConnected(false);
    startSearching();
  };

  const handleEnd = () => {
    setIsConnected(false);
    setIsSearching(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden">
      {/* Video area */}
      <div className="flex-1 flex flex-col md:flex-row gap-3 p-3 relative">
        {/* Your video */}
        <div className="flex-1 glass-card overflow-hidden flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-background" />
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center mx-auto mb-3">
              <Video className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Your Camera</p>
          </div>
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass text-xs text-foreground">You</div>
        </div>

        {/* Stranger video / matching */}
        <div className="flex-1 glass-card overflow-hidden flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-background" />
          <div className="relative z-10 text-center">
            {isSearching ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-20 h-20 rounded-full border-4 border-primary/30 border-t-primary animate-spin mx-auto mb-4" />
                <p className="text-foreground font-display font-semibold text-lg">Finding a stranger...</p>
                <p className="text-sm text-muted-foreground mt-1">Please wait</p>
              </motion.div>
            ) : isConnected ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
                <p className="text-foreground font-display font-semibold">Connected!</p>
                <p className="text-sm text-muted-foreground">Say hello 👋</p>
              </motion.div>
            ) : (
              <div>
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                  <Video className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">No one connected</p>
                <Button onClick={startSearching} className="mt-4 bg-gradient-to-r from-primary to-secondary glow-primary">
                  Find a Stranger
                </Button>
              </div>
            )}
          </div>
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass text-xs text-foreground">Stranger</div>
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
              <p className="text-xs text-muted-foreground text-center">Messages will appear here</p>
            </div>
            <div className="p-3 border-t border-border/30 flex gap-2">
              <Input placeholder="Type a message..." className="glass border-border/50 bg-muted/30 text-sm" />
              <Button size="icon" className="bg-gradient-to-r from-primary to-secondary shrink-0">
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
            onClick={() => setIsMuted(!isMuted)}
            className={`rounded-full w-12 h-12 glass border-border/50 ${isMuted ? "bg-destructive/20 border-destructive/50 text-destructive" : ""}`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsCamOff(!isCamOff)}
            className={`rounded-full w-12 h-12 glass border-border/50 ${isCamOff ? "bg-destructive/20 border-destructive/50 text-destructive" : ""}`}
          >
            {isCamOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setChatOpen(!chatOpen)}
            className={`rounded-full w-12 h-12 glass border-border/50 ${chatOpen ? "bg-primary/20 border-primary/50 text-primary" : ""}`}
          >
            <MessageSquare className="w-5 h-5" />
          </Button>

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

// Need Users icon
import { Users } from "lucide-react";

export default Chat;
