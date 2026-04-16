import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onSuccess: () => void;
}

export const OTPModal = ({ isOpen, onClose, email, onSuccess }: OTPModalProps) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { verifyOTP, resendOTP } = useAuth();

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(email, otp);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Verification failed. Please check the code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendOTP(email);
    } catch (error: any) {
      toast.error(error.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-background border-glass-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-display text-center">Verify Email</DialogTitle>
          <DialogDescription className="text-center">
            Enter the 6-digit code sent to <span className="font-semibold text-primary">{email}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-6 py-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            className="gap-2"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-12 h-14 text-lg border-glass-border bg-secondary/30" />
              <InputOTPSlot index={1} className="w-12 h-14 text-lg border-glass-border bg-secondary/30" />
              <InputOTPSlot index={2} className="w-12 h-14 text-lg border-glass-border bg-secondary/30" />
              <InputOTPSlot index={3} className="w-12 h-14 text-lg border-glass-border bg-secondary/30" />
              <InputOTPSlot index={4} className="w-12 h-14 text-lg border-glass-border bg-secondary/30" />
              <InputOTPSlot index={5} className="w-12 h-14 text-lg border-glass-border bg-secondary/30" />
            </InputOTPGroup>
          </InputOTP>

          <Button
            onClick={handleVerify}
            disabled={loading || otp.length !== 6}
            className="w-full gradient-primary border-0 text-foreground shadow-glow h-12 text-lg font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Didn't receive a code?{" "}
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-primary hover:underline font-medium disabled:opacity-50"
            >
              {resending ? "Resending..." : "Resend"}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
