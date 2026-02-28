import { useRef, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CHECK_INTERVAL_MS = 8000; // Check every 8 seconds
const CANVAS_SIZE = 320; // Small frame for faster processing

interface UseNudityDetectionOptions {
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  strangerSessionId: string | null;
  isConnected: boolean;
  onNudityDetected: () => void;
}

export function useNudityDetection({
  remoteVideoRef,
  strangerSessionId,
  isConnected,
  onNudityDetected,
}: UseNudityDetectionOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const checkingRef = useRef(false);

  const captureFrame = useCallback((): string | null => {
    const video = remoteVideoRef.current;
    if (!video || video.readyState < 2 || video.videoWidth === 0) return null;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const canvas = canvasRef.current;
    const scale = CANVAS_SIZE / Math.max(video.videoWidth, video.videoHeight);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Return base64 without the data URL prefix
    const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
    return dataUrl.split(",")[1] || null;
  }, [remoteVideoRef]);

  const checkFrame = useCallback(async () => {
    if (checkingRef.current) return;
    checkingRef.current = true;

    try {
      const imageBase64 = captureFrame();
      if (!imageBase64) return;

      const { data, error } = await supabase.functions.invoke("check-nudity", {
        body: {
          imageBase64,
          reportedUserId: strangerSessionId,
        },
      });

      if (error) {
        console.error("Nudity check error:", error);
        return;
      }

      if (data?.nude && data?.confidence >= 0.7) {
        toast.error("⚠️ Inappropriate content detected. User has been blocked.", {
          duration: 5000,
        });
        onNudityDetected();
      }
    } catch (err) {
      console.error("Frame check failed:", err);
    } finally {
      checkingRef.current = false;
    }
  }, [captureFrame, strangerSessionId, onNudityDetected]);

  useEffect(() => {
    if (isConnected) {
      // Initial check after 3 seconds
      const initialTimeout = setTimeout(() => {
        checkFrame();
      }, 3000);

      intervalRef.current = setInterval(checkFrame, CHECK_INTERVAL_MS);

      return () => {
        clearTimeout(initialTimeout);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isConnected, checkFrame]);

  return null;
}
