import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const REPORT_REASONS = [
  "Nudity or sexual content",
  "Harassment or bullying",
  "Hate speech",
  "Spam or scam",
  "Underage user",
  "Other",
];

interface ReportDialogProps {
  strangerSessionId: string | null;
}

const ReportDialog = ({ strangerSessionId }: ReportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error("Please select a reason");
      return;
    }

    setSubmitting(true);

    const { data: { session } } = await supabase.auth.getSession();

    const reason = selectedReason === "Other" && details
      ? `${selectedReason}: ${details}`
      : selectedReason;

    if (session?.user) {
      const { error } = await supabase.from("reports").insert({
        reporter_id: session.user.id,
        reported_user_id: strangerSessionId || "anonymous",
        reason,
      });

      if (error) {
        console.error("Report error:", error);
        toast.error("Failed to submit report. Please try again.");
      } else {
        toast.success("Report submitted. Thank you for keeping the community safe.");
      }
    } else {
      // Not logged in — still show confirmation, report won't persist
      toast.success("Report noted. Sign in to ensure reports are tracked.");
    }

    setSubmitting(false);
    setOpen(false);
    setSelectedReason("");
    setDetails("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-11 h-11 md:w-12 md:h-12 glass border-border/50 text-destructive hover:bg-destructive/20 hover:border-destructive/50"
        >
          <Flag className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Report User</DialogTitle>
          <DialogDescription>
            Help us keep the community safe. Select a reason for your report.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          {REPORT_REASONS.map((reason) => (
            <button
              key={reason}
              onClick={() => setSelectedReason(reason)}
              className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                selectedReason === reason
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border/50 bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {reason}
            </button>
          ))}
          {selectedReason === "Other" && (
            <Textarea
              placeholder="Please describe the issue..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="mt-1"
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !selectedReason}
            className="bg-destructive hover:bg-destructive/90"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
